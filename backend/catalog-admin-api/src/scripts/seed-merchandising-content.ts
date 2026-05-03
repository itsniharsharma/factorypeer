import "dotenv/config";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";
import { createCatalogAdminServices } from "../composition-root.js";
import { seedMerchandisingContent } from "../bootstrap/merchandising-seed.js";

async function main() {
  const config = loadConfig();
  const models = await connectMongo(config);
  const services = createCatalogAdminServices(models, config.defaultTenantId ?? null);

  try {
    await seedMerchandisingContent(services);
    console.log("Merchandising content seeded successfully.");
  } finally {
    await disconnectMongo();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});