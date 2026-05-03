#!/usr/bin/env node
/**
 * Idempotent catalog seed: Machining → Milling → Milling Cutters → T-Slot Milling Cutters
 * Mirrors admin API workflow (same routes as catalog-admin-api).
 *
 * Usage:
 *   CATALOG_ADMIN_API_URL=http://127.0.0.1:4040 node scripts/seed-machining-t-slot.mjs
 *
 * Requires MongoDB + catalog-admin-api. Uses x-catalog-actor-id for audit fields.
 */

const BASE = (process.env.CATALOG_ADMIN_API_URL ?? "http://127.0.0.1:4040").replace(/\/$/, "");
const ACTOR = process.env.CATALOG_ACTOR_ID ?? "507f1f77bcf86cd799439011";

const PREFIX = `${BASE}/admin/catalog`;

async function api(method, path, json = undefined) {
  const url = `${PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = {
    accept: "application/json",
    "x-catalog-actor-id": ACTOR,
  };
  if (json !== undefined) {
    headers["content-type"] = "application/json";
  }
  const res = await fetch(url, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  return body;
}

async function ensureCategory(parentId, slug, title, kind) {
  const siblings =
    parentId == null
      ? await api("GET", "/categories/root/children")
      : await api("GET", `/categories/${parentId}/children`);
  let node = siblings.find((n) => n.slug === slug);
  if (!node) {
    node = await api("POST", "/categories", {
      parentId,
      slug,
      title,
      description: "",
      kind,
      status: "published",
    });
    console.log(`  created category ${slug} (${node._id}) kind=${kind}`);
  } else {
    if (node.status !== "published") {
      node = await api("PATCH", `/categories/${node._id}`, { status: "published" });
      console.log(`  published category ${slug}`);
    }
    if (node.kind !== kind) {
      await api("PATCH", `/categories/${node._id}/kind`, { kind });
      node = { ...node, kind };
      console.log(`  set kind=${kind} on ${slug}`);
    }
    console.log(`  reuse category ${slug} (${node._id})`);
  }
  return node;
}

const COLUMN_DEFS = [
  { key: "cutterDia", label: "Cutter Dia", widthClass: "w-[120px]", sortOrder: 0 },
  { key: "cutWidth", label: "Cut Width", widthClass: "w-[120px]", sortOrder: 1 },
  { key: "neckDia", label: "Neck Dia", widthClass: "w-[120px]", sortOrder: 2 },
  { key: "overallLen", label: "Overall Length", widthClass: "w-[130px]", sortOrder: 3 },
  { key: "shankDia", label: "Shank Dia", widthClass: "w-[110px]", sortOrder: 4 },
  { key: "toothCount", label: "Teeth", widthClass: "w-[90px]", sortOrder: 5 },
  { key: "coating", label: "Coating", widthClass: "w-[130px]", sortOrder: 6 },
  { key: "unitPrice", label: "Unit Price", widthClass: "w-[120px]", sortOrder: 7 },
];

async function main() {
  console.log(`Catalog API: ${PREFIX}`);
  console.log("Actor:", ACTOR);

  const machining = await ensureCategory(null, "machining", "Machining", "branch");
  const milling = await ensureCategory(machining._id, "milling", "Milling", "branch");
  const millingCutters = await ensureCategory(milling._id, "milling-cutters", "Milling Cutters", "branch");
  const tslot = await ensureCategory(
    millingCutters._id,
    "t-slot-milling-cutters",
    "T-Slot Milling Cutters",
    "family",
  );

  let schema = await api("GET", `/taxonomy/${tslot._id}/spec-schema`);
  if (!schema) {
    schema = await api("POST", `/taxonomy/${tslot._id}/spec-schema`, {
      familySummary:
        "Choose by cutter diameter, neck diameter, overall length, and shank diameter. Rows represent orderable variants.",
      status: "draft",
    });
    console.log("Created spec schema", schema._id);
  } else {
    console.log("Existing spec schema", schema._id, schema.status);
  }

  const columns = await api("GET", `/spec-schemas/${schema._id}/columns`);
  const existingKeys = new Set(columns.map((c) => c.key));
  for (const col of COLUMN_DEFS) {
    if (existingKeys.has(col.key)) continue;
    await api("POST", `/spec-schemas/${schema._id}/columns`, {
      ...col,
      dataType: "string",
      filterable: true,
      sortable: true,
    });
    console.log("  added column", col.key);
  }

  if (schema.status !== "published") {
    schema = await api("POST", `/spec-schemas/${schema._id}/publish`, undefined);
    console.log("Published spec schema; category active schema attached.");
  }

  const sku = "TSC-0500-0187-06";
  const itemNo = "82M114";
  const productSlug = "indexpro-t-slot-cutter-0500-tialn";

  const products = await api(
    "GET",
    `/products?status=published&limit=20&q=${encodeURIComponent(productSlug)}`,
  );
  let product = Array.isArray(products) ? products.find((p) => p.slug === productSlug) : null;

  if (!product) {
    product = await api("POST", "/products", {
      slug: productSlug,
      title: "IndexPro T-Slot Cutter 0.500 x 0.187 TiAlN",
      brand: "IndexPro",
      status: "published",
      categoryIds: [tslot._id],
      searchText: `${sku} ${itemNo} IndexPro T-Slot milling cutter TiAlN 0.500`,
      sortOrder: 0,
    });
    console.log("Created product", product._id, product.slug);
  } else {
    await api("PATCH", `/products/${product._id}`, {
      categoryIds: [tslot._id],
      searchText: `${sku} ${itemNo} IndexPro T-Slot milling cutter TiAlN 0.500`,
      status: "published",
    });
    console.log("Updated existing product", product._id);
  }

  const variants = await api("GET", `/products/${product._id}/variants?limit=50&status=published`);
  let variant = variants.find((v) => v.sku === sku);
  if (!variant) {
    variant = await api("POST", `/products/${product._id}/variants`, {
      sku,
      itemNumber: itemNo,
      mpn: "IP-TS-500-0187",
      manufacturer: "IndexPro",
      unitPrice: "148.20",
      currency: "USD",
      availability: "In Stock",
      uom: "EA",
      status: "published",
      searchBlob: "t-slot cutter carbide",
      sortOrder: 0,
    });
    console.log("Created variant", variant._id, variant.sku);
  } else {
    console.log("Reuse variant", variant._id);
  }

  await api("PATCH", `/products/${product._id}`, {
    defaultVariantId: variant._id,
  });

  const rows = await api("GET", `/spec-schemas/${schema._id}/rows?limit=200`);
  const rowValues = {
    cutterDia: "0.500 in",
    cutWidth: "0.187 in",
    neckDia: "0.312 in",
    overallLen: "2.500 in",
    shankDia: "0.375 in",
    toothCount: "6",
    coating: "TiAlN",
    unitPrice: "$148.20",
  };

  let row = Array.isArray(rows) && rows.find((r) => r.externalKey === "demo-ts-row-1");

  if (!row) {
    row = await api("POST", `/spec-schemas/${schema._id}/rows`, {
      values: rowValues,
      externalKey: "demo-ts-row-1",
      status: "published",
      sortOrder: 0,
      variantBindings: [],
    });
    console.log("Created spec row", row._id);
  } else {
    console.log("Reuse spec row", row._id);
  }

  try {
    await api("POST", `/products/variants/${variant._id}/link-row`, {
      specRowId: row._id,
      syncBindings: true,
      bindingRole: "primary",
    });
    console.log("Linked variant → spec row (sync bindings).");
  } catch (e) {
    console.warn("link-row (may already be linked):", e.message);
  }

  console.log("\nDone. Storefront paths:");
  console.log(
    `  Category: /category/machining/milling/milling-cutters/t-slot-milling-cutters`,
  );
  console.log(`  PDP:      /product/${productSlug}`);
  console.log(`  Search:   /search?q=${encodeURIComponent(sku)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
