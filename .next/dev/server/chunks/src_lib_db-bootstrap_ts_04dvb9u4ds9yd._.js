module.exports = [
"[project]/src/lib/db-bootstrap.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureDatabaseReady",
    ()=>ensureDatabaseReady
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:os [external] (node:os, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
;
/**
 * Zero-config database bootstrap — PGlite edition.
 *
 * What a layman experiences: `npm install && npm run dev` — and THAT IS ALL.
 *
 * Decision tree (all automatic):
 *   1. DATABASE_URL reachable        -> use it, verify tables, done
 *   2. DATABASE_URL missing or down  -> boot a REAL PostgreSQL compiled to
 *      WebAssembly (PGlite) right inside this process — no binaries to
 *      download, no ports, no admin rights, impossible to "fail to install",
 *      works identically on Windows/macOS/Linux. Data persists in .pglite/
 *
 * Tables are created with plain idempotent SQL (works for BOTH drivers),
 * so no drizzle-kit subprocess is needed in dev or by end users.
 */ const log = (...args)=>console.log("[ViralDarshan DB]", ...args);
const warn = (...args)=>console.warn("[ViralDarshan DB]", ...args);
const g = globalThis;
/* ------------------------------------------------------- schema (DDL) --- */ /** Mirrors src/db/schema.ts exactly; every statement is idempotent. */ const BOOT_SQL = `
CREATE TABLE IF NOT EXISTS topics (
  id serial PRIMARY KEY,
  slug text NOT NULL,
  name text NOT NULL,
  hindi_name text NOT NULL,
  folder text NOT NULL,
  keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  reference_image text
);
ALTER TABLE topics ADD COLUMN IF NOT EXISTS reference_image text;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS reference_photos jsonb NOT NULL DEFAULT '[]'::jsonb;
CREATE UNIQUE INDEX IF NOT EXISTS topics_slug_uq ON topics (slug);

CREATE TABLE IF NOT EXISTS downloads (
  id serial PRIMARY KEY,
  video_id text NOT NULL,
  url text NOT NULL,
  topic_id integer NOT NULL REFERENCES topics (id),
  caption text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT '',
  view_count integer NOT NULL DEFAULT 0,
  like_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed',
  ist_date text NOT NULL,
  file_path text,
  file_name text,
  file_hash text,
  file_size integer,
  error text,
  scan_run_id integer,
  discovered_at timestamptz NOT NULL DEFAULT now(),
  downloaded_at timestamptz
);
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS metric_source text NOT NULL DEFAULT 'views';
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS ai_verdict text NOT NULL DEFAULT 'pending';
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS ai_provider text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS ai_confidence integer;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS ai_detected_topic text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS ai_reason text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS youtube_status text NOT NULL DEFAULT 'none';
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS youtube_id text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS youtube_url text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS youtube_title text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS publish_at timestamptz;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS uploaded_at timestamptz;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS yt_error text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS strategy text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS phash text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS ai_frame text;
ALTER TABLE downloads ADD COLUMN IF NOT EXISTS transcript text;
CREATE UNIQUE INDEX IF NOT EXISTS downloads_video_id_uq ON downloads (video_id);
CREATE UNIQUE INDEX IF NOT EXISTS downloads_url_uq ON downloads (url);
CREATE INDEX IF NOT EXISTS downloads_ist_date_idx ON downloads (ist_date);
CREATE INDEX IF NOT EXISTS downloads_status_idx ON downloads (status);
CREATE INDEX IF NOT EXISTS downloads_hash_idx ON downloads (file_hash);
CREATE UNIQUE INDEX IF NOT EXISTS downloads_one_approved_per_topic_day_uq
  ON downloads (topic_id, ist_date)
  WHERE status = 'completed' AND ai_verdict = 'match';

CREATE TABLE IF NOT EXISTS scan_runs (
  id serial PRIMARY KEY,
  trigger text NOT NULL DEFAULT 'scheduled',
  status text NOT NULL DEFAULT 'running',
  ist_date text NOT NULL,
  candidates integer NOT NULL DEFAULT 0,
  eligible integer NOT NULL DEFAULT 0,
  fresh integer NOT NULL DEFAULT 0,
  downloaded integer NOT NULL DEFAULT 0,
  duplicates integer NOT NULL DEFAULT 0,
  failed integer NOT NULL DEFAULT 0,
  quota_before integer NOT NULL DEFAULT 0,
  message text NOT NULL DEFAULT '',
  ai_provider text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id serial PRIMARY KEY,
  ts timestamptz NOT NULL DEFAULT now(),
  level text NOT NULL DEFAULT 'info',
  message text NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_providers (
  id serial PRIMARY KEY,
  slug text NOT NULL,
  name text NOT NULL,
  base_url text NOT NULL,
  docs_url text NOT NULL DEFAULT '',
  free_tier text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  api_key text,
  active boolean NOT NULL DEFAULT false,
  enabled boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'untested',
  status_detail text NOT NULL DEFAULT '',
  last_tested_at timestamptz
);
ALTER TABLE ai_providers ADD COLUMN IF NOT EXISTS model text NOT NULL DEFAULT '';
CREATE UNIQUE INDEX IF NOT EXISTS ai_providers_slug_uq ON ai_providers (slug);

CREATE TABLE IF NOT EXISTS manual_uploads (
  id serial PRIMARY KEY,
  video_id text NOT NULL UNIQUE,
  url text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  file_path text,
  file_hash text,
  file_size integer,
  publish_at timestamptz,
  youtube_id text,
  youtube_url text,
  youtube_title text,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE manual_uploads ADD COLUMN IF NOT EXISTS strategy text;
ALTER TABLE manual_uploads ADD COLUMN IF NOT EXISTS phash text;
ALTER TABLE manual_uploads ADD COLUMN IF NOT EXISTS priority integer NOT NULL DEFAULT 0;
ALTER TABLE manual_uploads ADD COLUMN IF NOT EXISTS ai_frame text;
ALTER TABLE manual_uploads ADD COLUMN IF NOT EXISTS transcript text;

CREATE TABLE IF NOT EXISTS video_stats (
  id serial PRIMARY KEY,
  youtube_id text NOT NULL,
  source text NOT NULL,
  source_id integer NOT NULL,
  view_count integer NOT NULL DEFAULT 0,
  like_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  hours_after integer NOT NULL,
  checked_at timestamptz NOT NULL DEFAULT now(),
  strategy text,
  publish_at timestamptz
);
CREATE INDEX IF NOT EXISTS video_stats_yt_idx ON video_stats (youtube_id, hours_after);

CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL
);
`;
async function bootExternal(url) {
    let client = null;
    try {
        const { Client } = await __turbopack_context__.A("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg, async loader)");
        client = new Client({
            connectionString: url,
            connectionTimeoutMillis: 4000
        });
        await client.connect();
        await client.query(BOOT_SQL);
        await client.end();
        client = null;
        log("Using configured DATABASE_URL — tables verified.");
        return {
            ok: true,
            mode: "external",
            detail: "configured DATABASE_URL"
        };
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        warn(`Configured DATABASE_URL not reachable (${msg.slice(0, 140)}). Falling back to bundled database…`);
        if (client) {
            try {
                await client.end();
            } catch  {
            /* ignore */ }
        }
        return null;
    }
}
/**
 * PGlite's WebAssembly filesystem ABORTS on Windows when the data-directory
 * path contains spaces, parentheses or non-ASCII characters (e.g. a project
 * unzipped to "Downloads/my app (1)/"). So we store the database in a CLEAN
 * system path instead of inside the project folder.
 */ function safeDataDir() {
    const isClean = (p)=>/^[A-Za-z0-9_\-:\\/.]+$/.test(p);
    const candidates = [
        process.env.LOCALAPPDATA && __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.env.LOCALAPPDATA, "ViralDarshan", "pgdata"),
        process.env.HOME && __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.env.HOME, ".viraldarshan", "pgdata"),
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__["default"].tmpdir(), "viraldarshan-pgdata"),
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), ".pglite")
    ].filter(Boolean);
    return candidates.find(isClean) ?? candidates[candidates.length - 1];
}
async function openPglite(mod, target) {
    const pg = target ? new mod.PGlite(target) : new mod.PGlite(); // undefined = in-memory
    await pg.waitReady;
    await pg.exec(BOOT_SQL);
    g.__vdPglite = pg;
}
async function bootBundled() {
    const mod = await __turbopack_context__.A("[externals]/@electric-sql/pglite [external] (@electric-sql/pglite, esm_import, [project]/node_modules/@electric-sql/pglite, async loader)").catch(()=>null);
    if (!mod?.PGlite) {
        return {
            ok: false,
            mode: "none",
            detail: "@electric-sql/pglite missing — run `npm install`"
        };
    }
    // 1) persistent, on a CLEAN path (fixes the Windows spaces/parens abort)
    const dir = safeDataDir();
    try {
        log("Starting bundled in-process PostgreSQL (zero downloads, runs anywhere)…");
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].mkdirSync(dir, {
            recursive: true
        });
        await openPglite(mod, dir);
        log(`Bundled database is ready. Data saved in ${dir}`);
        return {
            ok: true,
            mode: "bundled",
            detail: dir
        };
    } catch (e) {
        const d = e instanceof Error ? e.message : String(e);
        warn(`Persistent database at "${dir}" failed (${d.slice(0, 120)}). Falling back to in-memory…`);
    }
    // 2) last resort: in-memory — the app ALWAYS runs even if the disk path is
    //    unusable. Data resets on restart, but nothing ever blocks startup.
    try {
        await openPglite(mod, undefined);
        warn("Running on an IN-MEMORY database. The app works fully, but download " + "history resets when the server restarts. To keep history, move this " + "project to a folder path WITHOUT spaces or parentheses, then restart.");
        return {
            ok: true,
            mode: "bundled",
            detail: "in-memory"
        };
    } catch (e) {
        const detail = e instanceof Error ? e.stack ?? e.message : String(e);
        warn("Bundled database failed to start:", detail.slice(0, 400));
        return {
            ok: false,
            mode: "none",
            detail: detail.slice(0, 400)
        };
    }
}
async function boot() {
    const existing = process.env.DATABASE_URL;
    if (existing) {
        const external = await bootExternal(existing);
        if (external?.ok) return external;
    } else {
        log("No DATABASE_URL configured — using the bundled database (fully automatic).");
    }
    return bootBundled();
}
function ensureDatabaseReady(force = false) {
    if (g.__vdBoot && !force) return g.__vdBoot;
    if (force && g.__vdBoot) {
        const current = g.__vdBoot;
        g.__vdBoot = current.then((o)=>{
            if (o.ok) return o; // already healthy — a forced retry must be a no-op
            return boot().catch((e)=>({
                    ok: false,
                    mode: "none",
                    detail: e instanceof Error ? e.message : String(e)
                }));
        });
        return g.__vdBoot;
    }
    g.__vdBoot = boot().catch((e)=>({
            ok: false,
            mode: "none",
            detail: e instanceof Error ? e.message : String(e)
        }));
    return g.__vdBoot;
}
}),
];

//# sourceMappingURL=src_lib_db-bootstrap_ts_04dvb9u4ds9yd._.js.map