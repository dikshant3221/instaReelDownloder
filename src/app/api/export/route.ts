import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { downloads, topics, manualUploads, videoStats } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function csvEscape(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(headers: string[], rows: Array<Record<string, unknown>>): string {
  const lines = [headers.join(",")];
  for (const r of rows) lines.push(headers.map((h) => csvEscape(r[h])).join(","));
  return lines.join("\n");
}

/**
 * Data export (#19): history | rejected | stats | queue as CSV.
 * Everything the app knows, in a spreadsheet-friendly file.
 */
export async function GET(req: NextRequest) {
  const type = new URL(req.url).searchParams.get("type") ?? "history";
  try {
    await ensureDb();
    let headers: string[];
    let rows: Array<Record<string, unknown>>;
    let name: string;

    if (type === "rejected") {
      rows = await db
        .select({
          videoId: downloads.videoId,
          url: downloads.url,
          topic: topics.name,
          istDate: downloads.istDate,
          viewCount: downloads.viewCount,
          aiVerdict: downloads.aiVerdict,
          aiProvider: downloads.aiProvider,
          aiConfidence: downloads.aiConfidence,
          aiDetectedTopic: downloads.aiDetectedTopic,
          aiReason: downloads.aiReason,
        })
        .from(downloads)
        .innerJoin(topics, eq(downloads.topicId, topics.id))
        .where(eq(downloads.status, "ai_rejected"))
        .orderBy(desc(downloads.id));
      headers = ["videoId", "url", "topic", "istDate", "viewCount", "aiVerdict", "aiProvider", "aiConfidence", "aiDetectedTopic", "aiReason"];
      name = "viraldarshan-rejected";
    } else if (type === "queue") {
      rows = await db.select().from(manualUploads).orderBy(desc(manualUploads.createdAt));
      headers = ["videoId", "url", "status", "publishAt", "youtubeId", "youtubeTitle", "strategy", "transcript", "error", "createdAt"];
      name = "viraldarshan-manual-queue";
    } else if (type === "stats") {
      rows = await db.select().from(videoStats).orderBy(desc(videoStats.checkedAt));
      headers = ["youtubeId", "source", "sourceId", "viewCount", "likeCount", "commentCount", "hoursAfter", "strategy", "checkedAt"];
      name = "viraldarshan-analytics";
    } else {
      rows = await db
        .select({
          videoId: downloads.videoId,
          url: downloads.url,
          topic: topics.name,
          caption: downloads.caption,
          istDate: downloads.istDate,
          viewCount: downloads.viewCount,
          likeCount: downloads.likeCount,
          metricSource: downloads.metricSource,
          aiVerdict: downloads.aiVerdict,
          aiConfidence: downloads.aiConfidence,
          aiProvider: downloads.aiProvider,
          strategy: downloads.strategy,
          transcript: downloads.transcript,
          youtubeTitle: downloads.youtubeTitle,
          youtubeUrl: downloads.youtubeUrl,
          publishAt: downloads.publishAt,
          fileHash: downloads.fileHash,
          fileSize: downloads.fileSize,
        })
        .from(downloads)
        .innerJoin(topics, eq(downloads.topicId, topics.id))
        .where(eq(downloads.status, "completed"))
        .orderBy(desc(downloads.id));
      headers = [
        "videoId", "url", "topic", "caption", "istDate", "viewCount", "likeCount",
        "metricSource", "aiVerdict", "aiConfidence", "aiProvider", "strategy",
        "transcript", "youtubeTitle", "youtubeUrl", "publishAt", "fileHash", "fileSize",
      ];
      name = "viraldarshan-history";
    }

    const csv = toCsv(headers, rows);
    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${name}-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
