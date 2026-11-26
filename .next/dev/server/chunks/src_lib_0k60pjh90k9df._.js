(()=>{"use strict";module.exports = [
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
        slug: "vrindavan-mandir-deity",
        name: "Vrindavan Temple & Deity",
        hindiName: "",
        folder: "Vrindavan_Mandir_Deity",
        keywords: [
            "Vrindavan temple",
            "Banke Bihari Mandir",
            "Radha Raman Mandir",
            "Govind Dev Mandir",
            "Radha Vallabh Mandir",
            "Vrindavan Darshan",
            "#vrindavan",
            "#vrindavandarshan",
            "mathura vrindavan mandir",
            "Vrindavan deity darshan",
            "Braj mandir",
            "Vrindavan mandir darshan"
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
        const dailyLimit = Math.min(await getDailyLimit(), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DAILY_LIMIT"]); // UPLOADS/day = 5
        const minViews = await getMinViews();
        const findTarget = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FIND_DAILY"]; // DOWNLOADS/day = 20
        const done = await todayCompleted(ist);
        // Downloads target: 20/day (the 5/day upload target is enforced at upload time).
        const remaining = Math.max(0, findTarget - done);
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
        // Mandir-only scope: temple/deity relevance (topic search), >1 lakh views,
        // and the video must come from a Vrindavan-related CHANNEL (personal
        // Instagram accounts are rejected).
        const eligible = candidates.filter((c)=>c.viewCount > minViews && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isVrindavanSource"])(c.author, c.caption));
        logs.push([
            eligible.length > 0 ? "info" : "warn",
            eligible.length > 0 ? `Eligible: ${eligible.length} Reel(s) above ${minViews.toLocaleString("en-IN")} views from recognized Vrindavan channels (personal accounts rejected).` : `No Vrindavan-channel Reel above ${minViews.toLocaleString("en-IN")} views this pass. Nothing fake will be downloaded.`
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
        const remainingAfter = Math.max(0, findTarget - after);
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
    const dailyLimit = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FIND_DAILY"]; // 20 videos found per day
    const uploadTarget = Math.min(await getDailyLimit(), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$reels$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DAILY_LIMIT"]); // 5 uploads/day
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
    const uploadsToday = (await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].select({
        n: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`count(*)::int`
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].istDate, ist), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["downloads"].youtubeStatus, "uploaded"))))[0]?.n ?? 0;
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
        uploadTarget,
        uploadsToday,
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
];})()

//# sourceMappingURL=src_lib_0k60pjh90k9df._.js.map