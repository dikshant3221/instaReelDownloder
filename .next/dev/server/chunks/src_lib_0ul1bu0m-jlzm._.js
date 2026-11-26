module.exports = [
"[project]/src/lib/db-bootstrap.ts [instrumentation] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]__0fpe_0it9ims3._.js",
  "server/chunks/[root-of-the-server]__216svhp8bgq4h._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/db-bootstrap.ts [instrumentation] (ecmascript)");
    });
});
}),
"[project]/src/lib/engine.ts [instrumentation] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[root-of-the-server]__00w89agxemjr5._.js",
  "server/chunks/[root-of-the-server]__0hyyg_4ah-j2h._.js",
  "server/chunks/[root-of-the-server]__01rs6oe1gkd4j._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/engine.ts [instrumentation] (ecmascript)");
    });
});
}),
];