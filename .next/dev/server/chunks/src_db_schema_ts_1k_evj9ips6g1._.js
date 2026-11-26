module.exports = [
"[project]/src/db/schema.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/table.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/serial.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/text.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/integer.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/boolean.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/timestamp.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/columns/jsonb.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/indexes.js [instrumentation] (ecmascript)");
;
;
const topics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["pgTable"])("topics", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("slug").notNull().unique(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    hindiName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("hindi_name").notNull(),
    folder: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("folder").notNull(),
    keywords: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["jsonb"])("keywords").$type().notNull().default([]),
    enabled: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["boolean"])("enabled").notNull().default(true),
    sortOrder: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("sort_order").notNull().default(0),
    // Reference photo of the deity/saint (data URL). Given to the vision AI so it
    // can compare video frames against the correct subject instead of guessing.
    referenceImage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("reference_image"),
    // Up to 3 reference photos (JSON array of data URLs) — multi-angle matching.
    referencePhotos: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$jsonb$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["jsonb"])("reference_photos").$type().notNull().default([])
});
const downloads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["pgTable"])("downloads", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    // Permanent cache identity
    videoId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("video_id").notNull(),
    url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("url").notNull(),
    topicId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("topic_id").notNull().references(()=>topics.id),
    caption: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("caption").notNull().default(""),
    author: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("author").notNull().default(""),
    viewCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("view_count").notNull().default(0),
    likeCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("like_count").notNull().default(0),
    metricSource: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("metric_source").notNull().default("views"),
    strategy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("strategy"),
    phash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("phash"),
    aiFrame: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ai_frame"),
    transcript: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("transcript"),
    aiVerdict: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ai_verdict").notNull().default("pending"),
    aiProvider: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ai_provider"),
    aiConfidence: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("ai_confidence"),
    aiDetectedTopic: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ai_detected_topic"),
    aiReason: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ai_reason"),
    // lifecycle: completed | failed | skipped_duplicate | ai_rejected
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("completed"),
    istDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ist_date").notNull(),
    filePath: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("file_path"),
    fileName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("file_name"),
    fileHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("file_hash"),
    fileSize: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("file_size"),
    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("error"),
    scanRunId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("scan_run_id"),
    // YouTube publishing lifecycle
    youtubeStatus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("youtube_status").notNull().default("none"),
    youtubeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("youtube_id"),
    youtubeUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("youtube_url"),
    youtubeTitle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("youtube_title"),
    publishAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("publish_at", {
        withTimezone: true
    }),
    uploadedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("uploaded_at", {
        withTimezone: true
    }),
    ytError: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("yt_error"),
    discoveredAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("discovered_at", {
        withTimezone: true
    }).notNull().defaultNow(),
    downloadedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("downloaded_at", {
        withTimezone: true
    })
}, (t)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["uniqueIndex"])("downloads_video_id_uq").on(t.videoId),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["uniqueIndex"])("downloads_url_uq").on(t.url),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["index"])("downloads_ist_date_idx").on(t.istDate),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["index"])("downloads_status_idx").on(t.status),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["index"])("downloads_hash_idx").on(t.fileHash),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["uniqueIndex"])("downloads_one_approved_per_topic_day_uq").on(t.topicId, t.istDate).where(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["sql"]`${t.status} = 'completed' AND ${t.aiVerdict} = 'match'`)
    ]);
const scanRuns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["pgTable"])("scan_runs", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    trigger: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("trigger").notNull().default("scheduled"),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("running"),
    istDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ist_date").notNull(),
    candidates: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("candidates").notNull().default(0),
    eligible: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("eligible").notNull().default(0),
    fresh: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("fresh").notNull().default(0),
    downloaded: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("downloaded").notNull().default(0),
    duplicates: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("duplicates").notNull().default(0),
    failed: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("failed").notNull().default(0),
    quotaBefore: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("quota_before").notNull().default(0),
    message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("message").notNull().default(""),
    aiProvider: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ai_provider"),
    startedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("started_at", {
        withTimezone: true
    }).notNull().defaultNow(),
    finishedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("finished_at", {
        withTimezone: true
    })
});
const activityLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["pgTable"])("activity_logs", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    ts: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("ts", {
        withTimezone: true
    }).notNull().defaultNow(),
    level: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("level").notNull().default("info"),
    message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("message").notNull()
});
const aiProviders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["pgTable"])("ai_providers", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("slug").notNull().unique(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    baseUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("base_url").notNull(),
    docsUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("docs_url").notNull().default(""),
    freeTier: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("free_tier").notNull().default(""),
    model: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("model").notNull().default(""),
    apiKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("api_key"),
    active: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["boolean"])("active").notNull().default(false),
    enabled: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$boolean$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["boolean"])("enabled").notNull().default(true),
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("untested"),
    statusDetail: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("status_detail").notNull().default(""),
    lastTestedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("last_tested_at", {
        withTimezone: true
    })
});
const videoStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["pgTable"])("video_stats", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    youtubeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("youtube_id").notNull(),
    source: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("source").notNull(),
    sourceId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("source_id").notNull(),
    viewCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("view_count").notNull().default(0),
    likeCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("like_count").notNull().default(0),
    commentCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("comment_count").notNull().default(0),
    hoursAfter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("hours_after").notNull(),
    checkedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("checked_at", {
        withTimezone: true
    }).notNull().defaultNow(),
    strategy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("strategy"),
    publishAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("publish_at", {
        withTimezone: true
    })
});
const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["pgTable"])("settings", {
    key: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("key").primaryKey(),
    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("value").notNull()
});
const manualUploads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["pgTable"])("manual_uploads", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$serial$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["serial"])("id").primaryKey(),
    videoId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("video_id").notNull().unique(),
    url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("url").notNull(),
    // queued | downloading | downloaded | uploading | uploaded | failed
    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("status").notNull().default("queued"),
    filePath: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("file_path"),
    fileHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("file_hash"),
    fileSize: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("file_size"),
    publishAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("publish_at", {
        withTimezone: true
    }),
    youtubeId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("youtube_id"),
    youtubeUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("youtube_url"),
    youtubeTitle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("youtube_title"),
    strategy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("strategy"),
    phash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("phash"),
    priority: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["integer"])("priority").notNull().default(0),
    aiFrame: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("ai_frame"),
    transcript: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("transcript"),
    error: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["text"])("error"),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("created_at", {
        withTimezone: true
    }).notNull().defaultNow(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["timestamp"])("updated_at", {
        withTimezone: true
    }).notNull().defaultNow()
}, (t)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["uniqueIndex"])("manual_uploads_video_id_uq").on(t.videoId)
    ]);
}),
];

//# sourceMappingURL=src_db_schema_ts_1k_evj9ips6g1._.js.map