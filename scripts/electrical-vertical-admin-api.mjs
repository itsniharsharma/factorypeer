#!/usr/bin/env node
/**
 * Electrical vertical E2E via catalog-admin-api — same HTTP routes the Admin Panel uses
 * (Categories → Spec schema & columns → Products & variants → Spec rows → link-row → publish schema → homepage tile).
 *
 * Usage:
 *   CATALOG_ADMIN_API_URL=http://127.0.0.1:4040 node scripts/electrical-vertical-admin-api.mjs
 *
 * Requires MongoDB + catalog-admin-api. Optional:
 *   CATALOG_ACTOR_ID  — ObjectId for audit fields (default demo id)
 * When API runs with CATALOG_ADMIN_API_KEY, set the same in env:
 *   export CATALOG_ADMIN_API_KEY=... ; node scripts/electrical-vertical-admin-api.mjs
 * (HTTP helper injects Authorization — extend api() if you script against this.)
 *
 * Idempotent: safe to re-run; reuses existing categories/products by slug / externalKey.
 */

import http from "node:http";
import { URL } from "node:url";

const BASE = (process.env.CATALOG_ADMIN_API_URL ?? "http://127.0.0.1:4040").replace(/\/$/, "");
const ACTOR = process.env.CATALOG_ACTOR_ID ?? "507f1f77bcf86cd799439011";

const PREFIX = `${BASE}/admin/catalog`;
const API_KEY = process.env.CATALOG_ADMIN_API_KEY?.trim();

/** Uses node:http (not fetch) so PATCH bodies are delivered reliably on Windows + Node 18+. */
async function api(method, path, json = undefined) {
  const urlStr = `${PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
  const u = new URL(urlStr);
  const payload = json !== undefined ? JSON.stringify(json) : undefined;
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: u.hostname,
      port: u.port || (u.protocol === "https:" ? 443 : 80),
      path: u.pathname + u.search,
      method,
      headers: {
        accept: "application/json",
        "x-catalog-actor-id": ACTOR,
        ...(API_KEY && API_KEY.length >= 16 ? { authorization: `Bearer ${API_KEY}` } : {}),
        ...(payload
          ? {
              "content-type": "application/json",
              "content-length": String(Buffer.byteLength(payload)),
            }
          : {}),
      },
    };
    const req = http.request(opts, (res) => {
      let text = "";
      res.on("data", (c) => {
        text += c;
      });
      res.on("end", () => {
        let body;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          body = text;
        }
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`${method} ${path} → ${res.statusCode}: ${text}`));
          return;
        }
        resolve(body);
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function productId(doc) {
  const raw = doc?._id ?? doc?.id;
  if (typeof raw === "string" && /^[a-f\d]{24}$/i.test(raw)) return raw;
  if (raw && typeof raw === "object" && typeof raw.toHexString === "function") return raw.toHexString();
  throw new Error(`Invalid product id: ${JSON.stringify(raw)}`);
}

async function ensureCategory(parentId, slug, title, kind) {
  const siblings =
    parentId == null ? await api("GET", "/categories/root/children") : await api("GET", `/categories/${parentId}/children`);
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
  { key: "poles", label: "Poles", sortOrder: 0, widthClass: "w-[72px]" },
  { key: "ratedCurrent", label: "Rated Current", sortOrder: 1, widthClass: "w-[110px]" },
  { key: "voltage", label: "Voltage", sortOrder: 2, widthClass: "w-[110px]" },
  { key: "breakingCapacity", label: "Breaking Capacity", sortOrder: 3, widthClass: "w-[130px]" },
  { key: "tripCurve", label: "Trip Curve", sortOrder: 4, widthClass: "w-[90px]" },
  { key: "mountingType", label: "Mounting Type", sortOrder: 5, widthClass: "w-[120px]" },
  { key: "width", label: "Width", sortOrder: 6, widthClass: "w-[90px]" },
  { key: "brand", label: "Brand", sortOrder: 7, widthClass: "w-[130px]" },
];

const IMG = "https://placehold.co/480x480/1e293b/ffffff/png?text=MCB";

/** @type {Array<{ slug: string; title: string; brand: string; sku: string; itemNo: string; mpn: string; rowKey: string; values: Record<string,string>; searchExtra: string }>} */
const PRODUCTS = [
  {
    slug: "schneider-acti9-ic60n-c16-1p",
    title: "Schneider Electric Acti9 iC60N 1P 16A Curve-C Miniature Circuit Breaker",
    brand: "Schneider Electric",
    sku: "SCH-A9K24116",
    itemNo: "FP-ELEC-114821",
    mpn: "A9K24116",
    rowKey: "mcb-row-schneider-a9k24116",
    searchExtra: "Acti9 iC60N DIN rail",
    values: {
      poles: "1",
      ratedCurrent: "16 A",
      voltage: "230/400 V AC",
      breakingCapacity: "6 kA",
      tripCurve: "C",
      mountingType: "DIN rail (IEC 60715)",
      width: "17.5 mm (1 module)",
      brand: "Schneider Electric",
    },
  },
  {
    slug: "abb-sh200-s201-c20-1p",
    title: "ABB SH200 / S201 1P 20A Curve-C Miniature Circuit Breaker",
    brand: "ABB",
    sku: "ABB-S201-C20-1P",
    itemNo: "FP-ELEC-229103",
    mpn: "S201-C20",
    rowKey: "mcb-row-abb-s201-c20",
    searchExtra: "System pro M compact",
    values: {
      poles: "1",
      ratedCurrent: "20 A",
      voltage: "230/400 V AC",
      breakingCapacity: "6 kA",
      tripCurve: "C",
      mountingType: "DIN rail",
      width: "17.5 mm",
      brand: "ABB",
    },
  },
  {
    slug: "siemens-sentron-5sy4120-7-1p",
    title: "Siemens Sentron 5SY 1P 20A Curve-C Miniature Circuit Breaker",
    brand: "Siemens",
    sku: "SIE-5SY4120-7",
    itemNo: "FP-ELEC-551902",
    mpn: "5SY4120-7",
    rowKey: "mcb-row-siemens-5sy4120",
    searchExtra: "Sentron 5SY UL489 branch",
    values: {
      poles: "1",
      ratedCurrent: "20 A",
      voltage: "240/415 V AC",
      breakingCapacity: "10 kA",
      tripCurve: "C",
      mountingType: "DIN rail",
      width: "17.5 mm",
      brand: "Siemens",
    },
  },
];

async function ensureProductFull(p, mcbId) {
  const q = `${p.slug}`;
  const list = await api("GET", `/products?status=published&limit=40&q=${encodeURIComponent(q)}`);
  let product = Array.isArray(list) ? list.find((x) => x.slug === p.slug) : null;

  const searchText = `${p.sku} ${p.itemNo} ${p.mpn} ${p.title} ${p.searchExtra}`.slice(0, 9900);
  const bodyCreate = {
    slug: p.slug,
    title: p.title,
    brand: p.brand,
    status: "published",
    categoryIds: [mcbId],
    searchText,
    sortOrder: 0,
    longDescription: `${p.title}. Industrial miniature circuit breaker for branch circuit protection. Suitable for panelboards and machinery disconnect protection where listed. Verify application engineering and local electrical codes prior to installation.`,
    features: [
      "Thermal-magnetic trip characteristic",
      "DIN rail mounting — typical industrial enclosure layouts",
      "Compact 17.5 mm single-pole module width",
    ],
    applications: ["Distribution panels", "Machine tool branch circuits", "Control cabinet protection"],
    marketingBullets: [
      `${p.brand} — orderable industrial SKU`,
      "Confirm voltage, fault level, and coordination with upstream devices",
    ],
    media: [{ url: IMG, alt: `${p.brand} MCB front`, sortOrder: 0 }],
    attachments: [
      {
        title: `${p.mpn} — dimensional outline (sample PDF)`,
        url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
        docType: "datasheet",
        sortOrder: 0,
      },
    ],
    shippingWeight: "0.22 lb (approx. single module)",
    branchAvailabilityPlaceholder:
      "Regional DC availability — sign in for transfer times and will-call pickup options.",
    logisticsMeta: [
      { label: "Freight class", value: "Parcel — small parts envelope / carton quantity dependent." },
      { label: "Hazmat", value: "No — standard electrical device." },
    ],
  };

  if (!product) {
    product = await api("POST", "/products", bodyCreate);
    console.log("  created product", product.slug, product._id);
  } else {
    await api("PATCH", `/products/${product._id}`, {
      ...bodyCreate,
      categoryIds: [mcbId],
    });
    console.log("  updated product", product.slug, product._id);
  }

  const variants = await api("GET", `/products/${product._id}/variants?limit=50`);
  let variant = variants.find((v) => v.sku === p.sku);
  if (!variant) {
    variant = await api("POST", `/products/${product._id}/variants`, {
      sku: p.sku,
      itemNumber: p.itemNo,
      mpn: p.mpn,
      manufacturer: p.brand,
      unitPrice: (89.5 + PRODUCTS.indexOf(p) * 12).toFixed(2),
      currency: "USD",
      availability: "In Stock — ships in 1–2 business days",
      uom: "EA",
      leadTime: "2–4 days",
      moq: 1,
      packaging: "Each (1)",
      status: "published",
      searchBlob: `${p.sku} ${p.itemNo} ${p.mpn} ${p.brand}`,
      sortOrder: 0,
    });
    console.log("  created variant", variant.sku);
  } else {
    await api("PATCH", `/products/variants/${variant._id}`, {
      sku: p.sku,
      itemNumber: p.itemNo,
      mpn: p.mpn,
      manufacturer: p.brand,
      unitPrice: (89.5 + PRODUCTS.indexOf(p) * 12).toFixed(2),
      currency: "USD",
      availability: "In Stock — ships in 1–2 business days",
      uom: "EA",
      leadTime: "2–4 days",
      moq: 1,
      packaging: "Each (1)",
      status: "published",
      searchBlob: `${p.sku} ${p.itemNo} ${p.mpn} ${p.brand}`,
    });
    console.log("  reuse variant", variant.sku);
  }

  await api("PATCH", `/products/${product._id}`, {
    defaultVariantId: variant._id,
  });

  return { product, variant };
}

async function main() {
  console.log(`Catalog API: ${PREFIX}`);
  console.log("Actor:", ACTOR);

  const electrical = await ensureCategory(null, "electrical", "Electrical", "branch");
  const circuitProtection = await ensureCategory(electrical._id, "circuit-protection", "Circuit Protection", "branch");
  const circuitBreakers = await ensureCategory(circuitProtection._id, "circuit-breakers", "Circuit Breakers", "branch");
  const mcb = await ensureCategory(circuitBreakers._id, "miniature-circuit-breakers", "Miniature Circuit Breakers", "family");

  let schema = await api("GET", `/taxonomy/${mcb._id}/spec-schema`);
  if (!schema) {
    schema = await api("POST", `/taxonomy/${mcb._id}/spec-schema`, {
      familySummary:
        "Miniature circuit breakers (MCBs) — compare poles, rated current, voltage, breaking capacity, trip curve, and mounting. Rows map to orderable SKUs.",
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
      searchIndex: true,
    });
    console.log("  added column", col.key);
  }

  const created = [];
  for (const def of PRODUCTS) {
    console.log("\nProduct:", def.slug);
    created.push(await ensureProductFull(def, mcb._id));
  }

  const rowsRes = await api("GET", `/spec-schemas/${schema._id}/rows?limit=200`);
  const rows = Array.isArray(rowsRes) ? rowsRes : [];

  for (let i = 0; i < PRODUCTS.length; i++) {
    const def = PRODUCTS[i];
    const { variant } = created[i];
    let row = rows.find((r) => r.externalKey === def.rowKey);
    if (!row) {
      row = await api("POST", `/spec-schemas/${schema._id}/rows`, {
        values: def.values,
        externalKey: def.rowKey,
        status: "published",
        sortOrder: i,
        variantBindings: [],
      });
      console.log("Created spec row", row._id, def.rowKey);
    } else {
      console.log("Reuse spec row", row._id, def.rowKey);
    }
    try {
      await api("POST", `/products/variants/${variant._id}/link-row`, {
        specRowId: row._id,
        syncBindings: true,
        bindingRole: "primary",
      });
      console.log("  linked variant → row");
    } catch (e) {
      console.warn("  link-row:", e.message);
    }
  }

  if (schema.status !== "published") {
    await api("POST", `/spec-schemas/${schema._id}/publish`, undefined);
    console.log("\nPublished spec schema — family active schema attached.");
  } else {
    console.log("\nSpec schema already published.");
  }

  const [a, b, c] = created;
  const pa = productId(a.product);
  const pb = productId(b.product);
  const pc = productId(c.product);
  /** Include `title` so partial PATCH always has a non-relation field (some proxies strip tiny JSON bodies). */
  await api("PATCH", `/products/${pa}`, {
    title: a.product.title,
    relatedProductIds: [pb],
    compatibleProductIds: [pc],
    recommendedProductIds: [pc],
  });
  await api("PATCH", `/products/${pb}`, {
    title: b.product.title,
    relatedProductIds: [pc],
    compatibleProductIds: [pa],
  });
  await api("PATCH", `/products/${pc}`, {
    title: c.product.title,
    relatedProductIds: [pa],
    compatibleProductIds: [pb],
  });
  console.log("\nSet related / compatible / recommended cross-links.");

  const tiles = await api("GET", "/homepage/category-tiles?status=published");
  const tileSlug = "electrical-vertical-highlight";
  const existsTile = Array.isArray(tiles) && tiles.some((t) => t.slug === tileSlug);
  if (!existsTile) {
    await api("POST", "/homepage/category-tiles", {
      slug: tileSlug,
      label: "Electrical — Circuit Protection",
      description: "MCBs, enclosures, and branch protection essentials.",
      categoryId: electrical._id,
      href: "/category/electrical/circuit-protection/circuit-breakers/miniature-circuit-breakers",
      imageUrl: "https://placehold.co/640x400/0f172a/e2e8f0/png?text=Electrical",
      imageAlt: "Electrical distribution products",
      ctaLabel: "Browse MCBs",
      status: "published",
      sortOrder: 2,
    });
    console.log("Created homepage category tile:", tileSlug);
  } else {
    console.log("Homepage tile already present:", tileSlug);
  }

  console.log("\n--- Done. Verify on storefront ---");
  console.log(
    "  Category (matrix): /category/electrical/circuit-protection/circuit-breakers/miniature-circuit-breakers",
  );
  for (const def of PRODUCTS) {
    console.log(`  PDP: /product/${def.slug}`);
    console.log(`       Search SKU: /search?q=${encodeURIComponent(def.sku)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
