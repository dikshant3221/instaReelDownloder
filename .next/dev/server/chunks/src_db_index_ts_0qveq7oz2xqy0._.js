module.exports = [
"[project]/src/db/index.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "db",
    ()=>db,
    "ensureDb",
    ()=>ensureDb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/node-postgres/driver.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
        globalForDb.__vdDb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["drizzle"])(globalForDb.__vdPool);
    }
    return globalForDb.__vdDb;
}
/** Any ready handle: bundled PGlite first (it is already live), else external. */ function materialize() {
    return globalForDb.__vdDbPglite ?? materializeExternal();
}
/** Bundled handle — async because drizzle's PGlite driver is ESM-only here. */ async function materializeBundled() {
    if (globalForDb.__vdDbPglite) return globalForDb.__vdDbPglite;
    if (!globalForDb.__vdPglite) return null;
    const mod = await __turbopack_context__.A("[project]/node_modules/drizzle-orm/pglite/index.js [instrumentation] (ecmascript, async loader)");
    globalForDb.__vdDbPglite = mod.drizzle({
        client: globalForDb.__vdPglite
    });
    return globalForDb.__vdDbPglite;
}
async function ensureDb() {
    if (materialize()) return;
    const { ensureDatabaseReady } = await __turbopack_context__.A("[project]/src/lib/db-bootstrap.ts [instrumentation] (ecmascript, async loader)");
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
            void __turbopack_context__.A("[project]/src/lib/db-bootstrap.ts [instrumentation] (ecmascript, async loader)").then((m)=>void m.ensureDatabaseReady());
            throw new Error("DB_WARMING_UP: the database is still starting");
        }
        const value = Reflect.get(impl, prop);
        return typeof value === "function" ? value.bind(impl) : value;
    }
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=src_db_index_ts_0qveq7oz2xqy0._.js.map