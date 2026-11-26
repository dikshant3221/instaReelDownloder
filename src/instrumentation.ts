/**
 * Next.js instrumentation hook — runs once when the server boots
 * (both `next dev` and `next start`), BEFORE any route handles a request.
 *
 * 1. Zero-config database bootstrap (auto-starts a bundled PostgreSQL).
 * 2. Autonomous engine loop: the downloader keeps scanning every minute even
 *    if the dashboard browser tab is closed — combined with the Windows
 *    wake-task (install_wake_task.py) the work continues while the laptop
 *    sleeps and catches up the moment it wakes.
 */
export async function register() {
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  try {
    const { ensureDatabaseReady } = await import("@/lib/db-bootstrap");
    await ensureDatabaseReady();
  } catch (e) {
    console.warn(
      "[ViralDarshan DB] bootstrap warning:",
      e instanceof Error ? e.message : e,
    );
  }

  // Autonomous scheduler — independent of any open browser tab.
  try {
    const { tickScheduler } = await import("@/lib/engine");
    setInterval(() => {
      void tickScheduler().catch((e) => console.error("[Engine tick]", e));
    }, 60_000);
    console.log("[ViralDarshan] autonomous scheduler armed (60s interval).");
  } catch (e) {
    console.warn("[ViralDarshan] scheduler warning:", e instanceof Error ? e.message : e);
  }
}
