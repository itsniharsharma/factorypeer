import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.POPULATE_BASE_URL?.trim() || "http://127.0.0.1:3000";
const API_BASE = `${BASE_URL}/api/admin/catalog`;

const IMAGE_URL =
  process.env.NEXT_PUBLIC_CATALOG_DEFAULT_IMAGE_URL?.trim() ||
  "https://res.cloudinary.com/demo/image/upload/sample.jpg";

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function api(method, pathName, body) {
  const url = `${API_BASE}${pathName}`;
  const res = await fetch(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const txt = await res.text();
  let data = undefined;
  try {
    data = txt ? JSON.parse(txt) : undefined;
  } catch {
    data = txt;
  }
  return { status: res.status, data, headers: res.headers };
}

async function getCategoryTree() {
  const res = await api("GET", "/categories/tree");
  if (res.status >= 300) throw new Error(`categories/tree failed: ${res.status}`);
  return Array.isArray(res.data) ? res.data : [];
}

function findNodeBySlug(nodes, slug) {
  for (const node of nodes) {
    if (node.slug === slug) return node;
    if (Array.isArray(node.children)) {
      const hit = findNodeBySlug(node.children, slug);
      if (hit) return hit;
    }
  }
  return null;
}

async function ensureCategory({ title, slug, kind, parentId = null, sortOrder = 0 }) {
  const currentTree = await getCategoryTree();
  const existing = findNodeBySlug(currentTree, slug);
  if (existing) {
    await api("PATCH", `/categories/${existing._id}`, {
      title,
      kind,
      status: "published",
      sortOrder,
    });
    if ((existing.parentId || null) !== parentId) {
      await api("POST", `/categories/${existing._id}/move`, { newParentId: parentId });
    }
    return existing._id;
  }

  const created = await api("POST", "/categories", {
    title,
    slug,
    kind,
    parentId,
    sortOrder,
    status: "published",
  });
  if (created.status >= 300) {
    throw new Error(`create category failed (${slug}): ${created.status} ${JSON.stringify(created.data)}`);
  }
  return created.data._id;
}

async function ensureProduct(spec) {
  const createRes = await api("POST", "/products", spec);
  if (createRes.status < 300) return createRes.data;
  const listRes = await api("GET", `/products?limit=300&q=${encodeURIComponent(spec.slug)}`);
  const items = Array.isArray(listRes.data) ? listRes.data : [];
  const hit = items.find((p) => p.slug === spec.slug);
  if (!hit) {
    throw new Error(`create product failed (${spec.slug}): ${createRes.status}`);
  }
  await api("PATCH", `/products/${hit._id}`, spec);
  return hit;
}

async function ensureVariant(productId, variant) {
  const variantsRes = await api("GET", `/products/${productId}/variants?limit=200`);
  const list = Array.isArray(variantsRes.data) ? variantsRes.data : [];
  const existing = list.find((v) => v.sku === variant.sku);
  if (existing) {
    await api("PATCH", `/products/variants/${existing._id}`, variant);
    return existing;
  }
  const created = await api("POST", `/products/${productId}/variants`, variant);
  if (created.status >= 300) {
    throw new Error(`create variant failed (${variant.sku}): ${created.status}`);
  }
  return created.data;
}

function buildProductSpecs(categoryTitle, categoryId) {
  const base = [
    "Industrial Grade Panel Heater",
    "Heavy Duty Steam Iron",
    "Split Inverter AC Controller",
    "Flame Resistant Copper Wire Coil",
    "Digital Clamp Meter",
    "High-Lumen Industrial Bulb",
    "Smart Energy Monitor Unit",
  ];

  return base.map((name, idx) => {
    const clean = `${categoryTitle} ${name}`;
    const slug = slugify(clean);
    const sku = `${slugify(categoryTitle).toUpperCase()}-${String(idx + 1).padStart(3, "0")}`;
    const basePrice = (idx + 2) * 18;
    return {
      slug,
      title: clean,
      brand: "FactoryPeer Industrial",
      status: "published",
      categoryIds: [categoryId],
      searchText: `${clean} for commercial and industrial use`,
      longDescription: `${clean} designed for continuous operation in demanding commercial environments.`,
      features: [
        "Industrial enclosure",
        "Low maintenance lifecycle",
        "Built for commercial duty cycles",
      ],
      applications: [
        "Plant maintenance",
        "Warehouse operations",
        "Facility electrical systems",
      ],
      marketingBullets: [
        "Reliable performance under continuous load",
        "Field-service friendly construction",
        "Fast procurement and replenishment",
      ],
      shippingWeight: `${(idx + 1) * 1.3} kg`,
      branchAvailabilityPlaceholder: "Stock varies by branch and central DC. Contact procurement desk for exact ETA.",
      logisticsMeta: [
        { label: "Dispatch SLA", value: "24-48 hours for in-stock items" },
        { label: "Freight Class", value: "Industrial electrical - standard handling" },
      ],
      media: [
        {
          url: IMAGE_URL,
          alt: clean,
          sortOrder: 0,
        },
      ],
      _variant: {
        sku,
        itemNumber: `ITM-${String(20000 + idx)}`,
        mpn: `FP-${slugify(categoryTitle).toUpperCase()}-${idx + 1}`,
        manufacturer: "FactoryPeer Industrial",
        unitPrice: basePrice.toFixed(2),
        currency: "USD",
        availability: idx % 3 === 0 ? "In stock" : idx % 3 === 1 ? "Limited stock" : "Backorder 5 days",
        uom: "Each",
        leadTime: idx % 3 === 2 ? "5 business days" : "2 business days",
        moq: idx % 2 === 0 ? 1 : 2,
        packaging: idx % 2 === 0 ? "Single carton" : "Pack of 2",
        status: "published",
        searchBlob: `${clean} ${sku} industrial commercial`,
      },
    };
  });
}

async function upsertHomepageBanners() {
  const banners = [
    {
      slug: "electrical-reliability-banner",
      title: "Industrial Electrical Reliability",
      subtitle: "Source compliant electrical components for plants and facilities.",
      description: "Production-ready inventory with transparent lead times.",
      ctaLabel: "Explore Electrical Catalog",
      href: "/category/electrical",
      status: "published",
      sortOrder: 0,
      image: { url: IMAGE_URL, alt: "Industrial electrical control room" },
    },
    {
      slug: "bulk-procurement-banner",
      title: "Bulk Procurement Without Delays",
      subtitle: "Consolidate RFQs, compare variants, and place recurring orders faster.",
      description: "Built for procurement teams managing multi-site industrial demand.",
      ctaLabel: "Request Bulk Quote",
      href: "/search?q=industrial",
      status: "published",
      sortOrder: 1,
      image: { url: IMAGE_URL, alt: "Warehouse and distribution operations" },
    },
  ];

  const list = await api("GET", "/homepage/banners");
  const existing = Array.isArray(list.data) ? list.data : [];
  for (const banner of banners) {
    const hit = existing.find((b) => b.slug === banner.slug);
    if (hit) {
      await api("PATCH", `/homepage/banners/${hit._id}`, banner);
    } else {
      await api("POST", "/homepage/banners", banner);
    }
  }
}

async function upsertSupportCards() {
  const cards = [
    {
      slug: "fast-delivery",
      title: "Fast Delivery",
      description: "Expedited dispatch for operationally critical MRO requirements.",
      ctaLabel: "Check Delivery Options",
      href: "/search?q=delivery",
      status: "published",
      sortOrder: 0,
      image: { url: IMAGE_URL, alt: "Fast logistics support" },
    },
    {
      slug: "bulk-procurement-support",
      title: "Bulk Procurement Support",
      description: "Dedicated sourcing support for high-volume and recurring purchase cycles.",
      ctaLabel: "Start Bulk RFQ",
      href: "/search?q=bulk",
      status: "published",
      sortOrder: 1,
      image: { url: IMAGE_URL, alt: "Bulk procurement planning" },
    },
    {
      slug: "technical-assistance",
      title: "24/7 Technical Assistance",
      description: "Talk to specialists for product matching, compatibility, and replacements.",
      ctaLabel: "Contact Technical Team",
      href: "/search?q=support",
      status: "published",
      sortOrder: 2,
      image: { url: IMAGE_URL, alt: "Technical support engineer" },
    },
  ];

  const list = await api("GET", "/homepage/support-cards");
  const existing = Array.isArray(list.data) ? list.data : [];
  for (const card of cards) {
    const hit = existing.find((c) => c.slug === card.slug);
    if (hit) {
      await api("PATCH", `/homepage/support-cards/${hit._id}`, card);
    } else {
      await api("POST", "/homepage/support-cards", card);
    }
  }
}

async function upsertFooter() {
  const linkGroups = [
    {
      slug: "footer-shop-electrical",
      title: "Shop Electrical",
      placement: "footer",
      status: "published",
      sortOrder: 0,
      links: [
        { label: "Electrical", href: "/category/electrical", status: "published", sortOrder: 0 },
        { label: "Wires", href: "/category/electrical/shop-stuff/wires", status: "published", sortOrder: 1 },
        { label: "Meters", href: "/category/electrical/shop-stuff/meter", status: "published", sortOrder: 2 },
        { label: "Bulbs", href: "/category/electrical/shop-stuff/bulb", status: "published", sortOrder: 3 },
      ],
    },
    {
      slug: "footer-support-rfq",
      title: "Support & RFQ",
      placement: "footer",
      status: "published",
      sortOrder: 1,
      links: [
        { label: "Request a quote", href: "/search?q=quote", status: "published", sortOrder: 0 },
        { label: "Search catalog", href: "/search", status: "published", sortOrder: 1 },
        { label: "Help center", href: "/search?q=help", status: "published", sortOrder: 2 },
      ],
    },
    {
      slug: "footer-legal-company",
      title: "Legal",
      placement: "footer",
      status: "published",
      sortOrder: 2,
      links: [
        { label: "Privacy policy", href: "/search?q=privacy", status: "published", sortOrder: 0 },
        { label: "Terms of use", href: "/search?q=terms", status: "published", sortOrder: 1 },
        { label: "Accessibility", href: "/search?q=accessibility", status: "published", sortOrder: 2 },
      ],
    },
  ];

  const groupsRes = await api("GET", "/navigation/link-groups?placement=footer");
  const existingGroups = Array.isArray(groupsRes.data) ? groupsRes.data : [];
  for (const group of linkGroups) {
    const hit = existingGroups.find((g) => g.slug === group.slug && g.placement === "footer");
    if (hit) {
      await api("PATCH", `/navigation/link-groups/${hit._id}`, group);
    } else {
      await api("POST", "/navigation/link-groups", group);
    }
  }

  const footerContent = {
    slug: "factorypeer-main-footer",
    brandName: "FactoryPeer",
    newsletterHeading: "Procurement Insights",
    newsletterDescription: "Get updates on inventory trends, sourcing insights, and industrial buying guides.",
    newsletterCtaLabel: "Subscribe",
    newsletterCtaHref: "/search?q=newsletter",
    feedbackHeading: "Need sourcing assistance?",
    feedbackCtaLabel: "Contact Us",
    feedbackCtaHref: "/search?q=contact",
    copyrightText: "© 2026 Factorypeer. Catalog content is managed from admin.",
    status: "published",
    sortOrder: 0,
    socialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com", icon: "in", sortOrder: 0 },
      { label: "YouTube", href: "https://www.youtube.com", icon: "yt", sortOrder: 1 },
    ],
  };

  const footerList = await api("GET", "/navigation/footer-content");
  const existingFooter = Array.isArray(footerList.data) ? footerList.data : [];
  const footerHit = existingFooter.find((f) => f.slug === footerContent.slug);
  if (footerHit) {
    await api("PATCH", `/navigation/footer-content/${footerHit._id}`, footerContent);
  } else {
    await api("POST", "/navigation/footer-content", footerContent);
  }
}

async function main() {
  const taxonomy = {
    title: "Electrical",
    slug: "electrical",
    children: [
      { title: "Home Stuff", slug: "home-stuff", children: ["Heater", "Iron", "AC"] },
      { title: "Shop Stuff", slug: "shop-stuff", children: ["Wires", "Meter", "Bulb"] },
      { title: "Industry Stuff", slug: "industry-stuff", children: ["Cement", "Fan", "Jug"] },
    ],
  };

  const created = { categories: [], products: [] };
  const rootId = await ensureCategory({
    title: taxonomy.title,
    slug: taxonomy.slug,
    kind: "branch",
    sortOrder: 0,
  });
  created.categories.push({ title: taxonomy.title, slug: taxonomy.slug, id: rootId });

  let branchSort = 0;
  for (const branch of taxonomy.children) {
    const branchId = await ensureCategory({
      title: branch.title,
      slug: branch.slug,
      kind: "branch",
      parentId: rootId,
      sortOrder: branchSort++,
    });
    created.categories.push({ title: branch.title, slug: branch.slug, id: branchId, parentId: rootId });

    let leafSort = 0;
    for (const leafTitle of branch.children) {
      const leafSlug = slugify(leafTitle);
      const leafId = await ensureCategory({
        title: leafTitle,
        slug: leafSlug,
        kind: "family",
        parentId: branchId,
        sortOrder: leafSort++,
      });
      created.categories.push({ title: leafTitle, slug: leafSlug, id: leafId, parentId: branchId });

      const productSpecs = buildProductSpecs(leafTitle, leafId);
      for (const spec of productSpecs) {
        const variant = spec._variant;
        delete spec._variant;
        const product = await ensureProduct(spec);
        await ensureVariant(product._id, variant);
        created.products.push({ category: leafTitle, productSlug: spec.slug, sku: variant.sku });
      }
    }
  }

  await upsertHomepageBanners();
  await upsertSupportCards();
  await upsertFooter();

  const outPath = path.join(process.cwd(), "scripts", "populate-admin-catalog.report.json");
  fs.writeFileSync(outPath, JSON.stringify(created, null, 2), "utf8");
  console.log(`Population complete. Report written to ${outPath}`);
  console.log(`Categories touched: ${created.categories.length}`);
  console.log(`Products ensured: ${created.products.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
