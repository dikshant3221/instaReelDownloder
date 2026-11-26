import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/**
 * ViralDarshan — permanent cache + state schema.
 *
 * Design notes:
 * - `downloads` is the PERMANENT dedupe cache. Rows are never deleted by the
 *   engine; unique constraints on videoId + url make "never download twice"
 *   enforceable at the database level, across days and restarts.
 * - The daily counter is DERIVED from `downloads` (status='completed',
 *   aiVerdict='match', istDate=today). A crash/restart can never reset or inflate the count,
 *   and the 7/day limit (exactly one approved video per topic) is enforced.
 */

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  hindiName: text("hindi_name").notNull(),
  folder: text("folder").notNull(),
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  enabled: boolean("enabled").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  // Reference photo of the deity/saint (data URL). Given to the vision AI so it
  // can compare video frames against the correct subject instead of guessing.
  referenceImage: text("reference_image"),
  // Up to 3 reference photos (JSON array of data URLs) — multi-angle matching.
  referencePhotos: jsonb("reference_photos").$type<string[]>().notNull().default([]),
});

export const downloads = pgTable(
  "downloads",
  {
    id: serial("id").primaryKey(),
    // Permanent cache identity
    videoId: text("video_id").notNull(), // Instagram shortcode
    url: text("url").notNull(), // canonical reel URL
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id),
    caption: text("caption").notNull().default(""),
    author: text("author").notNull().default(""),
    viewCount: integer("view_count").notNull().default(0),
    likeCount: integer("like_count").notNull().default(0),
    metricSource: text("metric_source").notNull().default("views"), // views | plays | likes-lower-bound
    strategy: text("strategy"), // viral formula used by the Strategy Bot
    phash: text("phash"), // perceptual frame hash — catches re-uploads of the same visual
    aiFrame: text("ai_frame"), // data-URL of the frame the AI saw (rejection audit)
    transcript: text("transcript"), // spoken-content transcript (Gemini audio), searchable
    aiVerdict: text("ai_verdict").notNull().default("pending"), // pending | match | mismatch | uncertain
    aiProvider: text("ai_provider"),
    aiConfidence: integer("ai_confidence"),
    aiDetectedTopic: text("ai_detected_topic"),
    aiReason: text("ai_reason"),
    // lifecycle: completed | failed | skipped_duplicate | ai_rejected
    status: text("status").notNull().default("completed"),
    istDate: text("ist_date").notNull(), // YYYY-MM-DD in Asia/Kolkata
    filePath: text("file_path"), // absolute local path in Windows Downloads
    fileName: text("file_name"),
    fileHash: text("file_hash"), // sha256 of bytes — extra dedupe signal
    fileSize: integer("file_size"),
    error: text("error"),
    scanRunId: integer("scan_run_id"),
    // YouTube publishing lifecycle
    youtubeStatus: text("youtube_status").notNull().default("none"), // none|pending|uploaded|failed
    youtubeId: text("youtube_id"),
    youtubeUrl: text("youtube_url"),
    youtubeTitle: text("youtube_title"),
    publishAt: timestamp("publish_at", { withTimezone: true }),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }),
    ytError: text("yt_error"),
    discoveredAt: timestamp("discovered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    downloadedAt: timestamp("downloaded_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("downloads_video_id_uq").on(t.videoId),
    uniqueIndex("downloads_url_uq").on(t.url),
    index("downloads_ist_date_idx").on(t.istDate),
    index("downloads_status_idx").on(t.status),
    index("downloads_hash_idx").on(t.fileHash),
    uniqueIndex("downloads_one_approved_per_topic_day_uq")
      .on(t.topicId, t.istDate)
      .where(sql`${t.status} = 'completed' AND ${t.aiVerdict} = 'match'`),
  ],
);

export const scanRuns = pgTable("scan_runs", {
  id: serial("id").primaryKey(),
  trigger: text("trigger").notNull().default("scheduled"), // scheduled | manual
  status: text("status").notNull().default("running"), // running | finished | skipped
  istDate: text("ist_date").notNull(),
  candidates: integer("candidates").notNull().default(0),
  eligible: integer("eligible").notNull().default(0),
  fresh: integer("fresh").notNull().default(0),
  downloaded: integer("downloaded").notNull().default(0),
  duplicates: integer("duplicates").notNull().default(0),
  failed: integer("failed").notNull().default(0),
  quotaBefore: integer("quota_before").notNull().default(0),
  message: text("message").notNull().default(""),
  aiProvider: text("ai_provider"),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
  level: text("level").notNull().default("info"), // info | ok | warn | error | ai
  message: text("message").notNull(),
});

export const aiProviders = pgTable("ai_providers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  baseUrl: text("base_url").notNull(),
  docsUrl: text("docs_url").notNull().default(""),
  freeTier: text("free_tier").notNull().default(""),
  model: text("model").notNull().default(""),
  apiKey: text("api_key"), // stored locally only, masked in UI
  active: boolean("active").notNull().default(false),
  enabled: boolean("enabled").notNull().default(true),
  status: text("status").notNull().default("untested"), // untested | ok | error
  statusDetail: text("status_detail").notNull().default(""),
  lastTestedAt: timestamp("last_tested_at", { withTimezone: true }),
});

/**
 * Post-publish performance checkpoints (+1h, +6h, +24h) pulled from
 * YouTube — the data the Strategy Bot learns from.
 */
export const videoStats = pgTable("video_stats", {
  id: serial("id").primaryKey(),
  youtubeId: text("youtube_id").notNull(),
  source: text("source").notNull(), // manual | daily
  sourceId: integer("source_id").notNull(),
  viewCount: integer("view_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
  hoursAfter: integer("hours_after").notNull(), // checkpoint bucket: 1 | 6 | 24
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
  strategy: text("strategy"),
  publishAt: timestamp("publish_at", { withTimezone: true }),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

/**
 * Manually submitted Instagram links: downloaded directly (no AI topic gate)
 * and published to YouTube on a user-chosen schedule (default: 5-min gaps).
 * Completely separate from the daily 7-video auto collection.
 */
export const manualUploads = pgTable(
  "manual_uploads",
  {
    id: serial("id").primaryKey(),
    videoId: text("video_id").notNull().unique(),
    url: text("url").notNull(),
    // queued | downloading | downloaded | uploading | uploaded | failed
    status: text("status").notNull().default("queued"),
    filePath: text("file_path"),
    fileHash: text("file_hash"),
    fileSize: integer("file_size"),
    publishAt: timestamp("publish_at", { withTimezone: true }),
    youtubeId: text("youtube_id"),
    youtubeUrl: text("youtube_url"),
    youtubeTitle: text("youtube_title"),
    strategy: text("strategy"),
    phash: text("phash"),
    priority: integer("priority").notNull().default(0), // lower = processed first
    uploadedDay: text("uploaded_day"), // IST day this row was uploaded (counted toward the 5/day cap)
    aiFrame: text("ai_frame"),
    transcript: text("transcript"),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("manual_uploads_video_id_uq").on(t.videoId)],
);
