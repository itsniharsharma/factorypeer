/** Mirrors Mongo-backed docs returned by catalog-admin-api (JSON-serialized). */

export type PublishStatus = "draft" | "published" | "archived";

export type CategoryDoc = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  kind: "branch" | "family";
  status: PublishStatus;
  parentId?: string | null;
  path: string;
  sortOrder?: number;
  activeSpecSchemaId?: string | null;
  children?: CategoryDoc[];
  createdAt?: string;
  updatedAt?: string;
};

export type SpecSchemaDoc = {
  _id: string;
  taxonomyNodeId: string;
  familySummary?: string;
  status: PublishStatus;
  version?: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SpecColumnDoc = {
  _id: string;
  specSchemaId: string;
  key: string;
  label: string;
  dataType?: string;
  filterable?: boolean;
  sortable?: boolean;
  searchIndex?: boolean;
  enumOptions?: string[];
  unit?: string;
  widthClass?: string;
  sortOrder?: number;
};

export type VariantBindingDoc = {
  productVariantId: string;
  role?: "primary" | "alternate";
  sortOrder?: number;
};

export type SpecRowDoc = {
  _id: string;
  specSchemaId: string;
  taxonomyNodeId: string;
  values: Record<string, string>;
  variantBindings?: VariantBindingDoc[];
  externalKey?: string;
  status: PublishStatus;
  sortOrder?: number;
};

/** CDN image metadata (e.g. Cloudinary) — binaries not stored in Mongo. */
export type CatalogMediaAssetDoc = {
  url: string;
  publicId?: string;
  alt?: string;
  width?: number;
  height?: number;
  format?: string;
};

export type ProductMediaItemDoc = CatalogMediaAssetDoc & {
  sortOrder?: number;
};

export type ProductAttachmentRecordDoc = {
  title: string;
  url: string;
  docType?: string;
  sortOrder?: number;
};

export type ProductDoc = {
  _id: string;
  slug: string;
  title: string;
  brand?: string;
  status: PublishStatus;
  categoryIds?: string[];
  searchText?: string;
  sortOrder?: number;
  defaultVariantId?: string | null;
  media?: ProductMediaItemDoc[];
  longDescription?: string;
  features?: string[];
  applications?: string[];
  marketingBullets?: string[];
  attachments?: ProductAttachmentRecordDoc[];
  relatedProductIds?: string[];
  compatibleProductIds?: string[];
  recommendedProductIds?: string[];
  /** PDP — shipping weight display (e.g. "2.4 lb") */
  shippingWeight?: string;
  /** PDP — branch pick-up / stock messaging */
  branchAvailabilityPlaceholder?: string;
  /** PDP — extra logistics rows (hazmat, freight class, etc.) */
  logisticsMeta?: Array<{ label: string; value: string }>;
};

export type ProductVariantDoc = {
  _id: string;
  productId: string;
  sku: string;
  itemNumber?: string;
  mpn?: string;
  manufacturer?: string;
  unitPrice?: string;
  currency?: string;
  availability?: string;
  uom?: string;
  leadTime?: string;
  moq?: number | null;
  packaging?: string;
  status: PublishStatus;
  specRowId?: string | null;
  searchBlob?: string;
  sortOrder?: number;
};

export type HomepagePromoBannerDoc = {
  _id: string;
  slug: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: CatalogMediaAssetDoc;
  imageAlt?: string;
  ctaLabel?: string;
  href?: string;
  openInNewTab?: boolean;
  status: PublishStatus;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type HomepageCategoryTileDoc = {
  _id: string;
  slug: string;
  label: string;
  description?: string;
  categoryId?: string | null;
  href?: string;
  image?: CatalogMediaAssetDoc;
  imageAlt?: string;
  icon?: string;
  ctaLabel?: string;
  status: PublishStatus;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type HomepageSupportCardDoc = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  image?: CatalogMediaAssetDoc;
  icon?: string;
  ctaLabel?: string;
  href?: string;
  status: PublishStatus;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SiteLinkGroupPlacement = "utility" | "navigation" | "footer";

export type SiteLinkDoc = {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  external?: boolean;
  openInNewTab?: boolean;
  sortOrder?: number;
  status?: PublishStatus;
  metadata?: Record<string, unknown>;
};

export type SiteLinkGroupDoc = {
  _id: string;
  slug: string;
  title: string;
  placement: SiteLinkGroupPlacement;
  description?: string;
  status: PublishStatus;
  sortOrder?: number;
  links: SiteLinkDoc[];
  metadata?: Record<string, unknown>;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type FooterSocialLinkDoc = {
  label: string;
  href: string;
  icon?: string;
  sortOrder?: number;
};

export type FooterContentDoc = {
  _id: string;
  slug: string;
  brandName?: string;
  newsletterHeading?: string;
  newsletterDescription?: string;
  newsletterCtaLabel?: string;
  newsletterCtaHref?: string;
  feedbackHeading?: string;
  feedbackCtaLabel?: string;
  feedbackCtaHref?: string;
  copyrightText?: string;
  status: PublishStatus;
  sortOrder?: number;
  socialLinks: FooterSocialLinkDoc[];
  metadata?: Record<string, unknown>;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
