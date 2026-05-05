import type { FastifyInstance } from "fastify";

/**
 * Structured access logs with latency (Fastify provides req.id by default).
 */
export function registerRequestObservability(app: FastifyInstance) {
  app.addHook("onResponse", async (req, reply) => {
    const rt = (reply as unknown as { elapsedTime?: number }).elapsedTime;
    const payload = {
      reqId: req.id,
      method: req.method,
      url: req.url,
      statusCode: reply.statusCode,
      responseTimeMs: rt,
    };
    if (typeof rt === "number" && rt >= 250) {
      req.log.warn({ ...payload, slowRequest: true }, "Slow admin API response");
      return;
    }
    req.log.info(payload);
  });
}
