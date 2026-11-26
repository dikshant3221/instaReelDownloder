module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/manual/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/manual.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/youtube.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const dynamic = "force-dynamic";
const runtime = "nodejs";
async function GET() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureDb"])();
        const list = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listManual"])();
        // Crash recovery: resume any queued items when the dashboard polls.
        if (!list.paused && list.rows.some((i)=>i.status === "queued" || i.status === "downloaded")) {
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processManualQueue"])();
        }
        const yt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["youtubeStatus"])();
        const etaSeconds = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueEtaSeconds"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            items: list.rows,
            paused: list.paused,
            etaSeconds,
            peakWindow: "9:00–11:00 PM IST",
            dailyCap: 5,
            youtubeConnected: yt.connected,
            youtubeEnabled: yt.enabled
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            items: [],
            gapMinutes: 5,
            warmingUp: true
        });
    }
}
async function POST(req) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureDb"])();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: "database still starting"
        }, {
            status: 503
        });
    }
    const body = await req.json().catch(()=>({}));
    if (body.action === "pause" || body.action === "resume") {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setQueuePaused"])(body.action === "pause");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            paused: body.action === "pause"
        });
    }
    if (body.action === "priority") {
        if (!body.id || body.dir !== -1 && body.dir !== 1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                error: "id and dir (±1) required"
            }, {
                status: 400
            });
        }
        const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["moveQueueItem"])(body.id, body.dir);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok
        });
    }
    if (body.action === "retry") {
        if (!body.id) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: "missing id"
        }, {
            status: 400
        });
        const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["retryManual"])(body.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok
        });
    }
    const lines = (body.urls ?? "").split(/[\n,]+/).map((s)=>s.trim()).filter(Boolean);
    if (lines.length === 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: "Paste at least one Instagram link."
        }, {
            status: 400
        });
    }
    if (lines.length > 500) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: "Maximum 500 links per batch."
        }, {
            status: 400
        });
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$manual$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["submitManualLinks"])(lines, body.publishAt);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        ...result
    });
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
    uploadedDay: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])("uploaded_day"),
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
async function searchUrls(topics, scanIndex, deadlineMs) {
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
        if (Date.now() > deadlineMs) return; // hard time budget — never exceed ~2 min per scan
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
                if (Date.now() > deadlineMs) break;
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
    // Hard time budget: discovery must finish well within 2 minutes.
    const discoveryDeadline = Date.now() + 60_000;
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
        const searched = await searchUrls(topics, scanIndex, discoveryDeadline);
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
"[project]/src/lib/manual.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "listManual",
    ()=>listManual,
    "moveQueueItem",
    ()=>moveQueueItem,
    "processManualQueue",
    ()=>processManualQueue,
    "queueEtaSeconds",
    ()=>queueEtaSeconds,
    "retryManual",
    ()=>retryManual,
    "setQueuePaused",
    ()=>setQueuePaused,
    "submitManualLinks",
    ()=>submitManualLinks
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/instagram-real.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/youtube.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$review$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai-review.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transcript$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/transcript.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ist.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/schedule.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$review$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transcript$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$review$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transcript$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
/* ---------------- helpers ---------------------------------------------- */ function parseShortcode(raw) {
    const m = raw.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]{5,})/i);
    return m ? m[1] : null;
}
async function logManual(level, message) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"]).values({
        level,
        message
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].execute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`DELETE FROM activity_logs WHERE id < (
      SELECT COALESCE(MIN(id), 0) FROM (SELECT id FROM activity_logs ORDER BY id DESC LIMIT 400) keep
    )`);
}
async function submitManualLinks(rawLines, publishAtISO) {
    const skipped = [];
    let accepted = 0;
    const target = publishAtISO ? new Date(publishAtISO) : null;
    const targetValid = target !== null && !Number.isNaN(target.getTime()) && target.getTime() > Date.now() + 60_000;
    // Auto viral schedule: peak evening slots (9–11 PM IST), max 5/day, future
    // dates only — rolls to the next day automatically when a day is full.
    const slots = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planPublishSlots"])(rawLines.length, targetValid ? target.getTime() : null);
    let slotIdx = 0;
    const firstSlot = slots[0];
    for (const raw of rawLines){
        const line = raw.trim();
        if (!line) continue;
        const sc = parseShortcode(line);
        if (!sc) {
            skipped.push({
                url: line,
                reason: "Not an Instagram Reel/Post URL"
            });
            continue;
        }
        const url = `https://www.instagram.com/reel/${sc}/`;
        // Permanent dedupe: same video already queued OR already in daily cache.
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id,
            status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].status
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].videoId, sc)).limit(1);
        if (existing[0]) {
            skipped.push({
                url,
                reason: `Already in queue (${existing[0].status})`
            });
            continue;
        }
        const inDaily = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].videoId, sc)).limit(1);
        if (inDaily[0]) {
            skipped.push({
                url,
                reason: "Already downloaded in the daily collection"
            });
            continue;
        }
        const slot = slots[slotIdx];
        if (slot === undefined) {
            skipped.push({
                url,
                reason: "No free schedule slot (5/day cap reached for the coming days)"
            });
            continue;
        }
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).values({
                videoId: sc,
                url,
                status: "queued",
                publishAt: new Date(slot)
            });
            slotIdx++;
            accepted++;
        } catch  {
            skipped.push({
                url,
                reason: "Duplicate (race)"
            });
        }
    }
    if (accepted > 0) {
        await logManual("info", `Manual queue: ${accepted} link(s) accepted → download → AI content check → upload. Auto-scheduled at peak evening times (9–11 PM IST, max ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MANUAL_DAILY_CAP"]}/day, future dates)${firstSlot ? `; first goes public ${new Date(firstSlot).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "short",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        })} IST` : ""}.`);
        void processManualQueue();
    }
    const list = await listManual();
    return {
        accepted,
        skipped,
        items: list.rows
    };
}
/* ---------------- processing ------------------------------------------- */ let processing = false;
/**
 * Uploads-per-day accounting across manual + daily videos. The user limit is
 * 5 uploads per IST day total. Manual rows are DELETED after a successful
 * upload (links are consumed), so the counter lives in settings.
 */ async function uploadsTodayTotal() {
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
    let manual = 0;
    const raw = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key, "manualUploadedToday")).limit(1))[0]?.value;
    if (raw) {
        const [d, n] = raw.split("|");
        if (d === today) manual = Number(n) || 0;
    }
    const daily = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, today), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeStatus, "uploaded"))))[0]?.n ?? 0;
    return manual + daily;
}
async function bumpManualUploadsToday() {
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
    let n = 0;
    const raw = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key, "manualUploadedToday")).limit(1))[0]?.value;
    if (raw) {
        const [d, v] = raw.split("|");
        if (d === today) n = Number(v) || 0;
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).values({
        key: "manualUploadedToday",
        value: `${today}|${n + 1}`
    }).onConflictDoUpdate({
        target: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key,
        set: {
            value: `${today}|${n + 1}`
        }
    });
}
async function processManualQueue() {
    if (processing) return;
    processing = true;
    try {
        // Operator pause switch (#13): keeps the queue but stops processing.
        const paused = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key, "manualPaused")).limit(1))[0]?.value;
        if (paused === "true") return;
        // Reclaim rows stuck mid-flight after a crash/restart (>5 min old).
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
            status: "queued",
            updatedAt: new Date()
        }).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].status} IN ('downloading','uploading') AND ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].updatedAt} < now() - interval '5 minutes'`);
        const st = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["youtubeStatus"])();
        const ist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
        // Work items: queued (download first) or downloaded (upload when connected).
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].status} IN ('queued','downloaded')`).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].priority), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id));
        const processRow = async (row)=>{
            let filePath = row.filePath;
            // ---- step 1: direct download (NO AI verification) ----
            if (!filePath) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
                    status: "downloading",
                    updatedAt: new Date(),
                    error: null
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, row.id));
                const candidate = {
                    videoId: row.videoId,
                    url: row.url,
                    topicSlug: "manual",
                    topicId: 0,
                    caption: "",
                    author: "",
                    viewCount: 0,
                    likeCount: 0,
                    publishedAgoHrs: 0,
                    metricSource: "views",
                    eligibilityProof: "manual submission",
                    source: "source-list"
                };
                // Files land in Downloads/Instagram_Viral_Videos/Manual/<date>/
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloadRealVideo"])(candidate, `Manual/${ist}`);
                if (!result.ok || !result.filePath) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
                        status: "failed",
                        error: (result.error ?? "download failed").slice(0, 500),
                        updatedAt: new Date()
                    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, row.id));
                    await logManual("error", `Manual download failed for ${row.videoId}: ${result.error}`);
                    return;
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
                    status: "downloaded",
                    filePath: result.filePath,
                    fileHash: result.fileHash,
                    fileSize: result.fileSize,
                    updatedAt: new Date()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, row.id));
                await logManual("ok", `Manual: downloaded ${row.videoId} (${((result.fileSize ?? 0) / 1_048_576).toFixed(1)} MB).`);
                filePath = result.filePath;
            }
            if (!filePath) return;
            // ---- step 1.5: AI CONTENT CHECK (original content verified BEFORE
            // title generation and upload — never publish an unrelated video) ----
            const meta = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchReelMetadata"])(row.url);
            const caption = meta?.description || meta?.title || "";
            const reach = meta?.views || meta?.likes || 0;
            const topicRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"]).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].sortOrder));
            const matched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2d$real$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topicFor"])(`${caption} ${meta?.author ?? ""}`, topicRows.map((t)=>({
                    ...t,
                    keywords: t.keywords
                })));
            const checkTopic = matched ?? {
                id: 0,
                slug: "vrindavan-devotional",
                name: "Vrindavan Devotional Reel",
                hindiName: "",
                folder: "",
                keywords: []
            };
            const checkCandidate = {
                videoId: row.videoId,
                url: row.url,
                topicSlug: checkTopic.slug,
                topicId: checkTopic.id,
                caption,
                author: meta?.author ?? "",
                viewCount: reach,
                likeCount: meta?.likes ?? 0,
                publishedAgoHrs: 0,
                metricSource: "views",
                eligibilityProof: "manual submission",
                source: "source-list"
            };
            await logManual("ai", `Manual content check: verifying original video ${row.videoId} against real frames before upload…`);
            const transcript = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transcript$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transcribeVideo"])(filePath);
            const review = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2d$review$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reviewDownloadedVideo"])(checkCandidate, checkTopic, filePath, transcript || undefined);
            if (review.verdict !== "match") {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(filePath, {
                    force: true
                }).catch(()=>{});
                const reason = review.verdict === "unavailable" ? `AI content check unavailable (${review.reason}) — add/repair an AI key in API Keys, then press Retry` : `Content check failed: ${review.reason}`;
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
                    status: "failed",
                    error: reason.slice(0, 500),
                    filePath: null,
                    aiFrame: review.frameDataUrl ?? null,
                    transcript: transcript || null,
                    updatedAt: new Date()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, row.id));
                await logManual("warn", `Manual REJECTED ${row.videoId} before upload — ${reason}. File deleted; nothing published.`);
                return;
            }
            await logManual("ai", `Manual content check PASSED for ${row.videoId} (${review.confidence}% via ${review.provider}) — creating title and uploading.`);
            // ---- step 2: YouTube upload (needs connection) ----
            if (!st.connected) {
                await logManual("warn", `Manual: ${row.videoId} downloaded — connect YouTube to upload it.`);
                return;
            }
            if (!filePath) return;
            // 5 uploads per IST day across everything — remaining rows wait for tomorrow.
            if (await uploadsTodayTotal() >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MANUAL_DAILY_CAP"]) {
                await logManual("info", `Manual: daily upload limit (5) reached — ${row.videoId} stays queued for tomorrow.`);
                return;
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
                status: "uploading",
                updatedAt: new Date()
            }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, row.id));
            try {
                // Content is already verified above. Now create the UNIQUE heading
                // from this video's real metadata (caption already fetched in check).
                let heading = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planVideoStrategy"])(matched?.name ?? "Vrindavan Devotional Reel", caption, reach, row.videoId);
                heading = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyShortsOptimization"])(heading, filePath);
                // Planned peak slot must still be in the future — otherwise re-plan
                // through the same 9 PM / 5-per-day scheduler.
                let reserved = row.publishAt ? new Date(row.publishAt).getTime() : 0;
                if (!(reserved > Date.now() + 90_000)) {
                    const [replanned] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planPublishSlots"])(1);
                    reserved = replanned ?? Date.now() + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PUBLISH_GAP_MS"];
                }
                const publishAt = new Date(reserved).toISOString();
                const { id, alreadyOnChannel } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["publishVideoFile"])({
                    filePath,
                    title: heading.title,
                    description: heading.description,
                    tags: heading.hashtags.map((h)=>h.slice(1)).concat([
                        "Instagram",
                        "Reel"
                    ]),
                    publishAt,
                    category: heading.category,
                    language: heading.language,
                    sourceUrl: row.url,
                    playlistName: matched?.name ?? "Vrindavan Devotional Reel"
                });
                if (alreadyOnChannel) {
                    // Already on the channel → this link is consumed: DELETE it and
                    // continue with the next queued video (no duplicate upload).
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, row.id));
                    await logManual("ok", `Manual: ${row.videoId} is ALREADY on your YouTube channel (${id}) — link deleted, next queued video will be used.`);
                    return;
                }
                // Success: count toward the 5/day cap, then consume (delete) the link.
                await bumpManualUploadsToday();
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, row.id));
                await logManual("ok", `Manual: "${heading.title}" uploaded → public at ${new Date(publishAt).toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })} IST. Link consumed & deleted. https://www.youtube.com/watch?v=${id}`);
            } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                if (msg.includes("QUOTA_EXHAUSTED")) {
                    const { notifyQuotaOnce } = await __turbopack_context__.A("[project]/src/lib/engine.ts [app-route] (ecmascript, async loader)");
                    void notifyQuotaOnce(`YouTube API quota exhausted for today — ${row.videoId} stays queued and uploads resume after IST midnight.`);
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
                    status: "failed",
                    error: msg.slice(0, 500),
                    updatedAt: new Date()
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, row.id));
                await logManual("error", `Manual upload failed for ${row.videoId}: ${msg.slice(0, 200)}`);
            }
        };
        // Bounded parallelism: 2 workers keeps large batches (100–500 links)
        // moving while staying polite to Instagram and YouTube rate limits.
        let cursor = 0;
        await Promise.all(Array.from({
            length: Math.min(2, rows.length)
        }, async ()=>{
            while(cursor < rows.length){
                const row = rows[cursor++];
                try {
                    await processRow(row);
                } catch (e) {
                    await logManual("error", `Manual processing error for ${row.videoId}: ${e instanceof Error ? e.message : String(e)}`);
                }
            }
        }));
    } finally{
        processing = false;
    }
}
async function setQueuePaused(paused) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).values({
        key: "manualPaused",
        value: paused ? "true" : "false"
    }).onConflictDoUpdate({
        target: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key,
        set: {
            value: paused ? "true" : "false"
        }
    });
    if (!paused) void processManualQueue();
}
async function moveQueueItem(id, dir) {
    const row = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, id)).limit(1))[0];
    if (!row) return false;
    const neighbor = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].status} IN ('queued','downloaded') AND ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id} <> ${id}`).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].priority), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id)).limit(50);
    const myPos = neighbor.findIndex((r)=>r.id === id);
    const swapTarget = dir === -1 ? neighbor[myPos - 1] : neighbor[myPos + 1];
    if (!swapTarget) return false;
    // Swap priorities by position index (unique, small integers).
    const base = Math.min(row.priority || 0, swapTarget.priority || 0);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
        priority: base + 1,
        updatedAt: new Date()
    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, dir === -1 ? swapTarget.id : id));
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set({
        priority: base,
        updatedAt: new Date()
    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, dir === -1 ? id : swapTarget.id));
    return true;
}
async function queueEtaSeconds() {
    const pending = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].status} IN ('queued','downloaded')`);
    return Math.round((pending[0]?.n ?? 0) * 40 / 2);
}
async function listManual() {
    const paused = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["settings"].key, "manualPaused")).limit(1))[0]?.value === "true";
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).orderBy(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].createdAt} DESC`).limit(300);
    return {
        paused,
        rows: rows.map((r)=>({
                id: r.id,
                videoId: r.videoId,
                url: r.url,
                status: r.status,
                filePath: r.filePath,
                fileSize: r.fileSize,
                publishAt: r.publishAt ? new Date(r.publishAt).toISOString() : null,
                youtubeId: r.youtubeId,
                youtubeUrl: r.youtubeUrl,
                youtubeTitle: r.youtubeTitle,
                error: r.error,
                createdAt: new Date(r.createdAt).toISOString()
            }))
    };
}
async function retryManual(id) {
    const row = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, id)).limit(1))[0];
    if (!row || row.status !== "failed") return false;
    // Failed before download → start over; failed at upload → keep file.
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).set(row.filePath ? {
        status: "downloaded",
        error: null,
        updatedAt: new Date()
    } : {
        status: "queued",
        error: null,
        updatedAt: new Date()
    }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id, id));
    void processManualQueue();
    return true;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/reels.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Shared Reel types + strict daily constraints. No demo/fake discovery lives here. */ /**
 * Vrindavan channel filter: only reels from recognized temple/spiritual
 * CHANNELS are eligible — personal Instagram accounts are rejected.
 *
 * 1. Positive allowlist of known official Vrindavan temple/darshan handles.
 * 2. Otherwise BOTH the handle AND the caption must carry temple/channel
 *    markers (e.g. "@x_mandir" + "Vrindavan darshan") — a personal handle
 *    posting temple content once does not pass.
 */ __turbopack_context__.s([
    "DAILY_LIMIT",
    ()=>DAILY_LIMIT,
    "FIND_DAILY",
    ()=>FIND_DAILY,
    "MIN_VIEWS",
    ()=>MIN_VIEWS,
    "VRINDAVAN_CHANNELS",
    ()=>VRINDAVAN_CHANNELS,
    "isVrindavanSource",
    ()=>isVrindavanSource,
    "selectDiverse",
    ()=>selectDiverse
]);
const VRINDAVAN_CHANNELS = new Set([
    "banke_bihari_mandir_official",
    "bankebiharimandirofficial",
    "vrindavan.reels",
    "vrindavan_bankebihari",
    "shri_vrindavan_ji_official",
    "shrihitradhavallabhmandir",
    "shrihitradhavallabhlal",
    "shriradhavallabhmandir",
    "office_radharaman",
    "shri_radharaman_lal_ju",
    "radharamanji.temple",
    "govind_dev_ji_temple",
    "govind_dev_ji_",
    "govinddevji_daily_darshan",
    "premanand__maharaj_official",
    "premanandji_.maharaj_official",
    "premanand_ji_maharaj_121",
    "bhaktipath",
    "jaishreebhagwan1950",
    "vrindavan.darshan",
    "banke_bihari_bhakt",
    "bihari_ji_ki_gali",
    "vrindavan_ras",
    "radhavallabh_prem",
    "hit_radha_vallabh",
    "seva_kunj_dunj",
    "seva_kunj_darshan",
    "vrindavan_satsang",
    "radha_keli_kunj",
    "shrimad_bhagwat_katha",
    "braj_ke_sant"
].map((h)=>h.toLowerCase()));
const CHANNEL_MARKER = /(mandir|temple|vrindavan|mathura|braj|official|darshan|sanatan|bhakti|satsang|katha|seva)/i;
function isVrindavanSource(author, caption) {
    const handle = author.replace(/^@/, "").toLowerCase();
    if (VRINDAVAN_CHANNELS.has(handle)) return true;
    // Heuristic: channel-ish handle AND temple-ish content, both present.
    return CHANNEL_MARKER.test(author) && CHANNEL_MARKER.test(caption);
}
const DAILY_LIMIT = 5; // uploads per IST day (YouTube budget)
const FIND_DAILY = 20; // downloads collected per IST day
const MIN_VIEWS = 100_000; // strictly MORE than this (1 lakh+)
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
"[project]/src/lib/schedule.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "MANUAL_DAILY_CAP",
    ()=>MANUAL_DAILY_CAP,
    "PEAK_SLOTS_IST_MIN",
    ()=>PEAK_SLOTS_IST_MIN,
    "PUBLISH_GAP_MS",
    ()=>PUBLISH_GAP_MS,
    "planPublishSlots",
    ()=>planPublishSlots
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ist.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/youtube-stats.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const PUBLISH_GAP_MS = 5 * 60 * 1000;
const MANUAL_DAILY_CAP = 5;
const PEAK_SLOTS_IST_MIN = Array.from({
    length: 12
}, (_, i)=>21 * 60 + i * 15);
const MIN_LEAD_MS = 2 * 60_000;
const SEPARATION_MS = 10 * 60_000;
/** Natural jitter (2–10 min) so scheduled times look human, not machine-set. */ function naturalJitter(dayKey, slot, nth) {
    let h = 5381;
    const seed = `${dayKey}|${slot}|${nth}`;
    for(let i = 0; i < seed.length; i++)h = (h << 5) + h + seed.charCodeAt(i) >>> 0;
    return (2 + h % 9) * 60_000; // 2..10 minutes
}
function istInstantFromKey(dayKey, minutes) {
    const [y, m, d] = dayKey.split("-").map(Number);
    return Date.UTC(y, m - 1, d, 0, 0, 0) - 330 * 60_000 + minutes * 60_000;
}
async function planPublishSlots(count, explicitFirst, options = {}) {
    // Cap accounting: manual queue rows only (daily videos have their own cap).
    const manualRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        p: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].publishAt
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ne"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].status, "failed"));
    const manualTimes = manualRows.map((r)=>r.p ? new Date(r.p).getTime() : 0).filter((t)=>t > 0);
    // Collision avoidance: also respect daily videos already scheduled.
    let busyTimes = manualTimes.filter((t)=>t > Date.now());
    if (options.includeDaily) {
        const dailyRows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            p: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].publishAt
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeStatus} IN ('uploaded','pending') AND ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].publishAt} IS NOT NULL`);
        busyTimes = [
            ...busyTimes,
            ...dailyRows.map((r)=>r.p ? new Date(r.p).getTime() : 0).filter((t)=>t > Date.now())
        ];
    }
    const byDay = new Map();
    for (const t of manualTimes){
        const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])(new Date(t));
        byDay.set(k, (byDay.get(k) ?? 0) + 1);
    }
    const assigned = [];
    const busy = ()=>[
            ...busyTimes,
            ...assigned
        ];
    const fits = (t)=>{
        if (t <= Date.now() + MIN_LEAD_MS) return false;
        const day = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])(new Date(t));
        if ((byDay.get(day) ?? 0) >= MANUAL_DAILY_CAP) return false;
        if (busy().some((o)=>Math.abs(o - t) < SEPARATION_MS)) return false;
        return true;
    };
    const claim = (t)=>{
        assigned.push(t);
        const day = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])(new Date(t));
        byDay.set(day, (byDay.get(day) ?? 0) + 1);
    };
    // Learn from analytics: try the best-performing hour's slots first.
    let slots = [
        ...PEAK_SLOTS_IST_MIN
    ];
    try {
        const insights = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInsights"])();
        if (insights.bestHour !== null) {
            slots = [
                ...slots
            ].sort((a, b)=>Math.abs(a - insights.bestHour * 60) - Math.abs(b - insights.bestHour * 60));
        }
    } catch  {
    /* analytics optional */ }
    const maxDays = Math.max(90, Math.ceil(count / MANUAL_DAILY_CAP) + 10);
    for(let i = 0; i < count; i++){
        let chosen;
        if (i === 0 && explicitFirst && fits(explicitFirst)) chosen = explicitFirst;
        if (chosen === undefined) {
            search: for(let dayOffset = 0; dayOffset < maxDays; dayOffset++){
                const dayKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])(new Date(Date.now() + dayOffset * 86_400_000));
                for (const slot of slots){
                    const nth = byDay.get(dayKey) ?? 0;
                    const t = istInstantFromKey(dayKey, slot) + naturalJitter(dayKey, slot, nth);
                    if (fits(t)) {
                        chosen = t;
                        break search;
                    }
                }
            }
        }
        if (chosen === undefined) break;
        claim(chosen);
    }
    return assigned;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/strategist.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Upload Strategy Bot — thinks like a top 1% YouTube strategist.
 *
 * For every video it selects ONE proven viral formula (rotated deterministically
 * per video so uploads never repeat a structure), and injects that formula into
 * the AI copywriting prompt so title/description follow a deliberate strategy
 * instead of generic "amazing video" copy.
 *
 * Formulas are drawn from what actually works on Indian devotional Shorts:
 * FOMO, curiosity gaps, social proof, blessings, emotional transformation,
 * concrete specifics, direct questions, and end-reveals.
 */ __turbopack_context__.s([
    "describeStrategy",
    ()=>describeStrategy,
    "pickStrategy",
    ()=>pickStrategy
]);
const FORMULAS = [
    {
        id: "fomo",
        name: "FOMO / urgency",
        instruction: "Use an urgency hook: 'Don't scroll', 'Watch before it's gone', 'Wait for the ending' — make the viewer fear missing out."
    },
    {
        id: "curiosity",
        name: "Curiosity gap",
        instruction: "Open a curiosity gap: 'Why is this…', 'What happens when…', 'You won't believe…' — the answer must feel one tap away."
    },
    {
        id: "social-proof",
        name: "Social proof",
        instruction: "Imply massive popularity: 'Millions watched this', 'Everyone is sharing', 'Viral across India' — people follow the crowd."
    },
    {
        id: "blessing",
        name: "Devotional blessing",
        instruction: "Promise a spiritual payoff: 'Watch for darshan blessing', 'Peace will fill your heart', 'Radha Rani's blessing today' — devotional viewers click blessings."
    },
    {
        id: "transformation",
        name: "Emotional transformation",
        instruction: "Promise an emotional shift: 'This will make your day', 'Tears of joy guaranteed', 'Your mood will change' — emotion drives shares."
    },
    {
        id: "specific",
        name: "Specific detail",
        instruction: "Lead with ONE concrete detail from this caption (a place, moment, number, or event) — specificity beats vagueness."
    },
    {
        id: "question",
        name: "Direct question",
        instruction: "Make the title a direct question to the viewer about this exact content — questions pull comments, which lift reach."
    },
    {
        id: "reveal",
        name: "Hidden reveal",
        instruction: "Promise a reveal: 'The last frame is priceless', 'Watch till the very end', 'Stay for the final darshan' — completion rate is king."
    }
];
function hashOf(s) {
    let h = 5381;
    for(let i = 0; i < s.length; i++)h = (h << 5) + h + s.charCodeAt(i) >>> 0;
    return h;
}
function pickStrategy(seed, weights) {
    const h = hashOf(seed);
    if (weights && Object.keys(weights).length >= 2) {
        const values = FORMULAS.map((f)=>weights[f.id] ?? 0);
        const known = values.filter((v)=>v > 0);
        const fallbackWeight = known.length ? known.reduce((a, b)=>a + b, 0) / known.length : 1;
        const total = values.reduce((acc, v)=>acc + (v > 0 ? v : fallbackWeight), 0);
        let target = (h >>> 0) / 0xffffffff * total;
        for(let i = 0; i < FORMULAS.length; i++){
            const w = values[i] > 0 ? values[i] : fallbackWeight;
            target -= w;
            if (target <= 0) return FORMULAS[i];
        }
    }
    return FORMULAS[h % FORMULAS.length];
}
function describeStrategy(s) {
    return `${s.name} (${s.id})`;
}
}),
"[project]/src/lib/transcript.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "hasTranscriptProvider",
    ()=>hasTranscriptProvider,
    "transcribeVideo",
    ()=>transcribeVideo
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:os [external] (node:os, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__ = __turbopack_context__.i("[externals]/ffmpeg-static [external] (ffmpeg-static, cjs, [project]/node_modules/ffmpeg-static)");
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
/**
 * Spoken-content transcript (Gemini audio understanding).
 *
 * Why: for pravachan/saint videos, WHAT is said is the strongest proof of
 * topic — far stronger than frames. The transcript is stored on the video
 * row, fed to the AI content check as extra evidence, and makes the library
 * searchable by spoken words.
 *
 * Only Google Gemini reliably accepts audio input — used only when that key
 * exists. Everything is best-effort: a missing transcript never blocks a video.
 */ function geminiKey() {
    return null; // populated async below
}
async function geminiProvider() {
    try {
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].slug, "gemini")).limit(1);
        const p = rows[0];
        if (!p?.apiKey || !p.enabled) return null;
        return {
            key: p.apiKey,
            model: p.model || "gemini-2.5-flash-lite"
        };
    } catch  {
        return null;
    }
}
/** Extracts the first ~50s of audio as MP3 (small payload for the API). */ async function extractAudio(filePath, outPath) {
    const binary = __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"] ? String(__TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"]) : "";
    if (!binary) return false;
    return new Promise((resolve)=>{
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"])(binary, [
            "-hide_banner",
            "-loglevel",
            "error",
            "-t",
            "50",
            "-i",
            filePath,
            "-vn",
            "-ac",
            "1",
            "-b:a",
            "32k",
            "-f",
            "mp3",
            "-y",
            outPath
        ], {
            windowsHide: true,
            timeout: 30_000
        }, (err)=>resolve(!err));
    });
}
async function transcribeVideo(filePath) {
    try {
        const provider = await geminiProvider();
        if (!provider) return "";
        const dir = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.mkdtemp(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__["default"].tmpdir(), "vd-tts-"));
        const audio = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, "clip.mp3");
        try {
            if (!await extractAudio(filePath, audio)) return "";
            const size = (await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.stat(audio)).size;
            if (size < 2_000) return ""; // effectively silent clip
            const b64 = (await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.readFile(audio)).toString("base64");
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(provider.model)}:generateContent?key=${encodeURIComponent(provider.key)}`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: "Transcribe this Hindi devotional discourse/audio EXACTLY as spoken, preserving names of saints and temples. If it is only music with no speech, reply with SILENT. Reply with ONLY the transcript."
                                },
                                {
                                    inline_data: {
                                        mime_type: "audio/mpeg",
                                        data: b64
                                    }
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0,
                        maxOutputTokens: 700
                    }
                }),
                signal: AbortSignal.timeout(45_000)
            });
            if (!res.ok) return "";
            const j = await res.json();
            const text = j.candidates?.[0]?.content?.parts?.map((x)=>x.text ?? "").join("").trim() ?? "";
            if (!text || /^silent$/i.test(text)) return "";
            return text.slice(0, 2000);
        } finally{
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(dir, {
                recursive: true,
                force: true
            }).catch(()=>{});
        }
    } catch  {
        return "";
    }
}
async function hasTranscriptProvider() {
    return await geminiProvider() !== null;
}
// silence unused-helper lint (kept for future provider expansion)
void geminiKey;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/youtube-stats.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "QUOTA_COST",
    ()=>QUOTA_COST,
    "QUOTA_LIMIT",
    ()=>QUOTA_LIMIT,
    "addQuota",
    ()=>addQuota,
    "canAffordUpload",
    ()=>canAffordUpload,
    "collectVideoStats",
    ()=>collectVideoStats,
    "getInsights",
    ()=>getInsights,
    "getStrategyWeights",
    ()=>getStrategyWeights,
    "isQuotaError",
    ()=>isQuotaError,
    "markQuotaExhausted",
    ()=>markQuotaExhausted,
    "quotaSnapshot",
    ()=>quotaSnapshot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ist.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const QUOTA_LIMIT = 10_000; // default Google project quota per day
const QUOTA_COST = {
    videosList: 1,
    search: 100,
    upload: 1600,
    thumbnail: 50,
    update: 50,
    playlistInsert: 50,
    playlistItem: 50,
    comment: 50
};
const CHECKPOINTS_H = [
    1,
    6,
    24
];
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
async function addQuota(units, action) {
    try {
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
        const date = await getSetting("youtubeQuotaDate", "");
        let used = Number(await getSetting("youtubeQuotaUsed", "0")) || 0;
        if (date !== today) {
            used = 0;
            await setSetting("youtubeQuotaDate", today);
        }
        used += units;
        await setSetting("youtubeQuotaUsed", String(used));
        if (used >= QUOTA_LIMIT) {
            const { activityLogs } = await __turbopack_context__.A("[project]/src/db/schema.ts [app-route] (ecmascript, async loader)");
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(activityLogs).values({
                level: "warn",
                message: `YouTube API quota (estimated) exhausted: ${used}/${QUOTA_LIMIT} units used today via ${action}. Uploads resume after the daily reset (IST midnight).`
            });
        }
    } catch  {
    /* quota tracking must never break an upload */ }
}
async function quotaSnapshot() {
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
    const date = await getSetting("youtubeQuotaDate", "");
    const used = date === today ? Number(await getSetting("youtubeQuotaUsed", "0")) || 0 : 0;
    const remaining = Math.max(0, QUOTA_LIMIT - used);
    const perUploadCost = QUOTA_COST.upload + QUOTA_COST.thumbnail + QUOTA_COST.update + QUOTA_COST.playlistItem + QUOTA_COST.comment;
    return {
        used,
        limit: QUOTA_LIMIT,
        remaining,
        exhausted: remaining < QUOTA_COST.upload,
        perUploadCost
    };
}
async function canAffordUpload() {
    const q = await quotaSnapshot();
    return q.remaining >= q.perUploadCost;
}
function isQuotaError(status, body) {
    return status === 403 && /quotaExceeded|quota/i.test(body);
}
async function markQuotaExhausted() {
    await setSetting("youtubeQuotaDate", (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])());
    await setSetting("youtubeQuotaUsed", String(QUOTA_LIMIT));
}
async function publishedRows() {
    const daily = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        youtubeId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeId,
        publishAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].publishAt,
        strategy: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].strategy,
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeStatus, "uploaded"));
    const manual = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        youtubeId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].youtubeId,
        publishAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].publishAt,
        strategy: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].strategy,
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].status, "uploaded"));
    return [
        ...daily.map((r)=>({
                youtubeId: r.youtubeId ?? "",
                source: "daily",
                sourceId: r.id,
                publishAt: r.publishAt,
                strategy: r.strategy
            })),
        ...manual.map((r)=>({
                youtubeId: r.youtubeId ?? "",
                source: "manual",
                sourceId: r.id,
                publishAt: r.publishAt,
                strategy: r.strategy
            }))
    ].filter((r)=>r.youtubeId);
}
async function collectVideoStats() {
    try {
        const { accessToken } = await __turbopack_context__.A("[project]/src/lib/youtube.ts [app-route] (ecmascript, async loader)");
        const token = await accessToken();
        if (!token) return 0;
        const rows = await publishedRows();
        const now = Date.now();
        // Determine which (video, checkpoint) pairs are due but missing.
        const due = new Map(); // key: checkpoint hours
        for (const r of rows){
            if (!r.publishAt) continue;
            const elapsedH = (now - new Date(r.publishAt).getTime()) / 3_600_000;
            for (const h of CHECKPOINTS_H){
                if (elapsedH < h) continue;
                const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
                    id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].id
                }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].youtubeId, r.youtubeId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].source, r.source), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].sourceId, r.sourceId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].hoursAfter, h))).limit(1);
                if (existing[0]) continue;
                const list = due.get(String(h)) ?? [];
                list.push(r);
                due.set(String(h), list);
            }
        }
        if (due.size === 0) return 0;
        // One videos.list call covers up to 50 ids (1 quota unit).
        const allIds = [
            ...new Set([
                ...due.values()
            ].flat().map((r)=>r.youtubeId))
        ];
        const statsById = new Map();
        for(let i = 0; i < allIds.length; i += 50){
            const chunk = allIds.slice(i, i + 50);
            const res = await fetch(`${process.env.GOOGLE_API_BASE || "https://www.googleapis.com"}/youtube/v3/videos?part=statistics&id=${chunk.join(",")}`, {
                headers: {
                    authorization: `Bearer ${token}`
                },
                signal: AbortSignal.timeout(20_000)
            });
            if (!res.ok) break;
            const j = await res.json();
            for (const item of j.items ?? []){
                statsById.set(item.id, {
                    views: Number(item.statistics?.viewCount ?? 0),
                    likes: Number(item.statistics?.likeCount ?? 0),
                    comments: Number(item.statistics?.commentCount ?? 0)
                });
            }
            await addQuota(1, "videosList");
        }
        let written = 0;
        for (const [hStr, list] of due){
            const h = Number(hStr);
            for (const r of list){
                const st = statsById.get(r.youtubeId);
                if (!st) continue;
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"]).values({
                    youtubeId: r.youtubeId,
                    source: r.source,
                    sourceId: r.sourceId,
                    viewCount: st.views,
                    likeCount: st.likes,
                    commentCount: st.comments,
                    hoursAfter: h,
                    strategy: r.strategy,
                    publishAt: r.publishAt
                });
                written++;
            }
        }
        return written;
    } catch  {
        return 0; // analytics must never break the pipeline
    }
}
async function getInsights() {
    const out = {
        topStrategy: null,
        topStrategyAvg: 0,
        strategySamples: 0,
        bestHour: null,
        bestHourAvg: 0,
        hourSamples: 0
    };
    try {
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            youtubeId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].youtubeId,
            hoursAfter: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].hoursAfter,
            viewCount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].viewCount,
            strategy: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].strategy,
            publishAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].publishAt
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"]).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].youtubeId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].hoursAfter));
        // keep the latest checkpoint per video
        const latest = new Map();
        for (const r of rows)if (!latest.has(r.youtubeId)) latest.set(r.youtubeId, r);
        const vals = [
            ...latest.values()
        ];
        if (vals.length === 0) return out;
        // by strategy
        const byStrategy = new Map();
        for (const v of vals){
            if (!v.strategy) continue;
            const a = byStrategy.get(v.strategy) ?? [];
            a.push(v.viewCount);
            byStrategy.set(v.strategy, a);
        }
        for (const [name, arr] of byStrategy){
            const avg = arr.reduce((s, x)=>s + x, 0) / arr.length;
            if (arr.length >= 1 && avg > out.topStrategyAvg) {
                out.topStrategy = name;
                out.topStrategyAvg = Math.round(avg);
                out.strategySamples = arr.length;
            }
        }
        // by publish hour (IST)
        if (vals.length >= 2) {
            const byHour = new Map();
            for (const v of vals){
                if (!v.publishAt) continue;
                const hour = Number(new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    hour12: false
                }).format(new Date(v.publishAt)));
                const a = byHour.get(hour) ?? [];
                a.push(v.viewCount);
                byHour.set(hour, a);
            }
            for (const [hour, arr] of byHour){
                const avg = arr.reduce((s, x)=>s + x, 0) / arr.length;
                if (arr.length >= 2 && avg > out.bestHourAvg) {
                    out.bestHour = hour;
                    out.bestHourAvg = Math.round(avg);
                    out.hourSamples = arr.length;
                }
            }
        }
        return out;
    } catch  {
        return out;
    }
}
async function getStrategyWeights() {
    try {
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            strategy: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].strategy,
            viewCount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].viewCount,
            youtubeId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].youtubeId,
            hoursAfter: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].hoursAfter
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"]).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].youtubeId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["videoStats"].hoursAfter));
        const latest = new Map();
        for (const r of rows)if (!latest.has(r.youtubeId)) latest.set(r.youtubeId, r);
        const acc = new Map();
        for (const r of latest.values()){
            if (!r.strategy) continue;
            const a = acc.get(r.strategy) ?? {
                sum: 0,
                n: 0
            };
            a.sum += r.viewCount;
            a.n++;
            acc.set(r.strategy, a);
        }
        const weights = {};
        for (const [name, a] of acc)weights[name] = (a.sum + 1000) / (a.n + 1);
        return weights;
    } catch  {
        return {};
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/youtube.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "accessToken",
    ()=>accessToken,
    "applyShortsOptimization",
    ()=>applyShortsOptimization,
    "authUrlWithClient",
    ()=>authUrlWithClient,
    "createUniqueHeading",
    ()=>createUniqueHeading,
    "extractThumbnail",
    ()=>extractThumbnail,
    "findOnChannel",
    ()=>findOnChannel,
    "generateViralHeading",
    ()=>generateViralHeading,
    "getTrendingTags",
    ()=>getTrendingTags,
    "handleAuthCode",
    ()=>handleAuthCode,
    "isDuplicateTitle",
    ()=>isDuplicateTitle,
    "loadAccounts",
    ()=>loadAccounts,
    "loadTokens",
    ()=>loadTokens,
    "planVideoStrategy",
    ()=>planVideoStrategy,
    "probeDurationMs",
    ()=>probeDurationMs,
    "publishVideoFile",
    ()=>publishVideoFile,
    "recentUploadTitles",
    ()=>recentUploadTitles,
    "redirectUri",
    ()=>redirectUri,
    "rotateAccount",
    ()=>rotateAccount,
    "saveAccounts",
    ()=>saveAccounts,
    "uploadPendingBatch",
    ()=>uploadPendingBatch,
    "youtubeStatus",
    ()=>youtubeStatus
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/conditions.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/expressions/select.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__ = __turbopack_context__.i("[externals]/ffmpeg-static [external] (ffmpeg-static, cjs, [project]/node_modules/ffmpeg-static)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ist.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$strategist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/strategist.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/youtube-stats.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/reels.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/schedule.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
;
/**
 * YouTube publishing pipeline.
 *
 * Runs ONLY after the daily collection is complete (all enabled topics have
 * one approved video). For each approved video:
 *   1. AI generates a viral title + hashtags (Gemini → Mistral → NVIDIA → …)
 *   2. A representative frame is extracted as the thumbnail (proper view)
 *   3. Uploaded as PRIVATE with publishAt = now + 15 min (auto-goes public)
 *   4. Location metadata set to India (recordingDetails)
 *
 * OAuth: user pastes their Google OAuth Client ID + Secret once, clicks
 * Connect, consents; refresh token is stored locally (never leaves the box).
 */ const SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    // Full youtube scope powers topic playlists + pinned CTA comments.
    // Existing connections must re-authorize once to gain it.
    "https://www.googleapis.com/auth/youtube"
].join(" ");
// Base URLs — overridable for proxies / offline testing (server-side only).
const OAUTH_BASE = process.env.GOOGLE_OAUTH_BASE || "https://oauth2.googleapis.com";
const API_BASE = process.env.GOOGLE_API_BASE || "https://www.googleapis.com";
const PUBLISH_DELAY_MS = 15 * 60 * 1000; // public 15 minutes after upload
/* ---------------- local settings helpers (no engine import cycle) ------- */ async function getSetting(key, fallback = "") {
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
async function logYt(level, message) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"]).values({
        level,
        message
    });
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].execute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`DELETE FROM activity_logs WHERE id < (
    SELECT COALESCE(MIN(id), 0) FROM (SELECT id FROM activity_logs ORDER BY id DESC LIMIT 400) keep
  )`);
}
async function loadAccounts() {
    const raw = await getSetting("youtubeAccounts", "");
    if (raw) {
        try {
            const store = JSON.parse(raw);
            if (Array.isArray(store.accounts) && store.accounts.length) return store;
        } catch  {
        /* fall through to migration */ }
    }
    // Migrate legacy single-token storage into account #1.
    const legacy = await getSetting("youtubeTokens", "");
    const clientId = await getSetting("youtubeClientId", "");
    const clientSecret = await getSetting("youtubeClientSecret", "");
    const accounts = [];
    let legacyT = null;
    if (legacy) {
        try {
            legacyT = JSON.parse(legacy);
        } catch  {
            legacyT = null;
        }
    }
    if (clientId || legacyT?.access_token) {
        accounts.push({
            label: "Primary",
            clientId: legacyT?.client_id || clientId,
            clientSecret: legacyT?.client_secret || clientSecret,
            access_token: legacyT?.access_token,
            refresh_token: legacyT?.refresh_token,
            expires_at: legacyT?.expires_at,
            quotaUsed: 0,
            quotaDate: ""
        });
    }
    const store = {
        active: 0,
        accounts
    };
    await setSetting("youtubeAccounts", JSON.stringify(store));
    return store;
}
async function saveAccounts(store) {
    await setSetting("youtubeAccounts", JSON.stringify(store));
}
async function loadTokens() {
    const store = await loadAccounts();
    const acc = store.accounts[store.active];
    if (!acc?.access_token) return null;
    return {
        access_token: acc.access_token,
        refresh_token: acc.refresh_token,
        expires_at: acc.expires_at ?? 0,
        client_id: acc.clientId,
        client_secret: acc.clientSecret
    };
}
async function saveTokens(t) {
    const store = await loadAccounts();
    const acc = store.accounts[store.active];
    if (!acc) return;
    acc.access_token = t.access_token;
    acc.refresh_token = t.refresh_token ?? acc.refresh_token;
    acc.expires_at = t.expires_at;
    await saveAccounts(store);
}
async function rotateAccount() {
    const store = await loadAccounts();
    if (store.accounts.length < 2) return false;
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
    const cur = store.accounts[store.active];
    cur.quotaDate = today;
    cur.quotaUsed = Number(await getSetting("youtubeQuotaUsed", "0")) || 0;
    for(let i = 1; i <= store.accounts.length; i++){
        const idx = (store.active + i) % store.accounts.length;
        const acc = store.accounts[idx];
        if (!acc.access_token) continue; // never consented
        const usedToday = acc.quotaDate === today ? acc.quotaUsed : 0;
        if (usedToday < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_LIMIT"] - 2_000) {
            store.active = idx;
            await saveAccounts(store);
            await setSetting("youtubeQuotaUsed", "0");
            await setSetting("youtubeQuotaDate", today);
            await logYt("ok", `Quota rotation → account "${acc.label}" (${store.accounts.length} configured). Uploads continue without interruption.`);
            return true;
        }
    }
    return false;
}
/** Quota guard with automatic rotation — throws only when ALL accounts are spent. */ async function ensureUploadQuota() {
    const { canAffordUpload, quotaSnapshot } = await __turbopack_context__.A("[project]/src/lib/youtube-stats.ts [app-route] (ecmascript, async loader)");
    if (await canAffordUpload()) return;
    if (await rotateAccount()) return;
    const q = await quotaSnapshot();
    throw new Error(`QUOTA_EXHAUSTED: every configured Google project is spent today (active: ${q.used}/${q.limit} units). Add another Google Cloud project in YouTube → Accounts, or request a free quota increase from Google. Uploads resume at IST midnight.`);
}
async function youtubeStatus() {
    const clientId = await getSetting("youtubeClientId", "");
    const clientSecret = await getSetting("youtubeClientSecret", "");
    const tokens = await loadTokens();
    const enabled = await getSetting("youtubeEnabled", "false") === "true";
    const channelTitle = await getSetting("youtubeChannelTitle", "");
    // Credential pool overview (#1): every configured project + which is active.
    const accStore = await loadAccounts();
    const accounts = accStore.accounts.map((a, i)=>({
            index: i,
            label: a.label,
            clientIdPreview: a.clientId ? `••••${a.clientId.slice(-6)}` : "",
            channelTitle: a.channelTitle ?? null,
            connected: Boolean(a.access_token),
            active: i === accStore.active
        }));
    // Token freshness (#24): auto-refreshes on use; show how long before it would expire.
    const tokenExpiresInMin = tokens?.expires_at ? Math.round((tokens.expires_at - Date.now()) / 60_000) : null;
    return {
        configured: Boolean(clientId && clientSecret),
        connected: Boolean(tokens?.access_token),
        enabled,
        publishDelayMinutes: PUBLISH_DELAY_MS / 60000,
        channelTitle: channelTitle || null,
        tokenExpiresInMin,
        accounts,
        activeAccount: accStore.active
    };
}
/** Exchange an auth code (or refresh) for tokens. */ async function exchange(tokens) {
    const body = new URLSearchParams({
        client_id: tokens.clientId,
        client_secret: tokens.clientSecret,
        redirect_uri: tokens.redirectUri,
        ...tokens.code ? {
            grant_type: "authorization_code",
            code: tokens.code
        } : {
            grant_type: "refresh_token",
            refresh_token: tokens.refreshToken
        }
    });
    const res = await fetch(`${OAUTH_BASE}/token`, {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        body,
        signal: AbortSignal.timeout(20_000)
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Google token exchange failed (HTTP ${res.status}): ${text.slice(0, 200)}`);
    }
    const j = await res.json();
    return {
        access_token: j.access_token,
        refresh_token: j.refresh_token || tokens.refreshToken,
        expires_at: Date.now() + j.expires_in * 1000,
        client_id: tokens.clientId,
        client_secret: tokens.clientSecret
    };
}
function authUrlWithClient(clientId, redirectUri, state) {
    const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    u.searchParams.set("client_id", clientId);
    u.searchParams.set("redirect_uri", redirectUri);
    u.searchParams.set("response_type", "code");
    u.searchParams.set("scope", SCOPES);
    u.searchParams.set("access_type", "offline");
    u.searchParams.set("prompt", "consent");
    u.searchParams.set("state", state);
    return u.toString();
}
async function handleAuthCode(code, redirectUri) {
    const store = await loadAccounts();
    const idx = store.pending !== undefined && store.pending < store.accounts.length ? store.pending : store.active;
    const acc = store.accounts[idx];
    if (!acc?.clientId || !acc.clientSecret) {
        throw new Error("Google OAuth client is not configured yet.");
    }
    const tokens = await exchange({
        code,
        clientId: acc.clientId,
        clientSecret: acc.clientSecret,
        redirectUri
    });
    // Preserve refresh token if Google didn't send a new one.
    if (!tokens.refresh_token && acc.refresh_token) {
        tokens.refresh_token = acc.refresh_token;
    }
    acc.access_token = tokens.access_token;
    acc.refresh_token = tokens.refresh_token;
    acc.expires_at = tokens.expires_at;
    store.active = idx; // freshly consented account becomes active
    store.pending = undefined;
    await saveAccounts(store);
    // Remember WHICH channel we are publishing to (#21).
    try {
        const res = await fetch(`${API_BASE}/youtube/v3/channels?part=snippet&mine=true`, {
            headers: {
                authorization: `Bearer ${tokens.access_token}`
            },
            signal: AbortSignal.timeout(15_000)
        });
        if (res.ok) {
            const j = await res.json();
            const title = j.items?.[0]?.snippet?.title;
            if (title) {
                await setSetting("youtubeChannelTitle", title);
                const st2 = await loadAccounts();
                const a2 = st2.accounts[st2.active];
                if (a2) {
                    a2.channelTitle = title;
                    await saveAccounts(st2);
                }
                await logYt("ok", `Connected to YouTube channel: "${title}".`);
            }
        }
    } catch  {
    /* identity is cosmetic */ }
    await logYt("ok", "YouTube connected — uploads enabled for today's collection.");
}
async function accessToken() {
    let t = await loadTokens();
    if (!t) return null;
    if (Date.now() > t.expires_at - 60_000 && t.refresh_token) {
        try {
            t = await exchange({
                refreshToken: t.refresh_token,
                clientId: t.client_id,
                clientSecret: t.client_secret,
                redirectUri: await redirectUri()
            });
            await saveTokens(t);
        } catch (e) {
            await logYt("error", `YouTube token refresh failed: ${e instanceof Error ? e.message : e}`);
            return null;
        }
    }
    return t.access_token;
}
async function redirectUri() {
    const override = process.env.YOUTUBE_REDIRECT_URI?.trim();
    if (override) return override;
    const saved = await getSetting("youtubeRedirectUri", "");
    return saved || "http://localhost:3000/api/youtube/callback";
}
const CATEGORY_IDS = new Set([
    "19",
    "22",
    "24"
]);
const LOCATION_LINE = "📍 Location: India";
// Rotated CTA lines — every upload reads a little different so a batch of
// videos never looks like one automated template pushed them all out.
const CTA_VARIANTS = [
    "Like, Share & Follow 🙏 | लाइक करें, शेयर करें और फॉलो करें",
    "Follow for daily Vrindavan darshan 🙏 | रोज़ वृंदावन दर्शन के लिए फॉलो करें",
    "Like & share if this touched your heart ❤️ | दिल छू लिया तो लाइक-शेयर करें",
    "Follow for more such darshan 🙏 | ऐसे और दर्शन के लिए फॉलो करें",
    "Save this for later 🙏 | बाद के लिए सेव करें",
    "Tag someone who needs this blessing today ✨ | किसी को टैग करें जिसे यह आशीर्वाद चाहिए"
];
function hashStr(s) {
    let h = 5381;
    for(let i = 0; i < s.length; i++)h = (h << 5) + h + s.charCodeAt(i) >>> 0;
    return h;
}
function ctaFor(seed) {
    return CTA_VARIANTS[hashStr(seed) % CTA_VARIANTS.length];
}
/** Small deterministic hash — used to vary hooks so titles never repeat. */ function hashOf(s) {
    let h = 5381;
    for(let i = 0; i < s.length; i++)h = (h << 5) + h + s.charCodeAt(i) >>> 0;
    return h;
}
const FALLBACK_HOOKS = [
    "This Darshan Will Take Your Breath Away",
    "You Won't Believe This Beautiful Moment",
    "Pure Devotion in One Glance",
    "Watch This Before You Scroll",
    "The Most Heart-Touching Moment",
    "Blessed Beyond Words",
    "A Moment of Pure Peace",
    "This Is Why Vrindavan Is Special",
    "Wait For The Ending 🙏",
    "Impossible To Look Away"
];
// Hindi hooks — Indian audiences engage far more with Hindi/Hinglish titles.
const FALLBACK_HOOKS_HI = [
    "इस दर्शन को देखकर आप भावुक हो जाएंगे 🙏",
    "यह नज़ारा देखकर आंखें भर आएंगी",
    "वृंदावन का अद्भुत दर्शन — देखकर मन खुश हो जाएगा",
    "इस पल को देखिए, मन को शांति मिल जाएगी",
    "यह दृश्य देखकर आपका दिन बन जाएगा",
    "भक्ति की सबसे सुंदर झलक 🙏",
    "वृंदावन धाम के अलौकिक दर्शन",
    "देखिए यह अद्भुत क्षण — हृदय खुश हो जाएगा"
];
function fallbackHeading(topicName, caption, views, variant = 0) {
    // Caption words + a caption-hash-chosen hook guarantee a UNIQUE title even
    // when several reels share a similar opening line. `variant` rotates the
    // hook when a dedupe check finds an existing identical title.
    // \p{M} keeps Devanagari matras (vowel signs) attached to their letters —
    // without it Hindi words would shatter into single characters.
    const words = caption.replace(/[^\p{L}\p{M}\p{N} ]+/gu, " ").trim().split(/\s+/).filter(Boolean);
    const clean = words.slice(0, 12).join(" ");
    const base = topicName.replace(/^Shri\s+/i, "");
    const hasDevanagari = /[\u0900-\u097F]/.test(caption);
    const seed = hashOf(caption || String(views)) + variant * 7;
    const hook = hasDevanagari ? FALLBACK_HOOKS_HI[seed % FALLBACK_HOOKS_HI.length] : views >= 1_000_000 && variant === 0 ? "This VIRAL Darshan Broke The Internet" : FALLBACK_HOOKS[seed % FALLBACK_HOOKS.length];
    const title = (words.length >= 4 ? `${base}: ${hook} | ${clean}` : `${base} — ${hook}`).slice(0, 95);
    const hashtags = [
        "#Vrindavan",
        "#India",
        "#Viral",
        "#Trending",
        "#Shorts",
        `#${base.replace(/[^A-Za-z0-9]/g, "")}`,
        "#RadhaRani",
        "#KrishnaBhakti",
        "#HinduDevotional"
    ];
    const context = clean || `${base} special darshan from Vrindavan.`;
    const cta = ctaFor(caption || base);
    // Rotate between two description layouts +6 CTA variants so a batch never
    // looks like one automated template produced it.
    const description = (variant + hashStr(caption || base)) % 2 === 0 ? [
        title,
        "",
        hashtags.join(" "),
        "",
        context,
        "",
        cta,
        LOCATION_LINE
    ].join("\n") : [
        title,
        "",
        context,
        "",
        hashtags.join(" "),
        "",
        cta,
        LOCATION_LINE
    ].join("\n");
    return {
        title,
        hashtags,
        description,
        category: "19",
        language: hasDevanagari ? "hi" : "en"
    };
}
async function aiComplete(prompt) {
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].enabled, true)).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].active), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["aiProviders"].id));
    for (const p of rows){
        if (!p.apiKey) continue;
        try {
            if (p.slug === "gemini") {
                const res = await fetch(`${p.baseUrl}/models/${encodeURIComponent(p.model || "gemini-2.5-flash-lite")}:generateContent?key=${encodeURIComponent(p.apiKey)}`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: "user",
                                parts: [
                                    {
                                        text: prompt
                                    }
                                ]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.9,
                            maxOutputTokens: 300,
                            responseMimeType: "application/json"
                        }
                    }),
                    signal: AbortSignal.timeout(25_000)
                });
                if (res.ok) {
                    const j = await res.json();
                    const text = j.candidates?.[0]?.content?.parts?.map((x)=>x.text ?? "").join("") ?? "";
                    if (text.trim()) return text;
                }
            } else {
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
                                content: prompt
                            }
                        ],
                        temperature: 0.9,
                        max_tokens: 300,
                        stream: false
                    }),
                    signal: AbortSignal.timeout(25_000)
                });
                if (res.ok) {
                    const j = await res.json();
                    const text = j.choices?.[0]?.message?.content ?? "";
                    if (text.trim()) return text;
                }
            }
        } catch  {
        // provider failed → try the next one
        }
    }
    return null;
}
/** Only "hi" or "en" are ever allowed as the YouTube language. */ function normalizeLanguage(lang, title) {
    const l = String(lang ?? "").toLowerCase().slice(0, 2);
    if (l === "hi" || l === "en") return l;
    // Devanagari title → Hindi, otherwise English (never any other language).
    return /[\u0900-\u097F]/.test(title) ? "hi" : "en";
}
/** Every Short must carry the viral hashtag set — merged in if missing. */ const GUARANTEED_VIRAL_TAGS = [
    "#Viral",
    "#Trending",
    "#India",
    "#Shorts"
];
function ensureViralHashtags(tags) {
    const out = [
        ...tags
    ];
    const has = (t)=>out.some((x)=>x.toLowerCase() === t.toLowerCase());
    for (const t of GUARANTEED_VIRAL_TAGS){
        if (!has(t) && out.length < 10) out.push(t);
    }
    return out.slice(0, 10);
}
async function generateViralHeading(topicName, caption, views, existingTitles = [], strategy) {
    const cta = ctaFor(caption || topicName);
    const prompt = `You are a world-class YouTube Shorts copywriter optimizing for VIRALITY IN INDIA for a Hindu devotional/Vrindavan audience (Hindi-speaking Indian viewers).
${strategy ? `\nMANDATORY VIRAL FORMULA FOR THIS VIDEO ("${strategy.name}"): ${strategy.instruction}\n` : ""}

Subject: "${topicName}"
Video caption/content: "${caption.slice(0, 500)}"
${views > 0 ? `Public reach signal: ~${views.toLocaleString("en-IN")} views/likes.` : ""}
${existingTitles.length ? `ALREADY-USED TITLES (your title MUST be completely different — different hook, different words): ${existingTitles.slice(0, 12).map((t)=>`"${t}"`).join(", ")}` : ""}

Create a COMPLETE package optimized for Indian virality:
1. "title": max 95 chars. Write it in Hindi (Devanagari) or natural Hinglish when the caption is Hindi — for Indian audiences Hindi/Hinglish titles go viral far more than English. If the caption is clearly English, use English with a strong Indian emotional hook. Strong curiosity/emotion hook, 1-2 emoji allowed. Never generic. NEVER similar to the already-used titles above.
2. "hashtags": 8 hashtags — MUST include Indian viral tags #viral #trending #india plus subject-specific ones (Vrindavan, Krishna, RadhaRani, HinduDevotional, bhakti etc). Hindi-translit tags welcome (#sanatandharma, #bhakti, #vrindavan).
3. "description": 4-6 lines in the SAME language as the title — line 1 = scroll-stopping hook, line 2 = hashtags, line 3 = 1-line specific context from THIS caption, line 4 = this CTA (already chosen for you): "${cta}", line 5 = "${LOCATION_LINE}".
4. "category": one of "19" (People & Blogs), "22" (Education), "24" (Entertainment).
5. "language": ONLY "hi" or "en" — never any other language. "hi" for Hindi/Hinglish content (most Indian devotional reels), "en" only for clearly English content.

CRITICAL: SPECIFIC to this video's caption — never a generic template.

Return ONLY strict JSON: {"title":"...","hashtags":["#..."],"description":"...","category":"19","language":"hi"}`;
    const raw = await aiComplete(prompt);
    if (raw) {
        try {
            const m = raw.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(m ? m[0] : raw);
            const title = String(parsed.title ?? "").trim().slice(0, 95);
            const hashtags = (Array.isArray(parsed.hashtags) ? parsed.hashtags.map(String) : []).map((h)=>h.startsWith("#") ? h : `#${h.replace(/\s+/g, "")}`).filter((h)=>h.length > 1).slice(0, 10);
            if (title && hashtags.length) {
                const category = CATEGORY_IDS.has(String(parsed.category)) ? String(parsed.category) : "19";
                const language = normalizeLanguage(parsed.language, title);
                const description = String(parsed.description ?? "").trim() || [
                    title,
                    "",
                    hashtags.join(" "),
                    "",
                    cta,
                    LOCATION_LINE
                ].join("\n");
                return {
                    title,
                    hashtags: ensureViralHashtags(hashtags),
                    description,
                    category,
                    language
                };
            }
        } catch  {
        // malformed AI output → template fallback
        }
    }
    const fb = fallbackHeading(topicName, caption, views);
    return {
        ...fb,
        hashtags: ensureViralHashtags(fb.hashtags)
    };
}
async function recentUploadTitles() {
    try {
        const manual = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            t: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].youtubeTitle
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].youtubeTitle} IS NOT NULL`).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["manualUploads"].id)).limit(40);
        const daily = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
            t: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeTitle
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeTitle} IS NOT NULL`).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["desc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id)).limit(40);
        return [
            ...manual,
            ...daily
        ].map((r)=>r.t ?? "").filter(Boolean);
    } catch  {
        return [];
    }
}
function normalizeTitle(s) {
    return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function isDuplicateTitle(title, recent) {
    const n = normalizeTitle(title);
    if (n.length < 8) return false;
    return recent.some((r)=>{
        const rn = normalizeTitle(r);
        if (!rn) return false;
        if (rn === n) return true;
        // Near-duplicate: shared 50-char stem (catches template clones).
        const stem = n.slice(0, 50);
        return stem.length >= 30 && rn.startsWith(stem);
    });
}
async function createUniqueHeading(topicName, caption, views, strategy) {
    const recent = await recentUploadTitles();
    const aiHeading = await generateViralHeading(topicName, caption, views, recent, strategy);
    if (!isDuplicateTitle(aiHeading.title, recent)) return aiHeading;
    for(let variant = 1; variant <= 5; variant++){
        const fb = fallbackHeading(topicName, caption, views, variant);
        if (!isDuplicateTitle(fb.title, recent)) return fb;
    }
    return aiHeading; // mathematically near-impossible to reach
}
async function planVideoStrategy(topicName, caption, views, videoId) {
    // Adaptive: weight formulas by what has ACTUALLY earned views on this
    // channel (post-publish analytics) — falls back to rotation with no data.
    const weights = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStrategyWeights"])();
    const strategy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$strategist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickStrategy"])(`${videoId}|${caption}`, weights);
    const heading = await createUniqueHeading(topicName, caption, views, strategy);
    heading.strategy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$strategist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["describeStrategy"])(strategy);
    await logYt("ai", `Strategy bot → "${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$strategist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["describeStrategy"])(strategy)}" for ${videoId}. Title: ${heading.title}`);
    return heading;
}
function probeDurationMs(filePath) {
    const binary = __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"] ? String(__TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"]) : "";
    if (!binary) return Promise.resolve(0);
    return new Promise((resolve)=>{
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"])(binary, [
            "-hide_banner",
            "-i",
            filePath
        ], {
            windowsHide: true,
            timeout: 20_000
        }, (_e, _o, stderr)=>{
            const m = String(stderr).match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
            resolve(m ? (+m[1] * 3600 + +m[2] * 60 + +m[3]) * 1000 : 0);
        });
    });
}
async function applyShortsOptimization(heading, filePath) {
    try {
        const dur = await probeDurationMs(filePath);
        if (dur > 0 && dur <= 62_000) {
            if (!/#shorts/i.test(heading.title)) {
                heading.title = `${heading.title} #Shorts`.slice(0, 100);
            }
            if (!/#shorts/i.test(heading.description)) {
                heading.description = `${heading.description}\n#Shorts`;
            }
        }
    } catch  {
    /* duration unknown → skip */ }
    return heading;
}
/* ---------------- thumbnail (proper frame) ------------------------------ */ /** Extracts a representative frame (20% into the video) as a JPEG thumbnail. */ const THUMB_FILTER = "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2";
function probeDuration(binary, videoPath) {
    return new Promise((resolve)=>{
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"])(binary, [
            "-hide_banner",
            "-i",
            videoPath
        ], {
            windowsHide: true,
            timeout: 15_000
        }, (_e, _o, stderr)=>{
            const m = String(stderr).match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
            resolve(m ? (+m[1] * 3600 + +m[2] * 60 + +m[3]) * 1000 : 10_000);
        });
    });
}
function grabFrame(binary, videoPath, out, seekSec) {
    const args = seekSec !== undefined ? [
        "-hide_banner",
        "-loglevel",
        "error",
        "-ss",
        seekSec.toFixed(2),
        "-i",
        videoPath,
        "-frames:v",
        "1",
        "-vf",
        THUMB_FILTER,
        "-q:v",
        "2",
        "-y",
        out
    ] : [
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        videoPath,
        "-vf",
        `select='gt(scene\\,0.3)',${THUMB_FILTER}`,
        "-frames:v",
        "1",
        "-q:v",
        "2",
        "-y",
        out
    ];
    return new Promise((resolve, reject)=>{
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"])(binary, args, {
            windowsHide: true,
            timeout: 45_000
        }, (e)=>{
            if (e) reject(e);
            else __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.stat(out).then((s)=>resolve(s.size)).catch(()=>resolve(0));
        });
    });
}
async function extractThumbnail(videoPath) {
    const binary = __TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"] ? String(__TURBOPACK__imported__module__$5b$externals$5d2f$ffmpeg$2d$static__$5b$external$5d$__$28$ffmpeg$2d$static$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$ffmpeg$2d$static$29$__["default"]) : "";
    if (!binary) return null;
    const base = videoPath.replace(/\.mp4$/i, "") + "__thumb";
    const made = [];
    try {
        const durationMs = await probeDuration(binary, videoPath);
        const durSec = Math.max(2, durationMs / 1000);
        const pcts = [
            0.1,
            0.25,
            0.4,
            0.55,
            0.7,
            0.85
        ];
        const candidates = [];
        // Sampled frames at spread timestamps.
        for(let i = 0; i < pcts.length; i++){
            const file = `${base}_${i}.jpg`;
            made.push(file);
            try {
                const size = await grabFrame(binary, videoPath, file, Math.max(0.3, durSec * pcts[i]));
                if (size > 5_000) candidates.push({
                    file,
                    size
                });
            } catch  {
            /* skip this candidate */ }
        }
        // Scene-change frame (high motion = eye-catching).
        try {
            const file = `${base}_scene.jpg`;
            made.push(file);
            const size = await grabFrame(binary, videoPath, file);
            if (size > 5_000) candidates.push({
                file,
                size
            });
        } catch  {
        /* optional */ }
        if (candidates.length === 0) return null;
        candidates.sort((a, b)=>b.size - a.size); // richest detail wins
        const best = candidates[0];
        const buf = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.readFile(best.file);
        // Clean up all candidates except we already read best into memory.
        await Promise.all(candidates.map((c)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(c.file, {
                force: true
            }).catch(()=>{})));
        return buf.length > 5_000 ? buf : null;
    } catch  {
        await Promise.all(made.map((f)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.rm(f, {
                force: true
            }).catch(()=>{})));
        return null;
    }
}
/** Extracts the Instagram shortcode from any reel URL. */ function shortcodeOf(url) {
    const m = url.match(/instagram\.com\/(?:reel|reels|p)\/([A-Za-z0-9_-]{5,})/i);
    return m ? m[1] : null;
}
async function findOnChannel(needle, title) {
    if (!needle && !title) return null;
    const token = await accessToken();
    if (!token) return null;
    // Query 1: the Instagram shortcode (matches older uploads + tag metadata).
    // Query 2: distinctive words from the unique title (descriptions no longer
    // carry the Instagram link, so the title is the reliable channel-side key).
    const queries = [];
    if (needle && needle.length >= 5) queries.push(needle);
    if (title && title.length >= 12) queries.push(title.split(/\s+/).slice(0, 6).join(" "));
    for (const q of queries){
        try {
            const res = await fetch(`${API_BASE}/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=25&q=${encodeURIComponent(q)}`, {
                headers: {
                    authorization: `Bearer ${token}`
                },
                signal: AbortSignal.timeout(25_000)
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].search, "search");
            if (!res.ok) continue;
            const j = await res.json();
            const n = q.toLowerCase();
            const qWords = n.split(/\s+/).filter((w)=>w.length > 3);
            for (const item of j.items ?? []){
                const title2 = (item.snippet?.title ?? "").toLowerCase();
                const hay = `${title2}\n${item.snippet?.description ?? ""}`.toLowerCase();
                // shortcode → exact substring; title query → majority word overlap.
                const match = needle && q === needle ? hay.includes(n) : qWords.length > 0 && qWords.filter((w)=>title2.includes(w)).length >= Math.ceil(qWords.length * 0.6);
                if (match && item.id?.videoId) return item.id.videoId;
            }
        } catch  {
        /* try next query */ }
    }
    return null;
}
/**
 * Core YouTube publisher: multipart upload (private + scheduled publishAt +
 * India location) + frame thumbnail. Shared by the daily batch and the
 * manual link queue.
 */ // Center of India — set as the video location for every Short (YouTube's
// recordingDetails.location field; deprecated in 2017 but still documented
// and accepted, with a safe retry if a future API rejects it).
const INDIA_LOCATION = {
    latitude: 20.5937,
    longitude: 78.9629,
    altitude: 0
};
/** India-optimized discovery tags — every Short gets these. */ const INDIA_TAGS = [
    "India",
    "Viral",
    "Trending",
    "Reels",
    "Shorts",
    "Vrindavan"
];
async function getTrendingTags() {
    try {
        const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
        if (await getSetting("trendingTagsAt", "") === today) {
            const raw = await getSetting("trendingTags", "");
            if (raw) return JSON.parse(raw);
        }
        const token = await accessToken();
        if (!token) return [];
        const res = await fetch(`${API_BASE}/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=50`, {
            headers: {
                authorization: `Bearer ${token}`
            },
            signal: AbortSignal.timeout(20_000)
        });
        if (!res.ok) return [];
        const j = await res.json();
        const freq = new Map();
        for (const item of j.items ?? []){
            for (const tag of item.snippet?.tags ?? []){
                const clean = String(tag).replace(/^#/, "").trim();
                if (!clean || clean.length > 30) continue;
                freq.set(clean, (freq.get(clean) ?? 0) + 1);
            }
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].videosList, "videosList");
        const top = [
            ...freq.entries()
        ].sort((a, b)=>b[1] - a[1]).slice(0, 12).map(([t])=>t);
        if (top.length) {
            await setSetting("trendingTags", JSON.stringify(top));
            await setSetting("trendingTagsAt", today);
            await logYt("ai", `Trending-tag research: refreshed ${top.length} tags from India's top videos (e.g. ${top.slice(0, 5).join(", ")}).`);
        }
        return top;
    } catch  {
        return [];
    }
}
/* ---------------- localized titles (#5) --------------------------------- */ /** Adds the OTHER language version (hi ↔ en) so the video speaks to both. */ async function setLocalizedVersions(videoId, input, token) {
    const other = input.language === "hi" ? "en" : "hi";
    const prompt = `Adapt this YouTube Short metadata into ${other === "hi" ? "Hindi (Devanagari script)" : "English"} for an Indian devotional audience. Keep ALL hashtags exactly as-is. Keep it viral and specific. Return ONLY JSON: {"title":"...","description":"..."}`;
    const raw = await aiComplete(`${prompt}\n\nTITLE: ${input.title}\nDESCRIPTION: ${input.description.slice(0, 600)}`);
    if (!raw) return;
    try {
        const m = raw.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(m ? m[0] : raw);
        const title = String(parsed.title ?? "").trim().slice(0, 95);
        const description = String(parsed.description ?? "").trim();
        if (!title) return;
        const res = await fetch(`${API_BASE}/youtube/v3/videos?part=localizations`, {
            method: "PUT",
            headers: {
                authorization: `Bearer ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: videoId,
                localizations: {
                    [other]: {
                        title,
                        description: description || input.description
                    }
                }
            }),
            signal: AbortSignal.timeout(20_000)
        });
        if (res.ok) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].update, "update");
            await logYt("ok", `Localized ${other === "hi" ? "Hindi" : "English"} title added to ${videoId}.`);
        } else {
            await logYt("warn", `Localization update skipped for ${videoId}: HTTP ${res.status}.`);
        }
    } catch  {
    /* non-fatal */ }
}
/* ---------------- topic playlists (#6) ---------------------------------- */ async function ensureTopicPlaylist(name, token) {
    try {
        const map = JSON.parse(await getSetting("youtubePlaylists", "{}") || "{}");
        if (map[name]) return map[name];
        const res = await fetch(`${API_BASE}/youtube/v3/playlists?part=snippet`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                snippet: {
                    title: `${name} | Vrindavan Darshan`,
                    description: `Curated ${name} devotional Shorts — automatically organized by ViralDarshan.`,
                    privacyStatus: "public"
                }
            }),
            signal: AbortSignal.timeout(20_000)
        });
        if (!res.ok) return null;
        const j = await res.json();
        if (!j.id) return null;
        map[name] = j.id;
        await setSetting("youtubePlaylists", JSON.stringify(map));
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].playlistInsert, "playlistInsert");
        return j.id;
    } catch  {
        return null;
    }
}
async function addVideoToPlaylist(videoId, playlistId, token) {
    try {
        const res = await fetch(`${API_BASE}/youtube/v3/playlistItems?part=snippet`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                snippet: {
                    playlistId,
                    resourceId: {
                        kind: "youtube#video",
                        videoId
                    }
                }
            }),
            signal: AbortSignal.timeout(20_000)
        });
        if (res.ok) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].playlistItem, "playlistItem");
        return res.ok;
    } catch  {
        return false;
    }
}
/* ---------------- pinned CTA comment (#11) ------------------------------ */ async function postPinnedComment(videoId, tags, token) {
    try {
        const text = `${ctaFor(videoId)}\n\n${tags.slice(0, 8).map((t)=>t.startsWith("#") ? t : `#${t}`).join(" ")}`.slice(0, 900);
        const res = await fetch(`${API_BASE}/youtube/v3/comments?part=snippet`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                snippet: {
                    videoId,
                    text
                }
            }),
            signal: AbortSignal.timeout(20_000)
        });
        if (res.ok) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].comment, "comment");
            await logYt("ok", `Pinned-style CTA comment posted on ${videoId}.`);
        } else {
            await logYt("warn", `CTA comment skipped for ${videoId}: HTTP ${res.status}.`);
        }
    } catch  {
    /* non-fatal */ }
}
async function publishVideoFile(input) {
    let token = await accessToken();
    if (!token) throw new Error("not connected / token refresh failed");
    // ---- Quota guard: rotate to the next Google project when one is spent;
    // only throws when EVERY configured credential is exhausted.
    await ensureUploadQuota();
    // Trending tags from India's real top videos (refreshed once/day).
    const trending = await getTrendingTags();
    // ---- Channel-wide dedupe: never upload a video that already exists on
    // this YouTube channel (checks by the Instagram shortcode, which every
    // description we publish carries as its Source line).
    const shortcode = input.sourceUrl ? shortcodeOf(input.sourceUrl) : null;
    {
        const existing = await findOnChannel(shortcode ?? "", input.title);
        if (existing) {
            await logYt("ok", `Channel check: this reel is ALREADY on your YouTube (${existing}) — upload skipped, never duplicated.`);
            return {
                id: existing,
                alreadyOnChannel: true
            };
        }
    }
    // Claim-safe mode (#26): credit + fair-use notice, but NO Instagram link is
    // ever shown on YouTube (user requirement) — the shortcode rides in the
    // private tags field instead, which powers the channel-side dedupe check.
    const copyrightOn = await getSetting("copyrightDisclaimer", "true") === "true";
    const DISCLAIMER = "\n\n⚠️ All rights belong to the original creators. Shared for devotional/archival purposes with full credit. For removal or credit changes, contact the uploader.";
    const description = input.description + (copyrightOn ? DISCLAIMER : "");
    const shortcodeTag = input.sourceUrl ? shortcodeOf(input.sourceUrl) : null;
    const buildMetadata = (withLocation)=>({
            snippet: {
                title: input.title,
                description,
                tags: trimTags([
                    ...new Set([
                        ...input.tags,
                        ...INDIA_TAGS,
                        ...trending,
                        ...shortcodeTag ? [
                            shortcodeTag
                        ] : []
                    ])
                ]),
                categoryId: input.category && CATEGORY_IDS.has(input.category) ? input.category : "19",
                defaultLanguage: input.language === "hi" ? "hi" : "en",
                defaultAudioLanguage: input.language === "hi" ? "hi" : "en"
            },
            status: {
                privacyStatus: "private",
                publishAt: input.publishAt,
                selfDeclaredMadeForKids: false,
                publicStatsViewable: true
            },
            recordingDetails: {
                recordingDate: new Date().toISOString(),
                // The real location field (my earlier bug: recordingLocation was the
                // WRONG name — fileDetails, not recordingDetails — so it never applied).
                ...withLocation ? {
                    location: INDIA_LOCATION,
                    locationDescription: "India"
                } : {}
            }
        });
    const fileBytes = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].promises.readFile(input.filePath);
    const boundary = "viraldarshan" + Date.now().toString(36);
    const postOnce = async (metadata)=>{
        const parts = [
            Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`),
            Buffer.from(`--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`),
            fileBytes,
            Buffer.from(`\r\n--${boundary}--\r\n`)
        ];
        const res = await fetch(`${API_BASE}/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status,recordingDetails`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "content-type": `multipart/related; boundary=${boundary}`
            },
            body: new Uint8Array(Buffer.concat(parts)),
            signal: AbortSignal.timeout(180_000)
        });
        const text = await res.text();
        if (res.ok) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].upload, "upload");
            return {
                ok: true,
                id: JSON.parse(text).id
            };
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isQuotaError"])(res.status, text)) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["markQuotaExhausted"])();
            return {
                ok: false,
                quota: true,
                error: `YouTube quotaExceeded (HTTP ${res.status}) — daily API budget spent.`
            };
        }
        return {
            ok: false,
            error: `HTTP ${res.status}: ${text.slice(0, 300)}`
        };
    };
    // First try WITH the India location. If a future API build rejects the
    // (deprecated) location fields, retry once without them so the upload
    // itself never fails.
    let result = await postOnce(buildMetadata(true));
    if (!result.ok && /invalidRecordingDetails/i.test(result.error ?? "")) {
        await logYt("warn", "YouTube rejected recordingDetails.location — retrying without the map field (description/tags still carry India).");
        result = await postOnce(buildMetadata(false));
    }
    // Real quotaExceeded from Google → rotate to the next project and retry once.
    if (!result.ok && result.quota && await rotateAccount()) {
        const fresh = await accessToken();
        if (fresh) {
            token = fresh;
            await logYt("warn", "YouTube quota hit on the active project — rotated to the next credential, retrying upload.");
            result = await postOnce(buildMetadata(true));
        }
    }
    if (!result.ok || !result.id) {
        if (result.quota) {
            throw new Error(`QUOTA_EXHAUSTED: ${result.error} Remaining videos stay queued and upload after the IST-midnight reset.`);
        }
        throw new Error(`YouTube upload failed (${result.error})`);
    }
    const j = {
        id: result.id
    };
    // Thumbnail: proper view frame from the video.
    try {
        const thumb = await extractThumbnail(input.filePath);
        if (thumb) {
            const tres = await fetch(`${API_BASE}/upload/youtube/v3/thumbnails/set?videoId=${encodeURIComponent(j.id)}&uploadType=media`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${token}`,
                    "content-type": "image/jpeg"
                },
                body: new Uint8Array(thumb),
                signal: AbortSignal.timeout(60_000)
            });
            if (tres.ok) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].thumbnail, "thumbnail");
            } else {
                await logYt("warn", `Thumbnail set failed for ${j.id}: HTTP ${tres.status} (video is uploaded).`);
            }
        }
    } catch (e) {
        await logYt("warn", `Thumbnail extraction failed for ${j.id}: ${e instanceof Error ? e.message : e}`);
    }
    // Verify the India location actually stuck (deprecated field — Google may
    // drop it silently). Read it back, and if missing try videos.update once.
    try {
        const check = await fetch(`${API_BASE}/youtube/v3/videos?part=recordingDetails&id=${encodeURIComponent(j.id)}`, {
            headers: {
                authorization: `Bearer ${token}`
            },
            signal: AbortSignal.timeout(20_000)
        });
        const cj = await check.json();
        const hasLoc = typeof cj.items?.[0]?.recordingDetails?.location?.latitude === "number";
        if (!hasLoc) {
            const upd = await fetch(`${API_BASE}/youtube/v3/videos?part=recordingDetails`, {
                method: "PUT",
                headers: {
                    authorization: `Bearer ${token}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    id: j.id,
                    recordingDetails: {
                        recordingDate: new Date().toISOString(),
                        location: INDIA_LOCATION,
                        locationDescription: "India"
                    }
                }),
                signal: AbortSignal.timeout(20_000)
            });
            if (upd.ok) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addQuota"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$youtube$2d$stats$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QUOTA_COST"].update, "update");
                await logYt("ok", `India map location set on ${j.id} via videos.update.`);
            } else {
                await logYt("warn", `YouTube did not accept the map location for ${j.id} (HTTP ${upd.status}) — the deprecated field is ignored by this API version; description/tags still carry India. Set the pin manually in YouTube Studio if needed.`);
            }
        } else {
            await logYt("ok", `India location verified on ${j.id} (read back from YouTube).`);
        }
    } catch (e) {
        await logYt("warn", `Location verification skipped for ${j.id}: ${e instanceof Error ? e.message : e}`);
    }
    // ---- Post-upload enhancements (all non-fatal, all quota-tracked) ----
    if (await getSetting("youtubeLocalizedTitles", "true") === "true") {
        await setLocalizedVersions(j.id, input, token);
    }
    if (input.playlistName && await getSetting("youtubePlaylistsEnabled", "true") === "true") {
        try {
            const playlistId = await ensureTopicPlaylist(input.playlistName, token);
            if (playlistId && await addVideoToPlaylist(j.id, playlistId, token)) {
                await logYt("ok", `${j.id} added to playlist "${input.playlistName}".`);
            }
        } catch  {
        /* non-fatal */ }
    }
    if (await getSetting("youtubeCommentsEnabled", "true") === "true") {
        await postPinnedComment(j.id, input.tags, token);
    }
    return {
        id: j.id
    };
}
/** Keeps snippet.tags within YouTube's 500-character budget. */ function trimTags(tags) {
    const out = [];
    let len = 0;
    for (const t of tags){
        const v = t.slice(0, 30);
        if (!v) continue;
        if (len + v.length + 1 > 480) break;
        out.push(v);
        len += v.length + 1;
    }
    return out.slice(0, 40);
}
/** Daily-batch upload: AI heading + publish in 15 minutes. */ async function uploadOne(row, _token) {
    if (!row.filePath) throw new Error("local file missing");
    let heading = await planVideoStrategy(row.topicName, row.caption, row.viewCount, row.videoId);
    heading = await applyShortsOptimization(heading, row.filePath);
    // Same peak-time scheduler as manual uploads: 9–11 PM IST slots with natural
    // jitter, collision-avoiding the manual queue (fallback: +15 min).
    const [slot] = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$schedule$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["planPublishSlots"])(1, null, {
        includeDaily: true
    });
    const publishAt = new Date(slot ?? Date.now() + PUBLISH_DELAY_MS).toISOString();
    const { id, alreadyOnChannel } = await publishVideoFile({
        filePath: row.filePath,
        title: heading.title,
        description: heading.description,
        tags: heading.hashtags.map((h)=>h.slice(1)).concat([
            "Vrindavan",
            "Darshan",
            "Devotional",
            "India"
        ]),
        publishAt,
        category: heading.category,
        language: heading.language,
        sourceUrl: row.url,
        playlistName: row.topicName
    });
    return {
        id,
        publishAt,
        title: heading.title,
        strategy: heading.strategy ?? null,
        alreadyOnChannel: Boolean(alreadyOnChannel)
    };
}
let uploading = false;
async function uploadPendingBatch() {
    if (uploading) return {
        uploaded: 0,
        failed: 0
    };
    const st = await youtubeStatus();
    if (!st.enabled || !st.connected) return {
        uploaded: 0,
        failed: 0
    };
    const ist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ist$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["istDate"])();
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id,
        videoId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].videoId,
        url: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].url,
        caption: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].caption,
        viewCount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].viewCount,
        filePath: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].filePath,
        youtubeStatus: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeStatus,
        topicName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].name
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).innerJoin(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].topicId, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["topics"].id)).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, ist), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].status, "completed"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].aiVerdict, "match"))).orderBy((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$select$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id));
    const pending = rows.filter((r)=>!r.filePath || r.youtubeStatus === "none" || r.youtubeStatus === "failed");
    // Hard cap: 5 uploads total per IST day (manual + daily combined).
    const dailyUploaded = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, ist), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeStatus, "uploaded"))))[0]?.n ?? 0;
    let manualUsed = 0;
    try {
        const raw = await getSetting("manualUploadedToday", "");
        const [d, n] = raw.split("|");
        if (d === ist) manualUsed = Number(n) || 0;
    } catch  {
        manualUsed = 0;
    }
    const slots = Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DAILY_LIMIT"] - (dailyUploaded + manualUsed));
    const capped = pending.slice(0, slots);
    if (capped.length < pending.length) {
        await logYt("info", `YouTube: daily cap 5/day — ${pending.length - capped.length} queued video(s) deferred to tomorrow (${dailyUploaded + manualUsed} already uploaded today).`);
    }
    if (capped.length === 0) {
        if (pending.length > 0) {
            await logYt("info", "YouTube: daily upload cap (5) reached — remaining videos stay queued for tomorrow.");
        }
        return {
            uploaded: 0,
            failed: 0
        };
    }
    uploading = true;
    let uploaded = 0;
    let failed = 0;
    try {
        await logYt("info", `YouTube: starting upload of ${capped.length} of ${pending.length} queued video(s) (daily cap 5) — location: India.`);
        for (const row of capped){
            const token = await accessToken();
            if (!token) {
                failed++;
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).set({
                    youtubeStatus: "failed",
                    ytError: "not connected / token refresh failed"
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id, row.id));
                continue;
            }
            try {
                const out = await uploadOne(row, token);
                uploaded++;
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).set({
                    youtubeStatus: "uploaded",
                    youtubeId: out.id,
                    youtubeUrl: `https://www.youtube.com/watch?v=${out.id}`,
                    youtubeTitle: out.title,
                    strategy: out.strategy,
                    publishAt: new Date(out.publishAt),
                    uploadedAt: new Date(),
                    ytError: null
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id, row.id));
                await logYt("ok", out.alreadyOnChannel ? `YouTube: this video already exists on your channel (${out.id}) — upload skipped, zero duplicates.` : `YouTube: "${out.title}" uploaded → goes PUBLIC at ${new Date(out.publishAt).toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata"
                })} IST. https://www.youtube.com/watch?v=${out.id}`);
            } catch (e) {
                failed++;
                const msg = e instanceof Error ? e.message : String(e);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).set({
                    youtubeStatus: "failed",
                    ytError: msg.slice(0, 500)
                }).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].id, row.id));
                await logYt("error", `YouTube upload failed for ${row.videoId}: ${msg.slice(0, 200)}`);
            }
        }
    } finally{
        uploading = false;
    }
    return {
        uploaded,
        failed
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0xj94u5hj03cn._.js.map