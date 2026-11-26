import { NextRequest, NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { topics } from "@/db/schema";
import { log } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function folderOf(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]+/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 60) || "Topic";
}

export async function GET() {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json({ topics: [], warmingUp: true });
  }
  const rows = await db.select().from(topics).orderBy(asc(topics.sortOrder));
  return NextResponse.json({
    topics: rows.map(({ referenceImage, ...t }) => ({ ...t, referenceImageSet: Boolean(referenceImage) })),
  });
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
  } catch {
    return NextResponse.json({ ok: false, error: "database still starting" }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    action?: "add" | "delete" | "update";
    slug?: string;
    name?: string;
    enabled?: boolean;
    keywords?: string[];
  };

  // -------- Add a brand-new topic --------
  if (body.action === "add") {
    const name = (body.name ?? "").trim();
    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Enter a topic name." }, { status: 400 });
    }
    const slug = slugify(name);
    if (!slug) return NextResponse.json({ ok: false, error: "Invalid name." }, { status: 400 });
    const exists = (await db.select({ id: topics.id }).from(topics).where(eq(topics.slug, slug)).limit(1))[0];
    if (exists) return NextResponse.json({ ok: false, error: "A topic with this name already exists." }, { status: 409 });

    const maxOrder =
      (await db.select({ m: sql<number>`coalesce(max(${topics.sortOrder}), 0)::int` }).from(topics))[0]?.m ?? 0;
    const keywords = Array.isArray(body.keywords) && body.keywords.length
      ? body.keywords.map((k) => String(k).trim()).filter(Boolean).slice(0, 40)
      : [name];
    await db.insert(topics).values({
      slug,
      name,
      hindiName: "",
      folder: folderOf(name),
      keywords,
      enabled: true,
      sortOrder: maxOrder + 1,
    });
    await log("ok", `New topic added: "${name}". It will be searched on the next scan.`);
    return NextResponse.json({ ok: true, slug });
  }

  if (!body.slug) return NextResponse.json({ ok: false }, { status: 400 });

  // -------- Delete a topic (and its reference photo) --------
  if (body.action === "delete") {
    await db.delete(topics).where(eq(topics.slug, body.slug));
    await log("warn", `Topic "${body.slug}" removed from monitoring.`);
    return NextResponse.json({ ok: true });
  }

  // -------- Update: enable/disable + keywords --------
  const sets: Partial<{ enabled: boolean; keywords: string[] }> = {};
  if (typeof body.enabled === "boolean") sets.enabled = body.enabled;
  if (Array.isArray(body.keywords)) {
    sets.keywords = body.keywords.map((k) => String(k).trim()).filter(Boolean).slice(0, 40);
  }
  if (Object.keys(sets).length === 0) return NextResponse.json({ ok: true });

  await db.update(topics).set(sets).where(eq(topics.slug, body.slug));
  if (typeof body.enabled === "boolean") {
    await log("info", `Topic "${body.slug}" ${body.enabled ? "enabled" : "disabled"}.`);
  }
  if (sets.keywords) {
    await log("info", `Keywords updated for "${body.slug}" (${sets.keywords.length}).`);
  }
  return NextResponse.json({ ok: true });
}
