export type InventoryStatus = "in-stock" | "limited" | "backorder";

export interface Category {
  id: string;
  name: string;
  segment: string;
  skuCount: number;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  itemNumber?: string;
  manufacturer: string;
  brand?: string;
  thumbnail?: string;
  price: string;
  uom: string;
  status: InventoryStatus;
  leadTime: string;
  /** Present when the row comes from the catalog API (PDP link). */
  slug?: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface PromoStripItem {
  id: string;
  label: string;
  value: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  skuCount: number;
}

export interface ServiceOffering {
  id: string;
  title: string;
  detail: string;
}

export interface TrustPoint {
  id: string;
  title: string;
  detail: string;
}

export interface SupportCTA {
  id: string;
  title: string;
  description: string;
  action: string;
  /** When set, primary CTA uses this target (from admin). */
  href?: string;
  /** Optional hero image — Cloudinary or other HTTPS CDN URL. */
  image?: string;
  imageAlt?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  ctaLabel?: string;
  href?: string;
  openInNewTab?: boolean;
}

export interface CategoryTile {
  id: string;
  label: string;
  image: string;
  /** Resolved from admin href, or /category/... from categoryId. */
  href?: string;
  imageAlt?: string;
  ctaLabel?: string;
}

export interface CatalogLinkItem {
  id: string;
  label: string;
  slug: string;
  count?: number;
}

export interface CatalogCategoryPageData {
  slug: string;
  title: string;
  description: string;
  subcategories: CatalogLinkItem[];
  featuredSubcategories: CategoryTile[];
  relatedCategories: CatalogLinkItem[];
  featuredProducts: Product[];
}

export interface ProductListingPageData {
  slug: string;
  title: string;
  breadcrumbs: string[];
  resultCount: number;
  filters: Array<{
    id: string;
    label: string;
    options: Array<{ id: string; label: string; count: number }>;
  }>;
  products: Array<
    Product & {
      shortSpec: string;
    }
  >;
}

/** PDP attachment row — sourced from product.attachments in catalog API. */
export interface ProductAttachmentDoc {
  id: string;
  title: string;
  url: string;
  docType: "manual" | "datasheet" | "sds" | "certification" | "drawing" | "other";
}

export interface ProductDetailPageData {
  slug: string;
  title: string;
  brand: string;
  sku: string;
  itemNumber: string;
  manufacturerModel: string;
  availability: string;
  leadTime: string;
  price: string;
  uom: string;
  /** Minimum order qty when set on variant. */
  moq: number | null;
  /** Sell unit / pack line copy. */
  packaging: string;
  breadcrumbs: CatalogBreadcrumb[];
  /** Primary first; zoom/lightbox uses full list. */
  images: Array<{ url: string; alt: string }>;
  /** Short merchandising blurb (overview). */
  shortDescription: string;
  /** Long-form PDP body. */
  longDescription: string;
  features: string[];
  applications: string[];
  marketingBullets: string[];
  specificationRows: SpecRow[];
  attachments: ProductAttachmentDoc[];
  /** Shipping weight line — from catalog or default placeholder. */
  shippingWeight: string;
  /** Branch / DC availability copy — admin or procurement placeholder. */
  branchAvailability: string;
  /** Hazmat, freight, carrier terms — from admin `logisticsMeta` plus defaults. */
  logisticsLines: Array<{ label: string; value: string }>;
}

export interface SearchCatalogProduct {
  id: string;
  slug: string;
  title: string;
  sku: string;
  itemNumber: string;
  manufacturer: string;
  mpn: string;
  shortSpec: string;
  price: string;
  uom: string;
  thumbnail?: string;
  availability: string;
}

export interface CartLineItem {
  id: string;
  slug: string;
  title: string;
  sku: string;
  itemNumber: string;
  thumbnail?: string;
  unitPrice: number;
  uom: string;
  quantity: number;
}

export interface CartPageData {
  lineItems: CartLineItem[];
  rfqNote: string;
}

export interface CatalogFilterGroup {
  id: string;
  label: string;
  options: Array<{ id: string; label: string; count: number }>;
}

export interface CatalogTileLink {
  id: string;
  label: string;
  description?: string;
  slug: string;
  productCount: number;
  image?: string;
}

export interface CatalogTaxonomyNode {
  id: string;
  slug: string;
  title: string;
  description: string;
  productCount: number;
  children: CatalogTaxonomyNode[];
  filters?: CatalogFilterGroup[];
  matrix?: CatalogSpecMatrix;
  /** From catalog API — drives spec matrix on family nodes */
  kind?: "branch" | "family";
  activeSpecSchemaId?: string | null;
  /** Mirrors category `sortOrder` from admin API — sibling ordering. */
  sortOrder?: number;
}

export interface CatalogSpecColumn {
  id: string;
  label: string;
  widthClass?: string;
}

export interface CatalogSpecRow {
  id: string;
  values: Record<string, string>;
  productSlug: string;
  productTitle: string;
  sku: string;
  itemNumber: string;
  unitPrice: string;
  availability: string;
}

export interface CatalogSpecMatrix {
  familySummary: string;
  columns: CatalogSpecColumn[];
  rows: CatalogSpecRow[];
  /** Published rows in schema (stable when matrix rows are paginated). */
  totalRowCount: number;
  /** Set when the matrix is loaded as a paged slice (family category UI). */
  matrixPage?: number;
  matrixPageSize?: number;
}

export interface CatalogBreadcrumb {
  label: string;
  href: string;
}

export interface CatalogNavLinkItem {
  id: string;
  label: string;
  href: string;
  isHeader?: boolean;
}

/** Mega menu: one root heading + immediate children only (taxonomy-driven). */
export interface MegaMenuRootGroup {
  root: CatalogNavLinkItem;
  children: CatalogNavLinkItem[];
}
