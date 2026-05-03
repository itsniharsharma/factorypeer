import "./bootstrap-env.js";
import { loadConfig } from "./config.js";
import { connectMongo, disconnectMongo } from "./db/connection.js";
import { createCatalogAdminServices } from "./composition-root.js";
import { buildApp } from "./app.js";

async function main() {
  const config = loadConfig();
  const models = await connectMongo(config);
  const services = createCatalogAdminServices(models, config.defaultTenantId ?? null);
  const app = await buildApp(services, config);

  try {
    await app.listen({ port: config.port, host: config.host });
    app.log.info(`catalog-admin-api listening on ${config.host}:${config.port}`);
  } catch (err) {
    await disconnectMongo();
    throw err;
  }

  const shutdown = async () => {
    await app.close();
    await disconnectMongo();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
