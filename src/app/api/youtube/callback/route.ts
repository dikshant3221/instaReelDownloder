import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { settings } from "@/db/schema";
import { handleAuthCode } from "@/lib/youtube";
import { log } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getSetting(key: string) {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? "";
}

/** Google OAuth redirect target: verifies state, exchanges the code, lands back on the app. */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error");
  const origin = url.origin;

  try {
    await ensureDb();

    if (err) {
      await log("warn", `YouTube authorization declined: ${err}`);
      return NextResponse.redirect(`${origin}/?yt=denied`);
    }
    if (!code || !state) {
      return NextResponse.redirect(`${origin}/?yt=invalid`);
    }

    const expected = await getSetting("youtubeOauthState");
    if (!expected || expected !== state) {
      await log("warn", "YouTube OAuth state mismatch — possible CSRF. Connection rejected.");
      return NextResponse.redirect(`${origin}/?yt=state`);
    }
    await db
      .insert(settings)
      .values({ key: "youtubeOauthState", value: "" })
      .onConflictDoUpdate({ target: settings.key, set: { value: "" } });

    const redirectUri = (await getSetting("youtubeRedirectUri")) || `${origin}/api/youtube/callback`;
    await handleAuthCode(code, redirectUri);
    return NextResponse.redirect(`${origin}/?yt=connected`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    try {
      await log("error", `YouTube connect failed: ${msg.slice(0, 300)}`);
    } catch {
      /* ignore */
    }
    return NextResponse.redirect(`${origin}/?yt=error`);
  }
}
