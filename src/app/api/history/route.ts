import { NextRequest, NextResponse } from "next/server";
import { desc, eq, and, sql } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { downloads, topics } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PAGE = 12;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const date = searchParams.get("date");
  const q = (searchParams.get("q") ?? "").trim();
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  try {
    await ensureDb(); // waits for — or kindly reports — a still-booting database
    const wheres = [eq(downloads.status, "completed"), eq(downloads.aiVerdict, "match")];
    if (topic && topic !== "all") wheres.push(eq(topics.slug, topic));
    if (date) wheres.push(eq(downloads.istDate, date));
    if (q.length >= 2) {
      const like = `%${q.replace(/[%_]/g, " ")}%`;
      wheres.push(
        sql`(${downloads.caption} ILIKE ${like} OR ${downloads.transcript} ILIKE ${like} OR ${downloads.youtubeTitle} ILIKE ${like})`,
      );
    }

    const items = await db
      .select({
        id: downloads.id,
        videoId: downloads.videoId,
        url: downloads.url,
        caption: downloads.caption,
        author: downloads.author,
        viewCount: downloads.viewCount,
        likeCount: downloads.likeCount,
        metricSource: downloads.metricSource,
        aiVerdict: downloads.aiVerdict,
        aiProvider: downloads.aiProvider,
        aiConfidence: downloads.aiConfidence,
        aiDetectedTopic: downloads.aiDetectedTopic,
        aiReason: downloads.aiReason,
        istDate: downloads.istDate,
        filePath: downloads.filePath,
        fileName: downloads.fileName,
        fileHash: downloads.fileHash,
        fileSize: downloads.fileSize,
        downloadedAt: downloads.downloadedAt,
        topicSlug: topics.slug,
        topicName: topics.name,
        topicFolder: topics.folder,
      })
      .from(downloads)
      .innerJoin(topics, eq(downloads.topicId, topics.id))
      .where(and(...wheres))
      .orderBy(desc(downloads.downloadedAt))
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

    const dates = await db
      .selectDistinct({ d: downloads.istDate })
      .from(downloads)
      .where(and(eq(downloads.status, "completed"), eq(downloads.aiVerdict, "match")))
      .orderBy(desc(downloads.istDate))
      .limit(14);

    return NextResponse.json({
      items: items.map((item) => ({
        ...item,
        // Never expose a Windows absolute path to the browser. This endpoint
        // streams the real verified MP4 from disk when the user clicks Save.
        filePath: item.filePath ? `/api/files/${item.id}` : null,
      })),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / PAGE)),
      dates: dates.map((d) => d.d),
    });
  } catch {
    // DB still warming up on first boot — library shows its loader and retries
    return NextResponse.json({ items: [], total: 0, page: 1, pages: 1, dates: [], warmingUp: true });
  }
}
