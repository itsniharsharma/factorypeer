/**
 * Catalog models — register once per Node process.
 *
 * Usage:
 * ```ts
 * import mongoose from "mongoose";
 * import { registerCatalogModels } from "@factorypeer/catalog-models";
 * registerCatalogModels(mongoose);
 * ```
 */
import type { Mongoose } from "mongoose";
import { type CatalogCategoryModel } from "./schemas/catalog-category.schema.js";
import { type CatalogSpecSchemaModel } from "./schemas/catalog-spec-schema.schema.js";
import { type CatalogSpecColumnModel } from "./schemas/catalog-spec-column.schema.js";
import { type CatalogSpecRowModel } from "./schemas/catalog-spec-row.schema.js";
import { type ProductModel } from "./schemas/product.schema.js";
import { type ProductVariantModel } from "./schemas/product-variant.schema.js";
import { type HomepagePromoBannerModel } from "./schemas/homepage-promo-banner.schema.js";
import { type HomepageCategoryTileModel } from "./schemas/homepage-category-tile.schema.js";
import { type HomepageSupportCardModel } from "./schemas/homepage-support-card.schema.js";
import { type SiteLinkGroupModel } from "./schemas/site-link-group.schema.js";
import { type FooterContentModel } from "./schemas/footer-content.schema.js";
/** Stable model registry type for repositories (avoids `?? model()` union inference). */
export interface CatalogRegisteredModels {
    CatalogCategory: CatalogCategoryModel;
    CatalogSpecSchema: CatalogSpecSchemaModel;
    CatalogSpecColumn: CatalogSpecColumnModel;
    CatalogSpecRow: CatalogSpecRowModel;
    Product: ProductModel;
    ProductVariant: ProductVariantModel;
    HomepagePromoBanner: HomepagePromoBannerModel;
    HomepageCategoryTile: HomepageCategoryTileModel;
    HomepageSupportCard: HomepageSupportCardModel;
    SiteLinkGroup: SiteLinkGroupModel;
    FooterContent: FooterContentModel;
}
export * from "./contracts.js";
export * from "./enums.js";
export * from "./schemas/catalog-category.schema.js";
export * from "./schemas/catalog-spec-schema.schema.js";
export * from "./schemas/catalog-spec-column.schema.js";
export * from "./schemas/catalog-spec-row.schema.js";
export * from "./schemas/product.schema.js";
export * from "./schemas/product-variant.schema.js";
export * from "./schemas/homepage-promo-banner.schema.js";
export * from "./schemas/homepage-category-tile.schema.js";
export * from "./schemas/homepage-support-card.schema.js";
export * from "./schemas/site-link-group.schema.js";
export * from "./schemas/footer-content.schema.js";
export declare function registerCatalogModels(mongoose: Mongoose): CatalogRegisteredModels;
//# sourceMappingURL=index.d.ts.map