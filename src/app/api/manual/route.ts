import { NextRequest, NextResponse } from "next/server";
import { ensureDb } from "@/db";
import {
  listManual,
  moveQueueItem,
  processManualQueue,
  queueEtaSeconds,
  retryManual,
  setQueuePaused,
  submitManualLinks,
} from "@/lib/manual";
import { youtubeStatus } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureDb();
    const list = await listManual();
    // Crash recovery: resume any queued items when the dashboard polls.
    if (!list.paused && list.rows.some((i) => i.status === "queued" || i.status === "downloaded")) {
      void processManualQueue();
    }
    const yt = await youtubeStatus();
    const etaSeconds = await queueEtaSeconds();
    return NextResponse.json({
      items: list.rows,
      paused: list.paused,
      etaSeconds,
      peakWindow: "9:00–11:00 PM IST",
      dailyCap: 5,
      youtubeConnected: yt.connected,
      youtubeEnabled: yt.enabled,
    });
  } catch {
    return NextResponse.json({ items: [], gapMinutes: 5, warmingUp: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json({ ok: false, error: "database still starting" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    action?: "submit" | "retry" | "pause" | "resume" | "priority";
    urls?: string;
    publishAt?: string;
    id?: number;
    dir?: number;
  };

  if (body.action === "pause" || body.action === "resume") {
    await setQueuePaused(body.action === "pause");
    return NextResponse.json({ ok: true, paused: body.action === "pause" });
  }

  if (body.action === "priority") {
    if (!body.id || (body.dir !== -1 && body.dir !== 1)) {
      return NextResponse.json({ ok: false, error: "id and dir (±1) required" }, { status: 400 });
    }
    const ok = await moveQueueItem(body.id, body.dir as -1 | 1);
    return NextResponse.json({ ok });
  }

  if (body.action === "retry") {
    if (!body.id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
    const ok = await retryManual(body.id);
    return NextResponse.json({ ok });
  }

  const lines = (body.urls ?? "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    return NextResponse.json({ ok: false, error: "Paste at least one Instagram link." }, { status: 400 });
  }
  if (lines.length > 500) {
    return NextResponse.json({ ok: false, error: "Maximum 500 links per batch." }, { status: 400 });
  }

  const result = await submitManualLinks(lines, body.publishAt);
  return NextResponse.json({ ok: true, ...result });
}
