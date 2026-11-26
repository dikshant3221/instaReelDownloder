import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { downloads, manualUploads, videoStats, settings } from "@/db/schema";
import { istDate } from "@/lib/ist";

/**
 * Post-publish analytics + quota accounting.
 *
 * - Pulls public statistics for published videos at +1h / +6h / +24h
 *   (videos.list is 1 quota unit for up to 50 videos — nearly free).
 * - Derives insights: which viral formula performs best, and which publish
 *   hour earns the most views on THIS channel — used to steer the Strategy
 *   Bot and the manual scheduler.
 * - Tracks estimated YouTube API quota usage (Google does not expose live
 *   usage; the official cost table is used — clearly labelled as estimated).
 */

export const QUOTA_LIMIT = 10_000; // default Google project quota per day

/** Official YouTube Data API v3 unit costs. */
export const QUOTA_COST = {
  videosList: 1,
  search: 100,
  upload: 1600,
  thumbnail: 50,
  update: 50,
  playlistInsert: 50,
  playlistItem: 50,
  comment: 50,
} as const;

const CHECKPOINTS_H = [1, 6, 24];

async function getSetting(key: string, fallback = ""): Promise<string> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? fallback;
}

async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

/* ---------------- quota accounting -------------------------------------- */

/** Adds estimated units to today's counter (resets automatically each IST day). */
export async function addQuota(units: number, action: keyof typeof QUOTA_COST): Promise<void> {
  try {
    const today = istDate();
    const date = await getSetting("youtubeQuotaDate", "");
    let used = Number(await getSetting("youtubeQuotaUsed", "0")) || 0;
    if (date !== today) {
      used = 0;
      await setSetting("youtubeQuotaDate", today);
    }
    used += units;
    await setSetting("youtubeQuotaUsed", String(used));
    if (used >= QUOTA_LIMIT) {
      const { activityLogs } = await import("@/db/schema");
      await db.insert(activityLogs).values({
        level: "warn",
        message: `YouTube API quota (estimated) exhausted: ${used}/${QUOTA_LIMIT} units used today via ${action}. Uploads resume after the daily reset (IST midnight).`,
      });
    }
  } catch {
    /* quota tracking must never break an upload */
  }
}

export interface QuotaSnapshot {
  used: number;
  limit: number;
  remaining: number;
  exhausted: boolean;
  /** Remaining units needed for one full upload (video + thumb + extras). */
  perUploadCost: number;
}

export async function quotaSnapshot(): Promise<QuotaSnapshot> {
  const today = istDate();
  const date = await getSetting("youtubeQuotaDate", "");
  const used = date === today ? Number(await getSetting("youtubeQuotaUsed", "0")) || 0 : 0;
  const remaining = Math.max(0, QUOTA_LIMIT - used);
  const perUploadCost =
    QUOTA_COST.upload + QUOTA_COST.thumbnail + QUOTA_COST.update + QUOTA_COST.playlistItem + QUOTA_COST.comment;
  return { used, limit: QUOTA_LIMIT, remaining, exhausted: remaining < QUOTA_COST.upload, perUploadCost };
}

/** True when there is clearly room for at least one more full upload. */
export async function canAffordUpload(): Promise<boolean> {
  const q = await quotaSnapshot();
  return q.remaining >= q.perUploadCost;
}

/** True when the response body indicates a hard quotaExceeded error. */
export function isQuotaError(status: number, body: string): boolean {
  return status === 403 && /quotaExceeded|quota/i.test(body);
}

/** Marks today's quota as fully spent (called on a real quotaExceeded). */
export async function markQuotaExhausted(): Promise<void> {
  await setSetting("youtubeQuotaDate", istDate());
  await setSetting("youtubeQuotaUsed", String(QUOTA_LIMIT));
}

/* ---------------- stats collection -------------------------------------- */

interface PublishedRow {
  youtubeId: string;
  source: "manual" | "daily";
  sourceId: number;
  publishAt: Date | null;
  strategy: string | null;
}

async function publishedRows(): Promise<PublishedRow[]> {
  const daily = await db
    .select({
      youtubeId: downloads.youtubeId,
      publishAt: downloads.publishAt,
      strategy: downloads.strategy,
      id: downloads.id,
    })
    .from(downloads)
    .where(eq(downloads.youtubeStatus, "uploaded"));
  const manual = await db
    .select({
      youtubeId: manualUploads.youtubeId,
      publishAt: manualUploads.publishAt,
      strategy: manualUploads.strategy,
      id: manualUploads.id,
    })
    .from(manualUploads)
    .where(eq(manualUploads.status, "uploaded"));
  return [
    ...daily.map((r) => ({ youtubeId: r.youtubeId ?? "", source: "daily" as const, sourceId: r.id, publishAt: r.publishAt, strategy: r.strategy })),
    ...manual.map((r) => ({ youtubeId: r.youtubeId ?? "", source: "manual" as const, sourceId: r.id, publishAt: r.publishAt, strategy: r.strategy })),
  ].filter((r) => r.youtubeId);
}

/**
 * Fetches statistics for checkpoints that are due (+1h, +6h, +24h after
 * publish) and stores them. Returns the number of rows written.
 */
export async function collectVideoStats(): Promise<number> {
  try {
    const { accessToken } = await import("@/lib/youtube");
    const token = await accessToken();
    if (!token) return 0;
    const rows = await publishedRows();
    const now = Date.now();

    // Determine which (video, checkpoint) pairs are due but missing.
    const due = new Map<string, PublishedRow[]>(); // key: checkpoint hours
    for (const r of rows) {
      if (!r.publishAt) continue;
      const elapsedH = (now - new Date(r.publishAt).getTime()) / 3_600_000;
      for (const h of CHECKPOINTS_H) {
        if (elapsedH < h) continue;
        const existing = await db
          .select({ id: videoStats.id })
          .from(videoStats)
          .where(
            and(
              eq(videoStats.youtubeId, r.youtubeId),
              eq(videoStats.source, r.source),
              eq(videoStats.sourceId, r.sourceId),
              eq(videoStats.hoursAfter, h),
            ),
          )
          .limit(1);
        if (existing[0]) continue;
        const list = due.get(String(h)) ?? [];
        list.push(r);
        due.set(String(h), list);
      }
    }
    if (due.size === 0) return 0;

    // One videos.list call covers up to 50 ids (1 quota unit).
    const allIds = [...new Set([...due.values()].flat().map((r) => r.youtubeId))];
    const statsById = new Map<string, { views: number; likes: number; comments: number }>();
    for (let i = 0; i < allIds.length; i += 50) {
      const chunk = allIds.slice(i, i + 50);
      const res = await fetch(
        `${process.env.GOOGLE_API_BASE || "https://www.googleapis.com"}/youtube/v3/videos?part=statistics&id=${chunk.join(",")}`,
        { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(20_000) },
      );
      if (!res.ok) break;
      const j = (await res.json()) as {
        items?: Array<{ id: string; statistics?: { viewCount?: string; likeCount?: string; commentCount?: string } }>;
      };
      for (const item of j.items ?? []) {
        statsById.set(item.id, {
          views: Number(item.statistics?.viewCount ?? 0),
          likes: Number(item.statistics?.likeCount ?? 0),
          comments: Number(item.statistics?.commentCount ?? 0),
        });
      }
      await addQuota(1, "videosList");
    }

    let written = 0;
    for (const [hStr, list] of due) {
      const h = Number(hStr);
      for (const r of list) {
        const st = statsById.get(r.youtubeId);
        if (!st) continue;
        await db.insert(videoStats).values({
          youtubeId: r.youtubeId,
          source: r.source,
          sourceId: r.sourceId,
          viewCount: st.views,
          likeCount: st.likes,
          commentCount: st.comments,
          hoursAfter: h,
          strategy: r.strategy,
          publishAt: r.publishAt,
        });
        written++;
      }
    }
    return written;
  } catch {
    return 0; // analytics must never break the pipeline
  }
}

/* ---------------- insights ---------------------------------------------- */

export interface Insights {
  topStrategy: string | null;
  topStrategyAvg: number;
  strategySamples: number;
  bestHour: number | null;
  bestHourAvg: number;
  hourSamples: number;
}

/** Latest checkpoint row per video → averages by strategy and publish hour. */
export async function getInsights(): Promise<Insights> {
  const out: Insights = {
    topStrategy: null,
    topStrategyAvg: 0,
    strategySamples: 0,
    bestHour: null,
    bestHourAvg: 0,
    hourSamples: 0,
  };
  try {
    const rows = await db
      .select({
        youtubeId: videoStats.youtubeId,
        hoursAfter: videoStats.hoursAfter,
        viewCount: videoStats.viewCount,
        strategy: videoStats.strategy,
        publishAt: videoStats.publishAt,
      })
      .from(videoStats)
      .orderBy(asc(videoStats.youtubeId), desc(videoStats.hoursAfter));
    // keep the latest checkpoint per video
    const latest = new Map<string, (typeof rows)[number]>();
    for (const r of rows) if (!latest.has(r.youtubeId)) latest.set(r.youtubeId, r);
    const vals = [...latest.values()];
    if (vals.length === 0) return out;

    // by strategy
    const byStrategy = new Map<string, number[]>();
    for (const v of vals) {
      if (!v.strategy) continue;
      const a = byStrategy.get(v.strategy) ?? [];
      a.push(v.viewCount);
      byStrategy.set(v.strategy, a);
    }
    for (const [name, arr] of byStrategy) {
      const avg = arr.reduce((s, x) => s + x, 0) / arr.length;
      if (arr.length >= 1 && avg > out.topStrategyAvg) {
        out.topStrategy = name;
        out.topStrategyAvg = Math.round(avg);
        out.strategySamples = arr.length;
      }
    }

    // by publish hour (IST)
    if (vals.length >= 2) {
      const byHour = new Map<number, number[]>();
      for (const v of vals) {
        if (!v.publishAt) continue;
        const hour = Number(
          new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }).format(
            new Date(v.publishAt),
          ),
        );
        const a = byHour.get(hour) ?? [];
        a.push(v.viewCount);
        byHour.set(hour, a);
      }
      for (const [hour, arr] of byHour) {
        const avg = arr.reduce((s, x) => s + x, 0) / arr.length;
        if (arr.length >= 2 && avg > out.bestHourAvg) {
          out.bestHour = hour;
          out.bestHourAvg = Math.round(avg);
          out.hourSamples = arr.length;
        }
      }
    }
    return out;
  } catch {
    return out;
  }
}

/**
 * Performance weights per strategy formula (smoothed so a single lucky video
 * doesn't dominate): score = (sum views + 1000) / (count + 1).
 */
export async function getStrategyWeights(): Promise<Record<string, number>> {
  try {
    const rows = await db
      .select({ strategy: videoStats.strategy, viewCount: videoStats.viewCount, youtubeId: videoStats.youtubeId, hoursAfter: videoStats.hoursAfter })
      .from(videoStats)
      .orderBy(asc(videoStats.youtubeId), desc(videoStats.hoursAfter));
    const latest = new Map<string, (typeof rows)[number]>();
    for (const r of rows) if (!latest.has(r.youtubeId)) latest.set(r.youtubeId, r);
    const acc = new Map<string, { sum: number; n: number }>();
    for (const r of latest.values()) {
      if (!r.strategy) continue;
      const a = acc.get(r.strategy) ?? { sum: 0, n: 0 };
      a.sum += r.viewCount;
      a.n++;
      acc.set(r.strategy, a);
    }
    const weights: Record<string, number> = {};
    for (const [name, a] of acc) weights[name] = (a.sum + 1000) / (a.n + 1);
    return weights;
  } catch {
    return {};
  }
}
