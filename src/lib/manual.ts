import fs from "node:fs";
import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { manualUploads, activityLogs, downloads, topics, settings } from "@/db/schema";
import {
  downloadRealVideo,
  fetchReelMetadata,
  topicFor,
  type RealCandidate,
} from "@/lib/instagram-real";
import { applyShortsOptimization, planVideoStrategy, publishVideoFile, youtubeStatus } from "@/lib/youtube";
import { reviewDownloadedVideo } from "@/lib/ai-review";
import { transcribeVideo } from "@/lib/transcript";
import { computePerceptualHash, isVisuallySimilar } from "@/lib/phash";
import { istDate } from "@/lib/ist";
import { planPublishSlots, MANUAL_DAILY_CAP, PUBLISH_GAP_MS, PEAK_SLOTS_IST_MIN } from "@/lib/schedule";
import type { TopicSeed } from "@/lib/reels";

/**
 * Manual Instagram → YouTube queue.
 *
 * User pastes one or more public Reel URLs. They are downloaded IMMEDIATELY,
 * then the ORIGINAL CONTENT is verified with AI (real frames) BEFORE any
 * title is created or anything is uploaded, then published to YouTube with an
 * YouTube as private videos with a scheduled public release:
 *   - with a user-provided date/time → published exactly then
 *   - without → published with 5-minute gaps (now+5, +10, +15 …)
 *
 * Completely independent of the daily 7-video auto collection.
 */


export interface ManualRow {
  id: number;
  videoId: string;
  url: string;
  status: string;
  filePath: string | null;
  fileSize: number | null;
  publishAt: string | null;
  youtubeId: string | null;
  youtubeUrl: string | null;
  youtubeTitle: string | null;
  error: string | null;
  createdAt: string;
}

/* ---------------- helpers ---------------------------------------------- */

function parseShortcode(raw: string): string | null {
  const m = raw.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]{5,})/i);
  return m ? m[1] : null;
}

async function logManual(level: string, message: string): Promise<void> {
  await db.insert(activityLogs).values({ level, message });
  await db.execute(
    sql`DELETE FROM activity_logs WHERE id < (
      SELECT COALESCE(MIN(id), 0) FROM (SELECT id FROM activity_logs ORDER BY id DESC LIMIT 400) keep
    )`,
  );
}

/* ---------------- submit ------------------------------------------------ */

export interface SubmitResult {
  accepted: number;
  skipped: Array<{ url: string; reason: string }>;
  items: ManualRow[];
}

export async function submitManualLinks(
  rawLines: string[],
  publishAtISO?: string,
): Promise<SubmitResult> {
  const skipped: Array<{ url: string; reason: string }> = [];
  let accepted = 0;

  const target = publishAtISO ? new Date(publishAtISO) : null;
  const targetValid = target !== null && !Number.isNaN(target.getTime()) && target.getTime() > Date.now() + 60_000;

  // Auto viral schedule: peak evening slots (9–11 PM IST), max 5/day, future
  // dates only — rolls to the next day automatically when a day is full.
  const slots = await planPublishSlots(rawLines.length, targetValid ? target!.getTime() : null);
  let slotIdx = 0;
  const firstSlot = slots[0];

  for (const raw of rawLines) {
    const line = raw.trim();
    if (!line) continue;
    const sc = parseShortcode(line);
    if (!sc) {
      skipped.push({ url: line, reason: "Not an Instagram Reel/Post URL" });
      continue;
    }
    const url = `https://www.instagram.com/reel/${sc}/`;

    // Permanent dedupe: same video already queued OR already in daily cache.
    const existing = await db
      .select({ id: manualUploads.id, status: manualUploads.status })
      .from(manualUploads)
      .where(eq(manualUploads.videoId, sc))
      .limit(1);
    if (existing[0]) {
      skipped.push({ url, reason: `Already in queue (${existing[0].status})` });
      continue;
    }
    const inDaily = await db
      .select({ id: downloads.id })
      .from(downloads)
      .where(eq(downloads.videoId, sc))
      .limit(1);
    if (inDaily[0]) {
      skipped.push({ url, reason: "Already downloaded in the daily collection" });
      continue;
    }

    const slot = slots[slotIdx];
    if (slot === undefined) {
      skipped.push({ url, reason: "No free schedule slot (5/day cap reached for the coming days)" });
      continue;
    }
    try {
      await db.insert(manualUploads).values({
        videoId: sc,
        url,
        status: "queued",
        publishAt: new Date(slot),
      });
      slotIdx++;
      accepted++;
    } catch {
      skipped.push({ url, reason: "Duplicate (race)" });
    }
  }

  if (accepted > 0) {
    await logManual(
      "info",
      `Manual queue: ${accepted} link(s) accepted → download → AI content check → upload. Auto-scheduled at peak evening times (9–11 PM IST, max ${MANUAL_DAILY_CAP}/day, future dates)${
        firstSlot
          ? `; first goes public ${new Date(firstSlot).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} IST`
          : ""
      }.`,
    );
    void processManualQueue();
  }

  const list = await listManual();
  return { accepted, skipped, items: list.rows };
}

/* ---------------- processing ------------------------------------------- */

let processing = false;

/**
 * Uploads-per-day accounting across manual + daily videos. The user limit is
 * 5 uploads per IST day total. Manual rows are DELETED after a successful
 * upload (links are consumed), so the counter lives in settings.
 */
async function uploadsTodayTotal(): Promise<number> {
  const today = istDate();
  let manual = 0;
  const raw = (await db.select().from(settings).where(eq(settings.key, "manualUploadedToday")).limit(1))[0]?.value;
  if (raw) {
    const [d, n] = raw.split("|");
    if (d === today) manual = Number(n) || 0;
  }
  const daily =
    (
      await db
        .select({ n: sql<number>`count(*)::int` })
        .from(downloads)
        .where(and(eq(downloads.istDate, today), eq(downloads.youtubeStatus, "uploaded")))
    )[0]?.n ?? 0;
  return manual + daily;
}

async function bumpManualUploadsToday(): Promise<void> {
  const today = istDate();
  let n = 0;
  const raw = (await db.select().from(settings).where(eq(settings.key, "manualUploadedToday")).limit(1))[0]?.value;
  if (raw) {
    const [d, v] = raw.split("|");
    if (d === today) n = Number(v) || 0;
  }
  await db
    .insert(settings)
    .values({ key: "manualUploadedToday", value: `${today}|${n + 1}` })
    .onConflictDoUpdate({ target: settings.key, set: { value: `${today}|${n + 1}` } });
}

/** Downloads + uploads queued manual videos. Idempotent and crash-safe. */
export async function processManualQueue(): Promise<void> {
  if (processing) return;
  processing = true;
  try {
    // Operator pause switch (#13): keeps the queue but stops processing.
    const paused = (
      await db.select().from(settings).where(eq(settings.key, "manualPaused")).limit(1)
    )[0]?.value;
    if (paused === "true") return;

    // Reclaim rows stuck mid-flight after a crash/restart (>5 min old).
    await db
      .update(manualUploads)
      .set({ status: "queued", updatedAt: new Date() })
      .where(
        sql`${manualUploads.status} IN ('downloading','uploading') AND ${manualUploads.updatedAt} < now() - interval '5 minutes'`,
      );

    const st = await youtubeStatus();
    const ist = istDate();

    // Work items: queued (download first) or downloaded (upload when connected).
    const rows = await db
      .select()
      .from(manualUploads)
      .where(sql`${manualUploads.status} IN ('queued','downloaded')`)
      .orderBy(asc(manualUploads.priority), asc(manualUploads.id));

    const processRow = async (row: (typeof rows)[number]): Promise<void> => {
      let filePath = row.filePath;

      // ---- step 1: direct download (NO AI verification) ----
      if (!filePath) {
        await db
          .update(manualUploads)
          .set({ status: "downloading", updatedAt: new Date(), error: null })
          .where(eq(manualUploads.id, row.id));
        const candidate: RealCandidate = {
          videoId: row.videoId,
          url: row.url,
          topicSlug: "manual",
          topicId: 0,
          caption: "",
          author: "",
          viewCount: 0,
          likeCount: 0,
          publishedAgoHrs: 0,
          metricSource: "views",
          eligibilityProof: "manual submission",
          source: "source-list",
        };
        // Files land in Downloads/Instagram_Viral_Videos/Manual/<date>/
        const result = await downloadRealVideo(candidate, `Manual/${ist}`);
        if (!result.ok || !result.filePath) {
          await db
            .update(manualUploads)
            .set({ status: "failed", error: (result.error ?? "download failed").slice(0, 500), updatedAt: new Date() })
            .where(eq(manualUploads.id, row.id));
          await logManual("error", `Manual download failed for ${row.videoId}: ${result.error}`);
          return;
        }
        await db
          .update(manualUploads)
          .set({
            status: "downloaded",
            filePath: result.filePath,
            fileHash: result.fileHash,
            fileSize: result.fileSize,
            updatedAt: new Date(),
          })
          .where(eq(manualUploads.id, row.id));
        await logManual("ok", `Manual: downloaded ${row.videoId} (${((result.fileSize ?? 0) / 1_048_576).toFixed(1)} MB).`);
        filePath = result.filePath;
      }

      if (!filePath) return;

      // ---- step 1.5: AI CONTENT CHECK (original content verified BEFORE
      // title generation and upload — never publish an unrelated video) ----
      const meta = await fetchReelMetadata(row.url);
      const caption = meta?.description || meta?.title || "";
      const reach = meta?.views || meta?.likes || 0;

      const topicRows = await db.select().from(topics).orderBy(asc(topics.sortOrder));
      const matched = topicFor(`${caption} ${meta?.author ?? ""}`, topicRows.map((t) => ({ ...t, keywords: t.keywords as string[] })));
      const checkTopic: TopicSeed = matched ?? {
        id: 0,
        slug: "vrindavan-devotional",
        name: "Vrindavan Devotional Reel",
        hindiName: "",
        folder: "",
        keywords: [],
      };
      const checkCandidate: RealCandidate = {
        videoId: row.videoId,
        url: row.url,
        topicSlug: checkTopic.slug,
        topicId: checkTopic.id,
        caption,
        author: meta?.author ?? "",
        viewCount: reach,
        likeCount: meta?.likes ?? 0,
        publishedAgoHrs: 0,
        metricSource: "views",
        eligibilityProof: "manual submission",
        source: "source-list",
      };

      await logManual("ai", `Manual content check: verifying original video ${row.videoId} against real frames before upload…`);
      const transcript = await transcribeVideo(filePath);
      const review = await reviewDownloadedVideo(checkCandidate, checkTopic, filePath, transcript || undefined);
      if (review.verdict !== "match") {
        await fs.promises.rm(filePath, { force: true }).catch(() => {});
        const reason =
          review.verdict === "unavailable"
            ? `AI content check unavailable (${review.reason}) — add/repair an AI key in API Keys, then press Retry`
            : `Content check failed: ${review.reason}`;
        await db
          .update(manualUploads)
          .set({
            status: "failed",
            error: reason.slice(0, 500),
            filePath: null,
            aiFrame: review.frameDataUrl ?? null,
            transcript: transcript || null,
            updatedAt: new Date(),
          })
          .where(eq(manualUploads.id, row.id));
        await logManual(
          "warn",
          `Manual REJECTED ${row.videoId} before upload — ${reason}. File deleted; nothing published.`,
        );
        return;
      }
      await logManual(
        "ai",
        `Manual content check PASSED for ${row.videoId} (${review.confidence}% via ${review.provider}) — creating title and uploading.`,
      );

      // ---- step 2: YouTube upload (needs connection) ----
      if (!st.connected) {
        await logManual("warn", `Manual: ${row.videoId} downloaded — connect YouTube to upload it.`);
        return;
      }
      if (!filePath) return;

      // 5 uploads per IST day across everything — remaining rows wait for tomorrow.
      if ((await uploadsTodayTotal()) >= MANUAL_DAILY_CAP) {
        await logManual("info", `Manual: daily upload limit (5) reached — ${row.videoId} stays queued for tomorrow.`);
        return;
      }

      await db
        .update(manualUploads)
        .set({ status: "uploading", updatedAt: new Date() })
        .where(eq(manualUploads.id, row.id));

      try {
        // Content is already verified above. Now create the UNIQUE heading
        // from this video's real metadata (caption already fetched in check).
        let heading = await planVideoStrategy(matched?.name ?? "Vrindavan Devotional Reel", caption, reach, row.videoId);
        heading = await applyShortsOptimization(heading, filePath);

        // Planned peak slot must still be in the future — otherwise re-plan
        // through the same 9 PM / 5-per-day scheduler.
        let reserved = row.publishAt ? new Date(row.publishAt).getTime() : 0;
        if (!(reserved > Date.now() + 90_000)) {
          const [replanned] = await planPublishSlots(1);
          reserved = replanned ?? Date.now() + PUBLISH_GAP_MS;
        }
        const publishAt = new Date(reserved).toISOString();
        const { id, alreadyOnChannel } = await publishVideoFile({
          filePath,
          title: heading.title,
          description: heading.description,
          tags: heading.hashtags.map((h) => h.slice(1)).concat(["Instagram", "Reel"]),
          publishAt,
          category: heading.category,
          language: heading.language,
          sourceUrl: row.url,
          playlistName: matched?.name ?? "Vrindavan Devotional Reel",
        });
        if (alreadyOnChannel) {
          // Already on the channel → this link is consumed: DELETE it and
          // continue with the next queued video (no duplicate upload).
          await db.delete(manualUploads).where(eq(manualUploads.id, row.id));
          await logManual(
            "ok",
            `Manual: ${row.videoId} is ALREADY on your YouTube channel (${id}) — link deleted, next queued video will be used.`,
          );
          return;
        }
        // Success: count toward the 5/day cap, then consume (delete) the link.
        await bumpManualUploadsToday();
        await db.delete(manualUploads).where(eq(manualUploads.id, row.id));
        await logManual(
          "ok",
          `Manual: "${heading.title}" uploaded → public at ${new Date(publishAt).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST. Link consumed & deleted. https://www.youtube.com/watch?v=${id}`,
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("QUOTA_EXHAUSTED")) {
          const { notifyQuotaOnce } = await import("@/lib/engine");
          void notifyQuotaOnce(`YouTube API quota exhausted for today — ${row.videoId} stays queued and uploads resume after IST midnight.`);
        }
        await db
          .update(manualUploads)
          .set({ status: "failed", error: msg.slice(0, 500), updatedAt: new Date() })
          .where(eq(manualUploads.id, row.id));
        await logManual("error", `Manual upload failed for ${row.videoId}: ${msg.slice(0, 200)}`);
      }
    };

    // Bounded parallelism: 2 workers keeps large batches (100–500 links)
    // moving while staying polite to Instagram and YouTube rate limits.
    let cursor = 0;
    await Promise.all(
      Array.from({ length: Math.min(2, rows.length) }, async () => {
        while (cursor < rows.length) {
          const row = rows[cursor++];
          try {
            await processRow(row);
          } catch (e) {
            await logManual(
              "error",
              `Manual processing error for ${row.videoId}: ${e instanceof Error ? e.message : String(e)}`,
            );
          }
        }
      }),
    );
  } finally {
    processing = false;
  }
}

/* ---------------- queue controls (#13) ---------------------------------- */

export async function setQueuePaused(paused: boolean): Promise<void> {
  await db
    .insert(settings)
    .values({ key: "manualPaused", value: paused ? "true" : "false" })
    .onConflictDoUpdate({ target: settings.key, set: { value: paused ? "true" : "false" } });
  if (!paused) void processManualQueue();
}

/** Moves a row up (-1) or down (+1) in the processing order. */
export async function moveQueueItem(id: number, dir: -1 | 1): Promise<boolean> {
  const row = (
    await db.select().from(manualUploads).where(eq(manualUploads.id, id)).limit(1)
  )[0];
  if (!row) return false;
  const neighbor = await db
    .select()
    .from(manualUploads)
    .where(sql`${manualUploads.status} IN ('queued','downloaded') AND ${manualUploads.id} <> ${id}`)
    .orderBy(asc(manualUploads.priority), asc(manualUploads.id))
    .limit(50);
  const myPos = neighbor.findIndex((r) => r.id === id);
  const swapTarget = dir === -1 ? neighbor[myPos - 1] : neighbor[myPos + 1];
  if (!swapTarget) return false;
  // Swap priorities by position index (unique, small integers).
  const base = Math.min(row.priority || 0, swapTarget.priority || 0);
  await db
    .update(manualUploads)
    .set({ priority: base + 1, updatedAt: new Date() })
    .where(eq(manualUploads.id, dir === -1 ? swapTarget.id : id));
  await db
    .update(manualUploads)
    .set({ priority: base, updatedAt: new Date() })
    .where(eq(manualUploads.id, dir === -1 ? id : swapTarget.id));
  return true;
}

/** Estimated seconds until the queue drains (2 workers, ~40s per item). */
export async function queueEtaSeconds(): Promise<number> {
  const pending = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(manualUploads)
    .where(sql`${manualUploads.status} IN ('queued','downloaded')`);
  return Math.round(((pending[0]?.n ?? 0) * 40) / 2);
}

/* ---------------- list / retry ------------------------------------------ */

export async function listManual(): Promise<{ paused: boolean; rows: ManualRow[] }> {
  const paused =
    (await db.select().from(settings).where(eq(settings.key, "manualPaused")).limit(1))[0]?.value === "true";
  const rows = await db
    .select()
    .from(manualUploads)
    .orderBy(sql`${manualUploads.createdAt} DESC`)
    .limit(300);
  return {
    paused,
    rows: rows.map((r) => ({
      id: r.id,
      videoId: r.videoId,
      url: r.url,
      status: r.status,
      filePath: r.filePath,
      fileSize: r.fileSize,
      publishAt: r.publishAt ? new Date(r.publishAt).toISOString() : null,
      youtubeId: r.youtubeId,
      youtubeUrl: r.youtubeUrl,
      youtubeTitle: r.youtubeTitle,
      error: r.error,
      createdAt: new Date(r.createdAt).toISOString(),
    })),
  };
}

export async function retryManual(id: number): Promise<boolean> {
  const row = (
    await db.select().from(manualUploads).where(eq(manualUploads.id, id)).limit(1)
  )[0];
  if (!row || row.status !== "failed") return false;
  // Failed before download → start over; failed at upload → keep file.
  await db
    .update(manualUploads)
    .set(
      row.filePath
        ? { status: "downloaded", error: null, updatedAt: new Date() }
        : { status: "queued", error: null, updatedAt: new Date() },
    )
    .where(eq(manualUploads.id, id));
  void processManualQueue();
  return true;
}
