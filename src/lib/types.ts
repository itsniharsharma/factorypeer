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
  thumbnail?: string;
  price: string;
  uom: string;
  status: InventoryStatus;
  leadTime: string;
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
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface CategoryTile {
  id: string;
  label: string;
  image: string;
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
  images: string[];
  description: string;
  specificationRows: SpecRow[];
  documents: Array<{ id: string; name: string; type: string }>;
  relatedProducts: Product[];
  accessories: Product[];
}
