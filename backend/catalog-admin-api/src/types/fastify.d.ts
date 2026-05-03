import type { Types } from "mongoose";

declare module "fastify" {
  interface FastifyRequest {
    /** Populated by `registerCatalogAuthContext` — actor for audit fields. */
    catalogAuth?: {
      actorUserId: Types.ObjectId | null;
      /** True when `Authorization` or `X-Catalog-Actor-Id` was present (stub for future JWT). */
      credentialsPresent: boolean;
    };
  }
}
