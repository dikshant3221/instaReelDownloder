import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { topics } from "@/db/schema";
import { log } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Returns the raw reference photo for a topic (used for the preview thumbnail). */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "";
  const idx = Number(url.searchParams.get("idx") ?? "0");
  try {
    await ensureDb();
    const row = (
      await db
        .select({ ref: topics.referenceImage, photos: topics.referencePhotos })
        .from(topics)
        .where(eq(topics.slug, slug))
        .limit(1)
    )[0];
    if (!row) return new Response("Not found", { status: 404 });
    // Multi-photo (#17): serve index N from the array; fall back to legacy single.
    const list = (row.photos?.length ? row.photos : row.ref ? [row.ref] : []);
    const dataUrl = list[idx] ?? list[0];
    if (!dataUrl) return new Response("Not found", { status: 404 });
    const m = dataUrl.match(/^data:(image\/[a-z0-9.+-]+);base64,(.*)$/i);
    if (!m) return new Response("Invalid", { status: 404 });
    const buf = Buffer.from(m[2], "base64");
    return new Response(new Uint8Array(buf), {
      headers: { "content-type": m[1], "cache-control": "no-store" },
    });
  } catch {
    return new Response("error", { status: 500 });
  }
}

/** Save or clear a topic's reference photo (data URL, ≤ ~2.5MB). */
export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = (await req.json().catch(() => ({}))) as {
      slug?: string;
      dataUrl?: string | null;
      action?: "set" | "clear" | "remove";
    index?: number;
    };
    if (!body.slug) return NextResponse.json({ ok: false, error: "missing slug" }, { status: 400 });

    if (body.action === "clear" || !body.dataUrl) {
      await db
        .update(topics)
        .set({ referenceImage: null, referencePhotos: [] })
        .where(eq(topics.slug, body.slug));
      await log("info", `Reference photos cleared for "${body.slug}".`);
      return NextResponse.json({ ok: true });
    }
    if (body.action === "remove") {
      const idx = Number((body as { index?: number }).index ?? -1);
      const row = (
        await db.select({ photos: topics.referencePhotos }).from(topics).where(eq(topics.slug, body.slug)).limit(1)
      )[0];
      const list = [...(row?.photos ?? [])];
      if (idx >= 0 && idx < list.length) list.splice(idx, 1);
      await db
        .update(topics)
        .set({ referencePhotos: list, referenceImage: list[0] ?? null })
        .where(eq(topics.slug, body.slug));
      return NextResponse.json({ ok: true, count: list.length });
    }

    if (!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(body.dataUrl)) {
      return NextResponse.json({ ok: false, error: "Use a JPG, PNG or WebP image." }, { status: 400 });
    }
    if (body.dataUrl.length > 3_500_000) {
      return NextResponse.json({ ok: false, error: "Image too large (max ~2.5MB)." }, { status: 400 });
    }

    const row = (
      await db.select({ photos: topics.referencePhotos }).from(topics).where(eq(topics.slug, body.slug)).limit(1)
    )[0];
    const list = [...(row?.photos ?? [])];
    if (list.length >= 3) {
      return NextResponse.json({ ok: false, error: "Maximum 3 reference photos per topic." }, { status: 400 });
    }
    list.push(body.dataUrl);
    await db
      .update(topics)
      .set({ referencePhotos: list, referenceImage: list[0] })
      .where(eq(topics.slug, body.slug));
    await log("ai", `Reference photo ${list.length}/3 added for "${body.slug}" — the AI now matches videos against it.`);
    return NextResponse.json({ ok: true, count: list.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
