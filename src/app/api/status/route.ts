import { NextResponse } from "next/server";
import { getStatus, tickScheduler } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Placeholder returned while the zero-config DB is still finishing boot —
 *  the dashboard renders this gracefully instead of erroring. */
function warmingUp(detail: string) {
  const names: Array<[string, string, string, string]> = [
    ["banke-bihari-ji", "Shri Banke Bihari Ji", "श्री बांके बिहारी जी", "Banke_Bihari_Ji"],
    ["radha-vallabh-ji", "Shri Radha Vallabh Ji", "श्री राधावल्लभ जी", "Radha_Vallabh_Ji"],
    ["radha-raman-ji", "Shri Radha Raman Ji", "श्री राधारमण जी", "Radha_Raman_Ji"],
    ["radha-govind-dev-ji", "Shri Radha Govind Dev Ji", "श्री राधा गोविन्द देव जी", "Radha_Govind_Dev_Ji"],
    ["premanand-ji-maharaj", "Premanand Ji Maharaj", "प्रेमानंद जी महाराज", "Premanand_Ji_Maharaj"],
    ["indresh-ji-maharaj", "Indresh Ji Maharaj", "इंद्रेश जी महाराज", "Indresh_Ji_Maharaj"],
    ["vinod-baba-ji", "Vinod Baba Ji", "विनोद बाबा जी", "Vinod_Baba_Ji"],
  ];
  const byTopic = names.map(([slug, name, hindiName, folder], i) => ({
    slug, name, hindiName, folder, enabled: true, keywords: [], count: 0, views: 0, sortOrder: i,
  }));
  const now = new Date();
  return NextResponse.json({
    warmingUp: detail,
    istNow: now.toISOString(),
    istDate: "",
    engineRunning: false,
    dailyLimit: 7,
    minViews: 1000000,
    today: { count: 0, remaining: 10, duplicatesSkipped: 0, failed: 0, aiRejected: 0, aiPending: 0, viewsTotal: 0, byTopic },
    yesterday: { date: "", count: 0 },
    lifetime: { downloaded: 0 },
    lastScanAt: 0,
    nextScanAt: 0,
    lastRun: null,
    topics: byTopic.map((t, i) => ({ id: i + 1, ...t })),
    providers: [],
    logs: [
      { id: 0, ts: now.toISOString(), level: "info", message: "First boot: preparing the bundled database… (usually under a minute, only once)" },
      { id: 1, ts: now.toISOString(), level: "info", message: `Detail: ${detail}` },
    ],
    downloadRoot: "Downloads/Instagram_Viral_Videos",
  });
}

async function guardianHeal() {
  // Guardian Bot — server half. When anything fails, re-run the zero-config
  // bootstrap from scratch (fresh attempt) and try the whole request again.
  try {
    const { ensureDatabaseReady } = await import("@/lib/db-bootstrap");
    await ensureDatabaseReady(true);
  } catch {
    /* healing is best-effort */
  }
}

export async function GET() {
  try {
    const { ensureDb } = await import("@/db");
    await ensureDb();
    // Lazy scheduler: status polling drives due/missed scans, but REAL media
    // discovery/download can take minutes. Run it in the background so the
    // dashboard never hangs or times out while yt-dlp is working.
    void tickScheduler().catch((e) =>
      console.error("[ViralDarshan Engine] background scan failed safely:", e),
    );
    const status = await getStatus();
    return NextResponse.json(status);
  } catch (firstError) {
    await guardianHeal();
    try {
      void tickScheduler().catch(() => {});
      const status = await getStatus();
      return NextResponse.json(status); // healed — client never sees the fault
    } catch (secondError) {
      return warmingUp(secondError instanceof Error ? secondError.message : String(secondError));
    }
  }
}
