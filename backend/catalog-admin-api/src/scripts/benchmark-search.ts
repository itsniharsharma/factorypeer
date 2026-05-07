import "../bootstrap-env.js";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";
import { normalizeAndTokenize } from "../utils/search-normalize.js";

function hr() {
  const t = process.hrtime.bigint();
  return Number(t / BigInt(1_000_000)); // ms
}

async function runOne(models: any, q: string) {
  const tokens = normalizeAndTokenize(q);
  const out: any = { q, tokens };

  // OLD FLOW: variant lookup -> product ids -> product query
  const start1 = hr();
  const variants = await models.ProductVariant.find({ $text: { $search: q } }, { productId: 1 }).limit(1000).lean();
  const afterVariants = hr();
  const pids = Array.from(new Set(variants.map((v: any) => String(v.productId)))).slice(0, 1000);
  const productsOld = pids.length ? await models.Product.find({ _id: { $in: pids } }).lean() : [];
  const end1 = hr();

  out.old = {
    variantQueryMs: afterVariants - start1,
    totalOldMs: end1 - start1,
    variantMatches: variants.length,
    productMatches: productsOld.length,
    productResponseSize: Buffer.byteLength(JSON.stringify(productsOld)),
    explainOld: await (pids.length ? models.Product.collection.find({ _id: { $in: pids.map((s) => new models.Product.db.bson.ObjectId(s)) } }).explain("executionStats") : Promise.resolve(null)),
  };

  // NEW FLOW: direct product search
  // Run text query and token query separately and merge results to avoid planner issues
  const startText = hr();
  const textQuery = { status: "published", $text: { $search: q } };
  const textResults = await models.Product.find(textQuery).limit(1000).lean();
  const endText = hr();

  const startTokens = hr();
  const tokenQuery = { status: "published", searchTokens: { $in: tokens } };
  const tokenResults = await models.Product.find(tokenQuery).limit(1000).lean();
  const endTokens = hr();

  // merge unique by id
  const byId = new Map<string, any>();
  for (const p of textResults) byId.set(String(p._id), p);
  for (const p of tokenResults) byId.set(String(p._id), p);
  const productsNew = Array.from(byId.values()).slice(0, 1000);

  out.new = {
    textQueryMs: endText - startText,
    tokenQueryMs: endTokens - startTokens,
    totalNewMs: (endText - startText) + (endTokens - startTokens),
    productMatches: productsNew.length,
    productResponseSize: Buffer.byteLength(JSON.stringify(productsNew)),
    explainText: await models.Product.collection.find(textQuery).explain("executionStats"),
    explainTokens: await models.Product.collection.find(tokenQuery).explain("executionStats"),
  };

  out.memory = process.memoryUsage();
  out.queries = { old: 2, new: 1 };
  return out;
}

async function main() {
  const cfg = loadConfig();
  const models = await connectMongo(cfg);
  try {
    const args = process.argv.slice(2);
    const q = args[0] ?? "bolt";
    console.log("Running benchmark for q=", q);
    const res = await runOne(models, q);
    console.log(JSON.stringify(res, null, 2));
  } finally {
    await disconnectMongo();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
