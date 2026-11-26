import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import youtubedl, { type Payload } from "youtube-dl-exec";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { MIN_VIEWS, type Candidate, type TopicSeed } from "@/lib/reels";

/* ---------------- adaptive source ranking (#22) + backoff (#23) -------- */

interface SourceStat {
  found: number; // reels discovered
  ok: number; // successful responses
  attempts: number;
  cooldownUntil: number; // ms epoch — skip source until then (429 backoff)
}

async function loadSourceStats(): Promise<Record<string, SourceStat>> {
  try {
    const rows = await db.select().from(settings).where(eq(settings.key, "sourceStats")).limit(1);
    return rows[0]?.value ? (JSON.parse(rows[0].value) as Record<string, SourceStat>) : {};
  } catch {
    return {};
  }
}

async function saveSourceStats(stats: Record<string, SourceStat>): Promise<void> {
  try {
    await db
      .insert(settings)
      .values({ key: "sourceStats", value: JSON.stringify(stats) })
      .onConflictDoUpdate({ target: settings.key, set: { value: JSON.stringify(stats) } });
  } catch {
    /* stats are best-effort */
  }
}

/** Orders sources by historical yield (best first) and drops dead/cooldown ones. */
function rankSources<T extends { label: string }>(
  sources: T[],
  stats: Record<string, SourceStat>,
): T[] {
  const score = (label: string) => {
    const st = stats[label];
    if (!st) return 1; // untested sources get a chance
    if (st.attempts >= 8 && st.found === 0) return -1; // persistently dead
    if (st.cooldownUntil > Date.now()) return -1; // backing off after 429
    return st.found + st.ok * 0.5;
  };
  return [...sources].sort((a, b) => score(b.label) - score(a.label));
}

/**
 * Real Instagram adapter.
 *
 * Discovery sources (in order):
 *  1. Apify official Instagram actor when APIFY_TOKEN is configured. This is
 *     the most reliable compliant source for public play counts + direct MP4.
 *  2. Real URLs listed in instagram-reels.txt or INSTAGRAM_REEL_URLS.
 *  3. Public search-engine index (Bing RSS), then yt-dlp metadata verification.
 *
 * Important: no invented IDs, URLs, counts or bytes. Unknown metrics are
 * reported honestly. A Reel is eligible only when an exposed play/view count
 * is >1M OR when >1M public likes provide a conservative lower-bound proof
 * that more than 1M people interacted with it. Private/login-only media is
 * skipped — no protection is bypassed.
 */

export interface RealCandidate extends Candidate {
  directMediaUrl?: string;
  cookiesBrowser?: string;
  metricSource: "views" | "plays" | "likes-lower-bound";
  eligibilityProof: string;
  source: "apify" | "source-list" | "public-search";
}

export interface DiscoveryOptions {
  apifyToken?: string;
  cookiesBrowser?: string;
  sourceUrls?: string;
  minViews?: number;
}

interface YtMeta extends Partial<Payload> {
  id?: string;
  title?: string;
  description?: string;
  uploader?: string;
  uploader_id?: string;
  view_count?: number;
  like_count?: number;
  webpage_url?: string;
  original_url?: string;
}

const CURATED_PUBLIC_PROFILES: Record<string, string[]> = {
  "banke-bihari-ji": [
    "banke_bihari_mandir_official",
    "bankebiharimandirofficial",
    "vrindavan.reels",
    "vrindavan_bankebihari",
  ],
  "radha-vallabh-ji": [
    "shrihitradhavallabhmandir",
    "shrihitradhavallabhlal",
    "shriradhavallabhmandir",
  ],
  "radha-raman-ji": ["office_radharaman", "shri_radharaman_lal_ju", "radharamanji.temple"],
  "radha-govind-dev-ji": ["govind_dev_ji_temple", "govind_dev_ji_", "govinddevji_daily_darshan"],
  "premanand-ji-maharaj": [
    "premanand__maharaj_official",
    "premanandji_.maharaj_official",
    "premanand_ji_maharaj_121",
  ],
  "indresh-ji-maharaj": ["bhaktipath"],
  "vinod-baba-ji": [],
};

interface ApifyItem {
  id?: string;
  shortCode?: string;
  shortcode?: string;
  url?: string;
  caption?: string;
  ownerUsername?: string;
  authorUsername?: string;
  likesCount?: number;
  likeCount?: number;
  videoViewCount?: number;
  viewCount?: number;
  videoPlayCount?: number;
  playCount?: number;
  videoUrl?: string;
  productType?: string;
  type?: string;
  inputUrl?: string;
}

function canonical(raw: string): { id: string; url: string } | null {
  const decoded = decodeURIComponent(raw.replace(/&amp;/g, "&"));
  const m = decoded.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
  if (!m) return null;
  return { id: m[1], url: `https://www.instagram.com/reel/${m[1]}/` };
}

/** Classifies caption/author text into a monitored topic (or null). */
export function topicFor(text: string, topics: TopicSeed[]): TopicSeed | null {
  const hay = text.toLocaleLowerCase();
  let best: { t: TopicSeed; score: number } | null = null;
  for (const t of topics) {
    let score = 0;
    for (const kw of t.keywords) {
      const k = kw.replace(/^#/, "").toLocaleLowerCase().trim();
      if (k.length >= 3 && hay.includes(k)) score += k.length;
    }
    // Search source already scoped this URL to a topic, so slug/name tokens
    // are useful extra signals without claiming AI certainty.
    for (const token of t.name.toLocaleLowerCase().split(/\s+/)) {
      if (token.length > 3 && hay.includes(token)) score += token.length;
    }
    if (score > (best?.score ?? 0)) best = { t, score };
  }
  return best?.score ? best.t : null;
}

function metric(
  exactViews: number,
  plays: number,
  likes: number,
  threshold: number,
): Pick<RealCandidate, "viewCount" | "metricSource" | "eligibilityProof"> | null {
  if (exactViews > threshold) {
    return {
      viewCount: exactViews,
      metricSource: "views",
      eligibilityProof: `${exactViews.toLocaleString("en-IN")} public views`,
    };
  }
  if (plays > threshold) {
    return {
      viewCount: plays,
      metricSource: "plays",
      eligibilityProof: `${plays.toLocaleString("en-IN")} public plays`,
    };
  }
  // Instagram often hides exact views from logged-out public metadata while
  // still exposing likes. Likes above the threshold are a conservative proof of
  // reach; we label it explicitly rather than pretending it is an exact count.
  if (likes > threshold) {
    return {
      viewCount: likes,
      metricSource: "likes-lower-bound",
      eligibilityProof: `at least ${likes.toLocaleString("en-IN")} public likes (exact plays unavailable)`,
    };
  }
  return null;
}

async function discoverApify(
  topics: TopicSeed[],
  configuredToken: string | undefined,
  threshold: number,
): Promise<RealCandidate[]> {
  const token = configuredToken?.trim() || process.env.APIFY_TOKEN?.trim();
  if (!token) return [];
  const directUrls = topics.flatMap((t) => [
    ...(CURATED_PUBLIC_PROFILES[t.slug] ?? []).slice(0, 1).map(
      (username) => `https://www.instagram.com/${username}/`,
    ),
    ...t.keywords
      .filter((k) => /^[#A-Za-z][A-Za-z0-9 #_-]{2,40}$/.test(k))
      .slice(0, 1)
      .map((k) => `https://www.instagram.com/explore/tags/${k.replace(/^#/, "").replace(/[^A-Za-z0-9_]/g, "")}/`),
  ]);
  try {
    const endpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=180`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        directUrls,
        resultsType: "posts",
        resultsLimit: 6,
        searchType: "hashtag",
        searchLimit: 7,
      }),
      signal: AbortSignal.timeout(190_000),
    });
    if (!res.ok) return [];
    const items = (await res.json()) as ApifyItem[];
    const out: RealCandidate[] = [];
    for (const x of items) {
      const isVideo = Boolean(
        x.videoUrl ||
          x.productType?.toLowerCase() === "clips" ||
          x.type?.toLowerCase() === "video",
      );
      if (!isVideo) continue;
      const c = canonical(x.url ?? "");
      if (!c) continue;
      const caption = x.caption ?? "";
      const inputHint = x.inputUrl ?? "";
      const profileTopic = topics.find((t) =>
        (CURATED_PUBLIC_PROFILES[t.slug] ?? []).some((u) => inputHint.includes(`/${u}/`)),
      );
      const topic =
        topicFor(`${caption} ${inputHint} ${x.ownerUsername ?? ""}`, topics) ?? profileTopic;
      if (!topic) continue;
      const likes = Number(x.likesCount ?? x.likeCount ?? 0);
      const proof = metric(
        Number(x.videoViewCount ?? x.viewCount ?? 0),
        Number(x.videoPlayCount ?? x.playCount ?? 0),
        likes,
        threshold,
      );
      if (!proof) continue;
      out.push({
        ...proof,
        videoId: x.shortCode ?? x.shortcode ?? c.id,
        url: c.url,
        topicSlug: topic.slug,
        topicId: topic.id,
        caption,
        author: `@${x.ownerUsername ?? x.authorUsername ?? "unknown"}`,
        likeCount: likes,
        publishedAgoHrs: 0,
        directMediaUrl: x.videoUrl,
        source: "apify",
      });
    }
    return out;
  } catch {
    return [];
  }
}

function configuredUrls(extra?: string): Array<{ url: string; topicSlug?: string; declaredViews?: number }> {
  const lines: string[] = [];
  if (extra) lines.push(...extra.split(/[\n,]+/));
  if (process.env.INSTAGRAM_REEL_URLS) {
    lines.push(...process.env.INSTAGRAM_REEL_URLS.split(/[\n,]+/));
  }
  const file = path.join(process.cwd(), "instagram-reels.txt");
  if (fs.existsSync(file)) lines.push(...fs.readFileSync(file, "utf8").split(/\r?\n/));
  return lines
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [url, topicSlug, views] = line.split("|").map((x) => x.trim());
      return { url, topicSlug: topicSlug || undefined, declaredViews: Number(views) || undefined };
    });
}

export interface IndexedReel {
  url: string;
  /** View/play count parsed from the search snippet (e.g. "2.4M views"). */
  views?: number;
}

/** Parses "2.4M views", "13,536 views", "1.2 lakh views" from nearby text. */
function parseViewHint(ctx: string): number | undefined {
  const patterns = [
    /([\d][\d.,]*)\s*([kKmM])?\s*(?:views?|plays?|lakh|crore)/i,
    /(?:views?|plays?)\s*[:\-]?\s*([\d][\d.,]*)\s*([kKmM])?/i,
  ];
  for (const re of patterns) {
    const m = ctx.match(re);
    if (!m) continue;
    const raw = m[1].replace(/,/g, "");
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) continue;
    const suffix = (m[2] ?? "").toLowerCase();
    const value = suffix === "k" ? n * 1_000 : suffix === "m" ? n * 1_000_000 : n;
    // "lakh"/"crore" bare-number cases: 1 lakh = 100k, 1 crore = 10M
    if (/lakh/i.test(m[0]) && !suffix) return n * 100_000;
    if (/crore/i.test(m[0]) && !suffix) return n * 10_000_000;
    if (value >= 1_000) return Math.round(value);
  }
  return undefined;
}

function extractIndexedReels(body: string): IndexedReel[] {
  // Decode percent-encoding (incl. double-encoding) so reel URLs hidden inside
  // search-engine redirect links (e.g. DuckDuckGo's uddg=...) are recovered.
  let decoded = body;
  for (let i = 0; i < 2; i++) {
    try {
      decoded += "\n" + decodeURIComponent(decoded.replace(/%25/g, "%"));
    } catch {
      break;
    }
  }
  const seen = new Set<string>();
  const out: IndexedReel[] = [];
  for (const m of decoded.matchAll(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]{5,})/gi)) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    const ctx = decoded.slice(Math.max(0, (m.index ?? 0) - 250), (m.index ?? 0) + 350);
    out.push({
      url: `https://www.instagram.com/reel/${m[1]}/`,
      views: parseViewHint(ctx),
    });
  }
  return out;
}

/**
 * Discovery Bot — resilient, self-healing reel-URL finder.
 *
 * Root cause of "0 found": the dev server runs on the user's laptop, so direct
 * calls to Bing/DuckDuckGo/Google inherit that network's regional blocks.
 * The bot therefore fetches each source THROUGH a neutral server-side reader
 * proxy (r.jina.ai) that egresses from external infrastructure, bypassing the
 * local block. It tries several engines, both via proxy and direct, rotates
 * query phrases per scan, decodes redirect links, and reports per-source stats.
 */
interface DiscoverySource {
  label: string;
  build: (query: string) => { url: string; init?: RequestInit };
}

const DISCOVERY_SOURCES: DiscoverySource[] = [
  {
    label: "proxy·duckduckgo",
    build: (q) => ({
      url: `https://r.jina.ai/https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
    }),
  },
  {
    label: "proxy·bing",
    build: (q) => ({
      url: `https://r.jina.ai/https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    }),
  },
  {
    label: "proxy·google",
    build: (q) => ({
      url: `https://r.jina.ai/https://www.google.com/search?num=20&q=${encodeURIComponent(q)}`,
    }),
  },
  {
    label: "direct·bing-rss",
    build: (q) => ({
      url: `https://www.bing.com/search?format=rss&q=${encodeURIComponent(q)}`,
      init: {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
          "accept-language": "en-IN,en;q=0.9,hi;q=0.7",
        },
      },
    }),
  },
  {
    label: "direct·duckduckgo",
    build: (q) => ({
      url: `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
      init: {
        method: "POST",
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
          "content-type": "application/x-www-form-urlencoded",
        },
        body: `q=${encodeURIComponent(q)}`,
      },
    }),
  },
];

/**
 * Global single-flight throttle for the reader proxy (r.jina.ai).
 * The free tier rate-limits hard — 21 simultaneous hashtag fetches all came
 * back 0/ok. One at a time + a short pause keeps every request under the
 * limit, and direct (non-proxy) sources are never throttled.
 */
let jinaBusy = false;
const jinaWaiters: Array<() => void> = [];

async function withJinaSlot<T>(fn: () => Promise<T>): Promise<T> {
  while (jinaBusy) await new Promise<void>((r) => jinaWaiters.push(r));
  jinaBusy = true;
  try {
    await new Promise((r) => setTimeout(r, 3_000)); // stay under the free proxy rate limit (~20/min)
    return await fn();
  } finally {
    jinaBusy = false;
    jinaWaiters.shift()?.();
  }
}

async function fetchText(
  url: string,
  timeoutMs: number,
  init?: RequestInit,
): Promise<{ ok: boolean; body: string; status: number }> {
  const run = async () => {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    return { ok: res.ok, body: res.ok ? await res.text() : "", status: res.status };
  };
  return url.includes("r.jina.ai") ? withJinaSlot(run) : run();
}

async function fetchSourceReels(
  source: DiscoverySource,
  query: string,
): Promise<{ urls: IndexedReel[]; ok: boolean; rateLimited: boolean }> {
  try {
    const { url, init } = source.build(query);
    const { ok, body, status } = await fetchText(url, 18_000, init);
    if (!ok) return { urls: [], ok: false, rateLimited: status === 429 };
    return { urls: extractIndexedReels(body), ok: true, rateLimited: false };
  } catch {
    return { urls: [], ok: false, rateLimited: false };
  }
}

/**
 * FREE Apify replacement: Instagram's own public hashtag pages, fetched via
 * the neutral reader proxy (r.jina.ai) so the local network block never
 * applies. No API key, no cost — returns ~12 real Reel URLs per hashtag.
 */
// Instagram intermittently login-walls hashtag pages (redirects to
// /accounts/login/). When that happens we probe ONCE per scan and skip the
// rest so a dead source can never stall the discovery pipeline.
let igTagLoginWalled = false;

async function fetchIgTagReels(topic: TopicSeed): Promise<IndexedReel[]> {
  if (igTagLoginWalled) return [];
  // Collect up to 3 distinct hashtags for this topic (explicit #tags first,
  // then normalized English keywords) — more tag pages = far more free reels.
  const tags: string[] = [];
  const push = (raw?: string) => {
    const clean = raw?.replace(/^#/, "").replace(/[^A-Za-z0-9_]/g, "");
    if (clean && clean.length >= 3 && !tags.includes(clean)) tags.push(clean);
  };
  for (const k of topic.keywords) {
    if (k.startsWith("#")) push(k);
    if (tags.length >= 3) break;
  }
  for (const k of topic.keywords) {
    if (/^[A-Za-z][A-Za-z0-9 ]{2,30}$/.test(k)) push(k.replace(/\s+/g, ""));
    if (tags.length >= 3) break;
  }

  // Sequential with early-stop: one good tag page (≈12 reels) ends the loop,
  // so a healthy topic costs exactly ONE proxy request instead of three.
  const merged: IndexedReel[] = [];
  const seen = new Set<string>();
  for (const tag of tags.slice(0, 3)) {
    if (merged.length >= 8) break;
    try {
      const { ok, body } = await fetchText(
        `https://r.jina.ai/https://www.instagram.com/explore/tags/${tag}/`,
        25_000,
        { headers: { "user-agent": "Mozilla/5.0" } },
      );
      if (!ok) continue;
      if (body.includes("/accounts/login/")) {
        // Login wall → stop probing tag pages for this whole scan.
        igTagLoginWalled = true;
        break;
      }
      for (const item of extractIndexedReels(body).slice(0, 10)) {
        if (seen.has(item.url)) continue;
        seen.add(item.url);
        merged.push(item);
      }
    } catch {
      /* next tag */
    }
  }
  return merged;
}

async function searchUrls(
  topics: TopicSeed[],
  scanIndex: number,
  deadlineMs: number,
): Promise<{ found: Map<string, TopicSeed>; viewsBy: Map<string, number>; diagnostic: string }> {
  const found = new Map<string, TopicSeed>();
  const sourceHits: Record<string, number> = {};
  const sourceOk: Record<string, number> = {};
  // View hints parsed from search snippets — gives the threshold a real number
  // when Instagram itself hides view counts.
  const viewsBy = new Map<string, number>();

  const take = (item: IndexedReel, t: TopicSeed, source: string) => {
    if (found.has(item.url)) return false;
    found.set(item.url, t);
    if (item.views && item.views > (viewsBy.get(item.url) ?? 0)) viewsBy.set(item.url, item.views);
    sourceHits[source] = (sourceHits[source] ?? 0) + 1;
    return true;
  };

  // Re-probe the hashtag source once per scan (it may un-block).
  igTagLoginWalled = false;

  // Search every topic in PARALLEL (each topic is independent).
  await Promise.all(
    topics.map(async (t) => {
      let topicFound = 0;
      if (Date.now() > deadlineMs) return; // hard time budget — never exceed ~2 min per scan

      // 1) FREE primary source: Instagram's own hashtag page via reader proxy.
      const tagUrls = await fetchIgTagReels(t);
      if (tagUrls.length > 0) sourceOk["ig-tag"] = (sourceOk["ig-tag"] ?? 0) + 1;
      for (const item of tagUrls) {
        if (topicFound >= 8) break;
        if (take(item, t, "ig-tag")) topicFound++;
      }

      // 2) Free fallback: search-engine indexes (also via reader proxy).
      if (topicFound < 6) {
        // Rotate through ALL keywords — Hindi phrases included, which surface
        // a different (often richer) slice of Instagram than English-only.
        const pool = t.keywords.filter((k) => k.length >= 3);
        const rotated = pool[scanIndex % Math.max(1, pool.length)] ?? t.name;
        const phrase = rotated.replace(/^#/, "") || t.name.replace(/^Shri /, "");
        const query = `site:instagram.com/reel/ "${phrase}"`;

        // Adaptive order: best-yield sources first, dead/cooling ones skipped.
        const stats = await loadSourceStats();
        const ordered = rankSources(DISCOVERY_SOURCES, stats).filter((src) => {
          const st = stats[src.label];
          if (!st) return true;
          if (st.attempts >= 8 && st.found === 0) return false; // persistently dead
          if (st.cooldownUntil > Date.now()) return false; // rate-limit backoff
          return true;
        });
        const results = await Promise.all(
          ordered.map(async (source) => {
            const r = await fetchSourceReels(source, query);
            const st = stats[source.label] ?? { found: 0, ok: 0, attempts: 0, cooldownUntil: 0 };
            st.attempts++;
            if (r.ok) {
              st.ok++;
              sourceOk[source.label] = (sourceOk[source.label] ?? 0) + 1;
            }
            // Exponential-ish backoff on rate limits (#23): 10 → 30 → 90 min.
            if (r.rateLimited) {
              st.cooldownUntil = Date.now() + Math.min(90 * 60_000, (st.attempts % 3 === 1 ? 10 : st.attempts % 3 === 2 ? 30 : 90) * 60_000);
            }
            stats[source.label] = st;
            return { label: source.label, ...r };
          }),
        );
        void saveSourceStats(stats);
        for (const { label, urls } of results) {
          if (Date.now() > deadlineMs) break;
          for (const item of urls.slice(0, 8)) {
            if (topicFound >= 8) break;
            if (take(item, t, label)) topicFound++;
          }
        }
      }
    }),
  );

  const parts = [
    `ig-tag:${sourceHits["ig-tag"] ?? 0}url/${sourceOk["ig-tag"] ?? 0}ok`,
    ...DISCOVERY_SOURCES.map(
      (s) => `${s.label}:${sourceHits[s.label] ?? 0}url/${sourceOk[s.label] ?? 0}ok`,
    ),
  ];
  const hinted = [...viewsBy.values()].filter((v) => v > 0).length;
  return {
    found,
    viewsBy,
    diagnostic: `Discovery Bot found ${found.size} URL(s)${hinted ? `, ${hinted} with view hints` : ""} — ${parts.join(", ")}`,
  };
}

function cookiesFlag(configured?: string): string | undefined {
  const browser = configured?.trim() || process.env.INSTAGRAM_COOKIES_FROM_BROWSER?.trim();
  return browser && browser !== "none" ? browser : undefined;
}

export interface InspectStats {
  inspected: number;
  eligible: number;
  /** Public metric exists but is not above the configured threshold. */
  belowThreshold: number;
  /** Instagram exposed no view/play/like metric at all. */
  noPublicMetric: number;
  /** Private, rate-limited, login-walled, or fetch error. */
  unavailable: number;
  /** Reels where yt-dlp returned an EXACT view count (cookie mode working). */
  exactViews: number;
}

async function inspectUrl(
  rawUrl: string,
  hint: TopicSeed | null,
  topics: TopicSeed[],
  threshold: number,
  declaredViews?: number,
  source: RealCandidate["source"] = "public-search",
  configuredBrowser?: string,
  stats?: InspectStats,
): Promise<RealCandidate | null> {
  const c = canonical(rawUrl);
  if (!c) {
    if (stats) stats.unavailable++;
    return null;
  }
  if (stats) stats.inspected++;
  try {
    const meta = (await youtubedl(c.url, {
      dumpSingleJson: true,
      skipDownload: true,
      noWarnings: true,
      noPlaylist: true,
      cookiesFromBrowser: cookiesFlag(configuredBrowser),
      socketTimeout: 12,
      retries: 1,
    })) as YtMeta;
    const caption = String(meta.description ?? meta.title ?? "").slice(0, 1500);
    const author = String(meta.uploader_id ?? meta.uploader ?? "unknown");
    const topic = topicFor(`${caption} ${author}`, topics) ?? hint;
    if (!topic) {
      if (stats) stats.unavailable++;
      return null;
    }
    const likes = Number(meta.like_count ?? 0);
    const rawViews = Number(meta.view_count ?? 0);
    if (rawViews > 0 && stats) stats.exactViews++;
    const exactViews = Number(meta.view_count ?? declaredViews ?? 0);
    const proof = metric(exactViews, 0, likes, threshold);
    if (!proof) {
      if (stats) {
        if (exactViews <= 0 && likes <= 0) stats.noPublicMetric++;
        else stats.belowThreshold++;
      }
      return null;
    }
    if (stats) stats.eligible++;
    return {
      ...proof,
      videoId: String(meta.id ?? c.id),
      url: c.url,
      topicSlug: topic.slug,
      topicId: topic.id,
      caption,
      author: author.startsWith("@") ? author : `@${author}`,
      likeCount: likes,
      publishedAgoHrs: 0,
      source,
      cookiesBrowser: cookiesFlag(configuredBrowser),
    };
  } catch {
    if (stats) stats.unavailable++;
    return null; // private, unavailable, rate limited or login required
  }
}

async function mapLimited<T, R>(items: T[], concurrency: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return out;
}

export async function discoverRealCandidates(
  topics: TopicSeed[],
  scanIndex: number,
  options: DiscoveryOptions = {},
): Promise<{
  candidates: RealCandidate[];
  detail: string;
  diagnostic: string;
  stats: InspectStats;
}> {
  const byId = new Map<string, RealCandidate>();
  const threshold = options.minViews ?? MIN_VIEWS;
  // Hard time budget: discovery must finish well within 2 minutes.
  const discoveryDeadline = Date.now() + 60_000;
  const stats: InspectStats = {
    inspected: 0,
    eligible: 0,
    belowThreshold: 0,
    noPublicMetric: 0,
    unavailable: 0,
    exactViews: 0,
  };

  const fromApify = await discoverApify(topics, options.apifyToken, threshold);
  for (const c of fromApify) byId.set(c.videoId, c);

  const configured = configuredUrls(options.sourceUrls);
  const configuredInspected = await mapLimited(configured, 6, async (x) => {
    const hint = topics.find((t) => t.slug === x.topicSlug) ?? null;
    return inspectUrl(
      x.url,
      hint,
      topics,
      threshold,
      x.declaredViews,
      "source-list",
      options.cookiesBrowser,
      stats,
    );
  });
  for (const c of configuredInspected) if (c) byId.set(c.videoId, c);

  let searchDiagnostic = "public search not needed";
  if (byId.size < 18) {
    const searched = await searchUrls(topics, scanIndex, discoveryDeadline);
    searchDiagnostic = searched.diagnostic;
    // Cap how many candidates per topic we inspect (we only need 1 each),
    // which keeps the slow yt-dlp metadata step short.
    const perTopicCount = new Map<string, number>();
    const toInspect: Array<[string, TopicSeed, number | undefined]> = [];
    for (const [url, hint] of searched.found.entries()) {
      const n = perTopicCount.get(hint.slug) ?? 0;
      if (n >= 8) continue;
      perTopicCount.set(hint.slug, n + 1);
      toInspect.push([url, hint, searched.viewsBy.get(url)]);
    }
    const inspected = await mapLimited(
      toInspect,
      8,
      ([url, hint, views]) =>
        inspectUrl(url, hint, topics, threshold, views, "public-search", options.cookiesBrowser, stats),
    );
    for (const c of inspected) if (c) byId.set(c.videoId, c);
  }

  const candidates = [...byId.values()].sort((a, b) => b.viewCount - a.viewCount);
  const sourceCount = configuredInspected.filter(Boolean).length;
  const publicCount = candidates.filter((c) => c.source === "public-search").length;
  return {
    candidates,
    detail: `${fromApify.length} from Apify, ${sourceCount} from source list, ${publicCount} from public search`,
    diagnostic: `${searchDiagnostic}; Apify ${options.apifyToken || process.env.APIFY_TOKEN ? "configured" : "not configured"}; browser session ${cookiesFlag(options.cookiesBrowser) ?? "not configured"}`,
    stats,
  };
}

/* ------------------------------------------------- manual reel metadata --- */

export interface ReelMeta {
  title: string;
  description: string;
  author: string;
  views: number;
  likes: number;
  durationSec: number;
}

/**
 * Fetches public metadata for ANY reel (no topic/threshold gating) — used by
 * the manual queue so every upload gets a unique, video-specific heading.
 */
export async function fetchReelMetadata(url: string): Promise<ReelMeta | null> {
  try {
    const meta = (await youtubedl(url, {
      dumpSingleJson: true,
      skipDownload: true,
      noWarnings: true,
      noPlaylist: true,
      socketTimeout: 15,
      retries: 1,
    })) as YtMeta;
    return {
      title: String(meta.title ?? "").slice(0, 300),
      description: String(meta.description ?? meta.title ?? "").slice(0, 1500),
      author: String(meta.uploader_id ?? meta.uploader ?? "unknown"),
      views: Number(meta.view_count ?? 0),
      likes: Number(meta.like_count ?? 0),
      durationSec: Number(meta.duration ?? 0),
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------- real download --- */

export function dailyDownloadFolder(istDate: string): string {
  const home = process.env.USERPROFILE || os.homedir();
  return path.join(home, "Downloads", "Instagram_Viral_Videos", istDate);
}

function safeTitle(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 56) || "instagram-reel";
}

async function hashFile(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = fs.createReadStream(file);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function validatePlayableMp4(file: string): Promise<{ size: number; hash: string }> {
  const st = await fs.promises.stat(file);
  if (st.size < 100_000) throw new Error(`download is only ${st.size} bytes — rejected as invalid`);
  const fd = await fs.promises.open(file, "r");
  try {
    const buf = Buffer.alloc(64);
    await fd.read(buf, 0, 64, 0);
    if (!buf.includes(Buffer.from("ftyp"))) {
      throw new Error("file has no MP4 ftyp header — rejected as unplayable");
    }
  } finally {
    await fd.close();
  }
  return { size: st.size, hash: await hashFile(file) };
}

async function directDownload(url: string, target: string): Promise<void> {
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0", referer: "https://www.instagram.com/" },
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok || !res.body) throw new Error(`media server returned HTTP ${res.status}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  await fs.promises.writeFile(target, bytes);
}

export async function downloadRealVideo(
  c: RealCandidate,
  istDate: string,
): Promise<{ ok: boolean; filePath?: string; fileName?: string; fileHash?: string; fileSize?: number; error?: string }> {
  const dir = dailyDownloadFolder(istDate);
  await fs.promises.mkdir(dir, { recursive: true });
  const base = `${c.videoId}_${safeTitle(c.caption)}`;
  const expected = path.join(dir, `${base}.mp4`);
  const part = path.join(dir, `${base}.part.mp4`);
  try {
    await fs.promises.rm(part, { force: true });
    await fs.promises.rm(expected, { force: true });
    if (c.directMediaUrl) {
      await directDownload(c.directMediaUrl, part);
      await fs.promises.rename(part, expected);
    } else {
      const stdout = await youtubedl(c.url, {
        // Prefer a single ≤720p mp4 so there is no slow ffmpeg merge step.
        format: "best[ext=mp4][height<=720]/best[ext=mp4]/best",
        output: expected,
        noPlaylist: true,
        noWarnings: true,
        noProgress: true,
        restrictFilenames: true,
        windowsFilenames: true,
        retries: 1,
        fragmentRetries: 1,
        concurrentFragments: 4,
        socketTimeout: 15,
        cookiesFromBrowser: cookiesFlag(c.cookiesBrowser),
        print: "after_move:filepath",
      });
      const printed = String(stdout).trim().split(/\r?\n/).pop();
      if (printed && fs.existsSync(printed) && printed !== expected) {
        await fs.promises.rename(printed, expected);
      }
    }
    const verified = await validatePlayableMp4(expected);
    return {
      ok: true,
      filePath: expected,
      fileName: path.basename(expected),
      fileHash: verified.hash,
      fileSize: verified.size,
    };
  } catch (e) {
    await fs.promises.rm(part, { force: true }).catch(() => {});
    await fs.promises.rm(expected, { force: true }).catch(() => {});
    return { ok: false, error: e instanceof Error ? e.message.slice(0, 500) : String(e) };
  }
}
