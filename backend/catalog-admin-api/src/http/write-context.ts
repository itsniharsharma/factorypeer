import type { FastifyRequest } from "fastify";
import type { WriteContext } from "../types/write-context.js";

/** Maps Fastify request (after auth plugin) to service-layer audit context. */
export function writeContext(req: FastifyRequest): WriteContext {
  return {
    actorUserId: req.catalogAuth?.actorUserId ?? null,
  };
}
