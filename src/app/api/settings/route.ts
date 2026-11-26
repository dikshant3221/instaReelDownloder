import { NextRequest, NextResponse } from "next/server";
import { ensureDb } from "@/db";
import { getMinViews, setSetting, log } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureDb();
    return NextResponse.json({ minViews: await getMinViews() });
  } catch {
    return NextResponse.json({ minViews: 1_000_000 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json({ ok: false, error: "database still starting" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as { minViews?: number };
  const v = Number(body.minViews);
  if (!Number.isFinite(v) || v < 0) {
    return NextResponse.json({ ok: false, error: "Enter a valid number." }, { status: 400 });
  }
  const clamped = Math.min(Math.round(v), 500_000_000); // sane upper bound
  await setSetting("minViews", String(clamped));
  // Re-scan soon so the new threshold takes effect immediately.
  await setSetting("nextScanAt", "0");
  await log("info", `Viral threshold set to ${clamped.toLocaleString("en-IN")} views.`);
  return NextResponse.json({ ok: true, minViews: clamped });
}
