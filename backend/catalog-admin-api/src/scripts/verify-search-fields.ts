import "../bootstrap-env.js";
import { Types } from "mongoose";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";
import { normalizeAndTokenize, normalizeForBlob, normalizeArrayStrings } from "../utils/search-normalize.js";

const SAMPLE_SIZE = Number(process.env["VERIFY_SAMPLE_SIZE"] ?? 100);
const SEED = process.env["VERIFY_SEED"]?.trim(); // optional; if set, use deterministic sampling
const VERBOSE = process.env["VERIFY_VERBOSE"] === "true";

async function countProducts(models: any): Promise<number> {
  return models.Product.countDocuments({});
}

// Deterministic sample: use seed to pick same N products each time
function deterministicSampleIds(total: number, sampleSize: number, seed: number): number[] {
  const step = Math.max(1, Math.floor(total / sampleSize));
  const out: number[] = [];
  let current = (seed % total) || 0;
  for (let i = 0; i < sampleSize && out.length < sampleSize; i++) {
    out.push(current);
    current = (current + step) % total;
  }
  return out;
}

async function computeForProduct(models: any, p: any): Promise<Record<string, any>> {
  const pid = p._id;
  // fetch published variants
  const variants = await models.ProductVariant.find(
    { productId: pid, status: "published" },
    { sku: 1, itemNumber: 1, mpn: 1, searchBlob: 1, specRowId: 1 },
  ).limit(1000).lean();
  const variantSkus = variants.map((v: any) => v.sku ?? "");
  const variantItemNumbers = variants.map((v: any) => v.itemNumber ?? "");
  const variantMpns = variants.map((v: any) => v.mpn ?? "");
  const variantBlob = variants.map((v: any) => v.searchBlob ?? "").join(" ");

  // categories
  const catIds = Array.isArray(p.categoryIds) ? p.categoryIds.filter(Boolean) : [];
  const cats = catIds.length
    ? await models.CatalogCategory.find({ _id: { $in: catIds } }, { slug: 1, path: 1, title: 1 }).lean()
    : [];
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
    const rows = await models.CatalogSpecRow.find(
      { _id: { $in: Array.from(specRowIds).map((s) => new Types.ObjectId(s)) } },
      { values: 1 },
    ).lean();
    for (const r of rows) {
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

  const tokens = normalizeAndTokenize(
    title,
    slug,
    searchText,
    brand,
    ...variantSkus,
    ...variantItemNumbers,
    ...variantMpns,
    ...catTokens,
    ...specTokens,
  );
  const blob = normalizeForBlob(title, slug, searchText, brand, variantBlob, ...catTokens, ...specTokens);
  const brands = normalizeArrayStrings([brand]);
  const categories = normalizeArrayStrings(catTokens);
  const specs = normalizeArrayStrings(specTokens);

  return { searchTokens: tokens, searchBlob: blob, searchableBrands: brands, searchableCategories: categories, searchableSpecs: specs };
}

function compareArrays(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  const bSet = new Set(b);
  if (aSet.size !== bSet.size) return false;
  for (const v of aSet) if (!bSet.has(v)) return false;
  return true;
}

async function verifyProduct(models: any, p: any): Promise<{ match: boolean; mismatches: string[] }> {
  const expected = await computeForProduct(models, p);
  const actual = {
    searchTokens: p.searchTokens ?? [],
    searchBlob: p.searchBlob ?? "",
    searchableBrands: p.searchableBrands ?? [],
    searchableCategories: p.searchableCategories ?? [],
    searchableSpecs: p.searchableSpecs ?? [],
  };

  const mismatches: string[] = [];
  if (!compareArrays(expected.searchTokens, actual.searchTokens)) mismatches.push("searchTokens");
  if (expected.searchBlob !== actual.searchBlob) mismatches.push("searchBlob");
  if (!compareArrays(expected.searchableBrands, actual.searchableBrands)) mismatches.push("searchableBrands");
  if (!compareArrays(expected.searchableCategories, actual.searchableCategories)) mismatches.push("searchableCategories");
  if (!compareArrays(expected.searchableSpecs, actual.searchableSpecs)) mismatches.push("searchableSpecs");

  const match = mismatches.length === 0;
  if (VERBOSE && !match) {
    console.log(`Mismatch in ${p._id}:`, mismatches.join(", "));
  }

  return { match, mismatches };
}

async function main() {
  const cfg = loadConfig();
  const models = await connectMongo(cfg);
  try {
    const total = await countProducts(models);
    console.log(`Total products: ${total}`);

    let skip = 0;
    let limit = SAMPLE_SIZE;

    // If seed is provided, use deterministic sampling
    if (SEED !== undefined && SEED.length > 0) {
      const seedNum = parseInt(SEED, 10) || 0;
      const sampleOffsets = deterministicSampleIds(total, SAMPLE_SIZE, seedNum);
      skip = Math.min(sampleOffsets[0] ?? 0, total - SAMPLE_SIZE);
      limit = SAMPLE_SIZE;
      console.log(`Using deterministic sampling with seed=${SEED}: skip=${skip}, limit=${limit}`);
    } else {
      // Random sampling: pick a random start
      skip = Math.max(0, Math.floor(Math.random() * Math.max(1, total - SAMPLE_SIZE)));
      limit = Math.min(SAMPLE_SIZE, total - skip);
      console.log(`Random sampling: skip=${skip}, limit=${limit}`);
    }

    const sampled = await models.Product.find({}, null, { skip, limit }).lean();
    console.log(`Sampled ${sampled.length} products for verification`);

    let matchCount = 0;
    const allMismatches: Record<string, string[]> = {};

    for (const p of sampled) {
      const { match, mismatches } = await verifyProduct(models, p);
      if (match) {
        matchCount++;
      } else {
        allMismatches[String(p._id)] = mismatches;
      }
    }

    const mismatchCount = sampled.length - matchCount;
    const mismatchPercent = sampled.length > 0 ? ((mismatchCount / sampled.length) * 100).toFixed(2) : "0.00";

    console.log("\n=== VERIFICATION RESULTS ===");
    console.log(`Sampled: ${sampled.length}`);
    console.log(`Matched: ${matchCount}`);
    console.log(`Mismatches: ${mismatchCount} (${mismatchPercent}%)`);

    if (Object.keys(allMismatches).length > 0) {
      console.log("\n=== MISMATCH DETAILS (first 10) ===");
      const entries = Object.entries(allMismatches).slice(0, 10);
      for (const [pid, fields] of entries) {
        console.log(`${pid}: ${fields.join(", ")}`);
      }
    }

    if (mismatchCount > 0) {
      console.log(`\nWARNING: Found ${mismatchCount} mismatches. Rerun migration or investigate stale writes.`);
      process.exitCode = 1;
    } else {
      console.log("\n✓ All sampled products verified successfully.");
      process.exitCode = 0;
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
