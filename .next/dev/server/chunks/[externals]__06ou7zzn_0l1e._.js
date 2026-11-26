module.exports = [
"[externals]/@electric-sql/pglite [external] (@electric-sql/pglite, esm_import, [project]/node_modules/@electric-sql/pglite, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_@electric-sql_pglite_0tk9wxz-ozhng._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/@electric-sql/pglite [external] (@electric-sql/pglite, esm_import, [project]/node_modules/@electric-sql/pglite)");
    });
});
}),
"[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
    });
});
}),
];