(()=>{"use strict";module.exports = [
"[externals]/@electric-sql/pglite [external] (@electric-sql/pglite, esm_import, [project]/node_modules/@electric-sql/pglite)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
var mod = await __turbopack_context__.y("@electric-sql/pglite-7966c14983af6418");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/node_modules/drizzle-orm/pglite/driver.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "PgliteDatabase",
    ()=>PgliteDatabase,
    "PgliteDriver",
    ()=>PgliteDriver,
    "drizzle",
    ()=>drizzle
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__ = __turbopack_context__.i("[externals]/@electric-sql/pglite [external] (@electric-sql/pglite, esm_import, [project]/node_modules/@electric-sql/pglite)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/entity.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$logger$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/logger.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/dialect.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/relations.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pglite/session.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
class PgliteDriver {
    constructor(client, dialect, options = {}){
        this.client = client;
        this.dialect = dialect;
        this.options = options;
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["entityKind"]] = "PgliteDriver";
    createSession(schema) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgliteSession"](this.client, this.dialect, schema, {
            logger: this.options.logger,
            cache: this.options.cache
        });
    }
}
class PgliteDatabase extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgDatabase"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["entityKind"]] = "PgliteDatabase";
}
function construct(client, config = {}) {
    const dialect = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$dialect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgDialect"]({
        casing: config.casing
    });
    let logger;
    if (config.logger === true) {
        logger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$logger$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DefaultLogger"]();
    } else if (config.logger !== false) {
        logger = config.logger;
    }
    let schema;
    if (config.schema) {
        const tablesConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractTablesRelationalConfig"])(config.schema, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$relations$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTableRelationsHelpers"]);
        schema = {
            fullSchema: config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap
        };
    }
    const driver = new PgliteDriver(client, dialect, {
        logger,
        cache: config.cache
    });
    const session = driver.createSession(schema);
    const db = new PgliteDatabase(dialect, session, schema);
    db.$client = client;
    db.$cache = config.cache;
    if (db.$cache) {
        db.$cache["invalidate"] = config.cache?.onMutate;
    }
    return db;
}
function drizzle(...params) {
    if (params[0] === void 0 || typeof params[0] === "string") {
        const instance = new __TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["PGlite"](params[0]);
        return construct(instance, params[1]);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isConfig"])(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client) return construct(client, drizzleConfig);
        if (typeof connection === "object") {
            const { dataDir, ...options } = connection;
            const instance2 = new __TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["PGlite"](dataDir, options);
            return construct(instance2, drizzleConfig);
        }
        const instance = new __TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["PGlite"](connection);
        return construct(instance, drizzleConfig);
    }
    return construct(params[0], params[1]);
}
((drizzle2)=>{
    function mock(config) {
        return construct({}, config);
    }
    drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/drizzle-orm/pglite/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "PgliteDatabase",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgliteDatabase"],
    "PgliteDriver",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgliteDriver"],
    "PglitePreparedQuery",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PglitePreparedQuery"],
    "PgliteSession",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgliteSession"],
    "PgliteTransaction",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgliteTransaction"],
    "drizzle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["drizzle"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pglite/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pglite/driver.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pglite/session.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$driver$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pglite$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/drizzle-orm/pglite/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
}),
"[project]/node_modules/drizzle-orm/pglite/session.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "PglitePreparedQuery",
    ()=>PglitePreparedQuery,
    "PgliteSession",
    ()=>PgliteSession,
    "PgliteTransaction",
    ()=>PgliteTransaction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/entity.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$logger$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/logger.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/pg-core/session.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/sql/sql.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__ = __turbopack_context__.i("[externals]/@electric-sql/pglite [external] (@electric-sql/pglite, esm_import, [project]/node_modules/@electric-sql/pglite)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$cache$2f$core$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/drizzle-orm/cache/core/cache.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
class PglitePreparedQuery extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgPreparedQuery"] {
    constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, name, _isResponseInArrayMode, customResultMapper){
        super({
            sql: queryString,
            params
        }, cache, queryMetadata, cacheConfig);
        this.client = client;
        this.queryString = queryString;
        this.params = params;
        this.logger = logger;
        this.fields = fields;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.rawQueryConfig = {
            rowMode: "object",
            parsers: {
                [__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["types"].TIMESTAMP]: (value)=>value,
                [__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["types"].TIMESTAMPTZ]: (value)=>value,
                [__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["types"].INTERVAL]: (value)=>value,
                [__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["types"].DATE]: (value)=>value,
                // numeric[]
                [1231]: (value)=>value,
                // timestamp[]
                [1115]: (value)=>value,
                // timestamp with timezone[]
                [1185]: (value)=>value,
                // interval[]
                [1187]: (value)=>value,
                // date[]
                [1182]: (value)=>value
            }
        };
        this.queryConfig = {
            rowMode: "array",
            parsers: {
                [__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["types"].TIMESTAMP]: (value)=>value,
                [__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["types"].TIMESTAMPTZ]: (value)=>value,
                [__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["types"].INTERVAL]: (value)=>value,
                [__TURBOPACK__imported__module__$5b$externals$5d2f40$electric$2d$sql$2f$pglite__$5b$external$5d$__$2840$electric$2d$sql$2f$pglite$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$electric$2d$sql$2f$pglite$29$__["types"].DATE]: (value)=>value,
                // numeric[]
                [1231]: (value)=>value,
                // timestamp[]
                [1115]: (value)=>value,
                // timestamp with timezone[]
                [1185]: (value)=>value,
                // interval[]
                [1187]: (value)=>value,
                // date[]
                [1182]: (value)=>value
            }
        };
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["entityKind"]] = "PglitePreparedQuery";
    rawQueryConfig;
    queryConfig;
    async execute(placeholderValues = {}) {
        const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fillPlaceholders"])(this.params, placeholderValues);
        this.logger.logQuery(this.queryString, params);
        const { fields, client, queryConfig, joinsNotNullableMap, customResultMapper, queryString, rawQueryConfig } = this;
        if (!fields && !customResultMapper) {
            return this.queryWithCache(queryString, params, async ()=>{
                return await client.query(queryString, params, rawQueryConfig);
            });
        }
        const result = await this.queryWithCache(queryString, params, async ()=>{
            return await client.query(queryString, params, queryConfig);
        });
        return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapResultRow"])(fields, row, joinsNotNullableMap));
    }
    all(placeholderValues = {}) {
        const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fillPlaceholders"])(this.params, placeholderValues);
        this.logger.logQuery(this.queryString, params);
        return this.queryWithCache(this.queryString, params, async ()=>{
            return await this.client.query(this.queryString, params, this.rawQueryConfig);
        }).then((result)=>result.rows);
    }
    /** @internal */ isResponseInArrayMode() {
        return this._isResponseInArrayMode;
    }
}
class PgliteSession extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgSession"] {
    constructor(client, dialect, schema, options = {}){
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.logger = options.logger ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$logger$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NoopLogger"]();
        this.cache = options.cache ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$cache$2f$core$2f$cache$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NoopCache"]();
    }
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["entityKind"]] = "PgliteSession";
    logger;
    cache;
    prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
        return new PglitePreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, name, isResponseInArrayMode, customResultMapper);
    }
    async transaction(transaction, config) {
        return this.client.transaction(async (client)=>{
            const session = new PgliteSession(client, this.dialect, this.schema, this.options);
            const tx = new PgliteTransaction(this.dialect, session, this.schema);
            if (config) {
                await tx.setTransaction(config);
            }
            return transaction(tx);
        });
    }
    async count(sql2) {
        const res = await this.execute(sql2);
        return Number(res["rows"][0]["count"]);
    }
}
class PgliteTransaction extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$session$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PgTransaction"] {
    static [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$entity$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["entityKind"]] = "PgliteTransaction";
    async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex + 1}`;
        const tx = new PgliteTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
        await tx.execute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"].raw(`savepoint ${savepointName}`));
        try {
            const result = await transaction(tx);
            await tx.execute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"].raw(`release savepoint ${savepointName}`));
            return result;
        } catch (err) {
            await tx.execute(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"].raw(`rollback to savepoint ${savepointName}`));
            throw err;
        }
    }
}
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];})()

//# sourceMappingURL=%5Broot-of-the-server%5D__1c3vn0c479chg._.js.map