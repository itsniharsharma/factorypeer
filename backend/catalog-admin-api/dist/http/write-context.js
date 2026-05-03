/** Maps Fastify request (after auth plugin) to service-layer audit context. */
export function writeContext(req) {
    return {
        actorUserId: req.catalogAuth?.actorUserId ?? null,
    };
}
