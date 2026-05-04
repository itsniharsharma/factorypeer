import "../bootstrap-env.js";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";
import { createCatalogAdminServices } from "../composition-root.js";
import { tenantMatch } from "../utils/mongo.js";

/**
 * Backfill variant.specRowId when a published spec row already lists the variant in variantBindings.
 * Run after deploy: `npm run repair:spec-linkage --prefix backend/catalog-admin-api`
 */
async function main() {
  const config = loadConfig();
  const models = await connectMongo(config);
  const services = createCatalogAdminServices(models, config.defaultTenantId ?? null);
  const tq = tenantMatch(config.defaultTenantId ?? null);

  const variants = await models.ProductVariant.find({
    status: "published",
    ...tq,
    $or: [{ specRowId: null }, { specRowId: { $exists: false } }],
  })
    .select("_id")
    .lean()
    .exec();

  let linked = 0;
  let skipped = 0;

  for (const doc of variants) {
    const id = String(doc._id);
    const r = await services.products.tryBackfillSpecRowIdFromBindings(id, undefined);
    if (r === "linked") linked += 1;
    else skipped += 1;
  }

  console.log(
    JSON.stringify(
      {
        scanned: variants.length,
        linked,
        skippedNoMatchOrNotRequired: skipped,
      },
      null,
      2,
    ),
  );

  await disconnectMongo();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
