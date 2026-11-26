import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Zero-config database handle.
 *
 * This module NEVER throws at import time (that's what caused the red
 * "DATABASE_URL is not set" crash-overlay). The connection is created lazily
 * the first time a query runs — by then the bootstrap has either adopted the
 * configured DATABASE_URL or started the bundled in-process PostgreSQL
 * (PGlite, pure WebAssembly — no downloads, works on any OS).
 */

type Db = ReturnType<typeof drizzle>;

const globalForDb = globalThis as typeof globalThis & {
  __vdPool?: Pool;
  __vdPoolUrl?: string;
  __vdDb?: Db;
  __vdDbPglite?: Db;
  __vdPglite?: unknown;
};

/** External connection via DATABASE_URL — fully synchronous. */
function materializeExternal(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!globalForDb.__vdPool || globalForDb.__vdPoolUrl !== url) {
    globalForDb.__vdPool = new Pool({ connectionString: url });
    globalForDb.__vdPoolUrl = url;
    globalForDb.__vdDb = undefined;
  }
  if (!globalForDb.__vdDb) {
    globalForDb.__vdDb = drizzle(globalForDb.__vdPool);
  }
  return globalForDb.__vdDb;
}

/** Any ready handle: bundled PGlite first (it is already live), else external. */
function materialize(): Db | null {
  return globalForDb.__vdDbPglite ?? materializeExternal();
}

/** Bundled handle — async because drizzle's PGlite driver is ESM-only here. */
async function materializeBundled(): Promise<Db | null> {
  if (globalForDb.__vdDbPglite) return globalForDb.__vdDbPglite;
  if (!globalForDb.__vdPglite) return null;
  const mod = await import("drizzle-orm/pglite");
  globalForDb.__vdDbPglite = mod.drizzle({
    client: globalForDb.__vdPglite as never,
  }) as unknown as Db;
  return globalForDb.__vdDbPglite;
}

/**
 * Route handlers call this FIRST. It waits for the zero-config bootstrap
 * (bundled start takes just a few seconds, only on first launch), and only
 * throws a tagged error if the DB is genuinely mid-boot — routes turn that
 * into a friendly "warming up" response, then retry automatically.
 */
export async function ensureDb(): Promise<void> {
  if (materialize()) return;
  const { ensureDatabaseReady } = await import("@/lib/db-bootstrap");
  await ensureDatabaseReady(); // shares the single boot attempt (no races)
  if (await materializeBundled()) return;
  if (materializeExternal()) return;
  // one honest forced retry covers a failed first attempt
  await ensureDatabaseReady(true);
  if (await materializeBundled()) return;
  if (materializeExternal()) return;
  throw new Error("DB_WARMING_UP: the database is still starting");
}

/**
 * The `db` object every module already imports. Import-safe; methods are
 * bound to the real instance so Drizzle internals keep working.
 */
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const impl = materialize();
    if (!impl) {
      // fire-and-forget: keep the bootstrap warm for the next request
      void import("@/lib/db-bootstrap").then((m) => void m.ensureDatabaseReady());
      throw new Error("DB_WARMING_UP: the database is still starting");
    }
    const value = Reflect.get(impl as object, prop) as unknown;
    return typeof value === "function"
      ? (value as (...a: unknown[]) => unknown).bind(impl)
      : value;
  },
});
