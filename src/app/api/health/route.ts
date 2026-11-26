import { db, ensureDb } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDb();
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch {
    // first boot: bundled database still starting — report, don't crash
    return Response.json({ ok: false, warmingUp: true }, { status: 503 });
  }
}
