import { Types } from "mongoose";
import type { FastifyInstance } from "fastify";

/**
 * Placeholder for future admin JWT / session auth.
 * Today: optional `X-Catalog-Actor-Id` (24-hex ObjectId) stamps `createdBy` / `updatedBy`.
 * `credentialsPresent` is true when that header or `Authorization` is set (for middleware upgrades).
 */
export async function registerCatalogAuthContext(app: FastifyInstance) {
  app.addHook("onRequest", async (req) => {
    const raw = req.headers["x-catalog-actor-id"];
    const str = Array.isArray(raw) ? raw[0] : raw;
    const authz = req.headers.authorization;
    req.catalogAuth = {
      actorUserId: str && Types.ObjectId.isValid(str) ? new Types.ObjectId(str) : null,
      credentialsPresent: Boolean(str ?? authz),
    };
  });
}
