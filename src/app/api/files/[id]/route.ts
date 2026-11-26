import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { eq } from "drizzle-orm";
import { db, ensureDb } from "@/db";
import { downloads } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Streams a verified real MP4 from the local Downloads folder. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await ensureDb();
    const { id } = await ctx.params;
    const n = Number(id);
    if (!Number.isInteger(n) || n < 1) return new Response("Not found", { status: 404 });
    const row = (
      await db
        .select({
          filePath: downloads.filePath,
          fileName: downloads.fileName,
          status: downloads.status,
          aiVerdict: downloads.aiVerdict,
        })
        .from(downloads)
        .where(eq(downloads.id, n))
        .limit(1)
    )[0];
    if (!row?.filePath || row.status !== "completed" || row.aiVerdict !== "match") {
      return new Response("Not found", { status: 404 });
    }
    const stat = await fs.promises.stat(row.filePath);
    if (!stat.isFile() || stat.size < 100_000) return new Response("Invalid media", { status: 410 });
    const filename = (row.fileName || path.basename(row.filePath)).replace(/["\r\n]/g, "_");
    const nodeStream = fs.createReadStream(row.filePath);
    const stream = Readable.toWeb(nodeStream) as ReadableStream;
    return new Response(stream, {
      headers: {
        "content-type": "video/mp4",
        "content-length": String(stat.size),
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return new Response("Video file is unavailable on this computer", { status: 404 });
  }
}
