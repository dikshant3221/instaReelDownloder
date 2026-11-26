import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { aiProviders } from "@/db/schema";
import { log, ensureSeeded, setSetting } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json({ providers: [], warmingUp: true });
  }
  await ensureSeeded();
  const rows = await db.select().from(aiProviders).orderBy(asc(aiProviders.id));
  return NextResponse.json({
    providers: rows.map((p) => ({
      ...p,
      apiKey: undefined,
      keySet: Boolean(p.apiKey),
      keyPreview: p.apiKey ? `••••••••${p.apiKey.slice(-4)}` : null,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json({ ok: false, error: "database still starting" }, { status: 503 });
  }
  await ensureSeeded();
  const body = (await req.json().catch(() => ({}))) as {
    slug?: string;
    action?: "set-key" | "activate" | "toggle";
    apiKey?: string;
    enabled?: boolean;
    model?: string;
    baseUrl?: string;
  };
  if (!body.slug || !body.action) return NextResponse.json({ ok: false }, { status: 400 });

  const row = (await db.select().from(aiProviders).where(eq(aiProviders.slug, body.slug)).limit(1))[0];
  if (!row) return NextResponse.json({ ok: false, error: "provider not found" }, { status: 404 });

  if (body.action === "set-key") {
    const key = (body.apiKey ?? "").trim();
    const baseUrl = body.baseUrl?.trim();
    const model = body.model?.trim();
    await db
      .update(aiProviders)
      .set({
        apiKey: key || row.apiKey || null,
        ...(baseUrl ? { baseUrl: baseUrl.replace(/\/$/, "") } : {}),
        ...(model ? { model } : {}),
        status: "untested",
        statusDetail: key || row.apiKey ? "Key/config saved locally — test to verify." : "",
      })
      .where(eq(aiProviders.slug, body.slug));
    await setSetting("nextScanAt", "0");
    await log("info", `AI vision configuration updated for ${row.name} (key stored locally, never shown in full). Pending/new videos will be reviewed automatically.`);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "activate") {
    await db.update(aiProviders).set({ active: false });
    await db.update(aiProviders).set({ active: true, enabled: true }).where(eq(aiProviders.slug, body.slug));
    await log("ai", `${row.name} is now the ACTIVE AI provider for keyword generation & caption classification. (The downloader works fine even with no provider.)`);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "toggle") {
    await db.update(aiProviders).set({ enabled: Boolean(body.enabled), active: body.enabled ? row.active : false }).where(eq(aiProviders.slug, body.slug));
    await log("info", `${row.name} ${body.enabled ? "enabled" : "disabled"}.`);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}
