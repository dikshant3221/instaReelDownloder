module.exports = [
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
];

//# sourceMappingURL=src_lib_youtube-stats_ts_105o3n2ggriy0._.js.map