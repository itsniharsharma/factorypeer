import type { FastifyInstance } from "fastify";
/**
 * Placeholder for future admin JWT / session auth.
 * Today: optional `X-Catalog-Actor-Id` (24-hex ObjectId) stamps `createdBy` / `updatedBy`.
 * `credentialsPresent` is true when that header or `Authorization` is set (for middleware upgrades).
 */
export declare function registerCatalogAuthContext(app: FastifyInstance): Promise<void>;
//# sourceMappingURL=auth-context.d.ts.map