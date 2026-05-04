import type { ProductDoc, ProductVariantDoc } from "@/lib/admin-api/types";
import type {
  Product,
  ProductDetailPageData,
  ProductListingPageData,
  SearchCatalogProduct,
  CatalogTaxonomyNode,
  SpecRow,
  CatalogBreadcrumb,
  ProductAttachmentDoc,
} from "@/lib/types";
import { catalogServerJson, catalogServerJsonList } from "./fetch";
import { getTaxonomyTree } from "./taxonomy";
import { buildSpecMatrixForCategory } from "./matrix";
import { getDefaultCatalogImageUrl } from "@/config/cdn-defaults";

function findCategoryBySlug(
  nodes: CatalogTaxonomyNode[],
  slug: string,
): CatalogTaxonomyNode | undefined {
  for (const n of nodes) {
    if (n.slug === slug) return n;
    const d = findCategoryBySlug(n.children, slug);
    if (d) return d;
  }
  return undefined;
}

function findCategoryPath(
  nodes: CatalogTaxonomyNode[],
  targetId: string,
  trail: CatalogTaxonomyNode[] = [],
): CatalogTaxonomyNode[] | undefined {
  for (const n of nodes) {
    const next = [...trail, n];
    if (n.id === targetId) return next;
    const d = findCategoryPath(n.children, targetId, next);
    if (d) return d;
  }
  return undefined;
}

function mapVariantStatus(avail?: string): Product["status"] {
  const s = (avail ?? "").toLowerCase();
  if (s.includes("limited")) return "limited";
  if (s.includes("back")) return "backorder";
  return "in-stock";
}

/** PDP spec table: use the matrix row bound to this SKU in any of the product's categories. */
async function specificationRowsForPublishedVariant(
  sku: string | undefined,
  categoryIds: string[] | undefined,
): Promise<SpecRow[]> {
  if (!sku || !categoryIds?.length) return [];
  for (const catId of categoryIds) {
    const matrix = await buildSpecMatrixForCategory(catId);
    if (!matrix?.rows?.length) continue;
    const match = matrix.rows.find((r) => r.sku === sku);
    if (match) {
      return matrix.columns.map((col) => ({
        label: col.label,
        value: match.values[col.id] ?? "—",
      }));
    }
  }
  return [];
}

function breadcrumbsForProduct(
  categoryIds: string[] | undefined,
  tree: CatalogTaxonomyNode[],
): CatalogBreadcrumb[] {
  const crumbs: CatalogBreadcrumb[] = [{ label: "All products", href: "/" }];
  const cid = categoryIds?.[0];
  if (!cid) return crumbs;
  const path = findCategoryPath(tree, cid);
  if (!path?.length) return crumbs;
  const segments: string[] = [];
  for (const node of path) {
    segments.push(node.slug);
    crumbs.push({
      label: node.title,
      href: `/category/${segments.join("/")}`,
    });
  }
  return crumbs;
}

function normalizeProductImages(product: ProductDoc): Array<{ url: string; alt: string }> {
  const media = product.media;
  if (!media?.length) {
    return [{ url: getDefaultCatalogImageUrl(), alt: product.title }];
  }
  const sorted = [...media].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return sorted.map((m, i) => ({
    url: m.url.trim(),
    alt: m.alt?.trim() || `${product.title} — image ${i + 1}`,
  }));
}

function normalizeAttachmentDocType(raw?: string): ProductAttachmentDoc["docType"] {
  const allowed: ProductAttachmentDoc["docType"][] = [
    "manual",
    "datasheet",
    "sds",
    "certification",
    "drawing",
    "other",
  ];
  if (raw && (allowed as string[]).includes(raw)) return raw as ProductAttachmentDoc["docType"];
  return "other";
}

type ProductSummaryCardDto = {
  productId: string;
  slug: string;
  title: string;
  brand?: string;
  sku: string;
  itemNumber?: string;
  manufacturer?: string;
  price: string;
  uom: string;
  availability: string;
};

/** Single batched API — avoids N+1 variant fetches per related SKU. */
async function fetchOrderedProductCards(ids: string[] | undefined): Promise<Product[]> {
  if (!ids?.length) return [];
  const unique = [...new Set(ids.map((x) => x.trim()).filter(Boolean))].slice(0, 48);
  if (!unique.length) return [];

  const rows = await catalogServerJson<ProductSummaryCardDto[]>(
    `/products/summary-cards?ids=${unique.join(",")}`,
    {
      next: { revalidate: 60, tags: ["catalog", "pdp-summary-cards"] },
    },
  );
  const list = Array.isArray(rows) ? rows : [];
  return list.map((row) => ({
    id: row.productId,
    slug: row.slug,
    title: row.title,
    sku: row.sku,
    itemNumber: row.itemNumber,
    manufacturer: row.manufacturer ?? "—",
    brand: row.brand,
    thumbnail: getDefaultCatalogImageUrl(),
    price: row.price,
    uom: row.uom,
    status: mapVariantStatus(row.availability),
    leadTime: "—",
  }));
}

/** Public helper for client-driven lists (e.g. recently viewed localStorage IDs). */
export async function getProductsByIds(ids: string[] | undefined): Promise<Product[]> {
  return fetchOrderedProductCards(ids);
}

export async function getProductBySlug(slug: string): Promise<ProductDetailPageData | undefined> {
  const tree = await getTaxonomyTree();
  const { data: list } = await catalogServerJsonList<ProductDoc[]>(
    `/products?status=published&limit=40&q=${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );
  const product = list.find((p) => p.slug === slug);
  if (!product) return undefined;

  const { data: variants } = await catalogServerJsonList<ProductVariantDoc[]>(
    `/products/${product._id}/variants?status=published&limit=80`,
    { cache: "no-store" },
  );
  const primary =
    variants.find((v) => v._id === product.defaultVariantId) ?? variants[0];

  const price =
    primary?.unitPrice && primary.currency
      ? `${primary.unitPrice} ${primary.currency}`
      : primary?.unitPrice ?? "—";

  const specificationRows = await specificationRowsForPublishedVariant(
    primary?.sku,
    product.categoryIds,
  );

  const breadcrumbs = breadcrumbsForProduct(product.categoryIds, tree);
  const images = normalizeProductImages(product);

  const longDescription =
    product.longDescription?.trim() ||
    product.searchText?.trim() ||
    `${product.title}. Industrial catalog item.`;

  const shortDescription =
    product.searchText?.trim() ||
    (product.longDescription?.trim()
      ? product.longDescription.trim().slice(0, 320)
      : `${product.title}.`);

  const attachments: ProductAttachmentDoc[] = (product.attachments ?? []).map((a, i) => ({
    id: `att-${product._id}-${i}`,
    title: a.title,
    url: a.url.trim(),
    docType: normalizeAttachmentDocType(a.docType),
  }));

  const shippingWeight =
    product.shippingWeight?.trim() ||
    "Shipping weight — request dimensional weight / freight class from buyer services.";
  const branchAvailability =
    product.branchAvailabilityPlaceholder?.trim() ||
    "Branch / DC availability: sign in to view local stock, transfer times, and will-call pickup.";
  const logisticsAdmin = (product.logisticsMeta ?? []).filter(
    (x) => x.label?.trim() && x.value?.trim(),
  );
  const logisticsLines =
    logisticsAdmin.length > 0
      ? logisticsAdmin.map((x) => ({ label: x.label.trim(), value: x.value.trim() }))
      : [
          {
            label: "Shipping terms",
            value: "Standard parcel — motor freight / LTL quoted separately when applicable.",
          },
          {
            label: "Pickup / drop ship",
            value: "Fulfillment source confirmed at order entry — expedite requests via RFQ.",
          },
        ];

  return {
    slug: product.slug,
    title: product.title,
    brand: product.brand ?? "Factorypeer",
    sku: primary?.sku ?? "—",
    itemNumber: primary?.itemNumber ?? "—",
    manufacturerModel: primary?.mpn ?? primary?.manufacturer ?? "—",
    availability: primary?.availability ?? "—",
    leadTime: primary?.leadTime?.trim() || "Contact buyer services for lead time",
    moq: primary?.moq ?? null,
    packaging: primary?.packaging?.trim() || "—",
    price,
    uom: primary?.uom ?? "Each",
    breadcrumbs,
    images,
    shortDescription,
    longDescription,
    features: product.features ?? [],
    applications: product.applications ?? [],
    marketingBullets: product.marketingBullets ?? [],
    specificationRows,
    attachments,
    shippingWeight,
    branchAvailability,
    logisticsLines,
  };
}

export async function getProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let skip = 0;
  const limit = 100;
  for (;;) {
    const { data, total } = await catalogServerJsonList<ProductDoc[]>(
      `/products?status=published&limit=${limit}&skip=${skip}`,
    );
    for (const p of data) slugs.push(p.slug);
    if (data.length < limit) break;
    skip += limit;
    if (total != null && skip >= total) break;
    if (data.length === 0) break;
  }
  return slugs;
}

export async function searchCatalog(query: string): Promise<SearchCatalogProduct[]> {
  const q = query.trim();
  if (!q) return [];
  const { data: products } = await catalogServerJsonList<ProductDoc[]>(
    `/products?status=published&limit=60&q=${encodeURIComponent(q)}`,
  );
  const out: SearchCatalogProduct[] = [];

  for (const p of products) {
    const { data: variants } = await catalogServerJsonList<ProductVariantDoc[]>(
      `/products/${p._id}/variants?limit=10&status=published`,
    );
    const v = variants[0];
    const price =
      v?.unitPrice && v?.currency ? `${v.unitPrice} ${v.currency}` : v?.unitPrice ?? "—";
    out.push({
      id: p._id,
      slug: p.slug,
      title: p.title,
      sku: v?.sku ?? "—",
      itemNumber: v?.itemNumber ?? "—",
      manufacturer: v?.manufacturer ?? p.brand ?? "—",
      mpn: v?.mpn ?? "—",
      shortSpec: (p.searchText ?? p.title).slice(0, 160),
      price,
      uom: v?.uom ?? "Each",
      thumbnail: getDefaultCatalogImageUrl(),
      availability: v?.availability ?? "—",
    });
  }
  return out;
}

export async function getProductListingBySlug(slug: string): Promise<ProductListingPageData | undefined> {
  const tree = await getTaxonomyTree();
  const cat = findCategoryBySlug(tree, slug);
  if (!cat) return undefined;

  const path = findCategoryPath(tree, cat.id);
  const breadcrumbs = path ? path.map((n) => n.title) : [cat.title];

  const { data: products, total } = await catalogServerJsonList<ProductDoc[]>(
    `/products?status=published&categoryId=${encodeURIComponent(cat.id)}&limit=100`,
  );

  const grid: Array<
    Product & {
      shortSpec: string;
    }
  > = [];

  for (const p of products) {
    const { data: vars } = await catalogServerJsonList<ProductVariantDoc[]>(
      `/products/${p._id}/variants?limit=3&status=published`,
    );
    const v = vars[0];
    const price =
      v?.unitPrice && v?.currency ? `${v.unitPrice} ${v.currency}` : v?.unitPrice ?? "—";
    grid.push({
      id: p._id,
      slug: p.slug,
      title: p.title,
      sku: v?.sku ?? "—",
      itemNumber: v?.itemNumber ?? "—",
      manufacturer: v?.manufacturer ?? p.brand ?? "—",
      thumbnail: getDefaultCatalogImageUrl(),
      price,
      uom: v?.uom ?? "Each",
      status: mapVariantStatus(v?.availability),
      leadTime: "—",
      shortSpec: (p.searchText ?? "").slice(0, 80),
    });
  }

  return {
    slug: cat.slug,
    title: cat.title,
    breadcrumbs,
    resultCount: total ?? grid.length,
    filters: [],
    products: grid,
  };
}

export async function getProductListingSlugs(): Promise<string[]> {
  const tree = await getTaxonomyTree();
  const out: string[] = [];
  const walk = (nodes: CatalogTaxonomyNode[]) => {
    for (const n of nodes) {
      out.push(n.slug);
      if (n.children.length) walk(n.children);
    }
  };
  walk(tree);
  return out;
}

/** Recently updated published products for the home page (with first variant for price/SKU). */
export async function getFeaturedHomeProducts(limit = 6): Promise<Product[]> {
  const { data: products } = await catalogServerJsonList<ProductDoc[]>(
    `/products?status=published&limit=${limit}&sort=-updatedAt`,
  );
  const out: Product[] = [];
  for (const p of products) {
    const { data: vars } = await catalogServerJsonList<ProductVariantDoc[]>(
      `/products/${p._id}/variants?status=published&limit=1`,
    );
    const v = vars[0];
    const price =
      v?.unitPrice && v?.currency ? `${v.unitPrice} ${v.currency}` : v?.unitPrice ?? "—";
    out.push({
      id: p._id,
      slug: p.slug,
      title: p.title,
      sku: v?.sku ?? "—",
      itemNumber: v?.itemNumber,
      manufacturer: v?.manufacturer ?? p.brand ?? "—",
      thumbnail: getDefaultCatalogImageUrl(),
      price,
      uom: v?.uom ?? "Each",
      status: mapVariantStatus(v?.availability),
      leadTime: "—",
    });
  }
  return out;
}
