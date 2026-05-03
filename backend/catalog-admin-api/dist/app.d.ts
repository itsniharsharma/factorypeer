import Fastify from "fastify";
import type { CatalogAdminServices } from "./composition-root.js";
import type { AppConfig } from "./config.js";
export declare function buildApp(services: CatalogAdminServices, config: AppConfig): Promise<Fastify.FastifyInstance<import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, Fastify.FastifyBaseLogger, Fastify.FastifyTypeProviderDefault>>;
//# sourceMappingURL=app.d.ts.map