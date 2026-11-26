import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { downloads, topics, settings } from "@/db/schema";
import { log } from "@/lib/engine";
import {
  youtubeStatus,
  authUrlWithClient,
  uploadPendingBatch,
} from "@/lib/youtube";
import { quotaSnapshot, getInsights } from "@/lib/youtube-stats";
import { istDate } from "@/lib/ist";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function get(key: string, fallback = "") {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? fallback;
}

async function set(key: string, value: string) {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function GET() {
  try {
    await ensureDb();
    const status = await youtubeStatus();
    const ist = istDate();
    const uploads = await db
      .select({
        id: downloads.id,
        videoId: downloads.videoId,
        title: downloads.youtubeTitle,
        url: downloads.youtubeUrl,
        ytStatus: downloads.youtubeStatus,
        publishAt: downloads.publishAt,
        ytError: downloads.ytError,
        viewCount: downloads.viewCount,
        topicName: topics.name,
      })
      .from(downloads)
      .innerJoin(topics, eq(downloads.topicId, topics.id))
      .where(and(eq(downloads.istDate, ist), eq(downloads.status, "completed"), eq(downloads.aiVerdict, "match")))
      .orderBy(asc(downloads.id));

    const clientId = await get("youtubeClientId", "");
    const [quota, insights] = await Promise.all([quotaSnapshot(), getInsights()]);
    const { telegramConfigured } = await import("@/lib/notify");
    const telegramSet = await telegramConfigured();
    const copyrightOn = (await get("copyrightDisclaimer", "true")) === "true";
    return NextResponse.json({
      ...status,
      quota,
      insights,
      telegramSet,
      copyrightOn,
      clientIdSet: Boolean(clientId),
      clientIdPreview: clientId ? `••••${clientId.slice(-6)}` : null,
      uploads: uploads.map((u) => ({
        ...u,
        publishAt: u.publishAt ? new Date(u.publishAt).toISOString() : null,
      })),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e), configured: false, connected: false, enabled: false, uploads: [] },
      { status: 503 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json({ ok: false, error: "database still starting" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    action?:
      | "save-client"
      | "connect"
      | "enable"
      | "upload-now"
      | "disconnect"
      | "telegram"
      | "copyright"
      | "add-account"
      | "switch-account";
    label?: string;
    index?: number;
    token?: string;
    chatId?: string;
    mode?: string;
    clientId?: string;
    clientSecret?: string;
    enabled?: boolean;
    redirectUri?: string;
  };

  const anyBody = body as Record<string, unknown>;

  // ---- credential pool: add another Google project (fresh 10k quota) ----
  if (body.action === "add-account") {
    const label = String(anyBody.label ?? "").trim() || `Project ${Date.now() % 1000}`;
    const clientId = String(anyBody.clientId ?? "").trim();
    const clientSecret = String(anyBody.clientSecret ?? "").trim();
    if (!clientId || !clientSecret) {
      return NextResponse.json({ ok: false, error: "Client ID and Secret are required." }, { status: 400 });
    }
    const { loadAccounts, saveAccounts, authUrlWithClient: authUrl } = await import("@/lib/youtube");
    const store = await loadAccounts();
    store.accounts.push({ label, clientId, clientSecret, quotaUsed: 0, quotaDate: "" });
    store.pending = store.accounts.length - 1;
    await saveAccounts(store);
    const origin = new URL(req.url).origin;
    const redirect = (await get("youtubeRedirectUri", "")) || `${origin}/api/youtube/callback`;
    await set("youtubeRedirectUri", redirect);
    const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await set("youtubeOauthState", state);
    await log("info", `Google project "${label}" added to the credential pool — authorize it to unlock its fresh daily quota.`);
    return NextResponse.json({ ok: true, url: authUrl(clientId, redirect, state) });
  }

  // ---- switch active credential ----
  if (body.action === "switch-account") {
    const { loadAccounts, saveAccounts } = await import("@/lib/youtube");
    const idx = Number(anyBody.index);
    const store = await loadAccounts();
    if (!Number.isInteger(idx) || idx < 0 || idx >= store.accounts.length) {
      return NextResponse.json({ ok: false, error: "Invalid account." }, { status: 400 });
    }
    if (!store.accounts[idx].access_token) {
      return NextResponse.json({ ok: false, error: "That account has not been authorized yet." }, { status: 400 });
    }
    // Persist current spend, then activate the chosen project with a clean counter.
    const cur = store.accounts[store.active];
    cur.quotaDate = await get("youtubeQuotaDate", "");
    cur.quotaUsed = Number(await get("youtubeQuotaUsed", "0")) || 0;
    store.active = idx;
    await saveAccounts(store);
    await set("youtubeQuotaUsed", "0");
    await set("youtubeQuotaDate", (await import("@/lib/ist")).istDate());
    await log("info", `Switched to Google account "${store.accounts[idx].label}".`);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "telegram") {
    const { testTelegram, setSetting: saveSecret } = await import("@/lib/notify");
    const token = String(anyBody.token ?? "").trim();
    const chatId = String(anyBody.chatId ?? "").trim();
    const effectiveToken = token || (await get("telegramBotToken", ""));
    const effectiveChat = chatId || (await get("telegramChatId", ""));
    // Only persist credentials AFTER Telegram accepts them — a failed test
    // must never leave a broken token stored.
    const result = await testTelegram(effectiveToken, effectiveChat);
    if (result.ok) {
      await saveSecret("telegramBotToken", effectiveToken);
      await saveSecret("telegramChatId", effectiveChat);
      await log("info", "Telegram alerts enabled.");
    }
    return NextResponse.json(result);
  }
  if (body.action === "copyright") {
    await set("copyrightDisclaimer", anyBody.enabled === false ? "false" : "true");
    await log("info", `Copyright claim-safe mode ${anyBody.enabled === false ? "DISABLED" : "ENABLED"}.`);
    return NextResponse.json({ ok: true, enabled: anyBody.enabled !== false });
  }

  switch (body.action) {
    case "save-client": {
      const clientId = (body.clientId ?? "").trim();
      const clientSecret = (body.clientSecret ?? "").trim();
      if (!clientId || !clientSecret) {
        return NextResponse.json({ ok: false, error: "Both Client ID and Client Secret are required." }, { status: 400 });
      }
      await set("youtubeClientId", clientId);
      await set("youtubeClientSecret", clientSecret);
      if (body.redirectUri) await set("youtubeRedirectUri", body.redirectUri.trim());
      await log("info", "Google OAuth client saved locally. Click Connect to authorize YouTube.");
      return NextResponse.json({ ok: true });
    }

    case "connect": {
      const clientId = await get("youtubeClientId", "");
      if (!clientId) {
        return NextResponse.json({ ok: false, error: "Save your Google OAuth Client ID first." }, { status: 400 });
      }
      const origin = new URL(req.url).origin;
      const redirectUri = await get("youtubeRedirectUri", `${origin}/api/youtube/callback`);
      await set("youtubeRedirectUri", redirectUri);
      const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
      await set("youtubeOauthState", state);
      return NextResponse.json({ ok: true, url: authUrlWithClient(clientId, redirectUri, state) });
    }

    case "enable": {
      const enabled = Boolean(body.enabled);
      await set("youtubeEnabled", enabled ? "true" : "false");
      await log("info", `Auto-upload ${enabled ? "ENABLED" : "DISABLED"} — uploads run only after the daily collection is complete.`);
      if (enabled) void uploadPendingBatch().catch(() => {});
      return NextResponse.json({ ok: true });
    }

    case "upload-now": {
      const result = await uploadPendingBatch();
      return NextResponse.json({ ok: true, ...result });
    }

    case "disconnect": {
      await set("youtubeTokens", "");
      await log("warn", "YouTube disconnected — tokens removed from this machine.");
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
  }
}
