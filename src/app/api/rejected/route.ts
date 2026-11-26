import { NextRequest, NextResponse } from "next/server";
import { desc, eq, and, sql } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { downloads, topics } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PAGE = 18;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  try {
    await ensureDb();
    const wheres = [eq(downloads.status, "ai_rejected")];
    if (topic && topic !== "all") wheres.push(eq(topics.slug, topic));

    const items = await db
      .select({
        id: downloads.id,
        videoId: downloads.videoId,
        url: downloads.url,
        caption: downloads.caption,
        author: downloads.author,
        viewCount: downloads.viewCount,
        likeCount: downloads.likeCount,
        istDate: downloads.istDate,
        aiVerdict: downloads.aiVerdict,
        aiProvider: downloads.aiProvider,
        aiConfidence: downloads.aiConfidence,
        aiDetectedTopic: downloads.aiDetectedTopic,
        aiReason: downloads.aiReason,
        aiFrame: downloads.aiFrame,
        topicSlug: topics.slug,
        topicName: topics.name,
      })
      .from(downloads)
      .innerJoin(topics, eq(downloads.topicId, topics.id))
      .where(and(...wheres))
      .orderBy(desc(downloads.id))
      .limit(PAGE)
      .offset((page - 1) * PAGE);

    const total =
      (
        await db
          .select({ n: sql<number>`count(*)::int` })
          .from(downloads)
          .innerJoin(topics, eq(downloads.topicId, topics.id))
          .where(and(...wheres))
      )[0]?.n ?? 0;

    return NextResponse.json({
      items,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / PAGE)),
    });
  } catch {
    return NextResponse.json({ items: [], total: 0, page: 1, pages: 1, warmingUp: true });
  }
}

/** Restore a wrongly-rejected video: re-queue it for the next scan, OR permanently drop. */
export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = (await req.json().catch(() => ({}))) as { id?: number; action?: "requeue" | "purge" };
    if (!body.id) return NextResponse.json({ ok: false }, { status: 400 });
    if (body.action === "purge") {
      await db.delete(downloads).where(eq(downloads.id, body.id));
    } else {
      // Remove the rejection record so discovery can pick it up and re-review.
      await db.delete(downloads).where(eq(downloads.id, body.id));
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
