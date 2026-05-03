import Fastify from "fastify";
import type { CatalogAdminServices } from "./composition-root.js";
import type { AppConfig } from "./config.js";
import { registerApiKeyGuard } from "./http/plugins/api-key-guard.js";
import { registerCatalogAuthContext } from "./http/plugins/auth-context.js";
import { registerErrorHandler } from "./http/plugins/error-handler.js";
import { registerRequestObservability } from "./http/plugins/request-observability.js";
import { registerCatalogAdminRoutes } from "./routes/index.js";

export async function buildApp(services: CatalogAdminServices, config: AppConfig) {
  const app = Fastify({
    logger: {
      level: config.logLevel ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
    },
    requestIdHeader: "x-request-id",
  });

  registerRequestObservability(app);
  await registerCatalogAuthContext(app);
  registerApiKeyGuard(app, config.adminApiKey);
  await registerErrorHandler(app);

  app.get("/health", async () => ({ ok: true }));

  await registerCatalogAdminRoutes(app, services);

  return app;
}
