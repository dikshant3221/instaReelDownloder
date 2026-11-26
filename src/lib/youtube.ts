import fs from "node:fs";
import { execFile } from "node:child_process";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import ffmpegPath from "ffmpeg-static";
import { db } from "@/db";
import { downloads, topics, settings, aiProviders, activityLogs, manualUploads } from "@/db/schema";
import { istDate } from "@/lib/ist";
import { pickStrategy, describeStrategy, type Strategy } from "@/lib/strategist";
import { QUOTA_LIMIT } from "@/lib/youtube-stats";
import { planPublishSlots, PUBLISH_GAP_MS } from "@/lib/schedule";
import {
  addQuota,
  canAffordUpload,
  isQuotaError,
  markQuotaExhausted,
  QUOTA_COST,
  getStrategyWeights,
} from "@/lib/youtube-stats";

/**
 * YouTube publishing pipeline.
 *
 * Runs ONLY after the daily collection is complete (all enabled topics have
 * one approved video). For each approved video:
 *   1. AI generates a viral title + hashtags (Gemini → Mistral → NVIDIA → …)
 *   2. A representative frame is extracted as the thumbnail (proper view)
 *   3. Uploaded as PRIVATE with publishAt = now + 15 min (auto-goes public)
 *   4. Location metadata set to India (recordingDetails)
 *
 * OAuth: user pastes their Google OAuth Client ID + Secret once, clicks
 * Connect, consents; refresh token is stored locally (never leaves the box).
 */

const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
  // Full youtube scope powers topic playlists + pinned CTA comments.
  // Existing connections must re-authorize once to gain it.
  "https://www.googleapis.com/auth/youtube",
].join(" ");

// Base URLs — overridable for proxies / offline testing (server-side only).
const OAUTH_BASE = process.env.GOOGLE_OAUTH_BASE || "https://oauth2.googleapis.com";
const API_BASE = process.env.GOOGLE_API_BASE || "https://www.googleapis.com";

const PUBLISH_DELAY_MS = 15 * 60 * 1000; // public 15 minutes after upload

// YouTube's API removed video map-location support (June 2017). Location is
// delivered via description + hashtags + tags instead (see publishVideoFile).

interface YoutubeTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  client_id: string;
  client_secret: string;
}

/* ---------------- local settings helpers (no engine import cycle) ------- */

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

async function logYt(level: string, message: string): Promise<void> {
  await db.insert(activityLogs).values({ level, message });
  await db.execute(sql`DELETE FROM activity_logs WHERE id < (
    SELECT COALESCE(MIN(id), 0) FROM (SELECT id FROM activity_logs ORDER BY id DESC LIMIT 400) keep
  )`);
}

/* ---------------- OAuth config ------------------------------------------ */

export interface YoutubeConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/**
 * Credential pool (quota fix): multiple Google OAuth clients — one per Google
 * Cloud project, each with its OWN free 10k/day quota. When the active client
 * runs out, the app rotates to the next one automatically so QUOTA_EXHAUSTED
 * never stops uploads while a fresh credential exists. Google authorization
 * itself cannot be avoided (there is no anonymous publish path), but quota
 * no longer blocks you.
 */
export interface YoutubeAccount {
  label: string;
  clientId: string;
  clientSecret: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  channelTitle?: string;
  quotaUsed: number;
  quotaDate: string; // IST date of quotaUsed
}

interface AccountStore {
  active: number;
  pending?: number; // account awaiting OAuth consent
  accounts: YoutubeAccount[];
}

export async function loadAccounts(): Promise<AccountStore> {
  const raw = await getSetting("youtubeAccounts", "");
  if (raw) {
    try {
      const store = JSON.parse(raw) as AccountStore;
      if (Array.isArray(store.accounts) && store.accounts.length) return store;
    } catch {
      /* fall through to migration */
    }
  }
  // Migrate legacy single-token storage into account #1.
  const legacy = await getSetting("youtubeTokens", "");
  const clientId = await getSetting("youtubeClientId", "");
  const clientSecret = await getSetting("youtubeClientSecret", "");
  const accounts: YoutubeAccount[] = [];
  let legacyT: YoutubeTokens | null = null;
  if (legacy) {
    try {
      legacyT = JSON.parse(legacy) as YoutubeTokens;
    } catch {
      legacyT = null;
    }
  }
  if (clientId || legacyT?.access_token) {
    accounts.push({
      label: "Primary",
      clientId: legacyT?.client_id || clientId,
      clientSecret: legacyT?.client_secret || clientSecret,
      access_token: legacyT?.access_token,
      refresh_token: legacyT?.refresh_token,
      expires_at: legacyT?.expires_at,
      quotaUsed: 0,
      quotaDate: "",
    });
  }
  const store: AccountStore = { active: 0, accounts };
  await setSetting("youtubeAccounts", JSON.stringify(store));
  return store;
}

export async function saveAccounts(store: AccountStore): Promise<void> {
  await setSetting("youtubeAccounts", JSON.stringify(store));
}

export async function loadTokens(): Promise<YoutubeTokens | null> {
  const store = await loadAccounts();
  const acc = store.accounts[store.active];
  if (!acc?.access_token) return null;
  return {
    access_token: acc.access_token,
    refresh_token: acc.refresh_token,
    expires_at: acc.expires_at ?? 0,
    client_id: acc.clientId,
    client_secret: acc.clientSecret,
  };
}

async function saveTokens(t: YoutubeTokens): Promise<void> {
  const store = await loadAccounts();
  const acc = store.accounts[store.active];
  if (!acc) return;
  acc.access_token = t.access_token;
  acc.refresh_token = t.refresh_token ?? acc.refresh_token;
  acc.expires_at = t.expires_at;
  await saveAccounts(store);
}

/**
 * Rotates to the next credential whose project still has quota today.
 * Returns false when every configured account is exhausted.
 */
export async function rotateAccount(): Promise<boolean> {
  const store = await loadAccounts();
  if (store.accounts.length < 2) return false;
  const today = istDate();
  const cur = store.accounts[store.active];
  cur.quotaDate = today;
  cur.quotaUsed = Number(await getSetting("youtubeQuotaUsed", "0")) || 0;
  for (let i = 1; i <= store.accounts.length; i++) {
    const idx = (store.active + i) % store.accounts.length;
    const acc = store.accounts[idx];
    if (!acc.access_token) continue; // never consented
    const usedToday = acc.quotaDate === today ? acc.quotaUsed : 0;
    if (usedToday < QUOTA_LIMIT - 2_000) {
      store.active = idx;
      await saveAccounts(store);
      await setSetting("youtubeQuotaUsed", "0");
      await setSetting("youtubeQuotaDate", today);
      await logYt(
        "ok",
        `Quota rotation → account "${acc.label}" (${store.accounts.length} configured). Uploads continue without interruption.`,
      );
      return true;
    }
  }
  return false;
}

/** Quota guard with automatic rotation — throws only when ALL accounts are spent. */
async function ensureUploadQuota(): Promise<void> {
  const { canAffordUpload, quotaSnapshot } = await import("@/lib/youtube-stats");
  if (await canAffordUpload()) return;
  if (await rotateAccount()) return;
  const q = await quotaSnapshot();
  throw new Error(
    `QUOTA_EXHAUSTED: every configured Google project is spent today (active: ${q.used}/${q.limit} units). Add another Google Cloud project in YouTube → Accounts, or request a free quota increase from Google. Uploads resume at IST midnight.`,
  );
}

export async function youtubeStatus() {
  const clientId = await getSetting("youtubeClientId", "");
  const clientSecret = await getSetting("youtubeClientSecret", "");
  const tokens = await loadTokens();
  const enabled = (await getSetting("youtubeEnabled", "false")) === "true";
  const channelTitle = await getSetting("youtubeChannelTitle", "");
  // Credential pool overview (#1): every configured project + which is active.
  const accStore = await loadAccounts();
  const accounts = accStore.accounts.map((a, i) => ({
    index: i,
    label: a.label,
    clientIdPreview: a.clientId ? `••••${a.clientId.slice(-6)}` : "",
    channelTitle: a.channelTitle ?? null,
    connected: Boolean(a.access_token),
    active: i === accStore.active,
  }));
  // Token freshness (#24): auto-refreshes on use; show how long before it would expire.
  const tokenExpiresInMin = tokens?.expires_at
    ? Math.round((tokens.expires_at - Date.now()) / 60_000)
    : null;
  return {
    configured: Boolean(clientId && clientSecret),
    connected: Boolean(tokens?.access_token),
    enabled,
    publishDelayMinutes: PUBLISH_DELAY_MS / 60000,
    channelTitle: channelTitle || null,
    tokenExpiresInMin,
    accounts,
    activeAccount: accStore.active,
  };
}

/** Exchange an auth code (or refresh) for tokens. */
async function exchange(tokens: {
  code?: string;
  refreshToken?: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): Promise<YoutubeTokens> {
  const body = new URLSearchParams({
    client_id: tokens.clientId,
    client_secret: tokens.clientSecret,
    redirect_uri: tokens.redirectUri,
    ...(tokens.code
      ? { grant_type: "authorization_code", code: tokens.code }
      : { grant_type: "refresh_token", refresh_token: tokens.refreshToken! }),
  });
  const res = await fetch(`${OAUTH_BASE}/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token exchange failed (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }
  const j = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  return {
    access_token: j.access_token,
    refresh_token: j.refresh_token || tokens.refreshToken,
    expires_at: Date.now() + j.expires_in * 1000,
    client_id: tokens.clientId,
    client_secret: tokens.clientSecret,
  };
}

export function authUrlWithClient(clientId: string, redirectUri: string, state: string): string {
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.searchParams.set("client_id", clientId);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", SCOPES);
  u.searchParams.set("access_type", "offline");
  u.searchParams.set("prompt", "consent");
  u.searchParams.set("state", state);
  return u.toString();
}

export async function handleAuthCode(code: string, redirectUri: string): Promise<void> {
  const store = await loadAccounts();
  const idx = store.pending !== undefined && store.pending < store.accounts.length ? store.pending : store.active;
  const acc = store.accounts[idx];
  if (!acc?.clientId || !acc.clientSecret) {
    throw new Error("Google OAuth client is not configured yet.");
  }
  const tokens = await exchange({
    code,
    clientId: acc.clientId,
    clientSecret: acc.clientSecret,
    redirectUri,
  });
  // Preserve refresh token if Google didn't send a new one.
  if (!tokens.refresh_token && acc.refresh_token) {
    tokens.refresh_token = acc.refresh_token;
  }
  acc.access_token = tokens.access_token;
  acc.refresh_token = tokens.refresh_token;
  acc.expires_at = tokens.expires_at;
  store.active = idx; // freshly consented account becomes active
  store.pending = undefined;
  await saveAccounts(store);
  // Remember WHICH channel we are publishing to (#21).
  try {
    const res = await fetch(`${API_BASE}/youtube/v3/channels?part=snippet&mine=true`, {
      headers: { authorization: `Bearer ${tokens.access_token}` }, signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) {
      const j = (await res.json()) as { items?: Array<{ snippet?: { title?: string } }> };
      const title = j.items?.[0]?.snippet?.title;
      if (title) {
        await setSetting("youtubeChannelTitle", title);
        const st2 = await loadAccounts();
        const a2 = st2.accounts[st2.active];
        if (a2) {
          a2.channelTitle = title;
          await saveAccounts(st2);
        }
        await logYt("ok", `Connected to YouTube channel: "${title}".`);
      }
    }
  } catch {
    /* identity is cosmetic */
  }
  await logYt("ok", "YouTube connected — uploads enabled for today's collection.");
}

/** Returns a valid access token, refreshing when expired. */
export async function accessToken(): Promise<string | null> {
  let t = await loadTokens();
  if (!t) return null;
  if (Date.now() > t.expires_at - 60_000 && t.refresh_token) {
    try {
      t = await exchange({
        refreshToken: t.refresh_token,
        clientId: t.client_id,
        clientSecret: t.client_secret,
        redirectUri: await redirectUri(),
      });
      await saveTokens(t);
    } catch (e) {
      await logYt("error", `YouTube token refresh failed: ${e instanceof Error ? e.message : e}`);
      return null;
    }
  }
  return t.access_token;
}

export async function redirectUri(): Promise<string> {
  const override = process.env.YOUTUBE_REDIRECT_URI?.trim();
  if (override) return override;
  const saved = await getSetting("youtubeRedirectUri", "");
  return saved || "http://localhost:3000/api/youtube/callback";
}

/* ---------------- AI viral heading -------------------------------------- */

export interface ViralHeading {
  title: string;
  hashtags: string[];
  /** Full viral description: hook + context + CTA + location. */
  description: string;
  /** YouTube category: 19 People & Blogs | 22 Education | 24 Entertainment */
  category: string;
  /** BCP-47: "en" or "hi" */
  language: string;
  /** The Strategy Bot formula that produced this heading (for analytics). */
  strategy?: string;
}

const CATEGORY_IDS = new Set(["19", "22", "24"]);
const LOCATION_LINE = "📍 Location: India";

// Rotated CTA lines — every upload reads a little different so a batch of
// videos never looks like one automated template pushed them all out.
const CTA_VARIANTS = [
  "Like, Share & Follow 🙏 | लाइक करें, शेयर करें और फॉलो करें",
  "Follow for daily Vrindavan darshan 🙏 | रोज़ वृंदावन दर्शन के लिए फॉलो करें",
  "Like & share if this touched your heart ❤️ | दिल छू लिया तो लाइक-शेयर करें",
  "Follow for more such darshan 🙏 | ऐसे और दर्शन के लिए फॉलो करें",
  "Save this for later 🙏 | बाद के लिए सेव करें",
  "Tag someone who needs this blessing today ✨ | किसी को टैग करें जिसे यह आशीर्वाद चाहिए",
];

function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

function ctaFor(seed: string): string {
  return CTA_VARIANTS[hashStr(seed) % CTA_VARIANTS.length];
}

/** Small deterministic hash — used to vary hooks so titles never repeat. */
function hashOf(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

const FALLBACK_HOOKS = [
  "This Darshan Will Take Your Breath Away",
  "You Won't Believe This Beautiful Moment",
  "Pure Devotion in One Glance",
  "Watch This Before You Scroll",
  "The Most Heart-Touching Moment",
  "Blessed Beyond Words",
  "A Moment of Pure Peace",
  "This Is Why Vrindavan Is Special",
  "Wait For The Ending 🙏",
  "Impossible To Look Away",
];

// Hindi hooks — Indian audiences engage far more with Hindi/Hinglish titles.
const FALLBACK_HOOKS_HI = [
  "इस दर्शन को देखकर आप भावुक हो जाएंगे 🙏",
  "यह नज़ारा देखकर आंखें भर आएंगी",
  "वृंदावन का अद्भुत दर्शन — देखकर मन खुश हो जाएगा",
  "इस पल को देखिए, मन को शांति मिल जाएगी",
  "यह दृश्य देखकर आपका दिन बन जाएगा",
  "भक्ति की सबसे सुंदर झलक 🙏",
  "वृंदावन धाम के अलौकिक दर्शन",
  "देखिए यह अद्भुत क्षण — हृदय खुश हो जाएगा",
];

function fallbackHeading(topicName: string, caption: string, views: number, variant = 0): ViralHeading {
  // Caption words + a caption-hash-chosen hook guarantee a UNIQUE title even
  // when several reels share a similar opening line. `variant` rotates the
  // hook when a dedupe check finds an existing identical title.
  // \p{M} keeps Devanagari matras (vowel signs) attached to their letters —
  // without it Hindi words would shatter into single characters.
  const words = caption.replace(/[^\p{L}\p{M}\p{N} ]+/gu, " ").trim().split(/\s+/).filter(Boolean);
  const clean = words.slice(0, 12).join(" ");
  const base = topicName.replace(/^Shri\s+/i, "");
  const hasDevanagari = /[\u0900-\u097F]/.test(caption);
  const seed = (hashOf(caption || String(views)) + variant * 7) ;
  const hook = hasDevanagari
    ? FALLBACK_HOOKS_HI[seed % FALLBACK_HOOKS_HI.length]
    : views >= 1_000_000 && variant === 0
      ? "This VIRAL Darshan Broke The Internet"
      : FALLBACK_HOOKS[seed % FALLBACK_HOOKS.length];
  const title = (
    words.length >= 4 ? `${base}: ${hook} | ${clean}` : `${base} — ${hook}`
  ).slice(0, 95);
  const hashtags = [
    "#Vrindavan",
    "#India",
    "#Viral",
    "#Trending",
    "#Shorts",
    `#${base.replace(/[^A-Za-z0-9]/g, "")}`,
    "#RadhaRani",
    "#KrishnaBhakti",
    "#HinduDevotional",
  ];
  const context = clean || `${base} special darshan from Vrindavan.`;
  const cta = ctaFor(caption || base);
  // Rotate between two description layouts +6 CTA variants so a batch never
  // looks like one automated template produced it.
  const description =
    (variant + hashStr(caption || base)) % 2 === 0
      ? [title, "", hashtags.join(" "), "", context, "", cta, LOCATION_LINE].join("\n")
      : [title, "", context, "", hashtags.join(" "), "", cta, LOCATION_LINE].join("\n");
  return {
    title,
    hashtags,
    description,
    category: "19",
    language: hasDevanagari ? "hi" : "en",
  };
}

async function aiComplete(prompt: string): Promise<string | null> {
  const rows = await db
    .select()
    .from(aiProviders)
    .where(eq(aiProviders.enabled, true))
    .orderBy(desc(aiProviders.active), asc(aiProviders.id));
  for (const p of rows) {
    if (!p.apiKey) continue;
    try {
      if (p.slug === "gemini") {
        const res = await fetch(
          `${p.baseUrl}/models/${encodeURIComponent(p.model || "gemini-2.5-flash-lite")}:generateContent?key=${encodeURIComponent(p.apiKey)}`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.9, maxOutputTokens: 300, responseMimeType: "application/json" },
            }),
            signal: AbortSignal.timeout(25_000),
          },
        );
        if (res.ok) {
          const j = (await res.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const text = j.candidates?.[0]?.content?.parts?.map((x) => x.text ?? "").join("") ?? "";
          if (text.trim()) return text;
        }
      } else {
        const res = await fetch(`${p.baseUrl.replace(/\/$/, "")}/chat/completions`, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${p.apiKey}` },
          body: JSON.stringify({
            model: p.model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.9,
            max_tokens: 300,
            stream: false,
          }),
          signal: AbortSignal.timeout(25_000),
        });
        if (res.ok) {
          const j = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const text = j.choices?.[0]?.message?.content ?? "";
          if (text.trim()) return text;
        }
      }
    } catch {
      // provider failed → try the next one
    }
  }
  return null;
}

/** Only "hi" or "en" are ever allowed as the YouTube language. */
function normalizeLanguage(lang: unknown, title: string): "hi" | "en" {
  const l = String(lang ?? "").toLowerCase().slice(0, 2);
  if (l === "hi" || l === "en") return l;
  // Devanagari title → Hindi, otherwise English (never any other language).
  return /[\u0900-\u097F]/.test(title) ? "hi" : "en";
}

/** Every Short must carry the viral hashtag set — merged in if missing. */
const GUARANTEED_VIRAL_TAGS = ["#Viral", "#Trending", "#India", "#Shorts"];

function ensureViralHashtags(tags: string[]): string[] {
  const out = [...tags];
  const has = (t: string) => out.some((x) => x.toLowerCase() === t.toLowerCase());
  for (const t of GUARANTEED_VIRAL_TAGS) {
    if (!has(t) && out.length < 10) out.push(t);
  }
  return out.slice(0, 10);
}

export async function generateViralHeading(
  topicName: string,
  caption: string,
  views: number,
  existingTitles: string[] = [],
  strategy?: Strategy,
): Promise<ViralHeading> {
  const cta = ctaFor(caption || topicName);
  const prompt = `You are a world-class YouTube Shorts copywriter optimizing for VIRALITY IN INDIA for a Hindu devotional/Vrindavan audience (Hindi-speaking Indian viewers).
${strategy ? `\nMANDATORY VIRAL FORMULA FOR THIS VIDEO ("${strategy.name}"): ${strategy.instruction}\n` : ""}

Subject: "${topicName}"
Video caption/content: "${caption.slice(0, 500)}"
${views > 0 ? `Public reach signal: ~${views.toLocaleString("en-IN")} views/likes.` : ""}
${existingTitles.length ? `ALREADY-USED TITLES (your title MUST be completely different — different hook, different words): ${existingTitles.slice(0, 12).map((t) => `"${t}"`).join(", ")}` : ""}

Create a COMPLETE package optimized for Indian virality:
1. "title": max 95 chars. Write it in Hindi (Devanagari) or natural Hinglish when the caption is Hindi — for Indian audiences Hindi/Hinglish titles go viral far more than English. If the caption is clearly English, use English with a strong Indian emotional hook. Strong curiosity/emotion hook, 1-2 emoji allowed. Never generic. NEVER similar to the already-used titles above.
2. "hashtags": 8 hashtags — MUST include Indian viral tags #viral #trending #india plus subject-specific ones (Vrindavan, Krishna, RadhaRani, HinduDevotional, bhakti etc). Hindi-translit tags welcome (#sanatandharma, #bhakti, #vrindavan).
3. "description": 4-6 lines in the SAME language as the title — line 1 = scroll-stopping hook, line 2 = hashtags, line 3 = 1-line specific context from THIS caption, line 4 = this CTA (already chosen for you): "${cta}", line 5 = "${LOCATION_LINE}".
4. "category": one of "19" (People & Blogs), "22" (Education), "24" (Entertainment).
5. "language": ONLY "hi" or "en" — never any other language. "hi" for Hindi/Hinglish content (most Indian devotional reels), "en" only for clearly English content.

CRITICAL: SPECIFIC to this video's caption — never a generic template.

Return ONLY strict JSON: {"title":"...","hashtags":["#..."],"description":"...","category":"19","language":"hi"}`;
  const raw = await aiComplete(prompt);
  if (raw) {
    try {
      const m = raw.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(m ? m[0] : raw) as {
        title?: string;
        hashtags?: unknown;
        description?: string;
        category?: unknown;
        language?: unknown;
      };
      const title = String(parsed.title ?? "").trim().slice(0, 95);
      const hashtags = (Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String) : [])
        .map((h) => (h.startsWith("#") ? h : `#${h.replace(/\s+/g, "")}`))
        .filter((h) => h.length > 1)
        .slice(0, 10);
      if (title && hashtags.length) {
        const category = CATEGORY_IDS.has(String(parsed.category)) ? String(parsed.category) : "19";
        const language = normalizeLanguage(parsed.language, title);
        const description =
          String(parsed.description ?? "").trim() ||
          [title, "", hashtags.join(" "), "", cta, LOCATION_LINE].join("\n");
        return { title, hashtags: ensureViralHashtags(hashtags), description, category, language };
      }
    } catch {
      // malformed AI output → template fallback
    }
  }
  const fb = fallbackHeading(topicName, caption, views);
  return { ...fb, hashtags: ensureViralHashtags(fb.hashtags) };
}

/* ---------------- guaranteed-unique headings ---------------------------- */

/** Recent titles already used (manual queue + daily batch) for dedupe. */
export async function recentUploadTitles(): Promise<string[]> {
  try {
    const manual = await db
      .select({ t: manualUploads.youtubeTitle })
      .from(manualUploads)
      .where(sql`${manualUploads.youtubeTitle} IS NOT NULL`)
      .orderBy(desc(manualUploads.id))
      .limit(40);
    const daily = await db
      .select({ t: downloads.youtubeTitle })
      .from(downloads)
      .where(sql`${downloads.youtubeTitle} IS NOT NULL`)
      .orderBy(desc(downloads.id))
      .limit(40);
    return [...manual, ...daily].map((r) => r.t ?? "").filter(Boolean);
  } catch {
    return [];
  }
}

function normalizeTitle(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function isDuplicateTitle(title: string, recent: string[]): boolean {
  const n = normalizeTitle(title);
  if (n.length < 8) return false;
  return recent.some((r) => {
    const rn = normalizeTitle(r);
    if (!rn) return false;
    if (rn === n) return true;
    // Near-duplicate: shared 50-char stem (catches template clones).
    const stem = n.slice(0, 50);
    return stem.length >= 30 && rn.startsWith(stem);
  });
}

/**
 * Creates a heading guaranteed to be DIFFERENT from every recently used
 * title: AI first (with the used-titles exclusion list), then rotating
 * fallback variants until a fresh one is found.
 */
export async function createUniqueHeading(
  topicName: string,
  caption: string,
  views: number,
  strategy?: Strategy,
): Promise<ViralHeading> {
  const recent = await recentUploadTitles();
  const aiHeading = await generateViralHeading(topicName, caption, views, recent, strategy);
  if (!isDuplicateTitle(aiHeading.title, recent)) return aiHeading;
  for (let variant = 1; variant <= 5; variant++) {
    const fb = fallbackHeading(topicName, caption, views, variant);
    if (!isDuplicateTitle(fb.title, recent)) return fb;
  }
  return aiHeading; // mathematically near-impossible to reach
}

/**
 * The Upload Strategy Bot's entry point: picks a viral formula for this
 * specific video, builds a guaranteed-unique heading that follows it, and
 * records the strategy in the audit log.
 */
export async function planVideoStrategy(
  topicName: string,
  caption: string,
  views: number,
  videoId: string,
): Promise<ViralHeading> {
  // Adaptive: weight formulas by what has ACTUALLY earned views on this
  // channel (post-publish analytics) — falls back to rotation with no data.
  const weights = await getStrategyWeights();
  const strategy = pickStrategy(`${videoId}|${caption}`, weights);
  const heading = await createUniqueHeading(topicName, caption, views, strategy);
  heading.strategy = describeStrategy(strategy);
  await logYt(
    "ai",
    `Strategy bot → "${describeStrategy(strategy)}" for ${videoId}. Title: ${heading.title}`,
  );
  return heading;
}

/** Duration probe via ffmpeg (used for #Shorts detection). */
export function probeDurationMs(filePath: string): Promise<number> {
  const binary = ffmpegPath ? String(ffmpegPath) : "";
  if (!binary) return Promise.resolve(0);
  return new Promise((resolve) => {
    execFile(binary, ["-hide_banner", "-i", filePath], { windowsHide: true, timeout: 20_000 }, (_e, _o, stderr) => {
      const m = String(stderr).match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
      resolve(m ? (+m[1] * 3600 + +m[2] * 60 + +m[3]) * 1000 : 0);
    });
  });
}

/** YouTube Shorts get a big algorithmic boost — add #Shorts to short clips. */
export async function applyShortsOptimization(
  heading: ViralHeading,
  filePath: string,
): Promise<ViralHeading> {
  try {
    const dur = await probeDurationMs(filePath);
    if (dur > 0 && dur <= 62_000) {
      if (!/#shorts/i.test(heading.title)) {
        heading.title = `${heading.title} #Shorts`.slice(0, 100);
      }
      if (!/#shorts/i.test(heading.description)) {
        heading.description = `${heading.description}\n#Shorts`;
      }
    }
  } catch {
    /* duration unknown → skip */
  }
  return heading;
}

/* ---------------- thumbnail (proper frame) ------------------------------ */

/** Extracts a representative frame (20% into the video) as a JPEG thumbnail. */
const THUMB_FILTER =
  "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2";

function probeDuration(binary: string, videoPath: string): Promise<number> {
  return new Promise((resolve) => {
    execFile(binary, ["-hide_banner", "-i", videoPath], { windowsHide: true, timeout: 15_000 }, (_e, _o, stderr) => {
      const m = String(stderr).match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
      resolve(m ? (+m[1] * 3600 + +m[2] * 60 + +m[3]) * 1000 : 10_000);
    });
  });
}

function grabFrame(binary: string, videoPath: string, out: string, seekSec?: number): Promise<number> {
  const args = seekSec !== undefined
    ? ["-hide_banner", "-loglevel", "error", "-ss", seekSec.toFixed(2), "-i", videoPath, "-frames:v", "1", "-vf", THUMB_FILTER, "-q:v", "2", "-y", out]
    : ["-hide_banner", "-loglevel", "error", "-i", videoPath, "-vf", `select='gt(scene\\,0.3)',${THUMB_FILTER}`, "-frames:v", "1", "-q:v", "2", "-y", out];
  return new Promise((resolve, reject) => {
    execFile(binary, args, { windowsHide: true, timeout: 45_000 }, (e) => {
      if (e) reject(e);
      else fs.promises.stat(out).then((s) => resolve(s.size)).catch(() => resolve(0));
    });
  });
}

/**
 * Picks the most visually detailed frame of the video as the thumbnail —
 * samples several timestamps plus a scene-change candidate and keeps the
 * richest-looking one (JPEG size correlates with visual detail). This is the
 * image shown to viewers before they press play, so it must earn the click.
 */
export async function extractThumbnail(videoPath: string): Promise<Buffer | null> {
  const binary = ffmpegPath ? String(ffmpegPath) : "";
  if (!binary) return null;
  const base = videoPath.replace(/\.mp4$/i, "") + "__thumb";
  const made: string[] = [];
  try {
    const durationMs = await probeDuration(binary, videoPath);
    const durSec = Math.max(2, durationMs / 1000);
    const pcts = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85];
    const candidates: Array<{ file: string; size: number }> = [];

    // Sampled frames at spread timestamps.
    for (let i = 0; i < pcts.length; i++) {
      const file = `${base}_${i}.jpg`;
      made.push(file);
      try {
        const size = await grabFrame(binary, videoPath, file, Math.max(0.3, durSec * pcts[i]));
        if (size > 5_000) candidates.push({ file, size });
      } catch {
        /* skip this candidate */
      }
    }
    // Scene-change frame (high motion = eye-catching).
    try {
      const file = `${base}_scene.jpg`;
      made.push(file);
      const size = await grabFrame(binary, videoPath, file);
      if (size > 5_000) candidates.push({ file, size });
    } catch {
      /* optional */
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.size - a.size); // richest detail wins
    const best = candidates[0];
    const buf = await fs.promises.readFile(best.file);
    // Clean up all candidates except we already read best into memory.
    await Promise.all(
      candidates.map((c) => fs.promises.rm(c.file, { force: true }).catch(() => {})),
    );
    return buf.length > 5_000 ? buf : null;
  } catch {
    await Promise.all(made.map((f) => fs.promises.rm(f, { force: true }).catch(() => {})));
    return null;
  }
}

/* ---------------- upload ------------------------------------------------- */

interface UploadRow {
  id: number;
  videoId: string;
  url: string;
  caption: string;
  viewCount: number;
  filePath: string | null;
  topicName: string;
}

export interface PublishInput {
  filePath: string;
  title: string;
  description: string;
  tags: string[];
  /** RFC3339 — YouTube auto-publishes the private video at this time. */
  publishAt: string;
  /** YouTube category ID: 19 | 22 | 24 (defaults to 19). */
  category?: string;
  /** BCP-47 language code: en | hi (defaults to en). */
  language?: string;
  /** Original Instagram URL — embedded as a source line AND used to check
   *  the channel so a video already published can never be uploaded twice. */
  sourceUrl?: string;
  /** Topic name — auto-added to the topic playlist on the channel. */
  playlistName?: string;
}

/** Extracts the Instagram shortcode from any reel URL. */
function shortcodeOf(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]{5,})/i);
  return m ? m[1] : null;
}

/**
 * ALWAYS checks the connected YouTube channel before uploading: searches the
 * user's own videos for this reel's shortcode (embedded in every description
 * we publish). Returns the existing YouTube video ID when found, else null.
 */
export async function findOnChannel(needle: string, title?: string): Promise<string | null> {
  if (!needle && !title) return null;
  const token = await accessToken();
  if (!token) return null;
  // Query 1: the Instagram shortcode (matches older uploads + tag metadata).
  // Query 2: distinctive words from the unique title (descriptions no longer
  // carry the Instagram link, so the title is the reliable channel-side key).
  const queries: string[] = [];
  if (needle && needle.length >= 5) queries.push(needle);
  if (title && title.length >= 12) queries.push(title.split(/\s+/).slice(0, 6).join(" "));
  for (const q of queries) {
    try {
      const res = await fetch(
        `${API_BASE}/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=25&q=${encodeURIComponent(q)}`,
        { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(25_000) },
      );
      await addQuota(QUOTA_COST.search, "search");
      if (!res.ok) continue;
      const j = (await res.json()) as {
        items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; description?: string } }>;
      };
      const n = q.toLowerCase();
      const qWords = n.split(/\s+/).filter((w) => w.length > 3);
      for (const item of j.items ?? []) {
        const title2 = (item.snippet?.title ?? "").toLowerCase();
        const hay = `${title2}\n${item.snippet?.description ?? ""}`.toLowerCase();
        // shortcode → exact substring; title query → majority word overlap.
        const match = needle && q === needle
          ? hay.includes(n)
          : qWords.length > 0 && qWords.filter((w) => title2.includes(w)).length >= Math.ceil(qWords.length * 0.6);
        if (match && item.id?.videoId) return item.id.videoId;
      }
    } catch {
      /* try next query */
    }
  }
  return null;
}

/**
 * Core YouTube publisher: multipart upload (private + scheduled publishAt +
 * India location) + frame thumbnail. Shared by the daily batch and the
 * manual link queue.
 */
// Center of India — set as the video location for every Short (YouTube's
// recordingDetails.location field; deprecated in 2017 but still documented
// and accepted, with a safe retry if a future API rejects it).
const INDIA_LOCATION = { latitude: 20.5937, longitude: 78.9629, altitude: 0 };

/** India-optimized discovery tags — every Short gets these. */
const INDIA_TAGS = ["India", "Viral", "Trending", "Reels", "Shorts", "Vrindavan"];


/* ---------------- trending tags (daily, from India's real trending) ---- */

export async function getTrendingTags(): Promise<string[]> {
  try {
    const today = istDate();
    if ((await getSetting("trendingTagsAt", "")) === today) {
      const raw = await getSetting("trendingTags", "");
      if (raw) return JSON.parse(raw) as string[];
    }
    const token = await accessToken();
    if (!token) return [];
    const res = await fetch(
      `${API_BASE}/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=50`,
      { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(20_000) },
    );
    if (!res.ok) return [];
    const j = (await res.json()) as { items?: Array<{ snippet?: { tags?: string[] } }> };
    const freq = new Map<string, number>();
    for (const item of j.items ?? []) {
      for (const tag of item.snippet?.tags ?? []) {
        const clean = String(tag).replace(/^#/, "").trim();
        if (!clean || clean.length > 30) continue;
        freq.set(clean, (freq.get(clean) ?? 0) + 1);
      }
    }
    await addQuota(QUOTA_COST.videosList, "videosList");
    const top = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([t]) => t);
    if (top.length) {
      await setSetting("trendingTags", JSON.stringify(top));
      await setSetting("trendingTagsAt", today);
      await logYt("ai", `Trending-tag research: refreshed ${top.length} tags from India's top videos (e.g. ${top.slice(0, 5).join(", ")}).`);
    }
    return top;
  } catch {
    return [];
  }
}

/* ---------------- localized titles (#5) --------------------------------- */

/** Adds the OTHER language version (hi ↔ en) so the video speaks to both. */
async function setLocalizedVersions(videoId: string, input: PublishInput, token: string): Promise<void> {
  const other = input.language === "hi" ? "en" : "hi";
  const prompt = `Adapt this YouTube Short metadata into ${other === "hi" ? "Hindi (Devanagari script)" : "English"} for an Indian devotional audience. Keep ALL hashtags exactly as-is. Keep it viral and specific. Return ONLY JSON: {"title":"...","description":"..."}`;
  const raw = await aiComplete(`${prompt}\n\nTITLE: ${input.title}\nDESCRIPTION: ${input.description.slice(0, 600)}`);
  if (!raw) return;
  try {
    const m = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(m ? m[0] : raw) as { title?: string; description?: string };
    const title = String(parsed.title ?? "").trim().slice(0, 95);
    const description = String(parsed.description ?? "").trim();
    if (!title) return;
    const res = await fetch(`${API_BASE}/youtube/v3/videos?part=localizations`, {
      method: "PUT",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        id: videoId,
        localizations: { [other]: { title, description: description || input.description } },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (res.ok) {
      await addQuota(QUOTA_COST.update, "update");
      await logYt("ok", `Localized ${other === "hi" ? "Hindi" : "English"} title added to ${videoId}.`);
    } else {
      await logYt("warn", `Localization update skipped for ${videoId}: HTTP ${res.status}.`);
    }
  } catch {
    /* non-fatal */
  }
}

/* ---------------- topic playlists (#6) ---------------------------------- */

async function ensureTopicPlaylist(name: string, token: string): Promise<string | null> {
  try {
    const map = JSON.parse((await getSetting("youtubePlaylists", "{}")) || "{}") as Record<string, string>;
    if (map[name]) return map[name];
    const res = await fetch(`${API_BASE}/youtube/v3/playlists?part=snippet`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        snippet: {
          title: `${name} | Vrindavan Darshan`,
          description: `Curated ${name} devotional Shorts — automatically organized by ViralDarshan.`,
          privacyStatus: "public",
        },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { id?: string };
    if (!j.id) return null;
    map[name] = j.id;
    await setSetting("youtubePlaylists", JSON.stringify(map));
    await addQuota(QUOTA_COST.playlistInsert, "playlistInsert");
    return j.id;
  } catch {
    return null;
  }
}

async function addVideoToPlaylist(videoId: string, playlistId: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/youtube/v3/playlistItems?part=snippet`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        snippet: {
          playlistId,
          resourceId: { kind: "youtube#video", videoId },
        },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (res.ok) await addQuota(QUOTA_COST.playlistItem, "playlistItem");
    return res.ok;
  } catch {
    return false;
  }
}

/* ---------------- pinned CTA comment (#11) ------------------------------ */

async function postPinnedComment(videoId: string, tags: string[], token: string): Promise<void> {
  try {
    const text = `${ctaFor(videoId)}\n\n${tags.slice(0, 8).map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ")}`.slice(0, 900);
    const res = await fetch(`${API_BASE}/youtube/v3/comments?part=snippet`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ snippet: { videoId, text } }),
      signal: AbortSignal.timeout(20_000),
    });
    if (res.ok) {
      await addQuota(QUOTA_COST.comment, "comment");
      await logYt("ok", `Pinned-style CTA comment posted on ${videoId}.`);
    } else {
      await logYt("warn", `CTA comment skipped for ${videoId}: HTTP ${res.status}.`);
    }
  } catch {
    /* non-fatal */
  }
}

export async function publishVideoFile(
  input: PublishInput,
): Promise<{ id: string; alreadyOnChannel?: boolean }> {
  let token = await accessToken();
  if (!token) throw new Error("not connected / token refresh failed");

  // ---- Quota guard: rotate to the next Google project when one is spent;
  // only throws when EVERY configured credential is exhausted.
  await ensureUploadQuota();
  // Trending tags from India's real top videos (refreshed once/day).
  const trending = await getTrendingTags();

  // ---- Channel-wide dedupe: never upload a video that already exists on
  // this YouTube channel (checks by the Instagram shortcode, which every
  // description we publish carries as its Source line).
  const shortcode = input.sourceUrl ? shortcodeOf(input.sourceUrl) : null;
  {
    const existing = await findOnChannel(shortcode ?? "", input.title);
    if (existing) {
      await logYt(
        "ok",
        `Channel check: this reel is ALREADY on your YouTube (${existing}) — upload skipped, never duplicated.`,
      );
      return { id: existing, alreadyOnChannel: true };
    }
  }

  // Claim-safe mode (#26): credit + fair-use notice, but NO Instagram link is
  // ever shown on YouTube (user requirement) — the shortcode rides in the
  // private tags field instead, which powers the channel-side dedupe check.
  const copyrightOn = (await getSetting("copyrightDisclaimer", "true")) === "true";
  const DISCLAIMER =
    "\n\n⚠️ All rights belong to the original creators. Shared for devotional/archival purposes with full credit. For removal or credit changes, contact the uploader.";
  const description = input.description + (copyrightOn ? DISCLAIMER : "");
  const shortcodeTag = input.sourceUrl ? shortcodeOf(input.sourceUrl) : null;

  const buildMetadata = (withLocation: boolean) => ({
    snippet: {
      title: input.title,
      description,
      tags: trimTags([
        ...new Set([...input.tags, ...INDIA_TAGS, ...trending, ...(shortcodeTag ? [shortcodeTag] : [])]),
      ]),
      categoryId: input.category && CATEGORY_IDS.has(input.category) ? input.category : "19",
      defaultLanguage: input.language === "hi" ? "hi" : "en",
      defaultAudioLanguage: input.language === "hi" ? "hi" : "en",
    },
    status: {
      privacyStatus: "private", // publishAt requires private → scheduled public release
      publishAt: input.publishAt,
      selfDeclaredMadeForKids: false,
      publicStatsViewable: true, // public view counts = social proof = more viral
    },
    recordingDetails: {
      recordingDate: new Date().toISOString(),
      // The real location field (my earlier bug: recordingLocation was the
      // WRONG name — fileDetails, not recordingDetails — so it never applied).
      ...(withLocation
        ? { location: INDIA_LOCATION, locationDescription: "India" }
        : {}),
    },
  });

  const fileBytes = await fs.promises.readFile(input.filePath);
  const boundary = "viraldarshan" + Date.now().toString(36);

  const postOnce = async (
    metadata: ReturnType<typeof buildMetadata>,
  ): Promise<{ ok: boolean; id?: string; error?: string; quota?: boolean }> => {
    const parts: Buffer[] = [
      Buffer.from(
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
      ),
      Buffer.from(`--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`),
      fileBytes,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ];
    const res = await fetch(
      `${API_BASE}/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status,recordingDetails`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": `multipart/related; boundary=${boundary}`,
        },
        body: new Uint8Array(Buffer.concat(parts)),
        signal: AbortSignal.timeout(180_000),
      },
    );
    const text = await res.text();
    if (res.ok) {
      await addQuota(QUOTA_COST.upload, "upload");
      return { ok: true, id: (JSON.parse(text) as { id: string }).id };
    }
    if (isQuotaError(res.status, text)) {
      await markQuotaExhausted();
      return { ok: false, quota: true, error: `YouTube quotaExceeded (HTTP ${res.status}) — daily API budget spent.` };
    }
    return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 300)}` };
  };

  // First try WITH the India location. If a future API build rejects the
  // (deprecated) location fields, retry once without them so the upload
  // itself never fails.
  let result = await postOnce(buildMetadata(true));
  if (!result.ok && /invalidRecordingDetails/i.test(result.error ?? "")) {
    await logYt("warn", "YouTube rejected recordingDetails.location — retrying without the map field (description/tags still carry India).");
    result = await postOnce(buildMetadata(false));
  }
  // Real quotaExceeded from Google → rotate to the next project and retry once.
  if (!result.ok && result.quota && (await rotateAccount())) {
    const fresh = await accessToken();
    if (fresh) {
      token = fresh;
      await logYt("warn", "YouTube quota hit on the active project — rotated to the next credential, retrying upload.");
      result = await postOnce(buildMetadata(true));
    }
  }
  if (!result.ok || !result.id) {
    if (result.quota) {
      throw new Error(
        `QUOTA_EXHAUSTED: ${result.error} Remaining videos stay queued and upload after the IST-midnight reset.`,
      );
    }
    throw new Error(`YouTube upload failed (${result.error})`);
  }
  const j = { id: result.id };

  // Thumbnail: proper view frame from the video.
  try {
    const thumb = await extractThumbnail(input.filePath);
    if (thumb) {
      const tres = await fetch(
        `${API_BASE}/upload/youtube/v3/thumbnails/set?videoId=${encodeURIComponent(j.id)}&uploadType=media`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${token}`, "content-type": "image/jpeg" },
          body: new Uint8Array(thumb),
          signal: AbortSignal.timeout(60_000),
        },
      );
      if (tres.ok) {
        await addQuota(QUOTA_COST.thumbnail, "thumbnail");
      } else {
        await logYt("warn", `Thumbnail set failed for ${j.id}: HTTP ${tres.status} (video is uploaded).`);
      }
    }
  } catch (e) {
    await logYt("warn", `Thumbnail extraction failed for ${j.id}: ${e instanceof Error ? e.message : e}`);
  }

  // Verify the India location actually stuck (deprecated field — Google may
  // drop it silently). Read it back, and if missing try videos.update once.
  try {
    const check = await fetch(
      `${API_BASE}/youtube/v3/videos?part=recordingDetails&id=${encodeURIComponent(j.id)}`,
      { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(20_000) },
    );
    const cj = (await check.json()) as {
      items?: Array<{ recordingDetails?: { location?: { latitude?: number } } }>;
    };
    const hasLoc = typeof cj.items?.[0]?.recordingDetails?.location?.latitude === "number";
    if (!hasLoc) {
      const upd = await fetch(`${API_BASE}/youtube/v3/videos?part=recordingDetails`, {
        method: "PUT",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({
          id: j.id,
          recordingDetails: {
            recordingDate: new Date().toISOString(),
            location: INDIA_LOCATION,
            locationDescription: "India",
          },
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (upd.ok) {
        await addQuota(QUOTA_COST.update, "update");
        await logYt("ok", `India map location set on ${j.id} via videos.update.`);
      } else {
        await logYt(
          "warn",
          `YouTube did not accept the map location for ${j.id} (HTTP ${upd.status}) — the deprecated field is ignored by this API version; description/tags still carry India. Set the pin manually in YouTube Studio if needed.`,
        );
      }
    } else {
      await logYt("ok", `India location verified on ${j.id} (read back from YouTube).`);
    }
  } catch (e) {
    await logYt("warn", `Location verification skipped for ${j.id}: ${e instanceof Error ? e.message : e}`);
  }

  // ---- Post-upload enhancements (all non-fatal, all quota-tracked) ----
  if ((await getSetting("youtubeLocalizedTitles", "true")) === "true") {
    await setLocalizedVersions(j.id, input, token);
  }
  if (input.playlistName && (await getSetting("youtubePlaylistsEnabled", "true")) === "true") {
    try {
      const playlistId = await ensureTopicPlaylist(input.playlistName, token);
      if (playlistId && (await addVideoToPlaylist(j.id, playlistId, token))) {
        await logYt("ok", `${j.id} added to playlist "${input.playlistName}".`);
      }
    } catch {
      /* non-fatal */
    }
  }
  if ((await getSetting("youtubeCommentsEnabled", "true")) === "true") {
    await postPinnedComment(j.id, input.tags, token);
  }

  return { id: j.id };
}

/** Keeps snippet.tags within YouTube's 500-character budget. */
function trimTags(tags: string[]): string[] {
  const out: string[] = [];
  let len = 0;
  for (const t of tags) {
    const v = t.slice(0, 30);
    if (!v) continue;
    if (len + v.length + 1 > 480) break;
    out.push(v);
    len += v.length + 1;
  }
  return out.slice(0, 40);
}

/** Daily-batch upload: AI heading + publish in 15 minutes. */
async function uploadOne(
  row: UploadRow,
  _token: string,
): Promise<{ id: string; publishAt: string; title: string; strategy: string | null; alreadyOnChannel?: boolean }> {
  if (!row.filePath) throw new Error("local file missing");
  let heading = await planVideoStrategy(row.topicName, row.caption, row.viewCount, row.videoId);
  heading = await applyShortsOptimization(heading, row.filePath);
  // Same peak-time scheduler as manual uploads: 9–11 PM IST slots with natural
  // jitter, collision-avoiding the manual queue (fallback: +15 min).
  const [slot] = await planPublishSlots(1, null, { includeDaily: true });
  const publishAt = new Date(slot ?? Date.now() + PUBLISH_DELAY_MS).toISOString();
  const { id, alreadyOnChannel } = await publishVideoFile({
    filePath: row.filePath,
    title: heading.title,
    description: heading.description,
    tags: heading.hashtags.map((h) => h.slice(1)).concat(["Vrindavan", "Darshan", "Devotional", "India"]),
    publishAt,
    category: heading.category,
    language: heading.language,
    sourceUrl: row.url,
    playlistName: row.topicName,
  });
  return {
    id,
    publishAt,
    title: heading.title,
    strategy: heading.strategy ?? null,
    alreadyOnChannel: Boolean(alreadyOnChannel),
  };
}

let uploading = false;

/**
 * Upload today's approved videos to YouTube. Called ONLY when the whole
 * daily collection is complete. Safe to call repeatedly — already-uploaded
 * videos are skipped.
 */
export async function uploadPendingBatch(): Promise<{ uploaded: number; failed: number }> {
  if (uploading) return { uploaded: 0, failed: 0 };
  const st = await youtubeStatus();
  if (!st.enabled || !st.connected) return { uploaded: 0, failed: 0 };

  const ist = istDate();
  const rows = await db
    .select({
      id: downloads.id,
      videoId: downloads.videoId,
      url: downloads.url,
      caption: downloads.caption,
      viewCount: downloads.viewCount,
      filePath: downloads.filePath,
      youtubeStatus: downloads.youtubeStatus,
      topicName: topics.name,
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
    .orderBy(asc(downloads.id));

  const pending = rows.filter(
    (r) => !r.filePath || r.youtubeStatus === "none" || r.youtubeStatus === "failed",
  );
  if (pending.length === 0) return { uploaded: 0, failed: 0 };

  uploading = true;
  let uploaded = 0;
  let failed = 0;
  try {
    await logYt("info", `YouTube: starting upload of ${pending.length} video(s) — public in 15 minutes, location: India.`);
    for (const row of pending) {
      const token = await accessToken();
      if (!token) {
        failed++;
        await db
          .update(downloads)
          .set({ youtubeStatus: "failed", ytError: "not connected / token refresh failed" })
          .where(eq(downloads.id, row.id));
        continue;
      }
      try {
        const out = await uploadOne(row as UploadRow, token);
        uploaded++;
        await db
          .update(downloads)
          .set({
            youtubeStatus: "uploaded",
            youtubeId: out.id,
            youtubeUrl: `https://www.youtube.com/watch?v=${out.id}`,
            youtubeTitle: out.title,
            strategy: out.strategy,
            publishAt: new Date(out.publishAt),
            uploadedAt: new Date(),
            ytError: null,
          })
          .where(eq(downloads.id, row.id));
        await logYt(
          "ok",
          out.alreadyOnChannel
            ? `YouTube: this video already exists on your channel (${out.id}) — upload skipped, zero duplicates.`
            : `YouTube: "${out.title}" uploaded → goes PUBLIC at ${new Date(out.publishAt).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST. https://www.youtube.com/watch?v=${out.id}`,
        );
      } catch (e) {
        failed++;
        const msg = e instanceof Error ? e.message : String(e);
        await db
          .update(downloads)
          .set({ youtubeStatus: "failed", ytError: msg.slice(0, 500) })
          .where(eq(downloads.id, row.id));
        await logYt("error", `YouTube upload failed for ${row.videoId}: ${msg.slice(0, 200)}`);
      }
    }
  } finally {
    uploading = false;
  }
  return { uploaded, failed };
}
