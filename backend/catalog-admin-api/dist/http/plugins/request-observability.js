/**
 * Structured access logs with latency (Fastify provides req.id by default).
 */
export function registerRequestObservability(app) {
    app.addHook("onResponse", async (req, reply) => {
        const rt = reply.elapsedTime;
        req.log.info({
            reqId: req.id,
            method: req.method,
            url: req.url,
            statusCode: reply.statusCode,
            responseTimeMs: rt,
        });
    });
}
