import type { FastifyInstance } from "fastify";

/**
 * Structured access logs with latency (Fastify provides req.id by default).
 */
export function registerRequestObservability(app: FastifyInstance) {
  app.addHook("onResponse", async (req, reply) => {
    const rt = (reply as unknown as { elapsedTime?: number }).elapsedTime;
    req.log.info({
      reqId: req.id,
      method: req.method,
      url: req.url,
      statusCode: reply.statusCode,
      responseTimeMs: rt,
    });
  });
}
