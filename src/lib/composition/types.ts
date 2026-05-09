/**
 * Frontend types for CategoryComposition.
 * These are derived from the backend schemas but used in server components only.
 */

export interface TableColumn {
  key: string;
  label: string;
  type: "string" | "number" | "currency" | "dimension" | "boolean";
  width: number;
  sortable: boolean;
  isPrice: boolean;
  isMandatory: boolean;
}

export interface TableRow {
  _id?: string;
  price: string; // e.g. "$49.99"
  values: Record<string, string>;
  sortOrder: number;
}

export interface ComparisonTable {
  columns: TableColumn[];
  rows: TableRow[];
}

export interface FeatureBullet {
  text: string;
  sortOrder: number;
}

export interface CatalogMediaAsset {
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  altText?: string;
}

export interface FamilySection {
  id: string;
  title: string;
  slug: string;
  image?: CatalogMediaAsset;
  description: string;
  featureBullets: FeatureBullet[];
  table: ComparisonTable;
  sortOrder: number;
  publishStatus: "draft" | "published" | "archived";
}

export interface FamilyPreviewCard {
  familySectionId: string;
  sortOrder: number;
}

export interface OverviewSection {
  heading: string;
  productCountMode: "exact" | "approximate" | "hidden";
  description: string;
  familyPreviewCards: FamilyPreviewCard[];
}

export interface CompositionSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface CategoryComposition {
  _id: string;
  categoryId: string;
  slugPath: string;
  status: "draft" | "published" | "archived";
  overviewSection: OverviewSection;
  familySections: FamilySection[];
  seo: CompositionSeo;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  documentVersion: number;
}
