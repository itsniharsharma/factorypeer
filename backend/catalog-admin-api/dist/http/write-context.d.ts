import type { FastifyRequest } from "fastify";
import type { WriteContext } from "../types/write-context.js";
/** Maps Fastify request (after auth plugin) to service-layer audit context. */
export declare function writeContext(req: FastifyRequest): WriteContext;
//# sourceMappingURL=write-context.d.ts.map