module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/status/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/engine.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const dynamic = "force-dynamic";
const runtime = "nodejs";
/** Placeholder returned while the zero-config DB is still finishing boot —
 *  the dashboard renders this gracefully instead of erroring. */ function warmingUp(detail) {
    const names = [
        [
            "banke-bihari-ji",
            "Shri Banke Bihari Ji",
            "श्री बांके बिहारी जी",
            "Banke_Bihari_Ji"
        ],
        [
            "radha-vallabh-ji",
            "Shri Radha Vallabh Ji",
            "श्री राधावल्लभ जी",
            "Radha_Vallabh_Ji"
        ],
        [
            "radha-raman-ji",
            "Shri Radha Raman Ji",
            "श्री राधारमण जी",
            "Radha_Raman_Ji"
        ],
        [
            "radha-govind-dev-ji",
            "Shri Radha Govind Dev Ji",
            "श्री राधा गोविन्द देव जी",
            "Radha_Govind_Dev_Ji"
        ],
        [
            "premanand-ji-maharaj",
            "Premanand Ji Maharaj",
            "प्रेमानंद जी महाराज",
            "Premanand_Ji_Maharaj"
        ],
        [
            "indresh-ji-maharaj",
            "Indresh Ji Maharaj",
            "इंद्रेश जी महाराज",
            "Indresh_Ji_Maharaj"
        ],
        [
            "vinod-baba-ji",
            "Vinod Baba Ji",
            "विनोद बाबा जी",
            "Vinod_Baba_Ji"
        ]
    ];
    const byTopic = names.map(([slug, name, hindiName, folder], i)=>({
            slug,
            name,
            hindiName,
            folder,
            enabled: true,
            keywords: [],
            count: 0,
            views: 0,
            sortOrder: i
        }));
    const now = new Date();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        warmingUp: detail,
        istNow: now.toISOString(),
        istDate: "",
        engineRunning: false,
        dailyLimit: 7,
        minViews: 1000000,
        today: {
            count: 0,
            remaining: 10,
            duplicatesSkipped: 0,
            failed: 0,
            aiRejected: 0,
            aiPending: 0,
            viewsTotal: 0,
            byTopic
        },
        yesterday: {
            date: "",
            count: 0
        },
        lifetime: {
            downloaded: 0
        },
        lastScanAt: 0,
        nextScanAt: 0,
        lastRun: null,
        topics: byTopic.map((t, i)=>({
                id: i + 1,
                ...t
            })),
        providers: [],
        logs: [
            {
                id: 0,
                ts: now.toISOString(),
                level: "info",
                message: "First boot: preparing the bundled database… (usually under a minute, only once)"
            },
            {
                id: 1,
                ts: now.toISOString(),
                level: "info",
                message: `Detail: ${detail}`
            }
        ],
        downloadRoot: "Downloads/Instagram_Viral_Videos"
    });
}
async function guardianHeal() {
    // Guardian Bot — server half. When anything fails, re-run the zero-config
    // bootstrap from scratch (fresh attempt) and try the whole request again.
    try {
        const { ensureDatabaseReady } = await __turbopack_context__.A("[project]/src/lib/db-bootstrap.ts [app-route] (ecmascript, async loader)");
        await ensureDatabaseReady(true);
    } catch  {
    /* healing is best-effort */ }
}
async function GET() {
    try {
        const { ensureDb } = await __turbopack_context__.A("[project]/src/db/index.ts [app-route] (ecmascript, async loader)");
        await ensureDb();
        // Lazy scheduler: status polling drives due/missed scans, but REAL media
        // discovery/download can take minutes. Run it in the background so the
        // dashboard never hangs or times out while yt-dlp is working.
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tickScheduler"])().catch((e)=>console.error("[ViralDarshan Engine] background scan failed safely:", e));
        const status = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStatus"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(status);
    } catch (firstError) {
        await guardianHeal();
        try {
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tickScheduler"])().catch(()=>{});
            const status = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStatus"])();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(status); // healed — client never sees the fault
        } catch (secondError) {
            return warmingUp(secondError instanceof Error ? secondError.message : String(secondError));
        }
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/db/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "db",
    ()=>db,
    "ensureDb",
    ()=>ensureDb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/node-postgres/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const globalForDb = globalThis;
/** External connection via DATABASE_URL — fully synchronous. */ function materializeExternal() {
    const url = process.env.DATABASE_URL;
    if (!url) return null;
    if (!globalForDb.__vdPool || globalForDb.__vdPoolUrl !== url) {
        globalForDb.__vdPool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["Pool"]({
            connectionString: url
        });
        globalForDb.__vdPoolUrl = url;
        globalForDb.__vdDb = undefined;
    }
    if (!globalForDb.__vdDb) {
        globalForDb.__vdDb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"])(globalForDb.__vdPool);
    }
    return globalForDb.__vdDb;
}
/** Any ready handle: bundled PGlite first (it is already live), else external. */ function materialize() {
    return globalForDb.__vdDbPglite ?? materializeExternal();
}
/** Bundled handle — async because drizzle's PGlite driver is ESM-only here. */ async function materializeBundled() {
    if (globalForDb.__vdDbPglite) return globalForDb.__vdDbPglite;
    if (!globalForDb.__vdPglite) return null;
    const mod = await __turbopack_context__.A("[project]/node_modules/drizzle-orm/pglite/index.js [app-route] (ecmascript, async loader)");
    globalForDb.__vdDbPglite = mod.drizzle({
        client: globalForDb.__vdPglite
    });
    return globalForDb.__vdDbPglite;
}
async function ensureDb() {
    if (materialize()) return;
    const { ensureDatabaseReady } = await __turbopack_context__.A("[project]/src/lib/db-bootstrap.ts [app-route] (ecmascript, async loader)");
    await ensureDatabaseReady(); // shares the single boot attempt (no races)
    if (await materializeBundled()) return;
    if (materializeExternal()) return;
    // one honest forced retry covers a failed first attempt
    await ensureDatabaseReady(true);
    if (await materializeBundled()) return;
    if (materializeExternal()) return;
    throw new Error("DB_WARMING_UP: the database is still starting");
}
const db = new Proxy({}, {
    get (_target, prop) {
        const impl = materialize();
        if (!impl) {
            // fire-and-forget: keep the bootstrap warm for the next request
            void __turbopack_context__.A("[project]/src/lib/db-bootstrap.ts [app-route] (ecmascript, async loader)").then((m)=>void m.ensureDatabaseReady());
            throw new Error("DB_WARMING_UP: the database is still starting");
        }
        const value = Reflect.get(impl, prop);
        return typeof value === "function" ? value.bind(impl) : value;
    }
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/db/schema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activityLogs",
    ()=>activityLogs,
    "aiProviders",
    ()=>aiProviders,
    "downloads",
    ()=>downloads,
    "manualUploads",
    ()=>manualUploads,
    "scanRuns",
    ()=>scanRuns,
    "settings",
    ()=>settings,
    "topics",
    ()=>topics,
    "videoStats",
    ()=>videoStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/serial.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/integer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/boolean.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/jsonb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/indexes.js [app-route] (ecmascript)");
;
;
const topics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("topics", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("slug").notNull().unique(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    hindiName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("hindi_name").notNull(),
    folder: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("folder").notNull(),
    keywords: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("keywords").$type().notNull().default([]),
    enabled: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("enabled").notNull().default(true),
    sortOrder: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("sort_order").notNull().default(0),
    // Reference photo of the deity/saint (data URL). Given to the vision AI so it
    // can compare video frames against the correct subject instead of guessing.
    referenceImage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("reference_image"),
    // Up to 3 reference photos (JSON array of data URLs) — multi-angle matching.
    referencePhotos: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonb"])("reference_photos").$type().notNull().default([])
});
const downloads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("downloads", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    // Permanent cache identity
    videoId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("video_id").notNull(),
    url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("url").notNull(),
    topicId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("topic_id").notNull().references(()=>topics.id),
    caption: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("caption").notNull().default(""),
    author: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("author").notNull().default(""),
    viewCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("view_count").notNull().default(0),
    likeCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("like_count").notNull().default(0),
    metricSource: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("metric_source").notNull().default("views"),
    strategy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("strategy"),
    phash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("phash"),
    aiFrame: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ai_frame"),
    transcript: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("transcript"),
    aiVerdict: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ai_verdict").notNull().default("pending"),
    aiProvider: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ai_provider"),
    aiConfidence: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("ai_confidence"),
    aiDetectedTopic: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ai_detected_topic"),
    aiReason: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ai_reason"),
    // lifecycle: completed | failed | skipped_duplicate | ai_rejected
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("completed"),
    istDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ist_date").notNull(),
    filePath: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("file_path"),
    fileName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("file_name"),
    fileHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("file_hash"),
    fileSize: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("file_size"),
    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("error"),
    scanRunId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("scan_run_id"),
    // YouTube publishing lifecycle
    youtubeStatus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("youtube_status").notNull().default("none"),
    youtubeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("youtube_id"),
    youtubeUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("youtube_url"),
    youtubeTitle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("youtube_title"),
    publishAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("publish_at", {
        withTimezone: true
    }),
    uploadedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("uploaded_at", {
        withTimezone: true
    }),
    ytError: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("yt_error"),
    discoveredAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("discovered_at", {
        withTimezone: true
    }).notNull().defaultNow(),
    downloadedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("downloaded_at", {
        withTimezone: true
    })
}, (t)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueIndex"])("downloads_video_id_uq").on(t.videoId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueIndex"])("downloads_url_uq").on(t.url),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("downloads_ist_date_idx").on(t.istDate),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("downloads_status_idx").on(t.status),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["index"])("downloads_hash_idx").on(t.fileHash),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueIndex"])("downloads_one_approved_per_topic_day_uq").on(t.topicId, t.istDate).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${t.status} = 'completed' AND ${t.aiVerdict} = 'match'`)
    ]);
const scanRuns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("scan_runs", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    trigger: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("trigger").notNull().default("scheduled"),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("running"),
    istDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ist_date").notNull(),
    candidates: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("candidates").notNull().default(0),
    eligible: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("eligible").notNull().default(0),
    fresh: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("fresh").notNull().default(0),
    downloaded: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("downloaded").notNull().default(0),
    duplicates: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("duplicates").notNull().default(0),
    failed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("failed").notNull().default(0),
    quotaBefore: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("quota_before").notNull().default(0),
    message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("message").notNull().default(""),
    aiProvider: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ai_provider"),
    startedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("started_at", {
        withTimezone: true
    }).notNull().defaultNow(),
    finishedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("finished_at", {
        withTimezone: true
    })
});
const activityLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("activity_logs", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    ts: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("ts", {
        withTimezone: true
    }).notNull().defaultNow(),
    level: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("level").notNull().default("info"),
    message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("message").notNull()
});
const aiProviders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("ai_providers", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("slug").notNull().unique(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    baseUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("base_url").notNull(),
    docsUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("docs_url").notNull().default(""),
    freeTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("free_tier").notNull().default(""),
    model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("model").notNull().default(""),
    apiKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("api_key"),
    active: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("active").notNull().default(false),
    enabled: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("enabled").notNull().default(true),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("untested"),
    statusDetail: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status_detail").notNull().default(""),
    lastTestedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("last_tested_at", {
        withTimezone: true
    })
});
const videoStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("video_stats", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    youtubeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("youtube_id").notNull(),
    source: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("source").notNull(),
    sourceId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("source_id").notNull(),
    viewCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("view_count").notNull().default(0),
    likeCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("like_count").notNull().default(0),
    commentCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("comment_count").notNull().default(0),
    hoursAfter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("hours_after").notNull(),
    checkedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("checked_at", {
        withTimezone: true
    }).notNull().defaultNow(),
    strategy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("strategy"),
    publishAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("publish_at", {
        withTimezone: true
    })
});
const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("settings", {
    key: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("key").primaryKey(),
    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("value").notNull()
});
const manualUploads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pgTable"])("manual_uploads", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    videoId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("video_id").notNull().unique(),
    url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("url").notNull(),
    // queued | downloading | downloaded | uploading | uploaded | failed
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("queued"),
    filePath: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("file_path"),
    fileHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("file_hash"),
    fileSize: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("file_size"),
    publishAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("publish_at", {
        withTimezone: true
    }),
    youtubeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("youtube_id"),
    youtubeUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("youtube_url"),
    youtubeTitle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("youtube_title"),
    strategy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("strategy"),
    phash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("phash"),
    priority: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["integer"])("priority").notNull().default(0),
    aiFrame: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("ai_frame"),
    transcript: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("transcript"),
    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("error"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("created_at", {
        withTimezone: true
    }).notNull().defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["timestamp"])("updated_at", {
        withTimezone: true
    }).notNull().defaultNow()
}, (t)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uniqueIndex"])("manual_uploads_video_id_uq").on(t.videoId)
    ]);
}),
"[project]/src/lib/ai-review.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "hasVisionProvider",
    ()=>hasVisionProvider,
    "reviewDownloadedVideo",
    ()=>reviewDownloadedVideo
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:os [external] (node:os, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__ = __turbopack_context__.i("[externals]/ffmpeg-static [external] (ffmpeg-static, cjs, [project]/node_modules/ffmpeg-static)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function parseDataUrl(u) {
    const m = u.match(/^data:(image\/[a-z0-9.+-]+);base64,(.*)$/i);
    return m ? {
        mime: m[1],
        base64: m[2]
    } : null;
}
/** ALL reference photos for a topic (up to 3) — multi-angle matching. */ async function loadReferencePhotos(topicId) {
    try {
        const row = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            ref: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].referenceImage,
            photos: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].referencePhotos
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].id, topicId)).limit(1))[0];
        if (!row) return [];
        const out = [];
        for (const u of row.photos ?? []){
            const p = parseDataUrl(u);
            if (p) out.push(p);
        }
        if (out.length === 0 && row.ref) {
            const p = parseDataUrl(row.ref);
            if (p) out.push(p);
        }
        return out.slice(0, 3);
    } catch  {
        return [];
    }
}
// Topic types: deities/temples look alike on camera (AI must NOT try to tell
// them apart), whereas saints are specific people whose discourse we want.
const SAINT_TOPICS = new Set([
    "premanand-ji-maharaj",
    "indresh-ji-maharaj",
    "vinod-baba-ji"
]);
const TOPIC_RULES = {
    "banke-bihari-ji": "Banke Bihari Ji temple / deity darshan in Vrindavan.",
    "radha-vallabh-ji": "Radha Vallabh Ji temple / deity darshan.",
    "radha-raman-ji": "Radha Raman Ji temple / deity darshan.",
    "radha-govind-dev-ji": "Govind Dev Ji temple / deity darshan.",
    "premanand-ji-maharaj": "Premanand Ji Maharaj giving pravachan (spiritual discourse) / satsang.",
    "indresh-ji-maharaj": "Indresh Upadhyay (Indresh Ji Maharaj) giving Bhagwat Katha / pravachan.",
    "vinod-baba-ji": "Vinod Baba Ji giving pravachan / satsang."
};
function reviewPrompt(c, topic, refCount, transcript) {
    const name = topic.name.replace(/^Shri\s+/i, "");
    const isSaint = SAINT_TOPICS.has(topic.slug);
    const subject = isSaint ? "saint" : "deity/temple";
    // When the user has provided a reference photo, the model CAN compare.
    const refBlock = refCount > 0 ? `\nIMAGES 1-${refCount} are OFFICIAL REFERENCE PHOTOS of ${name} (the correct ${subject}, multiple angles). All remaining images are frames sampled from the video.
- Compare the video frames against the reference photos.
- "relevant": the same ${subject} as the references appears in the video, OR it is closely related devotional content for it, OR you are unsure.
- "wrong_subject": the video clearly shows a DIFFERENT, specific ${subject} than the references (confidence >= 80).
- "unrelated": clearly non-devotional (ad, product, song/dance, movie, meme).
Use the references to judge identity; still give the benefit of the doubt when unsure.` : "";
    const frameBlock = `\nYou see real sampled frames from the video.`;
    void isSaint;
    void frameBlock;
    const verdictKeys = refCount > 0 ? "relevant|wrong_subject|unrelated" : "relevant|unrelated";
    return `You verify whether an Instagram Reel matches a devotional target.

TARGET: ${name} — ${TOPIC_RULES[topic.slug]}
This Reel was found by searching Instagram specifically for "${name}".

Caption: ${c.caption.slice(0, 900)}
Author: ${c.author}
${refBlock}
${transcript ? `\nTRANSCRIPT of what is SPOKEN in the video (strong evidence of the subject): "${transcript.slice(0, 600)}"` : ""}

Default to "relevant" unless you are highly confident (>= 80) it is wrong. confidence = how sure you are (0-100).

Return ONLY strict JSON, no markdown:
{"verdict":"${verdictKeys}","confidence":0,"reason":"one short sentence"}`;
}
async function extractFrames(filePath, videoId) {
    const binary = __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"] ? String(__TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"]) : "";
    if (!binary) throw new Error("bundled FFmpeg is unavailable");
    const dir = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.mkdtemp(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__["default"].tmpdir(), `vd-ai-${videoId}-`));
    const output = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, "frame-%02d.jpg");
    await new Promise((resolve, reject)=>{
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"])(binary, [
            "-hide_banner",
            "-loglevel",
            "error",
            "-skip_frame",
            "nokey",
            "-i",
            filePath,
            "-an",
            "-vf",
            "scale=440:-2:force_original_aspect_ratio=decrease",
            "-frames:v",
            "3",
            "-vsync",
            "vfr",
            "-q:v",
            "6",
            "-y",
            output
        ], {
            windowsHide: true,
            timeout: 30_000,
            maxBuffer: 1_000_000
        }, (error, _stdout, stderr)=>{
            if (error) reject(new Error(`FFmpeg frame extraction failed: ${String(stderr).slice(-250)}`));
            else resolve();
        });
    });
    const names = (await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.readdir(dir)).filter((n)=>n.endsWith(".jpg")).sort();
    const images = await Promise.all(names.slice(0, 3).map((n)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.readFile(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, n))));
    if (images.length === 0) throw new Error("no frames could be extracted from the MP4");
    return {
        dir,
        images
    };
}
function parseReview(raw, provider) {
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("provider returned no JSON verdict");
    const value = JSON.parse(match[0]);
    const raw3 = String(value.verdict ?? "uncertain").toLowerCase().trim();
    // Map the relevance vocabulary (and any legacy words) to internal verdicts.
    const map = {
        relevant: "match",
        match: "match",
        yes: "match",
        wrong_topic: "mismatch",
        "wrong-topic": "mismatch",
        wrong_subject: "mismatch",
        "wrong-subject": "mismatch",
        mismatch: "mismatch",
        unrelated: "mismatch",
        no: "mismatch",
        uncertain: "uncertain",
        unknown: "uncertain"
    };
    const verdict = map[raw3] ?? "uncertain";
    return {
        verdict,
        confidence: Math.max(0, Math.min(100, Number(value.confidence) || 0)),
        detectedTopic: String(value.detected_topic ?? "unknown"),
        reason: String(value.reason ?? "No reason supplied").slice(0, 700),
        evidence: Array.isArray(value.evidence) ? value.evidence.map(String).slice(0, 5) : [],
        provider,
        attempts: []
    };
}
async function callGemini(p, prompt, images, references = []) {
    const model = p.model || "gemini-2.5-flash-lite";
    const parts = [
        {
            text: prompt
        }
    ];
    for (const ref of references){
        parts.push({
            inline_data: {
                mime_type: ref.mime,
                data: ref.base64
            }
        });
    }
    for (const image of images){
        parts.push({
            inline_data: {
                mime_type: "image/jpeg",
                data: image.toString("base64")
            }
        });
    }
    const res = await fetch(`${p.baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(p.apiKey)}`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts
                }
            ],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 220,
                responseMimeType: "application/json"
            }
        }),
        signal: AbortSignal.timeout(25_000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 180)}`);
    const j = await res.json();
    const text = j.candidates?.[0]?.content?.parts?.map((x)=>x.text ?? "").join("") ?? "";
    return parseReview(text, p.name);
}
async function callOpenAiCompatible(p, prompt, images, references = []) {
    const content = [
        {
            type: "text",
            text: prompt
        }
    ];
    const pushImage = (url)=>content.push(p.slug === "mistral" ? {
            type: "image_url",
            image_url: url
        } : {
            type: "image_url",
            image_url: {
                url
            }
        });
    for (const ref of references)pushImage(`data:${ref.mime};base64,${ref.base64}`);
    for (const image of images){
        pushImage(`data:image/jpeg;base64,${image.toString("base64")}`);
    }
    const res = await fetch(`${p.baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${p.apiKey}`
        },
        body: JSON.stringify({
            model: p.model,
            messages: [
                {
                    role: "user",
                    content
                }
            ],
            temperature: 0,
            max_tokens: 220,
            stream: false
        }),
        signal: AbortSignal.timeout(25_000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 180)}`);
    const j = await res.json();
    const raw = j.choices?.[0]?.message?.content;
    const text = Array.isArray(raw) ? raw.map((x)=>x.text ?? "").join("") : String(raw ?? "");
    return parseReview(text, p.name);
}
async function providersWithKeys() {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].enabled, true)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].active), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].id));
    return rows.filter((p)=>Boolean(p.apiKey?.trim())).map((p)=>({
            slug: p.slug,
            name: p.name,
            baseUrl: p.baseUrl,
            model: p.model,
            apiKey: p.apiKey,
            active: p.active
        }));
}
async function hasVisionProvider() {
    return (await providersWithKeys()).length > 0;
}
async function reviewDownloadedVideo(c, topic, filePath, transcript) {
    const providers = await providersWithKeys();
    if (providers.length === 0) {
        return {
            verdict: "unavailable",
            confidence: 0,
            detectedTopic: "unknown",
            reason: "No AI provider key is configured. Add at least one key in API Keys.",
            evidence: [],
            provider: "none",
            attempts: []
        };
    }
    let tempDir = "";
    const attempts = [];
    let anyProviderResponded = false;
    let bestLean = null; // remembered softer signal for fallback accept
    try {
        const extracted = await extractFrames(filePath, c.videoId);
        tempDir = extracted.dir;
        const references = await loadReferencePhotos(topic.id);
        const prompt = reviewPrompt(c, topic, references.length, transcript);
        // First sampled frame kept as the audit image for rejections (#16).
        const frameDataUrl = extracted.images[0] ? `data:image/jpeg;base64,${extracted.images[0].toString("base64")}` : undefined;
        for (const p of providers){
            try {
                const result = p.slug === "gemini" ? await callGemini(p, prompt, extracted.images, references) : await callOpenAiCompatible(p, prompt, extracted.images, references);
                anyProviderResponded = true;
                attempts.push(`${p.name}: ${result.verdict} (${result.confidence}%)`);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).set({
                    status: "ok",
                    statusDetail: `Vision review operational (${p.model})`,
                    lastTestedAt: new Date()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].slug, p.slug));
                // ACCEPT by default: any "relevant" verdict passes immediately.
                if (result.verdict === "match") {
                    return {
                        ...result,
                        detectedTopic: topic.slug,
                        attempts
                    };
                }
                // REJECT only when a provider is HIGHLY confident (>=80) that the video
                // clearly shows a different, specific subject or is obviously non-devotional.
                if (result.verdict === "mismatch" && result.confidence >= 85) {
                    return {
                        ...result,
                        attempts,
                        frameDataUrl
                    };
                }
                // A weak/uncertain negative is NOT a rejection — we trust the keyword
                // search. Remember it only so the fallback can still accept.
                if (!bestLean) {
                    bestLean = {
                        ...result,
                        verdict: "match",
                        detectedTopic: topic.slug
                    };
                }
            } catch (e) {
                const message = e instanceof Error ? e.message : String(e);
                attempts.push(`${p.name}: failed (${message.slice(0, 120)})`);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).set({
                    status: "error",
                    statusDetail: message.slice(0, 500),
                    lastTestedAt: new Date()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].slug, p.slug));
            }
        }
        // Any provider responded without a confident rejection → ACCEPT.
        // The keyword search already established the subject, so we give the
        // video the benefit of the doubt (only obvious wrong matches are blocked).
        if (anyProviderResponded) {
            return {
                frameDataUrl,
                ...bestLean ?? {
                    confidence: 55,
                    detectedTopic: topic.slug,
                    reason: "Accepted — found via a search specific to this topic.",
                    evidence: [],
                    provider: "fallback-chain",
                    attempts: []
                },
                verdict: "match",
                detectedTopic: topic.slug,
                confidence: Math.max(bestLean?.confidence ?? 0, 55),
                reason: bestLean?.reason || "Accepted — found via a search specific to this topic.",
                attempts
            };
        }
        // No provider actually responded (all errored) → unavailable, keep for retry.
        return {
            verdict: "unavailable",
            confidence: 0,
            detectedTopic: "unknown",
            reason: "All AI providers failed to respond. Will retry on the next scan.",
            evidence: [],
            provider: "fallback-chain",
            attempts
        };
    } catch (e) {
        return {
            verdict: "unavailable",
            confidence: 0,
            detectedTopic: "unknown",
            reason: e instanceof Error ? e.message : String(e),
            evidence: [],
            provider: "frame-extractor",
            attempts
        };
    } finally{
        if (tempDir) await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(tempDir, {
            recursive: true,
            force: true
        }).catch(()=>{});
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "ensureSeeded",
    ()=>ensureSeeded,
    "getDailyLimit",
    ()=>getDailyLimit,
    "getMinViews",
    ()=>getMinViews,
    "getSetting",
    ()=>getSetting,
    "getStatus",
    ()=>getStatus,
    "log",
    ()=>log,
    "logMany",
    ()=>logMany,
    "notifyQuotaOnce",
    ()=>notifyQuotaOnce,
    "runScan",
    ()=>runScan,
    "setSetting",
    ()=>setSetting,
    "startEngine",
    ()=>startEngine,
    "stopEngine",
    ()=>stopEngine,
    "tickScheduler",
    ()=>tickScheduler,
    "todayCompleted",
    ()=>todayCompleted
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ist.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reels.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/instagram-real.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$review$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai-review.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$phash$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/phash.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/notify.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$review$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$review$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
/* ------------------------------------------------------------------ */ /* Seed data                                                           */ /* ------------------------------------------------------------------ */ const TOPIC_SEED = [
    {
        slug: "banke-bihari-ji",
        name: "Shri Banke Bihari Ji",
        hindiName: "श्री बांके बिहारी जी",
        folder: "Banke_Bihari_Ji",
        keywords: [
            "Banke Bihari",
            "बांके बिहारी",
            "Bihari Ji",
            "Banke Bihari Mandir",
            "Vrindavan Darshan",
            "Nidhivan",
            "बिहारी जी",
            "#BankeBihari"
        ]
    },
    {
        slug: "radha-vallabh-ji",
        name: "Shri Radha Vallabh Ji",
        hindiName: "श्री राधावल्लभ जी",
        folder: "Radha_Vallabh_Ji",
        keywords: [
            "Radha Vallabh",
            "राधावल्लभ",
            "RadhaRani",
            "Hit Radha Vallabh",
            "Seva Kunj",
            "राधा रानी",
            "#RadhaVallabh"
        ]
    },
    {
        slug: "radha-raman-ji",
        name: "Shri Radha Raman Ji",
        hindiName: "श्री राधारमण जी",
        folder: "Radha_Raman_Ji",
        keywords: [
            "Radha Raman",
            "राधारमण",
            "Radha Raman Mandir",
            "Shaligram deity",
            "Radharaman",
            "राधा रमण मंदिर",
            "#RadhaRaman"
        ]
    },
    {
        slug: "radha-govind-dev-ji",
        name: "Shri Radha Govind Dev Ji",
        hindiName: "श्री राधा गोविन्द देव जी",
        folder: "Radha_Govind_Dev_Ji",
        keywords: [
            "Govind Dev",
            "गोविन्द देव",
            "Radha Govind Dev",
            "Govindaji",
            "Rupa Goswami deity",
            "गोविन्ददेव मंदिर",
            "#RadhaGovindDev"
        ]
    },
    {
        slug: "premanand-ji-maharaj",
        name: "Premanand Ji Maharaj",
        hindiName: "प्रेमानंद जी महाराज",
        folder: "Premanand_Ji_Maharaj",
        keywords: [
            "Premanand Maharaj",
            "प्रेमानंद महाराज",
            "Premanand Ji Satsang",
            "Ekantik Vartalap",
            "Radha Keli Kunj",
            "प्रेमानंद जी प्रवचन"
        ]
    },
    {
        slug: "indresh-ji-maharaj",
        name: "Indresh Ji Maharaj",
        hindiName: "इंद्रेश जी महाराज",
        folder: "Indresh_Ji_Maharaj",
        keywords: [
            "Indresh Upadhyay",
            "इंद्रेश उपाध्याय",
            "Indresh Ji Katha",
            "Bhagwat Katha",
            "Indresh Maharaj Pravachan",
            "इंद्रेश जी कथा"
        ]
    },
    {
        slug: "vinod-baba-ji",
        name: "Vinod Baba Ji",
        hindiName: "विनोद बाबा जी",
        folder: "Vinod_Baba_Ji",
        keywords: [
            "Vinod Baba",
            "विनोद बाबा",
            "Vinod Baba Pravachan",
            "Braj Sant",
            "Vinod Bihari",
            "विनोद बाबा प्रवचन"
        ]
    }
];
const PROVIDER_SEED = [
    {
        slug: "gemini",
        name: "Google Gemini",
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        docsUrl: "https://aistudio.google.com/app/apikey",
        freeTier: "Free tier · multimodal Gemini Flash Lite",
        model: "gemini-2.5-flash-lite",
        active: true
    },
    {
        slug: "mistral",
        name: "Mistral AI",
        baseUrl: "https://api.mistral.ai/v1",
        docsUrl: "https://console.mistral.ai/api-keys",
        freeTier: "Free La Plateforme tier · Pixtral vision",
        model: "pixtral-12b-2409",
        active: false
    },
    {
        slug: "nvidia",
        name: "NVIDIA AI (NIM)",
        baseUrl: "https://integrate.api.nvidia.com/v1",
        docsUrl: "https://build.nvidia.com",
        freeTier: "Free dev credits · multimodal Llama 4",
        model: "meta/llama-4-maverick-17b-128e-instruct",
        active: false
    },
    {
        slug: "agnes",
        name: "Agnes AI",
        baseUrl: "https://api.agnes.ai/v1",
        docsUrl: "https://agnes.ai",
        freeTier: "Community tier where available · OpenAI-compatible vision endpoint",
        model: "agnes-vision",
        active: false
    },
    {
        slug: "bazarlink",
        name: "Bazarlink",
        baseUrl: "https://api.bazarlink.ai/v1",
        docsUrl: "https://bazarlink.ai",
        freeTier: "Free tier where available · OpenAI-compatible vision endpoint",
        model: "bazarlink-vision",
        active: false
    }
];
const sleep = (ms)=>new Promise((r)=>setTimeout(r, ms));
async function seedOnce() {
    for(let i = 0; i < TOPIC_SEED.length; i++){
        const t = TOPIC_SEED[i];
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"]).values({
            ...t,
            keywords: [
                ...t.keywords
            ],
            enabled: true,
            sortOrder: i
        })// Only refresh descriptive fields on re-seed. Do NOT touch `enabled` or
        // `sortOrder` — the user is allowed to disable/reorder topics.
        .onConflictDoUpdate({
            target: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].slug,
            set: {
                name: t.name,
                folder: t.folder
            }
        });
    }
    for (const p of PROVIDER_SEED){
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).values({
            slug: p.slug,
            name: p.name,
            baseUrl: p.baseUrl,
            docsUrl: p.docsUrl,
            freeTier: p.freeTier,
            model: p.model,
            active: p.active
        })// IMPORTANT: never clobber user-customised endpoint/model/key. Only fill
        // in defaults when a field is still empty, and refresh descriptive docs.
        .onConflictDoUpdate({
            target: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].slug,
            set: {
                name: p.name,
                docsUrl: p.docsUrl,
                freeTier: p.freeTier,
                baseUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CASE WHEN ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].baseUrl} = '' THEN ${p.baseUrl} ELSE ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].baseUrl} END`,
                model: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CASE WHEN ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].model} = '' THEN ${p.model} ELSE ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].model} END`
            }
        });
        const envKey = p.slug === "gemini" ? process.env.GEMINI_API_KEY : p.slug === "mistral" ? process.env.MISTRAL_API_KEY : p.slug === "nvidia" ? process.env.NVIDIA_API_KEY : p.slug === "agnes" ? process.env.AGNES_API_KEY : p.slug === "bazarlink" ? process.env.BAZARLINK_API_KEY : undefined;
        if (envKey?.trim()) {
            const saved = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
                apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].apiKey
            }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].slug, p.slug)).limit(1))[0];
            if (!saved?.apiKey) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).set({
                    apiKey: envKey.trim()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].slug, p.slug));
            }
        }
    }
    const defaults = {
        engineRunning: "true",
        nextScanAt: "0",
        downloadRoot: "Windows Downloads/Instagram_Viral_Videos/<IST-date>",
        scanIntervalMin: "30",
        minViews: String(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MIN_VIEWS"])
    };
    for (const [key, value] of Object.entries(defaults)){
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).values({
            key,
            value
        }).onConflictDoNothing({
            target: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key
        });
    }
}
async function ensureSeeded() {
    // Make sure the zero-config database is actually up before seeding.
    const { ensureDb } = await __turbopack_context__.A("[project]/src/db/index.ts [app-route] (ecmascript, async loader)");
    await ensureDb();
    let lastErr;
    for(let attempt = 0; attempt < 3; attempt++){
        try {
            await seedOnce();
            return;
        } catch (e) {
            lastErr = e;
            await sleep(250 * (attempt + 1));
        }
    }
    console.error("[ViralDarshan DB] seeding failed:", lastErr instanceof Error ? lastErr.message : lastErr);
    throw lastErr;
}
async function getSetting(key, fallback = "") {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key, key)).limit(1);
    return rows[0]?.value ?? fallback;
}
async function setSetting(key, value) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).values({
        key,
        value
    }).onConflictDoUpdate({
        target: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key,
        set: {
            value
        }
    });
}
async function getMinViews() {
    const v = Number(await getSetting("minViews", String(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MIN_VIEWS"])));
    return Number.isFinite(v) && v >= 0 ? v : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MIN_VIEWS"];
}
async function getDailyLimit() {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].enabled, true));
    return rows[0]?.n ?? 0;
}
async function log(level, message) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"]).values({
        level,
        message
    });
    // Retain last 400 log lines
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].execute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
    DELETE FROM activity_logs WHERE id < (
      SELECT COALESCE(MIN(id), 0) FROM (
        SELECT id FROM activity_logs ORDER BY id DESC LIMIT 400
      ) keep
    )
  `);
}
async function logMany(entries) {
    if (entries.length === 0) return;
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"]).values(entries.map(([level, message])=>({
            level,
            message
        })));
}
async function todayCompleted(ist) {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, ist), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status, "completed"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].aiVerdict, "match")));
    return rows[0]?.n ?? 0;
}
async function todayStats(ist) {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        topic: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].slug,
        topicName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].name,
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`,
        views: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`coalesce(sum(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].viewCount}),0)::bigint`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].topicId, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, ist), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status, "completed"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].aiVerdict, "match"))).groupBy(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].slug, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].name);
    return rows;
}
/* ------------------------------------------------------------------ */ /* Legacy placeholder cleanup                                          */ /* ------------------------------------------------------------------ */ let placeholdersCleaned = false;
/**
 * Older builds created 5KB metadata artifacts with an .mp4 extension. They
 * are not videos. Purge both their database rows and bytes so the quota is
 * recalculated from REAL, verified media only.
 */ async function purgeLegacyPlaceholders() {
    if (placeholdersCleaned) return;
    const legacy = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id,
        filePath: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].filePath
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status} = 'completed' AND (
        COALESCE(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].fileSize}, 0) < 100000 OR
        COALESCE(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].filePath}, '') LIKE '/downloads/%'
      )`);
    for (const row of legacy){
        if (row.filePath?.startsWith("/downloads/")) {
            const oldFile = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", row.filePath.replace(/^\//, ""));
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rm(oldFile, {
                force: true
            }).catch(()=>{});
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id, row.id));
    }
    if (legacy.length > 0) {
        await log("warn", `Removed ${legacy.length} old metadata placeholder(s). Only real playable MP4 files count now.`);
    }
    placeholdersCleaned = true;
}
/**
 * Audits real MP4s downloaded by the previous build before AI gating existed.
 * Match -> becomes countable. Mismatch/uncertain -> file deleted and permanent
 * ai_rejected cache row retained. Provider outage -> remains pending for retry.
 */ /* ------------------------------------------------------------------ */ /* Scan engine                                                         */ /* ------------------------------------------------------------------ */ let inProcessScan = false;
/** Any scan row started before this process booted belongs to a dead process
 *  and is reclaimed immediately (restart must never block scanning for 10min). */ const PROCESS_STARTED_AT = Date.now();
async function runScan(trigger) {
    await ensureSeeded();
    await purgeLegacyPlaceholders();
    if (inProcessScan) {
        return {
            status: "busy",
            message: "A scan is already running in this process (single-instance guard).",
            downloaded: 0,
            duplicates: 0,
            failed: 0,
            eligible: 0,
            candidates: 0,
            remainingAfter: 0
        };
    }
    // Cross-restart guard: an unfinished scan younger than 10 min = another
    // instance may own it. Older = crashed scan; safe to reclaim.
    const stale = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].status, "running")).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].startedAt)).limit(1);
    const staleStartedAt = stale[0] ? new Date(stale[0].startedAt).getTime() : 0;
    const staleIsLive = stale[0] !== undefined && staleStartedAt >= PROCESS_STARTED_AT && // started by THIS process
    Date.now() - staleStartedAt < 10 * 60_000;
    if (staleIsLive) {
        return {
            status: "busy",
            message: `Scan #${stale[0].id} still marked running — refusing parallel downloaders.`,
            downloaded: 0,
            duplicates: 0,
            failed: 0,
            eligible: 0,
            candidates: 0,
            remainingAfter: 0
        };
    }
    if (stale[0]) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).set({
            status: "skipped",
            message: "reclaimed after crash",
            finishedAt: new Date()
        }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].id, stale[0].id));
        await log("warn", `Recovered from crashed scan #${stale[0].id} — resuming safely without losing daily progress.`);
    }
    inProcessScan = true;
    const ist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
    const logs = [];
    try {
        const aiReady = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$review$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasVisionProvider"])();
        // Legacy pending rows (from the old AI-gate era) are now trusted directly —
        // auto-collection no longer rejects content, so they simply count.
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).set({
            aiVerdict: "match"
        }).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status} = 'completed' AND ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].aiVerdict} = 'pending'`);
        const dailyLimit = await getDailyLimit();
        const minViews = await getMinViews();
        const done = await todayCompleted(ist);
        const remaining = Math.max(0, dailyLimit - done);
        const activeProvider = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].active, true)).limit(1))[0];
        const aiNote = aiReady && activeProvider?.apiKey ? `AI enhancements ON (${activeProvider.name}): manual content checks, transcripts, viral titles` : "AI key not configured — auto-collection runs WITHOUT AI (no content rejection); manual uploads need a key for their content check";
        const [run] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).values({
            trigger,
            istDate: ist,
            quotaBefore: done,
            aiProvider: aiNote
        }).returning();
        logs.push([
            "info",
            `Scan #${run.id} (${trigger}) — IST ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istFull"])(new Date())}. Coverage: ${done}/${dailyLimit} topics complete → ${remaining} topic${remaining === 1 ? "" : "s"} still need a video.`
        ]);
        logs.push([
            aiReady ? "ai" : "warn",
            `AI relevance gate: ${aiNote}.`
        ]);
        if (remaining === 0) {
            const doneMsg = dailyLimit === 0 ? "No topics are enabled — enable at least one topic to start collecting." : `All ${dailyLimit} enabled topic(s) complete — searching stopped until IST midnight.`;
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).set({
                status: "skipped",
                message: doneMsg,
                finishedAt: new Date()
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].id, run.id));
            logs.push([
                dailyLimit === 0 ? "warn" : "ok",
                doneMsg
            ]);
            await logMany(logs);
            await setSetting("lastScanAt", String(Date.now()));
            await setSetting("nextScanAt", String((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nextIstMidnight"])()));
            if (dailyLimit > 0) void maybeUploadToYouTube();
            return {
                status: "skipped",
                message: "Daily target met",
                downloaded: 0,
                duplicates: 0,
                failed: 0,
                eligible: 0,
                candidates: 0,
                remainingAfter: 0
            };
        }
        // ---- REAL public discovery -------------------------------------
        const topicRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].enabled, true)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].sortOrder));
        const allSeeds = topicRows.map((t)=>({
                ...t,
                keywords: t.keywords
            }));
        // A topic that already has today's approved video is DONE: never searched
        // again today. Discovery runs only for the topics still missing.
        const completedTopics = new Set((await todayStats(ist)).filter((row)=>row.n >= 1).map((row)=>row.topic));
        const seeds = allSeeds.filter((t)=>!completedTopics.has(t.slug));
        const pendingTopicNames = seeds.map((t)=>t.name.replace(/^Shri\s+/i, "")).join(", ");
        logs.push([
            "info",
            `Searching ${seeds.length} remaining topic${seeds.length === 1 ? "" : "s"}: ${pendingTopicNames || "none"}. ` + `${completedTopics.size} topic${completedTopics.size === 1 ? "" : "s"} already complete today and skipped.`
        ]);
        const scanIndexRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].istDate, ist));
        const scanIndex = scanIndexRows[0]?.n ?? 0;
        const discovery = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["discoverRealCandidates"])(seeds, scanIndex, {
            apifyToken: await getSetting("apifyToken", ""),
            cookiesBrowser: await getSetting("instagramCookiesBrowser", ""),
            sourceUrls: await getSetting("instagramSourceUrls", ""),
            minViews
        });
        const candidates = discovery.candidates;
        const st = discovery.stats;
        logs.push([
            "info",
            `Real discovery: ${discovery.detail}. No generated/demo URLs are used.`
        ]);
        logs.push([
            candidates.length > 0 ? "info" : "warn",
            `Discovery diagnostic: ${discovery.diagnostic}.`
        ]);
        if (st.inspected > 0) {
            const below = st.belowThreshold;
            const noMetric = st.noPublicMetric;
            logs.push([
                candidates.length > 0 ? "info" : "warn",
                `Inspected ${st.inspected} public Reel(s): ${st.eligible} above ${minViews.toLocaleString("en-IN")}, ` + `${below} found but below your threshold, ${noMetric} with no public metric (Instagram hides views — enable browser cookies in Discovery Setup for exact counts), ` + `${st.unavailable} private/unreachable.`
            ]);
            // Surface WHY nothing downloaded so the dashboard can explain + fix it.
            await setSetting("lastScanInsight", JSON.stringify({
                ...st,
                threshold: minViews,
                at: Date.now()
            }));
        }
        if (candidates.length === 0 && st.inspected > 0 && st.belowThreshold > 0 && st.eligible === 0) {
            logs.push([
                "warn",
                `Your ${minViews.toLocaleString("en-IN")}-view threshold is blocking every Reel found. Instagram rarely exposes view counts publicly — lower the threshold (Topics → Viral threshold) or enable browser cookies for exact counts.`
            ]);
        } else if (candidates.length === 0) {
            logs.push([
                "warn",
                "Discovery Bot found no eligible public Reel this pass. It auto-rotates keywords/sources and retries continuously. For maximum reliability add a free Apify token in 'Instagram Discovery Setup'."
            ]);
        }
        // The real adapter has already verified public metrics. Keep this hard
        // gate as defense-in-depth; unknown/low-view Reels can never enter.
        const eligible = candidates.filter((c)=>c.viewCount > minViews);
        logs.push([
            eligible.length > 0 ? "info" : "warn",
            eligible.length > 0 ? `Viral filter: ${eligible.length} public Reel(s) have a verified metric above ${minViews.toLocaleString("en-IN")}.` : `No public Reel above ${minViews.toLocaleString("en-IN")} views this pass. Nothing fake will be downloaded or counted.`
        ]);
        // ---- Permanent dedupe ------------------------------------------
        const fresh = [];
        let duplicates = 0;
        for (const c of eligible){
            const hit = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
                id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id
            }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].videoId} = ${c.videoId} OR ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].url} = ${c.url})`).limit(1);
            if (hit[0]) duplicates++;
            else fresh.push(c);
        }
        if (duplicates > 0) {
            logs.push([
                "warn",
                `Duplicate shield: skipped ${duplicates} already-cached real video(s) (ID/URL match).`
            ]);
        }
        logs.push([
            "info",
            `${fresh.length} fresh verified Reel(s) after dedupe — ranking by viral metric + topic diversity.`
        ]);
        // Strictly select the single highest-metric candidate for each topic that
        // is still missing today. No topic can appear twice in `selected`.
        const distribution = await todayStats(ist);
        const todayByTopic = new Map(distribution.map((d)=>[
                d.topic,
                d.n
            ]));
        const selected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["selectDiverse"])(fresh, remaining, todayByTopic);
        // ---- REAL MP4 download + AI gate (parallel across topics) -------
        let downloaded = 0;
        let failed = 0;
        const targetFolder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dailyDownloadFolder"])(ist);
        logs.push([
            "info",
            `Download folder: ${targetFolder}. Processing ${selected.length} topic(s) in parallel…`
        ]);
        const processCandidate = async (c)=>{
            // Skip if this topic was completed (possibly by a concurrent task).
            const alreadyDone = (await todayStats(ist)).some((row)=>row.topic === c.topicSlug && row.n >= 1);
            if (alreadyDone) return;
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloadRealVideo"])(c, ist);
            if (!result.ok || !result.filePath || !result.fileHash || !result.fileSize) {
                failed++;
                logs.push([
                    "error",
                    `FAILED ${c.videoId} (${c.topicSlug}): ${result.error}. Not counted.`
                ]);
                return;
            }
            // Hash dedupe — identical bytes already cached.
            const hashHit = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
                id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id
            }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].fileHash, result.fileHash)).limit(1);
            if (hashHit[0]) {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rm(result.filePath, {
                    force: true
                }).catch(()=>{});
                duplicates++;
                logs.push([
                    "warn",
                    `${c.videoId}: identical content already cached — removed.`
                ]);
                return;
            }
            // Perceptual duplicate guard (#12): same visual re-uploaded under a
            // different shortcode (survives re-encode) → delete and count as duplicate.
            const phash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$phash$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computePerceptualHash"])(result.filePath);
            if (phash) {
                const twins = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
                    videoId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].videoId,
                    phash: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].phash
                }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].phash} IS NOT NULL`).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id)).limit(400);
                const twin = twins.find((r)=>r.videoId !== c.videoId && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$phash$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isVisuallySimilar"])(phash, r.phash));
                if (twin) {
                    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rm(result.filePath, {
                        force: true
                    }).catch(()=>{});
                    duplicates++;
                    logs.push([
                        "warn",
                        `${c.videoId} is visually identical to ${twin.videoId} (perceptual hash) — removed, never uploaded twice.`
                    ]);
                    return;
                }
            }
            // No content rejection for auto-collection (user directive): whatever
            // topic-scoped discovery found — after threshold + dedupe — is trusted.
            // The same strategy/title/playlist/channel-check pipeline as manual runs
            // at upload time (uploadPendingBatch → uploadOne).
            const topic = seeds.find((t)=>t.id === c.topicId);
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).values({
                    videoId: c.videoId,
                    url: c.url,
                    topicId: c.topicId,
                    caption: c.caption,
                    author: c.author,
                    viewCount: c.viewCount,
                    likeCount: c.likeCount,
                    metricSource: c.metricSource,
                    aiVerdict: "match",
                    aiProvider: null,
                    aiConfidence: null,
                    aiDetectedTopic: null,
                    aiReason: null,
                    phash,
                    status: "completed",
                    istDate: ist,
                    filePath: result.filePath,
                    fileName: result.fileName,
                    fileHash: result.fileHash,
                    fileSize: result.fileSize,
                    scanRunId: run.id,
                    downloadedAt: new Date()
                });
                downloaded++;
                logs.push([
                    "ok",
                    `SAVED ${topic.name.replace(/^Shri\s+/i, "")}: ${result.fileName} — ${(result.fileSize / 1_048_576).toFixed(1)} MB, ${c.eligibilityProof}. Trusted by topic search — queued for peak-time upload.`
                ]);
            } catch  {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].rm(result.filePath, {
                    force: true
                }).catch(()=>{});
                duplicates++;
                logs.push([
                    "warn",
                    `${c.videoId} raced into cache — second copy removed.`
                ]);
            }
        };
        // Bounded parallel pool — each selected candidate is a distinct topic, so
        // running them together is safe and dramatically faster than one-by-one.
        const concurrency = Math.min(4, selected.length);
        let cursor = 0;
        await Promise.all(Array.from({
            length: Math.max(1, concurrency)
        }, async ()=>{
            while(cursor < selected.length){
                const c = selected[cursor++];
                try {
                    await processCandidate(c);
                } catch (e) {
                    logs.push([
                        "error",
                        `Unexpected error on ${c.videoId}: ${e instanceof Error ? e.message : String(e)}`
                    ]);
                }
            }
        }));
        const after = await todayCompleted(ist);
        const remainingAfter = Math.max(0, dailyLimit - after);
        const message = remainingAfter === 0 ? `All ${dailyLimit} enabled topic(s) complete (${after}/${dailyLimit}). Searching stops until IST midnight.` : downloaded === 0 ? `No approved video found for the remaining ${remainingAfter} topic(s) this scan — will keep searching only those topics.` : `Added ${downloaded} topic video(s). ${remainingAfter} topic(s) still need a video.`;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).set({
            status: "finished",
            finishedAt: new Date(),
            candidates: candidates.length,
            eligible: eligible.length,
            fresh: fresh.length,
            downloaded,
            duplicates,
            failed,
            message
        }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].id, run.id));
        logs.push([
            remainingAfter === 0 ? "ok" : "info",
            message
        ]);
        // Continuous mode: while topics remain, keep searching back-to-back (a short
        // breather keeps discovery sources polite). Only when all topics are
        // collected do we rest until the IST midnight reset.
        const nextAt = remainingAfter === 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nextIstMidnight"])() : Date.now() + 8_000;
        await setSetting("lastScanAt", String(Date.now()));
        await setSetting("nextScanAt", String(nextAt));
        logs.push([
            "info",
            remainingAfter === 0 ? `All topics collected. Resting until IST midnight — permanent cache retained.` : `Continuing to search the ${remainingAfter} remaining topic(s)…`
        ]);
        await logMany(logs);
        // The daily collection is complete → publish to YouTube (15-min schedule).
        if (remainingAfter === 0) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notifyAsync"])(`Daily collection complete: ${after}/${dailyLimit} topics have today's approved video. Uploading to YouTube now.`);
            void maybeUploadToYouTube();
        }
        return {
            status: "finished",
            message,
            downloaded,
            duplicates,
            failed,
            eligible: eligible.length,
            candidates: candidates.length,
            remainingAfter
        };
    } finally{
        inProcessScan = false;
    }
}
/* ------------------------------------------------------------------ */ /* YouTube publishing (runs only after the full daily collection)       */ /* ------------------------------------------------------------------ */ /**
 * Publishes today's approved videos to YouTube once the whole daily
 * collection is complete. Fire-and-forget: never blocks or fails a scan.
 */ async function maybeUploadToYouTube() {
    try {
        const { uploadPendingBatch, youtubeStatus } = await __turbopack_context__.A("[project]/src/lib/youtube.ts [app-route] (ecmascript, async loader)");
        const st = await youtubeStatus();
        if (!st.enabled || !st.connected) return;
        const result = await uploadPendingBatch();
        if (result.uploaded > 0 || result.failed > 0) {
            await log("info", `YouTube batch: ${result.uploaded} uploaded (public in 15 min), ${result.failed} failed.`);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notifyAsync"])(`YouTube: ${result.uploaded} video(s) uploaded and scheduled${result.failed ? `, ${result.failed} failed` : ""}.`);
        }
    } catch (e) {
        console.error("[YouTube] upload batch failed:", e);
    }
}
async function startEngine() {
    await ensureSeeded();
    await setSetting("engineRunning", "true");
    await setSetting("nextScanAt", "0"); // immediately due → catch-up logic runs it
    await log("ok", "Engine STARTED — searching continuously until all 7 topics have an approved video today (Asia/Kolkata).");
}
async function stopEngine() {
    await setSetting("engineRunning", "false");
    await setSetting("nextScanAt", "0");
    await log("warn", "Engine STOPPED by user. No scans or downloads will run until restarted.");
}
async function tickScheduler() {
    await ensureSeeded();
    const running = await getSetting("engineRunning", "true") === "true";
    if (!running) return false;
    // Analytics loop (#4): collect +1h/+6h/+24h stats every ~30 min (cheap:
    // one videos.list call per batch) and keep trending tags fresh daily.
    try {
        const nextStatsAt = Number(await getSetting("nextStatsAt", "0"));
        if (Date.now() >= nextStatsAt) {
            await setSetting("nextStatsAt", String(Date.now() + 30 * 60_000));
            const { collectVideoStats, getTrendingTags: _unused } = {
                collectVideoStats: undefined,
                getTrendingTags: undefined
            };
            void collectVideoStatsSafe();
            void refreshTrendingSafe();
        }
        // Nightly backup of the permanent cache (#25) — JSON snapshot, keep 7 days.
        const lastBackup = await getSetting("lastBackupAt", "");
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])() !== lastBackup) {
            await setSetting("lastBackupAt", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])());
            void runNightlyBackup();
        }
    } catch  {
    /* analytics never blocks scheduling */ }
    const nextAt = Number(await getSetting("nextScanAt", "0"));
    const ist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
    const done = await todayCompleted(ist);
    const dailyLimit = await getDailyLimit();
    if (dailyLimit > 0 && done >= dailyLimit) {
        // Target met: make sure we only wake again after IST midnight.
        if (nextAt < (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nextIstMidnight"])() - 60_000 || nextAt === 0) {
            await setSetting("nextScanAt", String((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nextIstMidnight"])()));
        }
        // Retries any pending/failed YouTube uploads from earlier today.
        void maybeUploadToYouTube();
        return false;
    }
    if (nextAt === 0 || Date.now() >= nextAt) {
        const outcome = await runScan("scheduled");
        return outcome.status !== "busy";
    }
    return false;
}
/** Nightly JSON snapshot of the permanent cache (downloads + manual queue). */ async function runNightlyBackup() {
    try {
        const fs = await __turbopack_context__.A("[externals]/node:fs [external] (node:fs, cjs, async loader)");
        const path = await __turbopack_context__.A("[externals]/node:path [external] (node:path, cjs, async loader)");
        const [dl, man] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"])
        ]);
        const dir = path.join(process.cwd(), ".backups");
        fs.mkdirSync(dir, {
            recursive: true
        });
        const file = path.join(dir, `viraldarshan-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])()}.json`);
        fs.writeFileSync(file, JSON.stringify({
            at: new Date().toISOString(),
            downloads: dl,
            manual: man
        }, null, 1));
        // keep only the 7 newest backups
        const files = fs.readdirSync(dir).filter((f)=>f.startsWith("viraldarshan-")).sort();
        for (const old of files.slice(0, Math.max(0, files.length - 7))){
            fs.rmSync(path.join(dir, old), {
                force: true
            });
        }
        await log("info", `Backup created: .backups/${path.basename(file)} (${dl.length + man.length} records).`);
    } catch (e) {
        console.error("[Backup]", e);
    }
}
async function notifyQuotaOnce(message) {
    try {
        const key = "quotaNotifiedOn";
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
        if (await getSetting(key, "") === today) return;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setSetting"])(key, today);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notify$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notifyAsync"])(message);
    } catch  {
    /* ignore */ }
}
async function collectVideoStatsSafe() {
    try {
        const { collectVideoStats } = await __turbopack_context__.A("[project]/src/lib/youtube-stats.ts [app-route] (ecmascript, async loader)");
        const n = await collectVideoStats();
        if (n > 0) await log("ai", `Analytics: stored ${n} performance checkpoint(s) from YouTube.`);
    } catch (e) {
        console.error("[Analytics]", e);
    }
}
async function refreshTrendingSafe() {
    try {
        const { getTrendingTags } = await __turbopack_context__.A("[project]/src/lib/youtube.ts [app-route] (ecmascript, async loader)");
        await getTrendingTags();
    } catch  {
    /* trending refresh is best-effort */ }
}
async function getStatus() {
    await ensureSeeded();
    await purgeLegacyPlaceholders();
    const ist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
    const dailyLimit = await getDailyLimit();
    const minViews = await getMinViews();
    const yesterday = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istYesterdayDate"])();
    const [runRowsDone] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status, "completed"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].aiVerdict, "match")));
    const perTopic = await todayStats(ist);
    const yesterdayCount = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, yesterday), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status, "completed"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].aiVerdict, "match"))))[0]?.n ?? 0;
    const dupToday = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`coalesce(sum(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].duplicates}),0)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].istDate, ist)))[0]?.n ?? 0;
    const failToday = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`coalesce(sum(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].failed}),0)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].istDate, ist)))[0]?.n ?? 0;
    const aiRejectedToday = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, ist), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status, "ai_rejected"))))[0]?.n ?? 0;
    const aiPending = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status, "completed"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].aiVerdict, "pending"))))[0]?.n ?? 0;
    const viewsToday = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`coalesce(sum(${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].viewCount}),0)::bigint`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, ist), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status, "completed"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].aiVerdict, "match"))))[0]?.n ?? 0;
    const topicRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"]).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].sortOrder));
    const providerRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].id));
    const logRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"]).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"].id)).limit(60);
    const lastRun = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"]).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scanRuns"].id)).limit(1))[0];
    const done = await todayCompleted(ist);
    const running = await getSetting("engineRunning", "true") === "true";
    const nextScanAt = Number(await getSetting("nextScanAt", "0"));
    const lastScanAt = Number(await getSetting("lastScanAt", "0"));
    let scanInsight = null;
    try {
        const raw = await getSetting("lastScanInsight", "");
        if (raw) scanInsight = JSON.parse(raw);
    } catch  {
        scanInsight = null;
    }
    const perTopicMap = new Map(perTopic.map((p)=>[
            p.topic,
            p
        ]));
    let quota = null;
    let insights = null;
    try {
        const stats = await __turbopack_context__.A("[project]/src/lib/youtube-stats.ts [app-route] (ecmascript, async loader)");
        quota = await stats.quotaSnapshot();
        insights = await stats.getInsights();
    } catch  {
        quota = null;
        insights = null;
    }
    return {
        istNow: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istFull"])(new Date()),
        istDate: ist,
        engineRunning: running,
        dailyLimit,
        minViews,
        today: {
            count: done,
            remaining: Math.max(0, dailyLimit - done),
            duplicatesSkipped: dupToday,
            failed: failToday,
            aiRejected: aiRejectedToday,
            aiPending,
            viewsTotal: Number(viewsToday),
            byTopic: topicRows.map((t)=>({
                    slug: t.slug,
                    name: t.name,
                    hindiName: t.hindiName,
                    folder: t.folder,
                    enabled: t.enabled,
                    keywords: t.keywords,
                    count: perTopicMap.get(t.slug)?.n ?? 0,
                    views: Number(perTopicMap.get(t.slug)?.views ?? 0)
                }))
        },
        yesterday: {
            date: yesterday,
            count: yesterdayCount
        },
        lifetime: {
            downloaded: runRowsDone.n
        },
        lastScanAt,
        nextScanAt,
        lastRun: lastRun ?? null,
        scanInsight,
        quota,
        insights,
        // Exclude the heavy base64 reference image from the frequent status poll;
        // expose only a boolean flag. The image is fetched on demand via its route.
        topics: topicRows.map(({ referenceImage, ...t })=>({
                ...t,
                referenceImageSet: Boolean(referenceImage)
            })),
        providers: providerRows.map((p)=>({
                ...p,
                apiKey: undefined,
                keySet: Boolean(p.apiKey),
                keyPreview: p.apiKey ? `••••••••${p.apiKey.slice(-4)}` : null
            })),
        logs: logRows.reverse().map((l)=>({
                id: l.id,
                ts: l.ts,
                level: l.level,
                message: l.message
            })),
        downloadRoot: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dailyDownloadFolder"])(ist)
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/instagram-real.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "dailyDownloadFolder",
    ()=>dailyDownloadFolder,
    "discoverRealCandidates",
    ()=>discoverRealCandidates,
    "downloadRealVideo",
    ()=>downloadRealVideo,
    "fetchReelMetadata",
    ()=>fetchReelMetadata,
    "topicFor",
    ()=>topicFor
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:os [external] (node:os, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$youtube$2d$dl$2d$exec__$5b$external$5d$__$28$youtube$2d$dl$2d$exec$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$youtube$2d$dl$2d$exec$29$__ = __turbopack_context__.i("[externals]/youtube-dl-exec [external] (youtube-dl-exec, cjs, [project]/node_modules/youtube-dl-exec)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reels.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
async function loadSourceStats() {
    try {
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key, "sourceStats")).limit(1);
        return rows[0]?.value ? JSON.parse(rows[0].value) : {};
    } catch  {
        return {};
    }
}
async function saveSourceStats(stats) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).values({
            key: "sourceStats",
            value: JSON.stringify(stats)
        }).onConflictDoUpdate({
            target: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key,
            set: {
                value: JSON.stringify(stats)
            }
        });
    } catch  {
    /* stats are best-effort */ }
}
/** Orders sources by historical yield (best first) and drops dead/cooldown ones. */ function rankSources(sources, stats) {
    const score = (label)=>{
        const st = stats[label];
        if (!st) return 1; // untested sources get a chance
        if (st.attempts >= 8 && st.found === 0) return -1; // persistently dead
        if (st.cooldownUntil > Date.now()) return -1; // backing off after 429
        return st.found + st.ok * 0.5;
    };
    return [
        ...sources
    ].sort((a, b)=>score(b.label) - score(a.label));
}
const CURATED_PUBLIC_PROFILES = {
    "banke-bihari-ji": [
        "banke_bihari_mandir_official",
        "bankebiharimandirofficial",
        "vrindavan.reels",
        "vrindavan_bankebihari"
    ],
    "radha-vallabh-ji": [
        "shrihitradhavallabhmandir",
        "shrihitradhavallabhlal",
        "shriradhavallabhmandir"
    ],
    "radha-raman-ji": [
        "office_radharaman",
        "shri_radharaman_lal_ju",
        "radharamanji.temple"
    ],
    "radha-govind-dev-ji": [
        "govind_dev_ji_temple",
        "govind_dev_ji_",
        "govinddevji_daily_darshan"
    ],
    "premanand-ji-maharaj": [
        "premanand__maharaj_official",
        "premanandji_.maharaj_official",
        "premanand_ji_maharaj_121"
    ],
    "indresh-ji-maharaj": [
        "bhaktipath"
    ],
    "vinod-baba-ji": []
};
function canonical(raw) {
    const decoded = decodeURIComponent(raw.replace(/&amp;/g, "&"));
    const m = decoded.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
    if (!m) return null;
    return {
        id: m[1],
        url: `https://www.instagram.com/reel/${m[1]}/`
    };
}
function topicFor(text, topics) {
    const hay = text.toLocaleLowerCase();
    let best = null;
    for (const t of topics){
        let score = 0;
        for (const kw of t.keywords){
            const k = kw.replace(/^#/, "").toLocaleLowerCase().trim();
            if (k.length >= 3 && hay.includes(k)) score += k.length;
        }
        // Search source already scoped this URL to a topic, so slug/name tokens
        // are useful extra signals without claiming AI certainty.
        for (const token of t.name.toLocaleLowerCase().split(/\s+/)){
            if (token.length > 3 && hay.includes(token)) score += token.length;
        }
        if (score > (best?.score ?? 0)) best = {
            t,
            score
        };
    }
    return best?.score ? best.t : null;
}
function metric(exactViews, plays, likes, threshold) {
    if (exactViews > threshold) {
        return {
            viewCount: exactViews,
            metricSource: "views",
            eligibilityProof: `${exactViews.toLocaleString("en-IN")} public views`
        };
    }
    if (plays > threshold) {
        return {
            viewCount: plays,
            metricSource: "plays",
            eligibilityProof: `${plays.toLocaleString("en-IN")} public plays`
        };
    }
    // Instagram often hides exact views from logged-out public metadata while
    // still exposing likes. Likes above the threshold are a conservative proof of
    // reach; we label it explicitly rather than pretending it is an exact count.
    if (likes > threshold) {
        return {
            viewCount: likes,
            metricSource: "likes-lower-bound",
            eligibilityProof: `at least ${likes.toLocaleString("en-IN")} public likes (exact plays unavailable)`
        };
    }
    return null;
}
async function discoverApify(topics, configuredToken, threshold) {
    const token = configuredToken?.trim() || process.env.APIFY_TOKEN?.trim();
    if (!token) return [];
    const directUrls = topics.flatMap((t)=>[
            ...(CURATED_PUBLIC_PROFILES[t.slug] ?? []).slice(0, 1).map((username)=>`https://www.instagram.com/${username}/`),
            ...t.keywords.filter((k)=>/^[#A-Za-z][A-Za-z0-9 #_-]{2,40}$/.test(k)).slice(0, 1).map((k)=>`https://www.instagram.com/explore/tags/${k.replace(/^#/, "").replace(/[^A-Za-z0-9_]/g, "")}/`)
        ]);
    try {
        const endpoint = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&timeout=180`;
        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                directUrls,
                resultsType: "posts",
                resultsLimit: 6,
                searchType: "hashtag",
                searchLimit: 7
            }),
            signal: AbortSignal.timeout(190_000)
        });
        if (!res.ok) return [];
        const items = await res.json();
        const out = [];
        for (const x of items){
            const isVideo = Boolean(x.videoUrl || x.productType?.toLowerCase() === "clips" || x.type?.toLowerCase() === "video");
            if (!isVideo) continue;
            const c = canonical(x.url ?? "");
            if (!c) continue;
            const caption = x.caption ?? "";
            const inputHint = x.inputUrl ?? "";
            const profileTopic = topics.find((t)=>(CURATED_PUBLIC_PROFILES[t.slug] ?? []).some((u)=>inputHint.includes(`/${u}/`)));
            const topic = topicFor(`${caption} ${inputHint} ${x.ownerUsername ?? ""}`, topics) ?? profileTopic;
            if (!topic) continue;
            const likes = Number(x.likesCount ?? x.likeCount ?? 0);
            const proof = metric(Number(x.videoViewCount ?? x.viewCount ?? 0), Number(x.videoPlayCount ?? x.playCount ?? 0), likes, threshold);
            if (!proof) continue;
            out.push({
                ...proof,
                videoId: x.shortCode ?? x.shortcode ?? c.id,
                url: c.url,
                topicSlug: topic.slug,
                topicId: topic.id,
                caption,
                author: `@${x.ownerUsername ?? x.authorUsername ?? "unknown"}`,
                likeCount: likes,
                publishedAgoHrs: 0,
                directMediaUrl: x.videoUrl,
                source: "apify"
            });
        }
        return out;
    } catch  {
        return [];
    }
}
function configuredUrls(extra) {
    const lines = [];
    if (extra) lines.push(...extra.split(/[\n,]+/));
    if (process.env.INSTAGRAM_REEL_URLS) {
        lines.push(...process.env.INSTAGRAM_REEL_URLS.split(/[\n,]+/));
    }
    const file = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "instagram-reels.txt");
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].existsSync(file)) lines.push(...__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].readFileSync(file, "utf8").split(/\r?\n/));
    return lines.map((line)=>line.trim()).filter((line)=>line && !line.startsWith("#")).map((line)=>{
        const [url, topicSlug, views] = line.split("|").map((x)=>x.trim());
        return {
            url,
            topicSlug: topicSlug || undefined,
            declaredViews: Number(views) || undefined
        };
    });
}
/** Parses "2.4M views", "13,536 views", "1.2 lakh views" from nearby text. */ function parseViewHint(ctx) {
    const patterns = [
        /([\d][\d.,]*)\s*([kKmM])?\s*(?:views?|plays?|lakh|crore)/i,
        /(?:views?|plays?)\s*[:\-]?\s*([\d][\d.,]*)\s*([kKmM])?/i
    ];
    for (const re of patterns){
        const m = ctx.match(re);
        if (!m) continue;
        const raw = m[1].replace(/,/g, "");
        const n = Number(raw);
        if (!Number.isFinite(n) || n <= 0) continue;
        const suffix = (m[2] ?? "").toLowerCase();
        const value = suffix === "k" ? n * 1_000 : suffix === "m" ? n * 1_000_000 : n;
        // "lakh"/"crore" bare-number cases: 1 lakh = 100k, 1 crore = 10M
        if (/lakh/i.test(m[0]) && !suffix) return n * 100_000;
        if (/crore/i.test(m[0]) && !suffix) return n * 10_000_000;
        if (value >= 1_000) return Math.round(value);
    }
    return undefined;
}
function extractIndexedReels(body) {
    // Decode percent-encoding (incl. double-encoding) so reel URLs hidden inside
    // search-engine redirect links (e.g. DuckDuckGo's uddg=...) are recovered.
    let decoded = body;
    for(let i = 0; i < 2; i++){
        try {
            decoded += "\n" + decodeURIComponent(decoded.replace(/%25/g, "%"));
        } catch  {
            break;
        }
    }
    const seen = new Set();
    const out = [];
    for (const m of decoded.matchAll(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]{5,})/gi)){
        if (seen.has(m[1])) continue;
        seen.add(m[1]);
        const ctx = decoded.slice(Math.max(0, (m.index ?? 0) - 250), (m.index ?? 0) + 350);
        out.push({
            url: `https://www.instagram.com/reel/${m[1]}/`,
            views: parseViewHint(ctx)
        });
    }
    return out;
}
const DISCOVERY_SOURCES = [
    {
        label: "proxy·duckduckgo",
        build: (q)=>({
                url: `https://r.jina.ai/https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`
            })
    },
    {
        label: "proxy·bing",
        build: (q)=>({
                url: `https://r.jina.ai/https://www.bing.com/search?q=${encodeURIComponent(q)}`
            })
    },
    {
        label: "proxy·google",
        build: (q)=>({
                url: `https://r.jina.ai/https://www.google.com/search?num=20&q=${encodeURIComponent(q)}`
            })
    },
    {
        label: "direct·bing-rss",
        build: (q)=>({
                url: `https://www.bing.com/search?format=rss&q=${encodeURIComponent(q)}`,
                init: {
                    headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
                        "accept-language": "en-IN,en;q=0.9,hi;q=0.7"
                    }
                }
            })
    },
    {
        label: "direct·duckduckgo",
        build: (q)=>({
                url: `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
                init: {
                    method: "POST",
                    headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    body: `q=${encodeURIComponent(q)}`
                }
            })
    }
];
/**
 * Global single-flight throttle for the reader proxy (r.jina.ai).
 * The free tier rate-limits hard — 21 simultaneous hashtag fetches all came
 * back 0/ok. One at a time + a short pause keeps every request under the
 * limit, and direct (non-proxy) sources are never throttled.
 */ let jinaBusy = false;
const jinaWaiters = [];
async function withJinaSlot(fn) {
    while(jinaBusy)await new Promise((r)=>jinaWaiters.push(r));
    jinaBusy = true;
    try {
        await new Promise((r)=>setTimeout(r, 3_000)); // stay under the free proxy rate limit (~20/min)
        return await fn();
    } finally{
        jinaBusy = false;
        jinaWaiters.shift()?.();
    }
}
async function fetchText(url, timeoutMs, init) {
    const run = async ()=>{
        const res = await fetch(url, {
            ...init,
            signal: AbortSignal.timeout(timeoutMs)
        });
        return {
            ok: res.ok,
            body: res.ok ? await res.text() : "",
            status: res.status
        };
    };
    return url.includes("r.jina.ai") ? withJinaSlot(run) : run();
}
async function fetchSourceReels(source, query) {
    try {
        const { url, init } = source.build(query);
        const { ok, body, status } = await fetchText(url, 18_000, init);
        if (!ok) return {
            urls: [],
            ok: false,
            rateLimited: status === 429
        };
        return {
            urls: extractIndexedReels(body),
            ok: true,
            rateLimited: false
        };
    } catch  {
        return {
            urls: [],
            ok: false,
            rateLimited: false
        };
    }
}
/**
 * FREE Apify replacement: Instagram's own public hashtag pages, fetched via
 * the neutral reader proxy (r.jina.ai) so the local network block never
 * applies. No API key, no cost — returns ~12 real Reel URLs per hashtag.
 */ // Instagram intermittently login-walls hashtag pages (redirects to
// /accounts/login/). When that happens we probe ONCE per scan and skip the
// rest so a dead source can never stall the discovery pipeline.
let igTagLoginWalled = false;
async function fetchIgTagReels(topic) {
    if (igTagLoginWalled) return [];
    // Collect up to 3 distinct hashtags for this topic (explicit #tags first,
    // then normalized English keywords) — more tag pages = far more free reels.
    const tags = [];
    const push = (raw)=>{
        const clean = raw?.replace(/^#/, "").replace(/[^A-Za-z0-9_]/g, "");
        if (clean && clean.length >= 3 && !tags.includes(clean)) tags.push(clean);
    };
    for (const k of topic.keywords){
        if (k.startsWith("#")) push(k);
        if (tags.length >= 3) break;
    }
    for (const k of topic.keywords){
        if (/^[A-Za-z][A-Za-z0-9 ]{2,30}$/.test(k)) push(k.replace(/\s+/g, ""));
        if (tags.length >= 3) break;
    }
    // Sequential with early-stop: one good tag page (≈12 reels) ends the loop,
    // so a healthy topic costs exactly ONE proxy request instead of three.
    const merged = [];
    const seen = new Set();
    for (const tag of tags.slice(0, 3)){
        if (merged.length >= 8) break;
        try {
            const { ok, body } = await fetchText(`https://r.jina.ai/https://www.instagram.com/explore/tags/${tag}/`, 25_000, {
                headers: {
                    "user-agent": "Mozilla/5.0"
                }
            });
            if (!ok) continue;
            if (body.includes("/accounts/login/")) {
                // Login wall → stop probing tag pages for this whole scan.
                igTagLoginWalled = true;
                break;
            }
            for (const item of extractIndexedReels(body).slice(0, 10)){
                if (seen.has(item.url)) continue;
                seen.add(item.url);
                merged.push(item);
            }
        } catch  {
        /* next tag */ }
    }
    return merged;
}
async function searchUrls(topics, scanIndex) {
    const found = new Map();
    const sourceHits = {};
    const sourceOk = {};
    // View hints parsed from search snippets — gives the threshold a real number
    // when Instagram itself hides view counts.
    const viewsBy = new Map();
    const take = (item, t, source)=>{
        if (found.has(item.url)) return false;
        found.set(item.url, t);
        if (item.views && item.views > (viewsBy.get(item.url) ?? 0)) viewsBy.set(item.url, item.views);
        sourceHits[source] = (sourceHits[source] ?? 0) + 1;
        return true;
    };
    // Re-probe the hashtag source once per scan (it may un-block).
    igTagLoginWalled = false;
    // Search every topic in PARALLEL (each topic is independent).
    await Promise.all(topics.map(async (t)=>{
        let topicFound = 0;
        // 1) FREE primary source: Instagram's own hashtag page via reader proxy.
        const tagUrls = await fetchIgTagReels(t);
        if (tagUrls.length > 0) sourceOk["ig-tag"] = (sourceOk["ig-tag"] ?? 0) + 1;
        for (const item of tagUrls){
            if (topicFound >= 8) break;
            if (take(item, t, "ig-tag")) topicFound++;
        }
        // 2) Free fallback: search-engine indexes (also via reader proxy).
        if (topicFound < 6) {
            // Rotate through ALL keywords — Hindi phrases included, which surface
            // a different (often richer) slice of Instagram than English-only.
            const pool = t.keywords.filter((k)=>k.length >= 3);
            const rotated = pool[scanIndex % Math.max(1, pool.length)] ?? t.name;
            const phrase = rotated.replace(/^#/, "") || t.name.replace(/^Shri /, "");
            const query = `site:instagram.com/reel/ "${phrase}"`;
            // Adaptive order: best-yield sources first, dead/cooling ones skipped.
            const stats = await loadSourceStats();
            const ordered = rankSources(DISCOVERY_SOURCES, stats).filter((src)=>{
                const st = stats[src.label];
                if (!st) return true;
                if (st.attempts >= 8 && st.found === 0) return false; // persistently dead
                if (st.cooldownUntil > Date.now()) return false; // rate-limit backoff
                return true;
            });
            const results = await Promise.all(ordered.map(async (source)=>{
                const r = await fetchSourceReels(source, query);
                const st = stats[source.label] ?? {
                    found: 0,
                    ok: 0,
                    attempts: 0,
                    cooldownUntil: 0
                };
                st.attempts++;
                if (r.ok) {
                    st.ok++;
                    sourceOk[source.label] = (sourceOk[source.label] ?? 0) + 1;
                }
                // Exponential-ish backoff on rate limits (#23): 10 → 30 → 90 min.
                if (r.rateLimited) {
                    st.cooldownUntil = Date.now() + Math.min(90 * 60_000, (st.attempts % 3 === 1 ? 10 : st.attempts % 3 === 2 ? 30 : 90) * 60_000);
                }
                stats[source.label] = st;
                return {
                    label: source.label,
                    ...r
                };
            }));
            void saveSourceStats(stats);
            for (const { label, urls } of results){
                for (const item of urls.slice(0, 8)){
                    if (topicFound >= 8) break;
                    if (take(item, t, label)) topicFound++;
                }
            }
        }
    }));
    const parts = [
        `ig-tag:${sourceHits["ig-tag"] ?? 0}url/${sourceOk["ig-tag"] ?? 0}ok`,
        ...DISCOVERY_SOURCES.map((s)=>`${s.label}:${sourceHits[s.label] ?? 0}url/${sourceOk[s.label] ?? 0}ok`)
    ];
    const hinted = [
        ...viewsBy.values()
    ].filter((v)=>v > 0).length;
    return {
        found,
        viewsBy,
        diagnostic: `Discovery Bot found ${found.size} URL(s)${hinted ? `, ${hinted} with view hints` : ""} — ${parts.join(", ")}`
    };
}
function cookiesFlag(configured) {
    const browser = configured?.trim() || process.env.INSTAGRAM_COOKIES_FROM_BROWSER?.trim();
    return browser && browser !== "none" ? browser : undefined;
}
async function inspectUrl(rawUrl, hint, topics, threshold, declaredViews, source = "public-search", configuredBrowser, stats) {
    const c = canonical(rawUrl);
    if (!c) {
        if (stats) stats.unavailable++;
        return null;
    }
    if (stats) stats.inspected++;
    try {
        const meta = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$youtube$2d$dl$2d$exec__$5b$external$5d$__$28$youtube$2d$dl$2d$exec$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$youtube$2d$dl$2d$exec$29$__["default"])(c.url, {
            dumpSingleJson: true,
            skipDownload: true,
            noWarnings: true,
            noPlaylist: true,
            cookiesFromBrowser: cookiesFlag(configuredBrowser),
            socketTimeout: 12,
            retries: 1
        });
        const caption = String(meta.description ?? meta.title ?? "").slice(0, 1500);
        const author = String(meta.uploader_id ?? meta.uploader ?? "unknown");
        const topic = topicFor(`${caption} ${author}`, topics) ?? hint;
        if (!topic) {
            if (stats) stats.unavailable++;
            return null;
        }
        const likes = Number(meta.like_count ?? 0);
        const rawViews = Number(meta.view_count ?? 0);
        if (rawViews > 0 && stats) stats.exactViews++;
        const exactViews = Number(meta.view_count ?? declaredViews ?? 0);
        const proof = metric(exactViews, 0, likes, threshold);
        if (!proof) {
            if (stats) {
                if (exactViews <= 0 && likes <= 0) stats.noPublicMetric++;
                else stats.belowThreshold++;
            }
            return null;
        }
        if (stats) stats.eligible++;
        return {
            ...proof,
            videoId: String(meta.id ?? c.id),
            url: c.url,
            topicSlug: topic.slug,
            topicId: topic.id,
            caption,
            author: author.startsWith("@") ? author : `@${author}`,
            likeCount: likes,
            publishedAgoHrs: 0,
            source,
            cookiesBrowser: cookiesFlag(configuredBrowser)
        };
    } catch  {
        if (stats) stats.unavailable++;
        return null; // private, unavailable, rate limited or login required
    }
}
async function mapLimited(items, concurrency, fn) {
    const out = new Array(items.length);
    let cursor = 0;
    async function worker() {
        while(true){
            const i = cursor++;
            if (i >= items.length) return;
            out[i] = await fn(items[i]);
        }
    }
    await Promise.all(Array.from({
        length: Math.min(concurrency, items.length)
    }, worker));
    return out;
}
async function discoverRealCandidates(topics, scanIndex, options = {}) {
    const byId = new Map();
    const threshold = options.minViews ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MIN_VIEWS"];
    const stats = {
        inspected: 0,
        eligible: 0,
        belowThreshold: 0,
        noPublicMetric: 0,
        unavailable: 0,
        exactViews: 0
    };
    const fromApify = await discoverApify(topics, options.apifyToken, threshold);
    for (const c of fromApify)byId.set(c.videoId, c);
    const configured = configuredUrls(options.sourceUrls);
    const configuredInspected = await mapLimited(configured, 6, async (x)=>{
        const hint = topics.find((t)=>t.slug === x.topicSlug) ?? null;
        return inspectUrl(x.url, hint, topics, threshold, x.declaredViews, "source-list", options.cookiesBrowser, stats);
    });
    for (const c of configuredInspected)if (c) byId.set(c.videoId, c);
    let searchDiagnostic = "public search not needed";
    if (byId.size < 18) {
        const searched = await searchUrls(topics, scanIndex);
        searchDiagnostic = searched.diagnostic;
        // Cap how many candidates per topic we inspect (we only need 1 each),
        // which keeps the slow yt-dlp metadata step short.
        const perTopicCount = new Map();
        const toInspect = [];
        for (const [url, hint] of searched.found.entries()){
            const n = perTopicCount.get(hint.slug) ?? 0;
            if (n >= 8) continue;
            perTopicCount.set(hint.slug, n + 1);
            toInspect.push([
                url,
                hint,
                searched.viewsBy.get(url)
            ]);
        }
        const inspected = await mapLimited(toInspect, 8, ([url, hint, views])=>inspectUrl(url, hint, topics, threshold, views, "public-search", options.cookiesBrowser, stats));
        for (const c of inspected)if (c) byId.set(c.videoId, c);
    }
    const candidates = [
        ...byId.values()
    ].sort((a, b)=>b.viewCount - a.viewCount);
    const sourceCount = configuredInspected.filter(Boolean).length;
    const publicCount = candidates.filter((c)=>c.source === "public-search").length;
    return {
        candidates,
        detail: `${fromApify.length} from Apify, ${sourceCount} from source list, ${publicCount} from public search`,
        diagnostic: `${searchDiagnostic}; Apify ${options.apifyToken || process.env.APIFY_TOKEN ? "configured" : "not configured"}; browser session ${cookiesFlag(options.cookiesBrowser) ?? "not configured"}`,
        stats
    };
}
async function fetchReelMetadata(url) {
    try {
        const meta = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$youtube$2d$dl$2d$exec__$5b$external$5d$__$28$youtube$2d$dl$2d$exec$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$youtube$2d$dl$2d$exec$29$__["default"])(url, {
            dumpSingleJson: true,
            skipDownload: true,
            noWarnings: true,
            noPlaylist: true,
            socketTimeout: 15,
            retries: 1
        });
        return {
            title: String(meta.title ?? "").slice(0, 300),
            description: String(meta.description ?? meta.title ?? "").slice(0, 1500),
            author: String(meta.uploader_id ?? meta.uploader ?? "unknown"),
            views: Number(meta.view_count ?? 0),
            likes: Number(meta.like_count ?? 0),
            durationSec: Number(meta.duration ?? 0)
        };
    } catch  {
        return null;
    }
}
function dailyDownloadFolder(istDate) {
    const home = process.env.USERPROFILE || __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__["default"].homedir();
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(home, "Downloads", "Instagram_Viral_Videos", istDate);
}
function safeTitle(s) {
    return s.normalize("NFKD").replace(/[^A-Za-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 56) || "instagram-reel";
}
async function hashFile(file) {
    return new Promise((resolve, reject)=>{
        const hash = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256");
        const stream = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].createReadStream(file);
        stream.on("error", reject);
        stream.on("data", (chunk)=>hash.update(chunk));
        stream.on("end", ()=>resolve(hash.digest("hex")));
    });
}
async function validatePlayableMp4(file) {
    const st = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.stat(file);
    if (st.size < 100_000) throw new Error(`download is only ${st.size} bytes — rejected as invalid`);
    const fd = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.open(file, "r");
    try {
        const buf = Buffer.alloc(64);
        await fd.read(buf, 0, 64, 0);
        if (!buf.includes(Buffer.from("ftyp"))) {
            throw new Error("file has no MP4 ftyp header — rejected as unplayable");
        }
    } finally{
        await fd.close();
    }
    return {
        size: st.size,
        hash: await hashFile(file)
    };
}
async function directDownload(url, target) {
    const res = await fetch(url, {
        headers: {
            "user-agent": "Mozilla/5.0",
            referer: "https://www.instagram.com/"
        },
        signal: AbortSignal.timeout(120_000)
    });
    if (!res.ok || !res.body) throw new Error(`media server returned HTTP ${res.status}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.writeFile(target, bytes);
}
async function downloadRealVideo(c, istDate) {
    const dir = dailyDownloadFolder(istDate);
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.mkdir(dir, {
        recursive: true
    });
    const base = `${c.videoId}_${safeTitle(c.caption)}`;
    const expected = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, `${base}.mp4`);
    const part = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, `${base}.part.mp4`);
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(part, {
            force: true
        });
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(expected, {
            force: true
        });
        if (c.directMediaUrl) {
            await directDownload(c.directMediaUrl, part);
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rename(part, expected);
        } else {
            const stdout = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$youtube$2d$dl$2d$exec__$5b$external$5d$__$28$youtube$2d$dl$2d$exec$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$youtube$2d$dl$2d$exec$29$__["default"])(c.url, {
                // Prefer a single ≤720p mp4 so there is no slow ffmpeg merge step.
                format: "best[ext=mp4][height<=720]/best[ext=mp4]/best",
                output: expected,
                noPlaylist: true,
                noWarnings: true,
                noProgress: true,
                restrictFilenames: true,
                windowsFilenames: true,
                retries: 1,
                fragmentRetries: 1,
                concurrentFragments: 4,
                socketTimeout: 15,
                cookiesFromBrowser: cookiesFlag(c.cookiesBrowser),
                print: "after_move:filepath"
            });
            const printed = String(stdout).trim().split(/\r?\n/).pop();
            if (printed && __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].existsSync(printed) && printed !== expected) {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rename(printed, expected);
            }
        }
        const verified = await validatePlayableMp4(expected);
        return {
            ok: true,
            filePath: expected,
            fileName: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].basename(expected),
            fileHash: verified.hash,
            fileSize: verified.size
        };
    } catch (e) {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(part, {
            force: true
        }).catch(()=>{});
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(expected, {
            force: true
        }).catch(()=>{});
        return {
            ok: false,
            error: e instanceof Error ? e.message.slice(0, 500) : String(e)
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/ist.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fmtCountdown",
    ()=>fmtCountdown,
    "istClock",
    ()=>istClock,
    "istDate",
    ()=>istDate,
    "istFull",
    ()=>istFull,
    "istYesterdayDate",
    ()=>istYesterdayDate,
    "nextIstMidnight",
    ()=>nextIstMidnight
]);
/**
 * India Standard Time (Asia/Kolkata) utilities.
 * The daily 7-video counter (one per topic) is keyed on the IST calendar date and resets
 * automatically at IST midnight — the permanent duplicate cache never resets.
 */ const IST_OFFSET_MIN = 330; // UTC+5:30
const dateFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
});
const timeFmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
});
const fullFmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
});
function istDate(d = new Date()) {
    return dateFmt.format(d); // YYYY-MM-DD in IST
}
function istYesterdayDate(d = new Date()) {
    return istDate(new Date(d.getTime() - 24 * 3600 * 1000));
}
function istClock(d = new Date()) {
    return timeFmt.format(d);
}
function istFull(d) {
    return fullFmt.format(d);
}
function nextIstMidnight(from = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "numeric",
        day: "numeric"
    }).formatToParts(from);
    const y = Number(parts.find((p)=>p.type === "year").value);
    const m = Number(parts.find((p)=>p.type === "month").value);
    const day = Number(parts.find((p)=>p.type === "day").value);
    // Wall-clock ms for the day AFTER the current IST date (UTC reading),
    // then subtract the IST offset so the instant equals 00:00:00 IST.
    return Date.UTC(y, m - 1, day + 1, 0, 0, 0) - IST_OFFSET_MIN * 60_000;
}
function fmtCountdown(ms) {
    if (ms <= 0) return "due now";
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor(s % 3600 / 60);
    const ss = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${ss}s`;
    return `${ss}s`;
}
}),
"[project]/src/lib/notify.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "notify",
    ()=>notify,
    "notifyAsync",
    ()=>notifyAsync,
    "setSetting",
    ()=>setSetting,
    "telegramConfigured",
    ()=>telegramConfigured,
    "testTelegram",
    ()=>testTelegram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
/**
 * Telegram alerts — free, instant notifications for the events that matter:
 * daily collection complete, uploads scheduled/failed, quota exhausted.
 *
 * Configure once: create a bot via @BotFather → token; get chat id via
 * @userinfobot. Stored locally, never leaves the machine except to Telegram.
 */ async function getSetting(key, fallback = "") {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key, key)).limit(1);
    return rows[0]?.value ?? fallback;
}
async function setSetting(key, value) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).values({
        key,
        value
    }).onConflictDoUpdate({
        target: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key,
        set: {
            value
        }
    });
}
async function telegramConfigured() {
    return Boolean(await getSetting("telegramBotToken", "") && await getSetting("telegramChatId", ""));
}
async function notify(message) {
    try {
        if (!await telegramConfigured()) return false;
        const token = await getSetting("telegramBotToken", "");
        const chatId = await getSetting("telegramChatId", "");
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: `ViralDarshan\n\n${message}`,
                parse_mode: "HTML"
            }),
            signal: AbortSignal.timeout(10_000)
        });
        return res.ok;
    } catch  {
        return false;
    }
}
function notifyAsync(message) {
    void notify(message).catch(()=>{});
}
async function testTelegram(token, chatId) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: "ViralDarshan connected. Alerts are ON."
            }),
            signal: AbortSignal.timeout(10_000)
        });
        const j = await res.json();
        if (j.ok) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"]).values({
                level: "ok",
                message: "Telegram alerts connected."
            });
            return {
                ok: true,
                detail: "Test message delivered — alerts are ON."
            };
        }
        return {
            ok: false,
            detail: j.description ?? "Telegram rejected the request."
        };
    } catch (e) {
        return {
            ok: false,
            detail: e instanceof Error ? e.message : String(e)
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/phash.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computePerceptualHash",
    ()=>computePerceptualHash,
    "hammingDistance",
    ()=>hammingDistance,
    "isVisuallySimilar",
    ()=>isVisuallySimilar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__ = __turbopack_context__.i("[externals]/ffmpeg-static [external] (ffmpeg-static, cjs, [project]/node_modules/ffmpeg-static)");
;
;
async function computePerceptualHash(filePath) {
    const binary = __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"] ? String(__TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"]) : "";
    if (!binary) return null;
    return new Promise((resolve)=>{
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"])(binary, [
            "-hide_banner",
            "-loglevel",
            "error",
            "-ss",
            "0.2",
            "-i",
            filePath,
            "-frames:v",
            "1",
            "-vf",
            "select='not(mod(n\\,100))',scale=8:8:flags=area,format=gray",
            "-f",
            "rawvideo",
            "-"
        ], {
            windowsHide: true,
            timeout: 30_000,
            maxBuffer: 1_000_000
        }, (err, stdout)=>{
            if (err) {
                // Fallback: simple seek without the select filter.
                (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"])(binary, [
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-ss",
                    "0.2",
                    "-i",
                    filePath,
                    "-frames:v",
                    "1",
                    "-vf",
                    "scale=8:8:flags=area,format=gray",
                    "-f",
                    "rawvideo",
                    "-"
                ], {
                    windowsHide: true,
                    timeout: 30_000,
                    maxBuffer: 1_000_000
                }, (err2, stdout2)=>resolve(hashFromBuffer(err2 ? null : Buffer.from(stdout2, "binary"))));
                return;
            }
            resolve(hashFromBuffer(Buffer.from(stdout, "binary")));
        });
    });
}
function hashFromBuffer(buf) {
    if (!buf || buf.length < 64) return null;
    const pixels = buf.subarray(0, 64);
    let mean = 0;
    for (const p of pixels)mean += p;
    mean /= 64;
    // 64-bit string: pixel >= mean → 1
    let bits = "";
    for (const p of pixels)bits += p >= mean ? "1" : "0";
    return bits;
}
function hammingDistance(a, b) {
    if (!a || !b || a.length !== b.length) return 64;
    let d = 0;
    for(let i = 0; i < a.length; i++)if (a[i] !== b[i]) d++;
    return d;
}
function isVisuallySimilar(a, b) {
    if (!a || !b) return false;
    return hammingDistance(a, b) <= 8;
}
}),
"[project]/src/lib/reels.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Shared Reel types + strict daily constraints. No demo/fake discovery lives here. */ __turbopack_context__.s([
    "DAILY_LIMIT",
    ()=>DAILY_LIMIT,
    "MIN_VIEWS",
    ()=>MIN_VIEWS,
    "selectDiverse",
    ()=>selectDiverse
]);
const DAILY_LIMIT = 7; // exactly one approved video for each of 7 topics
const MIN_VIEWS = 1_000_000; // strictly MORE than this verified public metric (1M+)
function selectDiverse(fresh, quota, todayByTopic) {
    const bestMissing = new Map();
    for (const candidate of fresh){
        if ((todayByTopic.get(candidate.topicSlug) ?? 0) >= 1) continue;
        const current = bestMissing.get(candidate.topicSlug);
        if (!current || candidate.viewCount > current.viewCount) {
            bestMissing.set(candidate.topicSlug, candidate);
        }
    }
    return [
        ...bestMissing.values()
    ].sort((a, b)=>b.viewCount - a.viewCount).slice(0, Math.max(0, quota));
}
}),
]})(),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:child_process [external] (node:child_process, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:child_process", () => require("node:child_process"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:os [external] (node:os, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:os", () => require("node:os"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0t31gj3oresu3._.js.map