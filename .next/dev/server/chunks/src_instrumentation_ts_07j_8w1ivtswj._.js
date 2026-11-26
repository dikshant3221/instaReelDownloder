module.exports = [
"[project]/src/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js instrumentation hook — runs once when the server boots
 * (both `next dev` and `next start`), BEFORE any route handles a request.
 *
 * 1. Zero-config database bootstrap (auto-starts a bundled PostgreSQL).
 * 2. Autonomous engine loop: the downloader keeps scanning every minute even
 *    if the dashboard browser tab is closed — combined with the Windows
 *    wake-task (install_wake_task.py) the work continues while the laptop
 *    sleeps and catches up the moment it wakes.
 */ __turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if (process.env.NEXT_PHASE === "phase-production-build") return;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const { ensureDatabaseReady } = await __turbopack_context__.A("[project]/src/lib/db-bootstrap.ts [instrumentation] (ecmascript, async loader)");
        await ensureDatabaseReady();
    } catch (e) {
        console.warn("[ViralDarshan DB] bootstrap warning:", e instanceof Error ? e.message : e);
    }
    // Autonomous scheduler — independent of any open browser tab.
    try {
        const { tickScheduler } = await __turbopack_context__.A("[project]/src/lib/engine.ts [instrumentation] (ecmascript, async loader)");
        setInterval(()=>{
            void tickScheduler().catch((e)=>console.error("[Engine tick]", e));
        }, 60_000);
        console.log("[ViralDarshan] autonomous scheduler armed (60s interval).");
    } catch (e) {
        console.warn("[ViralDarshan] scheduler warning:", e instanceof Error ? e.message : e);
    }
}
}),
];

//# sourceMappingURL=src_instrumentation_ts_07j_8w1ivtswj._.js.map