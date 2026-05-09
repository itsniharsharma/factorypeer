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
import {
  registerCatalogCategorySchema,
  type CatalogCategoryModel,
} from "./schemas/catalog-category.schema.js";
import {
  registerCatalogSpecSchemaSchema,
  type CatalogSpecSchemaModel,
} from "./schemas/catalog-spec-schema.schema.js";
import {
  registerCatalogSpecColumnSchema,
  type CatalogSpecColumnModel,
} from "./schemas/catalog-spec-column.schema.js";
import {
  registerCatalogSpecRowSchema,
  type CatalogSpecRowModel,
} from "./schemas/catalog-spec-row.schema.js";
import { registerProductSchema, type ProductModel } from "./schemas/product.schema.js";
import {
  registerProductVariantSchema,
  type ProductVariantModel,
} from "./schemas/product-variant.schema.js";
import {
  registerHomepagePromoBannerSchema,
  type HomepagePromoBannerModel,
} from "./schemas/homepage-promo-banner.schema.js";
import {
  registerHomepageCategoryTileSchema,
  type HomepageCategoryTileModel,
} from "./schemas/homepage-category-tile.schema.js";
import {
  registerHomepageSupportCardSchema,
  type HomepageSupportCardModel,
} from "./schemas/homepage-support-card.schema.js";
import {
  registerSiteLinkGroupSchema,
  type SiteLinkGroupModel,
} from "./schemas/site-link-group.schema.js";
import {
  registerFooterContentSchema,
  type FooterContentModel,
} from "./schemas/footer-content.schema.js";
import {
  registerCategoryCompositionSchema,
  type CategoryCompositionModel,
} from "./schemas/category-composition.schema.js";

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
  CategoryComposition: CategoryCompositionModel;
}

export * from "./contracts.js";
export * from "./enums.js";
export * from "./schemas/catalog-media-asset.schema.js";
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
export * from "./schemas/category-composition.schema.js";

export function registerCatalogModels(mongoose: Mongoose): CatalogRegisteredModels {
  const CatalogCategory = (
    mongoose.models.CatalogCategory ??
    mongoose.model("CatalogCategory", registerCatalogCategorySchema())
  ) as CatalogCategoryModel;

  const CatalogSpecSchema = (
    mongoose.models.CatalogSpecSchema ??
    mongoose.model("CatalogSpecSchema", registerCatalogSpecSchemaSchema())
  ) as CatalogSpecSchemaModel;

  const CatalogSpecColumn = (
    mongoose.models.CatalogSpecColumn ??
    mongoose.model("CatalogSpecColumn", registerCatalogSpecColumnSchema())
  ) as CatalogSpecColumnModel;

  const CatalogSpecRow = (
    mongoose.models.CatalogSpecRow ??
    mongoose.model("CatalogSpecRow", registerCatalogSpecRowSchema())
  ) as CatalogSpecRowModel;

  const Product = (
    mongoose.models.Product ?? mongoose.model("Product", registerProductSchema())
  ) as ProductModel;

  const ProductVariant = (
    mongoose.models.ProductVariant ??
    mongoose.model("ProductVariant", registerProductVariantSchema())
  ) as ProductVariantModel;

  const HomepagePromoBanner = (
    mongoose.models.HomepagePromoBanner ??
    mongoose.model("HomepagePromoBanner", registerHomepagePromoBannerSchema())
  ) as HomepagePromoBannerModel;

  const HomepageCategoryTile = (
    mongoose.models.HomepageCategoryTile ??
    mongoose.model("HomepageCategoryTile", registerHomepageCategoryTileSchema())
  ) as HomepageCategoryTileModel;

  const HomepageSupportCard = (
    mongoose.models.HomepageSupportCard ??
    mongoose.model("HomepageSupportCard", registerHomepageSupportCardSchema())
  ) as HomepageSupportCardModel;

  const SiteLinkGroup = (
    mongoose.models.SiteLinkGroup ?? mongoose.model("SiteLinkGroup", registerSiteLinkGroupSchema())
  ) as SiteLinkGroupModel;

  const FooterContent = (
    mongoose.models.FooterContent ?? mongoose.model("FooterContent", registerFooterContentSchema())
  ) as FooterContentModel;

  const CategoryComposition = (
    mongoose.models.CategoryComposition ??
    mongoose.model("CategoryComposition", registerCategoryCompositionSchema())
  ) as CategoryCompositionModel;

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
    CategoryComposition,
  };
}
