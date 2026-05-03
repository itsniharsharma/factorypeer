import type { Types } from "mongoose";
import type { CatalogModels } from "./db/connection.js";
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
export declare function createCatalogAdminServices(models: CatalogModels, tenantId: Types.ObjectId | null): CatalogAdminServices;
//# sourceMappingURL=composition-root.d.ts.map