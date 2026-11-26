module.exports = [
"[externals]/node:fs [external] (node:fs, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[externals]/node:fs [external] (node:fs, cjs)");
    });
});
}),
"[externals]/node:path [external] (node:path, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[externals]/node:path [external] (node:path, cjs)");
    });
});
}),
"[project]/node_modules/drizzle-orm/pglite/index.js [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[root-of-the-server]__1c3vn0c479chg._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/node_modules/drizzle-orm/pglite/index.js [app-route] (ecmascript)");
    });
});
}),
"[project]/src/db/index.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/src/db/index.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/src/lib/db-bootstrap.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]__17xp6s8ohlag_._.js",
  "server/chunks/src_lib_db-bootstrap_ts_04dvb9u4ds9yd._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/db-bootstrap.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/src/lib/youtube-stats.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/src_db_schema_ts_0ye2dnp9rp-t8._.js",
  "server/chunks/src_lib_youtube-stats_ts_105o3n2ggriy0._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/youtube-stats.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/src/lib/youtube.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/src_db_schema_ts_0ye2dnp9rp-t8._.js",
  "server/chunks/src_lib_17nf4wojw6icy._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/youtube.ts [app-route] (ecmascript)");
    });
});
}),
];