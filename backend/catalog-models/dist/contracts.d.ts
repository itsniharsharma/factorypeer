/**
 * DTO shapes aligned with `src/lib/types.ts` and `catalog-service` return types.
 * API layer should map Mongoose documents → these shapes (not return DB docs raw).
 */
import type { PublishStatus } from "./enums.js";
/** Mirrors `CatalogFilterGroup` / filter facets on PLP. */
export interface CatalogFilterGroupDTO {
    id: string;
    label: string;
    options: Array<{
        id: string;
        label: string;
        count: number;
    }>;
}
/** Mirrors `CatalogSpecColumn`. */
export interface CatalogSpecColumnDTO {
    id: string;
    label: string;
    widthClass?: string;
}
/**
 * Mirrors `CatalogSpecRow` — current UI assumes one primary SKU per row.
 * When multiple variants bind to a row, mapper picks `primary` binding for these fields.
 */
export interface CatalogSpecRowDTO {
    id: string;
    values: Record<string, string>;
    productSlug: string;
    productTitle: string;
    sku: string;
    itemNumber: string;
    unitPrice: string;
    availability: string;
}
/** Mirrors `CatalogSpecMatrix`. */
export interface CatalogSpecMatrixDTO {
    familySummary: string;
    columns: CatalogSpecColumnDTO[];
    rows: CatalogSpecRowDTO[];
}
/** Mirrors `CatalogTaxonomyNode`. */
export interface CatalogTaxonomyNodeDTO {
    id: string;
    slug: string;
    title: string;
    description: string;
    productCount: number;
    children: CatalogTaxonomyNodeDTO[];
    filters?: CatalogFilterGroupDTO[];
    matrix?: CatalogSpecMatrixDTO;
}
/** Route resolution result — extend as needed when wiring `getRouteContext`. */
export interface CatalogRouteContextDTO {
    segments: string[];
    categoryId?: string;
    breadcrumbs: Array<{
        label: string;
        href: string;
    }>;
}
/** Minimal search hit — aligns with storefront SearchCatalogProduct cards. */
export interface CatalogSearchProductDTO {
    slug: string;
    title: string;
    sku?: string;
    snippet?: string;
}
/** Draft vs published at API boundary (subset of DB PublishStatus). */
export type CatalogPublishFilter = PublishStatus;
/** CDN image metadata — binaries hosted externally (e.g. Cloudinary). */
export interface CatalogMediaAssetDTO {
    url: string;
    publicId?: string;
    alt?: string;
    width?: number;
    height?: number;
    format?: string;
}
//# sourceMappingURL=contracts.d.ts.map