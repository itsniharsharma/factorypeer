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
import { registerCatalogCategorySchema, } from "./schemas/catalog-category.schema.js";
import { registerCatalogSpecSchemaSchema, } from "./schemas/catalog-spec-schema.schema.js";
import { registerCatalogSpecColumnSchema, } from "./schemas/catalog-spec-column.schema.js";
import { registerCatalogSpecRowSchema, } from "./schemas/catalog-spec-row.schema.js";
import { registerProductSchema } from "./schemas/product.schema.js";
import { registerProductVariantSchema, } from "./schemas/product-variant.schema.js";
import { registerHomepagePromoBannerSchema, } from "./schemas/homepage-promo-banner.schema.js";
import { registerHomepageCategoryTileSchema, } from "./schemas/homepage-category-tile.schema.js";
import { registerHomepageSupportCardSchema, } from "./schemas/homepage-support-card.schema.js";
import { registerSiteLinkGroupSchema, } from "./schemas/site-link-group.schema.js";
import { registerFooterContentSchema, } from "./schemas/footer-content.schema.js";
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
export function registerCatalogModels(mongoose) {
    const CatalogCategory = (mongoose.models.CatalogCategory ??
        mongoose.model("CatalogCategory", registerCatalogCategorySchema()));
    const CatalogSpecSchema = (mongoose.models.CatalogSpecSchema ??
        mongoose.model("CatalogSpecSchema", registerCatalogSpecSchemaSchema()));
    const CatalogSpecColumn = (mongoose.models.CatalogSpecColumn ??
        mongoose.model("CatalogSpecColumn", registerCatalogSpecColumnSchema()));
    const CatalogSpecRow = (mongoose.models.CatalogSpecRow ??
        mongoose.model("CatalogSpecRow", registerCatalogSpecRowSchema()));
    const Product = (mongoose.models.Product ?? mongoose.model("Product", registerProductSchema()));
    const ProductVariant = (mongoose.models.ProductVariant ??
        mongoose.model("ProductVariant", registerProductVariantSchema()));
    const HomepagePromoBanner = (mongoose.models.HomepagePromoBanner ??
        mongoose.model("HomepagePromoBanner", registerHomepagePromoBannerSchema()));
    const HomepageCategoryTile = (mongoose.models.HomepageCategoryTile ??
        mongoose.model("HomepageCategoryTile", registerHomepageCategoryTileSchema()));
    const HomepageSupportCard = (mongoose.models.HomepageSupportCard ??
        mongoose.model("HomepageSupportCard", registerHomepageSupportCardSchema()));
    const SiteLinkGroup = (mongoose.models.SiteLinkGroup ?? mongoose.model("SiteLinkGroup", registerSiteLinkGroupSchema()));
    const FooterContent = (mongoose.models.FooterContent ?? mongoose.model("FooterContent", registerFooterContentSchema()));
    return {
        CatalogCategory,
        CatalogSpecSchema,
        CatalogSpecColumn,
        CatalogSpecRow,
        Product,
        ProductVariant,
        HomepagePromoBanner,
        HomepageCategoryTile,
        HomepageSupportCard,
        SiteLinkGroup,
        FooterContent,
    };
}
