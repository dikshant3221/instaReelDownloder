import { and, asc, desc, eq, sql } from "drizzle-orm";
import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/db";
import { downloads, scanRuns, topics, activityLogs, aiProviders, settings, manualUploads } from "@/db/schema";
import { istDate, istYesterdayDate, nextIstMidnight, istFull } from "@/lib/ist";
import { MIN_VIEWS, TopicSeed, selectDiverse } from "@/lib/reels";
import {
  dailyDownloadFolder,
  discoverRealCandidates,
  downloadRealVideo,
  type RealCandidate,
} from "@/lib/instagram-real";
import { hasVisionProvider } from "@/lib/ai-review";
import { computePerceptualHash, isVisuallySimilar } from "@/lib/phash";
import { notifyAsync, setSetting as setNotifySetting } from "@/lib/notify";

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

const TOPIC_SEED = [
  {
    slug: "banke-bihari-ji",
    name: "Shri Banke Bihari Ji",
    hindiName: "श्री बांके बिहारी जी",
    folder: "Banke_Bihari_Ji",
    keywords: [
      "Banke Bihari", "बांके बिहारी", "Bihari Ji", "Banke Bihari Mandir",
      "Vrindavan Darshan", "Nidhivan", "बिहारी जी", "#BankeBihari",
    ],
  },
  {
    slug: "radha-vallabh-ji",
    name: "Shri Radha Vallabh Ji",
    hindiName: "श्री राधावल्लभ जी",
    folder: "Radha_Vallabh_Ji",
    keywords: [
      "Radha Vallabh", "राधावल्लभ", "RadhaRani", "Hit Radha Vallabh",
      "Seva Kunj", "राधा रानी", "#RadhaVallabh",
    ],
  },
  {
    slug: "radha-raman-ji",
    name: "Shri Radha Raman Ji",
    hindiName: "श्री राधारमण जी",
    folder: "Radha_Raman_Ji",
    keywords: [
      "Radha Raman", "राधारमण", "Radha Raman Mandir", "Shaligram deity",
      "Radharaman", "राधा रमण मंदिर", "#RadhaRaman",
    ],
  },
  {
    slug: "radha-govind-dev-ji",
    name: "Shri Radha Govind Dev Ji",
    hindiName: "श्री राधा गोविन्द देव जी",
    folder: "Radha_Govind_Dev_Ji",
    keywords: [
      "Govind Dev", "गोविन्द देव", "Radha Govind Dev", "Govindaji",
      "Rupa Goswami deity", "गोविन्ददेव मंदिर", "#RadhaGovindDev",
    ],
  },
  {
    slug: "premanand-ji-maharaj",
    name: "Premanand Ji Maharaj",
    hindiName: "प्रेमानंद जी महाराज",
    folder: "Premanand_Ji_Maharaj",
    keywords: [
      "Premanand Maharaj", "प्रेमानंद महाराज", "Premanand Ji Satsang",
      "Ekantik Vartalap", "Radha Keli Kunj", "प्रेमानंद जी प्रवचन",
    ],
  },
  {
    slug: "indresh-ji-maharaj",
    name: "Indresh Ji Maharaj",
    hindiName: "इंद्रेश जी महाराज",
    folder: "Indresh_Ji_Maharaj",
    keywords: [
      "Indresh Upadhyay", "इंद्रेश उपाध्याय", "Indresh Ji Katha",
      "Bhagwat Katha", "Indresh Maharaj Pravachan", "इंद्रेश जी कथा",
    ],
  },
  {
    slug: "vinod-baba-ji",
    name: "Vinod Baba Ji",
    hindiName: "विनोद बाबा जी",
    folder: "Vinod_Baba_Ji",
    keywords: [
      "Vinod Baba", "विनोद बाबा", "Vinod Baba Pravachan", "Braj Sant",
      "Vinod Bihari", "विनोद बाबा प्रवचन",
    ],
  },
] as const;

const PROVIDER_SEED = [
  {
    slug: "gemini",
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    docsUrl: "https://aistudio.google.com/app/apikey",
    freeTier: "Free tier · multimodal Gemini Flash Lite",
    model: "gemini-2.5-flash-lite",
    active: true,
  },
  {
    slug: "mistral",
    name: "Mistral AI",
    baseUrl: "https://api.mistral.ai/v1",
    docsUrl: "https://console.mistral.ai/api-keys",
    freeTier: "Free La Plateforme tier · Pixtral vision",
    model: "pixtral-12b-2409",
    active: false,
  },
  {
    slug: "nvidia",
    name: "NVIDIA AI (NIM)",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    docsUrl: "https://build.nvidia.com",
    freeTier: "Free dev credits · multimodal Llama 4",
    model: "meta/llama-4-maverick-17b-128e-instruct",
    active: false,
  },
  {
    slug: "agnes",
    name: "Agnes AI",
    baseUrl: "https://api.agnes.ai/v1",
    docsUrl: "https://agnes.ai",
    freeTier: "Community tier where available · OpenAI-compatible vision endpoint",
    model: "agnes-vision",
    active: false,
  },
  {
    slug: "bazarlink",
    name: "Bazarlink",
    baseUrl: "https://api.bazarlink.ai/v1",
    docsUrl: "https://bazarlink.ai",
    freeTier: "Free tier where available · OpenAI-compatible vision endpoint",
    model: "bazarlink-vision",
    active: false,
  },
] as const;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function seedOnce() {
  for (let i = 0; i < TOPIC_SEED.length; i++) {
    const t = TOPIC_SEED[i];
    await db
      .insert(topics)
      .values({ ...t, keywords: [...t.keywords], enabled: true, sortOrder: i })
      // Only refresh descriptive fields on re-seed. Do NOT touch `enabled` or
      // `sortOrder` — the user is allowed to disable/reorder topics.
      .onConflictDoUpdate({
        target: topics.slug,
        set: { name: t.name, folder: t.folder },
      });
  }
  for (const p of PROVIDER_SEED) {
    await db
      .insert(aiProviders)
      .values({
        slug: p.slug,
        name: p.name,
        baseUrl: p.baseUrl,
        docsUrl: p.docsUrl,
        freeTier: p.freeTier,
        model: p.model,
        active: p.active,
      })
      // IMPORTANT: never clobber user-customised endpoint/model/key. Only fill
      // in defaults when a field is still empty, and refresh descriptive docs.
      .onConflictDoUpdate({
        target: aiProviders.slug,
        set: {
          name: p.name,
          docsUrl: p.docsUrl,
          freeTier: p.freeTier,
          baseUrl: sql`CASE WHEN ${aiProviders.baseUrl} = '' THEN ${p.baseUrl} ELSE ${aiProviders.baseUrl} END`,
          model: sql`CASE WHEN ${aiProviders.model} = '' THEN ${p.model} ELSE ${aiProviders.model} END`,
        },
      });
    const envKey =
      p.slug === "gemini"
        ? process.env.GEMINI_API_KEY
        : p.slug === "mistral"
          ? process.env.MISTRAL_API_KEY
          : p.slug === "nvidia"
            ? process.env.NVIDIA_API_KEY
            : p.slug === "agnes"
              ? process.env.AGNES_API_KEY
              : p.slug === "bazarlink"
                ? process.env.BAZARLINK_API_KEY
                : undefined;
    if (envKey?.trim()) {
      const saved = (
        await db.select({ apiKey: aiProviders.apiKey }).from(aiProviders).where(eq(aiProviders.slug, p.slug)).limit(1)
      )[0];
      if (!saved?.apiKey) {
        await db.update(aiProviders).set({ apiKey: envKey.trim() }).where(eq(aiProviders.slug, p.slug));
      }
    }
  }
  const defaults: Record<string, string> = {
    engineRunning: "true",
    nextScanAt: "0", // run as soon as service boots (catch-up)
    downloadRoot: "Windows Downloads/Instagram_Viral_Videos/<IST-date>",
    scanIntervalMin: "30",
    minViews: String(MIN_VIEWS), // user-adjustable viral threshold
  };
  for (const [key, value] of Object.entries(defaults)) {
    await db.insert(settings).values({ key, value }).onConflictDoNothing({ target: settings.key });
  }
}

export async function ensureSeeded() {
  // Make sure the zero-config database is actually up before seeding.
  const { ensureDb } = await import("@/db");
  await ensureDb();
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await seedOnce();
      return;
    } catch (e) {
      lastErr = e;
      await sleep(250 * (attempt + 1));
    }
  }
  console.error("[ViralDarshan DB] seeding failed:",
    lastErr instanceof Error ? lastErr.message : lastErr);
  throw lastErr;
}

/* ------------------------------------------------------------------ */
/* Settings + logging                                                  */
/* ------------------------------------------------------------------ */

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? fallback;
}

export async function setSetting(key: string, value: string) {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

/** Effective viral threshold (user-adjustable; falls back to the constant). */
export async function getMinViews(): Promise<number> {
  const v = Number(await getSetting("minViews", String(MIN_VIEWS)));
  return Number.isFinite(v) && v >= 0 ? v : MIN_VIEWS;
}

/** Daily target = number of currently ENABLED topics (one approved video each). */
export async function getDailyLimit(): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(topics)
    .where(eq(topics.enabled, true));
  return rows[0]?.n ?? 0;
}

export async function log(level: string, message: string) {
  await db.insert(activityLogs).values({ level, message });
  // Retain last 400 log lines
  await db.execute(sql`
    DELETE FROM activity_logs WHERE id < (
      SELECT COALESCE(MIN(id), 0) FROM (
        SELECT id FROM activity_logs ORDER BY id DESC LIMIT 400
      ) keep
    )
  `);
}

export async function logMany(entries: Array<[string, string]>) {
  if (entries.length === 0) return;
  await db.insert(activityLogs).values(entries.map(([level, message]) => ({ level, message })));
}

/* ------------------------------------------------------------------ */
/* Daily counters — DERIVED from permanent cache (crash-safe)          */
/* ------------------------------------------------------------------ */

export async function todayCompleted(ist: string): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(downloads)
    .where(
      and(
        eq(downloads.istDate, ist),
        eq(downloads.status, "completed"),
        eq(downloads.aiVerdict, "match"),
      ),
    );
  return rows[0]?.n ?? 0;
}

async function todayStats(ist: string) {
  const rows = await db
    .select({
      topic: topics.slug,
      topicName: topics.name,
      n: sql<number>`count(*)::int`,
      views: sql<number>`coalesce(sum(${downloads.viewCount}),0)::bigint`,
    })
    .from(downloads)
    .innerJoin(topics, eq(downloads.topicId, topics.id))
    .where(
      and(
        eq(downloads.istDate, ist),
        eq(downloads.status, "completed"),
        eq(downloads.aiVerdict, "match"),
      ),
    )
    .groupBy(topics.slug, topics.name);
  return rows;
}

/* ------------------------------------------------------------------ */
/* Legacy placeholder cleanup                                          */
/* ------------------------------------------------------------------ */

let placeholdersCleaned = false;

/**
 * Older builds created 5KB metadata artifacts with an .mp4 extension. They
 * are not videos. Purge both their database rows and bytes so the quota is
 * recalculated from REAL, verified media only.
 */
async function purgeLegacyPlaceholders() {
  if (placeholdersCleaned) return;
  const legacy = await db
    .select({ id: downloads.id, filePath: downloads.filePath })
    .from(downloads)
    .where(
      sql`${downloads.status} = 'completed' AND (
        COALESCE(${downloads.fileSize}, 0) < 100000 OR
        COALESCE(${downloads.filePath}, '') LIKE '/downloads/%'
      )`,
    );
  for (const row of legacy) {
    if (row.filePath?.startsWith("/downloads/")) {
      const oldFile = path.join(process.cwd(), "public", row.filePath.replace(/^\//, ""));
      await fs.rm(oldFile, { force: true }).catch(() => {});
    }
    await db.delete(downloads).where(eq(downloads.id, row.id));
  }
  if (legacy.length > 0) {
    await log(
      "warn",
      `Removed ${legacy.length} old metadata placeholder(s). Only real playable MP4 files count now.`,
    );
  }
  placeholdersCleaned = true;
}

/**
 * Audits real MP4s downloaded by the previous build before AI gating existed.
 * Match -> becomes countable. Mismatch/uncertain -> file deleted and permanent
 * ai_rejected cache row retained. Provider outage -> remains pending for retry.
 */
/* ------------------------------------------------------------------ */
/* Scan engine                                                         */
/* ------------------------------------------------------------------ */

let inProcessScan = false;
/** Any scan row started before this process booted belongs to a dead process
 *  and is reclaimed immediately (restart must never block scanning for 10min). */
const PROCESS_STARTED_AT = Date.now();

export interface ScanOutcome {
  status: "finished" | "skipped" | "busy";
  message: string;
  downloaded: number;
  duplicates: number;
  failed: number;
  eligible: number;
  candidates: number;
  remainingAfter: number;
}

export async function runScan(trigger: "manual" | "scheduled"): Promise<ScanOutcome> {
  await ensureSeeded();
  await purgeLegacyPlaceholders();
  if (inProcessScan) {
    return { status: "busy", message: "A scan is already running in this process (single-instance guard).", downloaded: 0, duplicates: 0, failed: 0, eligible: 0, candidates: 0, remainingAfter: 0 };
  }
  // Cross-restart guard: an unfinished scan younger than 10 min = another
  // instance may own it. Older = crashed scan; safe to reclaim.
  const stale = await db
    .select()
    .from(scanRuns)
    .where(eq(scanRuns.status, "running"))
    .orderBy(desc(scanRuns.startedAt))
    .limit(1);
  const staleStartedAt = stale[0] ? new Date(stale[0].startedAt).getTime() : 0;
  const staleIsLive =
    stale[0] !== undefined &&
    staleStartedAt >= PROCESS_STARTED_AT && // started by THIS process
    Date.now() - staleStartedAt < 10 * 60_000;
  if (staleIsLive) {
    return { status: "busy", message: `Scan #${stale[0]!.id} still marked running — refusing parallel downloaders.`, downloaded: 0, duplicates: 0, failed: 0, eligible: 0, candidates: 0, remainingAfter: 0 };
  }
  if (stale[0]) {
    await db.update(scanRuns).set({ status: "skipped", message: "reclaimed after crash", finishedAt: new Date() }).where(eq(scanRuns.id, stale[0].id));
    await log("warn", `Recovered from crashed scan #${stale[0].id} — resuming safely without losing daily progress.`);
  }

  inProcessScan = true;
  const ist = istDate();
  const logs: Array<[string, string]> = [];
  try {
    const aiReady = await hasVisionProvider();
    // Legacy pending rows (from the old AI-gate era) are now trusted directly —
    // auto-collection no longer rejects content, so they simply count.
    await db
      .update(downloads)
      .set({ aiVerdict: "match" })
      .where(sql`${downloads.status} = 'completed' AND ${downloads.aiVerdict} = 'pending'`);
    const dailyLimit = await getDailyLimit();
    const minViews = await getMinViews();
    const done = await todayCompleted(ist);
    const remaining = Math.max(0, dailyLimit - done);

    const activeProvider = (
      await db.select().from(aiProviders).where(eq(aiProviders.active, true)).limit(1)
    )[0];
    const aiNote =
      aiReady && activeProvider?.apiKey
        ? `AI enhancements ON (${activeProvider.name}): manual content checks, transcripts, viral titles`
        : "AI key not configured — auto-collection runs WITHOUT AI (no content rejection); manual uploads need a key for their content check";

    const [run] = await db
      .insert(scanRuns)
      .values({ trigger, istDate: ist, quotaBefore: done, aiProvider: aiNote })
      .returning();

    logs.push([
      "info",
      `Scan #${run.id} (${trigger}) — IST ${istFull(new Date())}. Coverage: ${done}/${dailyLimit} topics complete → ${remaining} topic${remaining === 1 ? "" : "s"} still need a video.`,
    ]);
    logs.push([aiReady ? "ai" : "warn", `AI relevance gate: ${aiNote}.`]);

    if (remaining === 0) {
      const doneMsg = dailyLimit === 0
        ? "No topics are enabled — enable at least one topic to start collecting."
        : `All ${dailyLimit} enabled topic(s) complete — searching stopped until IST midnight.`;
      await db
        .update(scanRuns)
        .set({ status: "skipped", message: doneMsg, finishedAt: new Date() })
        .where(eq(scanRuns.id, run.id));
      logs.push([dailyLimit === 0 ? "warn" : "ok", doneMsg]);
      await logMany(logs);
      await setSetting("lastScanAt", String(Date.now()));
      await setSetting("nextScanAt", String(nextIstMidnight()));
      if (dailyLimit > 0) void maybeUploadToYouTube();
      return { status: "skipped", message: "Daily target met", downloaded: 0, duplicates: 0, failed: 0, eligible: 0, candidates: 0, remainingAfter: 0 };
    }

    // ---- REAL public discovery -------------------------------------
    const topicRows = await db.select().from(topics).where(eq(topics.enabled, true)).orderBy(asc(topics.sortOrder));
    const allSeeds: TopicSeed[] = topicRows.map((t) => ({ ...t, keywords: t.keywords as string[] }));

    // A topic that already has today's approved video is DONE: never searched
    // again today. Discovery runs only for the topics still missing.
    const completedTopics = new Set(
      (await todayStats(ist)).filter((row) => row.n >= 1).map((row) => row.topic),
    );
    const seeds = allSeeds.filter((t) => !completedTopics.has(t.slug));
    const pendingTopicNames = seeds.map((t) => t.name.replace(/^Shri\s+/i, "")).join(", ");
    logs.push([
      "info",
      `Searching ${seeds.length} remaining topic${seeds.length === 1 ? "" : "s"}: ${pendingTopicNames || "none"}. ` +
        `${completedTopics.size} topic${completedTopics.size === 1 ? "" : "s"} already complete today and skipped.`,
    ]);

    const scanIndexRows = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(scanRuns)
      .where(eq(scanRuns.istDate, ist));
    const scanIndex = scanIndexRows[0]?.n ?? 0;

    const discovery = await discoverRealCandidates(seeds, scanIndex, {
      apifyToken: await getSetting("apifyToken", ""),
      cookiesBrowser: await getSetting("instagramCookiesBrowser", ""),
      sourceUrls: await getSetting("instagramSourceUrls", ""),
      minViews,
    });
    const candidates = discovery.candidates;
    const st = discovery.stats;
    logs.push([
      "info",
      `Real discovery: ${discovery.detail}. No generated/demo URLs are used.`,
    ]);
    logs.push([candidates.length > 0 ? "info" : "warn", `Discovery diagnostic: ${discovery.diagnostic}.`]);
    if (st.inspected > 0) {
      const below = st.belowThreshold;
      const noMetric = st.noPublicMetric;
      logs.push([
        candidates.length > 0 ? "info" : "warn",
        `Inspected ${st.inspected} public Reel(s): ${st.eligible} above ${minViews.toLocaleString("en-IN")}, ` +
          `${below} found but below your threshold, ${noMetric} with no public metric (Instagram hides views — enable browser cookies in Discovery Setup for exact counts), ` +
          `${st.unavailable} private/unreachable.`,
      ]);
      // Surface WHY nothing downloaded so the dashboard can explain + fix it.
      await setSetting(
        "lastScanInsight",
        JSON.stringify({ ...st, threshold: minViews, at: Date.now() }),
      );
    }
    if (candidates.length === 0 && st.inspected > 0 && st.belowThreshold > 0 && st.eligible === 0) {
      logs.push([
        "warn",
        `Your ${minViews.toLocaleString("en-IN")}-view threshold is blocking every Reel found. Instagram rarely exposes view counts publicly — lower the threshold (Topics → Viral threshold) or enable browser cookies for exact counts.`,
      ]);
    } else if (candidates.length === 0) {
      logs.push([
        "warn",
        "Discovery Bot found no eligible public Reel this pass. It auto-rotates keywords/sources and retries continuously. For maximum reliability add a free Apify token in 'Instagram Discovery Setup'.",
      ]);
    }

    // The real adapter has already verified public metrics. Keep this hard
    // gate as defense-in-depth; unknown/low-view Reels can never enter.
    const eligible = candidates.filter((c) => c.viewCount > minViews);
    logs.push([
      eligible.length > 0 ? "info" : "warn",
      eligible.length > 0
        ? `Viral filter: ${eligible.length} public Reel(s) have a verified metric above ${minViews.toLocaleString("en-IN")}.`
        : `No public Reel above ${minViews.toLocaleString("en-IN")} views this pass. Nothing fake will be downloaded or counted.`,
    ]);

    // ---- Permanent dedupe ------------------------------------------
    const fresh: RealCandidate[] = [];
    let duplicates = 0;
    for (const c of eligible) {
      const hit = await db
        .select({ id: downloads.id })
        .from(downloads)
        .where(sql`(${downloads.videoId} = ${c.videoId} OR ${downloads.url} = ${c.url})`)
        .limit(1);
      if (hit[0]) duplicates++;
      else fresh.push(c);
    }
    if (duplicates > 0) {
      logs.push(["warn", `Duplicate shield: skipped ${duplicates} already-cached real video(s) (ID/URL match).`]);
    }
    logs.push(["info", `${fresh.length} fresh verified Reel(s) after dedupe — ranking by viral metric + topic diversity.`]);

    // Strictly select the single highest-metric candidate for each topic that
    // is still missing today. No topic can appear twice in `selected`.
    const distribution = await todayStats(ist);
    const todayByTopic = new Map(distribution.map((d) => [d.topic, d.n]));
    const selected = selectDiverse(fresh, remaining, todayByTopic);

    // ---- REAL MP4 download + AI gate (parallel across topics) -------
    let downloaded = 0;
    let failed = 0;
    const targetFolder = dailyDownloadFolder(ist);
    logs.push(["info", `Download folder: ${targetFolder}. Processing ${selected.length} topic(s) in parallel…`]);

    const processCandidate = async (c: RealCandidate) => {
      // Skip if this topic was completed (possibly by a concurrent task).
      const alreadyDone = (await todayStats(ist)).some((row) => row.topic === c.topicSlug && row.n >= 1);
      if (alreadyDone) return;

      const result = await downloadRealVideo(c, ist);
      if (!result.ok || !result.filePath || !result.fileHash || !result.fileSize) {
        failed++;
        logs.push(["error", `FAILED ${c.videoId} (${c.topicSlug}): ${result.error}. Not counted.`]);
        return;
      }

      // Hash dedupe — identical bytes already cached.
      const hashHit = await db
        .select({ id: downloads.id })
        .from(downloads)
        .where(eq(downloads.fileHash, result.fileHash))
        .limit(1);
      if (hashHit[0]) {
        await fs.rm(result.filePath, { force: true }).catch(() => {});
        duplicates++;
        logs.push(["warn", `${c.videoId}: identical content already cached — removed.`]);
        return;
      }

      // Perceptual duplicate guard (#12): same visual re-uploaded under a
      // different shortcode (survives re-encode) → delete and count as duplicate.
      const phash = await computePerceptualHash(result.filePath);
      if (phash) {
        const twins = await db
          .select({ videoId: downloads.videoId, phash: downloads.phash })
          .from(downloads)
          .where(sql`${downloads.phash} IS NOT NULL`)
          .orderBy(desc(downloads.id))
          .limit(400);
        const twin = twins.find((r) => r.videoId !== c.videoId && isVisuallySimilar(phash, r.phash));
        if (twin) {
          await fs.rm(result.filePath, { force: true }).catch(() => {});
          duplicates++;
          logs.push(["warn", `${c.videoId} is visually identical to ${twin.videoId} (perceptual hash) — removed, never uploaded twice.`]);
          return;
        }
      }

      // No content rejection for auto-collection (user directive): whatever
      // topic-scoped discovery found — after threshold + dedupe — is trusted.
      // The same strategy/title/playlist/channel-check pipeline as manual runs
      // at upload time (uploadPendingBatch → uploadOne).
      const topic = seeds.find((t) => t.id === c.topicId)!;
      try {
        await db.insert(downloads).values({
          videoId: c.videoId, url: c.url, topicId: c.topicId, caption: c.caption,
          author: c.author, viewCount: c.viewCount, likeCount: c.likeCount,
          metricSource: c.metricSource, aiVerdict: "match", aiProvider: null,
          aiConfidence: null, aiDetectedTopic: null, aiReason: null,
          phash,
          status: "completed", istDate: ist, filePath: result.filePath, fileName: result.fileName,
          fileHash: result.fileHash, fileSize: result.fileSize, scanRunId: run.id,
          downloadedAt: new Date(),
        });
        downloaded++;
        logs.push([
          "ok",
          `SAVED ${topic.name.replace(/^Shri\s+/i, "")}: ${result.fileName} — ${(result.fileSize / 1_048_576).toFixed(1)} MB, ${c.eligibilityProof}. Trusted by topic search — queued for peak-time upload.`,
        ]);
      } catch {
        await fs.rm(result.filePath, { force: true }).catch(() => {});
        duplicates++;
        logs.push(["warn", `${c.videoId} raced into cache — second copy removed.`]);
      }
    };

    // Bounded parallel pool — each selected candidate is a distinct topic, so
    // running them together is safe and dramatically faster than one-by-one.
    const concurrency = Math.min(4, selected.length);
    let cursor = 0;
    await Promise.all(
      Array.from({ length: Math.max(1, concurrency) }, async () => {
        while (cursor < selected.length) {
          const c = selected[cursor++];
          try {
            await processCandidate(c);
          } catch (e) {
            logs.push(["error", `Unexpected error on ${c.videoId}: ${e instanceof Error ? e.message : String(e)}`]);
          }
        }
      }),
    );

    const after = await todayCompleted(ist);
    const remainingAfter = Math.max(0, dailyLimit - after);
    const message =
      remainingAfter === 0
        ? `All ${dailyLimit} enabled topic(s) complete (${after}/${dailyLimit}). Searching stops until IST midnight.`
        : downloaded === 0
          ? `No approved video found for the remaining ${remainingAfter} topic(s) this scan — will keep searching only those topics.`
          : `Added ${downloaded} topic video(s). ${remainingAfter} topic(s) still need a video.`;

    await db
      .update(scanRuns)
      .set({
        status: "finished",
        finishedAt: new Date(),
        candidates: candidates.length,
        eligible: eligible.length,
        fresh: fresh.length,
        downloaded,
        duplicates,
        failed,
        message,
      })
      .where(eq(scanRuns.id, run.id));

    logs.push([remainingAfter === 0 ? "ok" : "info", message]);
    // Continuous mode: while topics remain, keep searching back-to-back (a short
    // breather keeps discovery sources polite). Only when all topics are
    // collected do we rest until the IST midnight reset.
    const nextAt = remainingAfter === 0 ? nextIstMidnight() : Date.now() + 8_000;
    await setSetting("lastScanAt", String(Date.now()));
    await setSetting("nextScanAt", String(nextAt));
    logs.push([
      "info",
      remainingAfter === 0
        ? `All topics collected. Resting until IST midnight — permanent cache retained.`
        : `Continuing to search the ${remainingAfter} remaining topic(s)…`,
    ]);
    await logMany(logs);
    // The daily collection is complete → publish to YouTube (15-min schedule).
    if (remainingAfter === 0) {
      notifyAsync(`Daily collection complete: ${after}/${dailyLimit} topics have today's approved video. Uploading to YouTube now.`);
      void maybeUploadToYouTube();
    }
    return { status: "finished", message, downloaded, duplicates, failed, eligible: eligible.length, candidates: candidates.length, remainingAfter };
  } finally {
    inProcessScan = false;
  }
}

/* ------------------------------------------------------------------ */
/* YouTube publishing (runs only after the full daily collection)       */
/* ------------------------------------------------------------------ */

/**
 * Publishes today's approved videos to YouTube once the whole daily
 * collection is complete. Fire-and-forget: never blocks or fails a scan.
 */
async function maybeUploadToYouTube(): Promise<void> {
  try {
    const { uploadPendingBatch, youtubeStatus } = await import("@/lib/youtube");
    const st = await youtubeStatus();
    if (!st.enabled || !st.connected) return;
    const result = await uploadPendingBatch();
    if (result.uploaded > 0 || result.failed > 0) {
      await log(
        "info",
        `YouTube batch: ${result.uploaded} uploaded (public in 15 min), ${result.failed} failed.`,
      );
      notifyAsync(
        `YouTube: ${result.uploaded} video(s) uploaded and scheduled${result.failed ? `, ${result.failed} failed` : ""}.`,
      );
    }
  } catch (e) {
    console.error("[YouTube] upload batch failed:", e);
  }
}

/* ------------------------------------------------------------------ */
/* Engine control + scheduling                                         */
/* ------------------------------------------------------------------ */

export async function startEngine() {
  await ensureSeeded();
  await setSetting("engineRunning", "true");
  await setSetting("nextScanAt", "0"); // immediately due → catch-up logic runs it
  await log("ok", "Engine STARTED — searching continuously until all 7 topics have an approved video today (Asia/Kolkata).");
}

export async function stopEngine() {
  await setSetting("engineRunning", "false");
  await setSetting("nextScanAt", "0");
  await log("warn", "Engine STOPPED by user. No scans or downloads will run until restarted.");
}

/**
 * Lazy scheduler: called from /api/status. If the engine is enabled and the
 * next scan is due (including missed windows — laptop-off recovery), run it.
 * Because state lives in Postgres, a restart never loses the daily count.
 */
export async function tickScheduler(): Promise<boolean> {
  await ensureSeeded();
  const running = (await getSetting("engineRunning", "true")) === "true";
  if (!running) return false;

  // Analytics loop (#4): collect +1h/+6h/+24h stats every ~30 min (cheap:
  // one videos.list call per batch) and keep trending tags fresh daily.
  try {
    const nextStatsAt = Number(await getSetting("nextStatsAt", "0"));
    if (Date.now() >= nextStatsAt) {
      await setSetting("nextStatsAt", String(Date.now() + 30 * 60_000));
      const { collectVideoStats, getTrendingTags: _unused } = { collectVideoStats: undefined, getTrendingTags: undefined };
      void collectVideoStatsSafe();
      void refreshTrendingSafe();
    }
    // Nightly backup of the permanent cache (#25) — JSON snapshot, keep 7 days.
    const lastBackup = await getSetting("lastBackupAt", "");
    if (istDate() !== lastBackup) {
      await setSetting("lastBackupAt", istDate());
      void runNightlyBackup();
    }
  } catch {
    /* analytics never blocks scheduling */
  }
  const nextAt = Number(await getSetting("nextScanAt", "0"));
  const ist = istDate();
  const done = await todayCompleted(ist);
  const dailyLimit = await getDailyLimit();
  if (dailyLimit > 0 && done >= dailyLimit) {
    // Target met: make sure we only wake again after IST midnight.
    if (nextAt < nextIstMidnight() - 60_000 || nextAt === 0) {
      await setSetting("nextScanAt", String(nextIstMidnight()));
    }
    // Retries any pending/failed YouTube uploads from earlier today.
    void maybeUploadToYouTube();
    return false;
  }
  if (nextAt === 0 || Date.now() >= nextAt) {
    const outcome = await runScan("scheduled");
    return outcome.status !== "busy";
  }
  return false;
}

/** Nightly JSON snapshot of the permanent cache (downloads + manual queue). */
async function runNightlyBackup(): Promise<void> {
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const [dl, man] = await Promise.all([
      db.select().from(downloads),
      db.select().from(manualUploads),
    ]);
    const dir = path.join(process.cwd(), ".backups");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `viraldarshan-${istDate()}.json`);
    fs.writeFileSync(file, JSON.stringify({ at: new Date().toISOString(), downloads: dl, manual: man }, null, 1));
    // keep only the 7 newest backups
    const files = fs.readdirSync(dir).filter((f) => f.startsWith("viraldarshan-")).sort();
    for (const old of files.slice(0, Math.max(0, files.length - 7))) {
      fs.rmSync(path.join(dir, old), { force: true });
    }
    await log("info", `Backup created: .backups/${path.basename(file)} (${dl.length + man.length} records).`);
  } catch (e) {
    console.error("[Backup]", e);
  }
}

/** QUOTA_EXHAUSTED alerts are sent at most once per IST day. */
export async function notifyQuotaOnce(message: string): Promise<void> {
  try {
    const key = "quotaNotifiedOn";
    const today = istDate();
    if ((await getSetting(key, "")) === today) return;
    await setNotifySetting(key, today);
    notifyAsync(message);
  } catch {
    /* ignore */
  }
}

async function collectVideoStatsSafe(): Promise<void> {
  try {
    const { collectVideoStats } = await import("@/lib/youtube-stats");
    const n = await collectVideoStats();
    if (n > 0) await log("ai", `Analytics: stored ${n} performance checkpoint(s) from YouTube.`);
  } catch (e) {
    console.error("[Analytics]", e);
  }
}

async function refreshTrendingSafe(): Promise<void> {
  try {
    const { getTrendingTags } = await import("@/lib/youtube");
    await getTrendingTags();
  } catch {
    /* trending refresh is best-effort */
  }
}

/* ------------------------------------------------------------------ */
/* Status snapshot for the dashboard                                   */
/* ------------------------------------------------------------------ */

export async function getStatus() {
  await ensureSeeded();
  await purgeLegacyPlaceholders();
  const ist = istDate();
  const dailyLimit = await getDailyLimit();
  const minViews = await getMinViews();
  const yesterday = istYesterdayDate();
  const [runRowsDone] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(downloads)
    .where(and(eq(downloads.status, "completed"), eq(downloads.aiVerdict, "match")));
  const perTopic = await todayStats(ist);
  const yesterdayCount = (
    await db
      .select({ n: sql<number>`count(*)::int` })
      .from(downloads)
      .where(
        and(
          eq(downloads.istDate, yesterday),
          eq(downloads.status, "completed"),
          eq(downloads.aiVerdict, "match"),
        ),
      )
  )[0]?.n ?? 0;

  const dupToday =
    (
      await db
        .select({ n: sql<number>`coalesce(sum(${scanRuns.duplicates}),0)::int` })
        .from(scanRuns)
        .where(eq(scanRuns.istDate, ist))
    )[0]?.n ?? 0;
  const failToday =
    (
      await db
        .select({ n: sql<number>`coalesce(sum(${scanRuns.failed}),0)::int` })
        .from(scanRuns)
        .where(eq(scanRuns.istDate, ist))
    )[0]?.n ?? 0;
  const aiRejectedToday =
    (
      await db
        .select({ n: sql<number>`count(*)::int` })
        .from(downloads)
        .where(and(eq(downloads.istDate, ist), eq(downloads.status, "ai_rejected")))
    )[0]?.n ?? 0;
  const aiPending =
    (
      await db
        .select({ n: sql<number>`count(*)::int` })
        .from(downloads)
        .where(and(eq(downloads.status, "completed"), eq(downloads.aiVerdict, "pending")))
    )[0]?.n ?? 0;
  const viewsToday =
    (
      await db
        .select({ n: sql<number>`coalesce(sum(${downloads.viewCount}),0)::bigint` })
        .from(downloads)
        .where(
          and(
            eq(downloads.istDate, ist),
            eq(downloads.status, "completed"),
            eq(downloads.aiVerdict, "match"),
          ),
        )
    )[0]?.n ?? 0;

  const topicRows = await db.select().from(topics).orderBy(asc(topics.sortOrder));
  const providerRows = await db.select().from(aiProviders).orderBy(asc(aiProviders.id));
  const logRows = await db.select().from(activityLogs).orderBy(desc(activityLogs.id)).limit(60);
  const lastRun = (await db.select().from(scanRuns).orderBy(desc(scanRuns.id)).limit(1))[0];

  const done = await todayCompleted(ist);
  const running = (await getSetting("engineRunning", "true")) === "true";
  const nextScanAt = Number(await getSetting("nextScanAt", "0"));
  const lastScanAt = Number(await getSetting("lastScanAt", "0"));
  let scanInsight: {
    inspected: number;
    eligible: number;
    belowThreshold: number;
    noPublicMetric: number;
    unavailable: number;
    threshold: number;
    at: number;
  } | null = null;
  try {
    const raw = await getSetting("lastScanInsight", "");
    if (raw) scanInsight = JSON.parse(raw);
  } catch {
    scanInsight = null;
  }

  const perTopicMap = new Map(perTopic.map((p) => [p.topic, p]));

  let quota: Awaited<ReturnType<typeof import("@/lib/youtube-stats").quotaSnapshot>> | null = null;
  let insights: Awaited<ReturnType<typeof import("@/lib/youtube-stats").getInsights>> | null = null;
  try {
    const stats = await import("@/lib/youtube-stats");
    quota = await stats.quotaSnapshot();
    insights = await stats.getInsights();
  } catch {
    quota = null;
    insights = null;
  }

  return {
    istNow: istFull(new Date()),
    istDate: ist,
    engineRunning: running,
    dailyLimit,
    minViews,
    today: {
      count: done,
      remaining: Math.max(0, dailyLimit - done),
      duplicatesSkipped: dupToday,
      failed: failToday,
      aiRejected: aiRejectedToday,
      aiPending,
      viewsTotal: Number(viewsToday),
      byTopic: topicRows.map((t) => ({
        slug: t.slug,
        name: t.name,
        hindiName: t.hindiName,
        folder: t.folder,
        enabled: t.enabled,
        keywords: t.keywords,
        count: perTopicMap.get(t.slug)?.n ?? 0,
        views: Number(perTopicMap.get(t.slug)?.views ?? 0),
      })),
    },
    yesterday: { date: yesterday, count: yesterdayCount },
    lifetime: { downloaded: runRowsDone.n },
    lastScanAt,
    nextScanAt,
    lastRun: lastRun ?? null,
    scanInsight,
    quota,
    insights,
    // Exclude the heavy base64 reference image from the frequent status poll;
    // expose only a boolean flag. The image is fetched on demand via its route.
    topics: topicRows.map(({ referenceImage, ...t }) => ({
      ...t,
      referenceImageSet: Boolean(referenceImage),
    })),
    providers: providerRows.map((p) => ({
      ...p,
      apiKey: undefined,
      keySet: Boolean(p.apiKey),
      keyPreview: p.apiKey ? `••••••••${p.apiKey.slice(-4)}` : null,
    })),
    logs: logRows.reverse().map((l) => ({
      id: l.id,
      ts: l.ts,
      level: l.level,
      message: l.message,
    })),
    downloadRoot: dailyDownloadFolder(ist),
  };
}
