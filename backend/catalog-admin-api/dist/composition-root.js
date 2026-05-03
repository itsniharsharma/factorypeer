import { CategoryRepository, SpecSchemaRepository, SpecColumnRepository, SpecRowRepository, ProductRepository, ProductVariantRepository, NavigationRepository, } from "./repositories/index.js";
import { HomepageRepository } from "./repositories/homepage.repository.js";
import { CategoryService } from "./services/category.service.js";
import { SpecMatrixService } from "./services/spec-matrix.service.js";
import { ProductService } from "./services/product.service.js";
import { HomepageService } from "./services/homepage.service.js";
import { NavigationService } from "./services/navigation.service.js";
export function createCatalogAdminServices(models, tenantId) {
    const categoryRepo = new CategoryRepository(models, tenantId);
    const specSchemaRepo = new SpecSchemaRepository(models, tenantId);
    const specColumnRepo = new SpecColumnRepository(models, tenantId);
    const specRowRepo = new SpecRowRepository(models, tenantId);
    const productRepo = new ProductRepository(models, tenantId);
    const variantRepo = new ProductVariantRepository(models, tenantId);
    const homepageRepo = new HomepageRepository(models, tenantId);
    const navigationRepo = new NavigationRepository(models, tenantId);
    return {
        categories: new CategoryService(categoryRepo, specSchemaRepo),
        specMatrix: new SpecMatrixService(categoryRepo, specSchemaRepo, specColumnRepo, specRowRepo),
        products: new ProductService(productRepo, variantRepo, specRowRepo),
        homepage: new HomepageService(homepageRepo),
        navigation: new NavigationService(navigationRepo),
    };
}
