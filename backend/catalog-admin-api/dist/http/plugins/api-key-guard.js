import { timingSafeEqual } from "node:crypto";
const ADMIN_PREFIX = "/admin/catalog";
function bearerToken(req) {
    const raw = req.headers.authorization;
    if (!raw || typeof raw !== "string")
        return null;
    const m = /^Bearer\s+(.+)$/i.exec(raw.trim());
    return m?.[1]?.trim() ?? null;
}
function safeEqual(a, b) {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length)
        return false;
    return timingSafeEqual(ba, bb);
}
/**
 * When `CATALOG_ADMIN_API_KEY` is set, all `/admin/catalog` routes require
 * `Authorization: Bearer <key>`. Health checks stay public.
 */
export function registerApiKeyGuard(app, adminApiKey) {
    if (!adminApiKey?.length) {
        app.log.warn("CATALOG_ADMIN_API_KEY is not set — catalog-admin-api accepts unauthenticated requests. Set in production.");
        return;
    }
    app.addHook("onRequest", async (req, reply) => {
        const url = req.url.split("?")[0] ?? req.url;
        if (!url.startsWith(ADMIN_PREFIX))
            return;
        const presented = bearerToken(req);
        if (!presented || !safeEqual(presented, adminApiKey)) {
            return reply.status(401).send({
                error: "UNAUTHORIZED",
                message: "Valid Bearer token required for catalog admin API.",
                requestId: req.id,
            });
        }
    });
}
