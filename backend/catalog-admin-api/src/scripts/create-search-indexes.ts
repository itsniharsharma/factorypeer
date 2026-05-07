import "../bootstrap-env.js";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";

async function main() {
  const cfg = loadConfig();
  const models = await connectMongo(cfg);
  try {
    console.log("Ensuring product indexes...");
    const existing = await models.Product.collection.indexes();
    const names = new Set(existing.map((i: any) => i.name));
    if (!names.has("searchBlob_text")) {
      // Only create text index if no other text index exists. Check for any text index first.
      const hasText = existing.some((i: any) => Object.values(i.key).includes("text"));
      if (!hasText) {
        await models.Product.collection.createIndex({ searchBlob: "text" }, { name: "searchBlob_text" });
        console.log("Created text index searchBlob_text");
      } else {
        console.log("Skipping creation of searchBlob text index: collection already has a text index");
      }
    }
    if (!names.has("searchTokens_1")) await models.Product.collection.createIndex({ searchTokens: 1 }, { name: "searchTokens_1" });
    if (!names.has("searchableBrands_1")) await models.Product.collection.createIndex({ searchableBrands: 1 }, { name: "searchableBrands_1" });
    if (!names.has("searchableCategories_1")) await models.Product.collection.createIndex({ searchableCategories: 1 }, { name: "searchableCategories_1" });
    console.log("Ensured product indexes.");

    console.log("Ensuring variant indexes...");
    const vExisting = await models.ProductVariant.collection.indexes();
    const vNames = new Set(vExisting.map((i: any) => i.name));
    if (!vNames.has("variant_itemNumber_1")) await models.ProductVariant.collection.createIndex({ itemNumber: 1 }, { name: "variant_itemNumber_1" });
    if (!vNames.has("variant_mpn_1")) await models.ProductVariant.collection.createIndex({ mpn: 1 }, { name: "variant_mpn_1" });
    if (!vNames.has("variant_searchBlob_1")) await models.ProductVariant.collection.createIndex({ searchBlob: 1 }, { name: "variant_searchBlob_1" });
    console.log("Ensured variant indexes.");
  } finally {
    await disconnectMongo();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
