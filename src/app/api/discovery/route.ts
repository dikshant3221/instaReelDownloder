import { NextRequest, NextResponse } from "next/server";
import { ensureDb } from "@/db";
import { ensureSeeded, getSetting, log, setSetting } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BROWSERS = new Set(["", "none", "chrome", "edge", "firefox", "brave", "chromium"]);

export async function GET() {
  try {
    await ensureDb();
    await ensureSeeded();
    const token = await getSetting("apifyToken", "");
    const browser = await getSetting("instagramCookiesBrowser", "");
    const urls = await getSetting("instagramSourceUrls", "");
    return NextResponse.json({
      apifyTokenSet: Boolean(token),
      apifyTokenPreview: token ? `••••••••${token.slice(-4)}` : null,
      browser: browser || "none",
      sourceUrls: urls,
      reliableDiscoveryReady: Boolean(token || (browser && browser !== "none") || urls),
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 503 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    await ensureSeeded();
    const body = (await req.json().catch(() => ({}))) as {
      action?: "save" | "test-apify";
      apifyToken?: string;
      browser?: string;
      sourceUrls?: string;
    };

    if (body.action === "test-apify") {
      const saved = await getSetting("apifyToken", "");
      const token = body.apifyToken?.trim() || saved;
      if (!token) return NextResponse.json({ ok: false, error: "Paste an Apify token first." });
      try {
        const res = await fetch(
          `https://api.apify.com/v2/users/me?token=${encodeURIComponent(token)}`,
          { signal: AbortSignal.timeout(12_000) },
        );
        if (!res.ok) throw new Error(`Apify returned HTTP ${res.status}`);
        return NextResponse.json({ ok: true, message: "Apify connection works. Exact public play-count discovery is ready." });
      } catch (e) {
        return NextResponse.json({
          ok: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    const browser = (body.browser ?? "none").toLowerCase();
    if (!BROWSERS.has(browser)) {
      return NextResponse.json({ ok: false, error: "Unsupported browser" }, { status: 400 });
    }
    if (typeof body.apifyToken === "string" && body.apifyToken.trim()) {
      await setSetting("apifyToken", body.apifyToken.trim());
    }
    if (browser) await setSetting("instagramCookiesBrowser", browser);
    if (typeof body.sourceUrls === "string") {
      const cleaned = body.sourceUrls
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => !s || /^https:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p)\/[A-Za-z0-9_-]+\/?(?:\|.*)?$/i.test(s))
        .slice(0, 100)
        .join("\n");
      await setSetting("instagramSourceUrls", cleaned);
    }
    await setSetting("nextScanAt", "0"); // new config should be used immediately
    await log("ok", "Instagram discovery configuration updated — next scan will use the new access sources.");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 503 },
    );
  }
}
