import type { ProductDoc, ProductVariantDoc } from "@/lib/admin-api/types";
import type {
  Product,
  ProductDetailPageData,
  ProductListingPageData,
  SearchCatalogProduct,
  CatalogTaxonomyNode,
  SpecRow,
} from "@/lib/types";
import { catalogServerJsonList } from "./fetch";
import { getTaxonomyTree } from "./taxonomy";
import { buildSpecMatrixForCategory } from "./matrix";

const PLACEHOLDER_IMG = "/images/product-thumb.svg";

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

export async function getProductBySlug(slug: string): Promise<ProductDetailPageData | undefined> {
  const { data: list } = await catalogServerJsonList<ProductDoc[]>(
    `/products?status=published&limit=40&q=${encodeURIComponent(slug)}`,
  );
  const product = list.find((p) => p.slug === slug);
  if (!product) return undefined;

  const { data: variants } = await catalogServerJsonList<ProductVariantDoc[]>(
    `/products/${product._id}/variants?status=published&limit=80`,
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

  return {
    slug: product.slug,
    title: product.title,
    brand: product.brand ?? "Factorypeer",
    sku: primary?.sku ?? "—",
    itemNumber: primary?.itemNumber ?? "—",
    manufacturerModel: primary?.mpn ?? primary?.manufacturer ?? "—",
    availability: primary?.availability ?? "—",
    leadTime: "See availability",
    price,
    uom: primary?.uom ?? "Each",
    images: [PLACEHOLDER_IMG, PLACEHOLDER_IMG, PLACEHOLDER_IMG, PLACEHOLDER_IMG],
    description: product.searchText?.trim() ? product.searchText : `${product.title}. Industrial catalog item.`,
    specificationRows,
    documents: [],
    relatedProducts: [],
    accessories: [],
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
      thumbnail: PLACEHOLDER_IMG,
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
      thumbnail: PLACEHOLDER_IMG,
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
      thumbnail: PLACEHOLDER_IMG,
      price,
      uom: v?.uom ?? "Each",
      status: mapVariantStatus(v?.availability),
      leadTime: "—",
    });
  }
  return out;
}
