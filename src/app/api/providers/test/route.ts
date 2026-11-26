import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { aiProviders } from "@/db/schema";
import { log } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Live-tests an AI provider key with a lightweight, free-tier-friendly call.
 * Failures (rate limits, bad keys, offline) are caught and reported —
 * the downloader never depends on AI availability.
 */
export async function POST(req: NextRequest) {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json({ ok: false, error: "database still starting" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as { slug?: string };
  const row = (
    await db.select().from(aiProviders).where(eq(aiProviders.slug, body.slug ?? "")).limit(1)
  )[0];
  if (!row) return NextResponse.json({ ok: false, error: "provider not found" }, { status: 404 });
  if (!row.apiKey) {
    await db.update(aiProviders).set({ status: "error", statusDetail: "No API key saved yet." }).where(eq(aiProviders.slug, row.slug));
    return NextResponse.json({ ok: false, error: "No API key saved yet." }, { status: 400 });
  }

  let status = "error";
  let detail = "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    let res: Response;
    if (row.slug === "gemini") {
      res = await fetch(`${row.baseUrl}/models?key=${encodeURIComponent(row.apiKey)}&pageSize=1`, {
        signal: controller.signal,
      });
    } else if (row.slug === "mistral" || row.slug === "nvidia" || row.slug === "agnes" || row.slug === "bazarlink") {
      res = await fetch(`${row.baseUrl}/models`, {
        headers: { Authorization: `Bearer ${row.apiKey}` },
        signal: controller.signal,
      });
    } else {
      throw new Error("No tester implemented for this provider");
    }
    if (res.ok) {
      status = "ok";
      detail = `Key valid — HTTP ${res.status}. Free-tier rate limits handled with backoff.`;
    } else if (res.status === 429) {
      status = "ok";
      detail = "Key valid but rate-limited right now (HTTP 429) — engine will back off automatically.";
    } else {
      detail = `Provider returned HTTP ${res.status}. Check the key in the provider console.`;
    }
  } catch (e) {
    detail =
      e instanceof Error && e.name === "AbortError"
        ? "Timed out (6s) — network/proxy blocked or provider unreachable. Downloader keeps working without AI."
        : `Connection failed: ${e instanceof Error ? e.message : String(e)}. Downloader keeps working without AI.`;
  } finally {
    clearTimeout(timeout);
  }

  await db
    .update(aiProviders)
    .set({ status, statusDetail: detail, lastTestedAt: new Date() })
    .where(eq(aiProviders.slug, row.slug));
  await log(status === "ok" ? "ai" : "warn", `AI provider test — ${row.name}: ${detail}`);
  return NextResponse.json({ ok: status === "ok", status, detail });
}
