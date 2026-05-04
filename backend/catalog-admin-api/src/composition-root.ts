import type { Types } from "mongoose";
import type { CatalogModels } from "./db/connection.js";
import {
  CategoryRepository,
  SpecSchemaRepository,
  SpecColumnRepository,
  SpecRowRepository,
  ProductRepository,
  ProductVariantRepository,
  NavigationRepository,
} from "./repositories/index.js";
import { HomepageRepository } from "./repositories/homepage.repository.js";
import { CategoryService } from "./services/category.service.js";
import { SpecMatrixService } from "./services/spec-matrix.service.js";
import { ProductService } from "./services/product.service.js";
import { HomepageService } from "./services/homepage.service.js";
import { NavigationService } from "./services/navigation.service.js";
import { CloudinaryService } from "./services/cloudinary.service.js";

export type CatalogAdminServices = {
  categories: CategoryService;
  specMatrix: SpecMatrixService;
  products: ProductService;
  homepage: HomepageService;
  navigation: NavigationService;
  cloudinary: CloudinaryService;
};

export function createCatalogAdminServices(
  models: CatalogModels,
  tenantId: Types.ObjectId | null,
): CatalogAdminServices {
  const categoryRepo = new CategoryRepository(models, tenantId);
  const specSchemaRepo = new SpecSchemaRepository(models, tenantId);
  const specColumnRepo = new SpecColumnRepository(models, tenantId);
  const specRowRepo = new SpecRowRepository(models, tenantId);
  const productRepo = new ProductRepository(models, tenantId);
  const variantRepo = new ProductVariantRepository(models, tenantId);
  const homepageRepo = new HomepageRepository(models, tenantId);
  const navigationRepo = new NavigationRepository(models, tenantId);
  const cloudinary = new CloudinaryService();

  return {
    categories: new CategoryService(categoryRepo, specSchemaRepo),
    specMatrix: new SpecMatrixService(categoryRepo, specSchemaRepo, specColumnRepo, specRowRepo),
    products: new ProductService(productRepo, variantRepo, specRowRepo, categoryRepo, specSchemaRepo, cloudinary),
    homepage: new HomepageService(homepageRepo, cloudinary),
    navigation: new NavigationService(navigationRepo),
    cloudinary,
  };
}
