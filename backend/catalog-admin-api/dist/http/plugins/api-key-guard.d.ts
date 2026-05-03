import type { FastifyInstance } from "fastify";
/**
 * When `CATALOG_ADMIN_API_KEY` is set, all `/admin/catalog` routes require
 * `Authorization: Bearer <key>`. Health checks stay public.
 */
export declare function registerApiKeyGuard(app: FastifyInstance, adminApiKey: string | undefined): void;
//# sourceMappingURL=api-key-guard.d.ts.map