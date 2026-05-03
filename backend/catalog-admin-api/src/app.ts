import Fastify from "fastify";
import type { CatalogAdminServices } from "./composition-root.js";
import { registerCatalogAuthContext } from "./http/plugins/auth-context.js";
import { registerErrorHandler } from "./http/plugins/error-handler.js";
import { registerCatalogAdminRoutes } from "./routes/index.js";

export async function buildApp(services: CatalogAdminServices) {
  const app = Fastify({ logger: true });

  await registerCatalogAuthContext(app);
  await registerErrorHandler(app);

  app.get("/health", async () => ({ ok: true }));

  await registerCatalogAdminRoutes(app, services);

  return app;
}
