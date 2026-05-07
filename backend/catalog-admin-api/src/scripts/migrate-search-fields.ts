import "../bootstrap-env.js";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";
import { normalizeAndTokenize, normalizeForBlob, normalizeArrayStrings } from "../utils/search-normalize.js";
import { Types } from "mongoose";

const BATCH_SIZE = Number(process.env["MIGRATE_BATCH_SIZE"] ?? 200);
const PROGRESS_KEY = process.env["MIGRATE_PROGRESS_KEY"] ?? "searchFieldsV1";

async function getLastId(models: any) {
  const coll = models.Product.db.collection("_search_migration_progress");
  const doc = await coll.findOne({ _id: PROGRESS_KEY });
  return doc?.lastId ? new Types.ObjectId(String(doc.lastId)) : null;
}

async function setLastId(models: any, id: Types.ObjectId) {
  const coll = models.Product.db.collection("_search_migration_progress");
  await coll.updateOne({ _id: PROGRESS_KEY }, { $set: { lastId: id.toString(), updatedAt: new Date() } }, { upsert: true });
}

function pickProductProjection() {
  return { title: 1, slug: 1, searchText: 1, brand: 1, categoryIds: 1 };
}

async function computeForProduct(models: any, p: any) {
  const pid = p._id;
  // fetch published variants for product
  const variants = await models.ProductVariant.find({ productId: pid, status: "published" }, { sku: 1, itemNumber: 1, mpn: 1, searchBlob: 1, specRowId: 1 }).limit(1000).lean();
  const variantSkus = variants.map((v: any) => v.sku ?? "");
  const variantItemNumbers = variants.map((v: any) => v.itemNumber ?? "");
  const variantMpns = variants.map((v: any) => v.mpn ?? "");
  const variantBlob = variants.map((v: any) => v.searchBlob ?? "").join(" ");

  // categories
  const catIds = Array.isArray(p.categoryIds) ? p.categoryIds.filter(Boolean) : [];
  const cats = catIds.length ? await models.CatalogCategory.find({ _id: { $in: catIds } }, { slug: 1, path: 1, title: 1 }).lean() : [];
  const catTokens: string[] = [];
  for (const c of cats) {
    if (typeof c.slug === "string") catTokens.push(c.slug);
    if (typeof c.path === "string") catTokens.push(c.path);
    if (typeof c.title === "string") catTokens.push(c.title);
  }

  // spec rows
  const specRowIds = new Set<string>();
  for (const v of variants) if (v.specRowId) specRowIds.add(String(v.specRowId));
  const specTokens: string[] = [];
  if (specRowIds.size) {
    const rows = await models.CatalogSpecRow.find({ _id: { $in: Array.from(specRowIds).map((s) => new Types.ObjectId(s)) } }, { values: 1 }).lean();
    for (const r of rows) {
      // values may be Map or object
      if (r.values instanceof Map) {
        for (const v of Array.from(r.values.values())) if (typeof v === "string") specTokens.push(v);
      } else if (r.values && typeof r.values === "object") {
        for (const v of Object.values(r.values)) if (typeof v === "string") specTokens.push(v as string);
      }
    }
  }

  const title = String(p.title ?? "");
  const slug = String(p.slug ?? "");
  const brand = String(p.brand ?? "");
  const searchText = String(p.searchText ?? "");

  const tokens = normalizeAndTokenize(title, slug, searchText, brand, ...variantSkus, ...variantItemNumbers, ...variantMpns, ...catTokens, ...specTokens);
  const blob = normalizeForBlob(title, slug, searchText, brand, variantBlob, ...catTokens, ...specTokens);
  const brands = normalizeArrayStrings([brand]);
  const categories = normalizeArrayStrings(catTokens);
  const specs = normalizeArrayStrings(specTokens);

  return { searchTokens: tokens, searchBlob: blob, searchableBrands: brands, searchableCategories: categories, searchableSpecs: specs };
}

async function migrateBatch(models: any, lastId: Types.ObjectId | null) {
  const q: any = {};
  if (lastId) q._id = { $gt: lastId };
  const cursor = models.Product.find(q, pickProductProjection()).sort({ _id: 1 }).cursor();
  const ops: any[] = [];
  let processed = 0;
  for await (const p of cursor) {
    const out = await computeForProduct(models, p);
    ops.push({ filter: { _id: p._id }, update: { $set: out } });
    processed++;
    if (ops.length >= BATCH_SIZE) break;
  }
  if (!processed) return { processed: 0, lastId };
  // execute bulk via raw collection to ensure persistence
  const lastProcessedId = ops[ops.length - 1].filter._id as Types.ObjectId;
  const coll = models.Product.collection;
  for (const op of ops) {
    await coll.updateOne(op.filter, op.update);
  }
  await setLastId(models, lastProcessedId);
  return { processed, lastId: lastProcessedId };
}

async function main() {
  const cfg = loadConfig();
  const models = await connectMongo(cfg);
  try {
    console.log(`Migration batch size: ${BATCH_SIZE}`);
    let lastId = await getLastId(models);
    console.log("Resuming from:", lastId?.toString() ?? "start");
    for (;;) {
      const r = await migrateBatch(models, lastId);
      if (!r.processed) {
        console.log("No more products to process. Migration complete.");
        break;
      }
      console.log(`Processed ${r.processed} products (lastId=${String(r.lastId)})`);
      lastId = r.lastId as Types.ObjectId;
    }
  } finally {
    await disconnectMongo();
  }
}

process.on("SIGINT", () => {
  console.log("Interrupted");
  process.exit(1);
});

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
