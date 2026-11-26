import { NextRequest, NextResponse } from "next/server";
import { ensureDb } from "@/db";
import { runScan, startEngine, stopEngine, getStatus, log } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json(
      { ok: false, error: "database still starting — the button will work in a few seconds" },
      { status: 503 },
    );
  }
  const body = (await req.json().catch(() => ({}))) as { action?: string };
  const action = body.action;

  switch (action) {
    case "start":
      await startEngine();
      void runScan("scheduled").catch((e) =>
        console.error("[ViralDarshan Engine] start scan failed safely:", e),
      );
      return NextResponse.json({ ok: true, outcome: { message: "Engine started — real-media scan is running in the background." }, status: await getStatus() });
    case "stop":
      await stopEngine();
      return NextResponse.json({ ok: true, status: await getStatus() });
    case "scan": {
      void runScan("manual").catch((e) =>
        console.error("[ViralDarshan Engine] manual scan failed safely:", e),
      );
      return NextResponse.json({
        ok: true,
        outcome: { message: "Real Reel search started in the background. The console will update as playable MP4 files arrive." },
        status: await getStatus(),
      });
    }
    default:
      await log("error", `Engine API received unknown action: ${String(action)}`);
      return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
  }
}
