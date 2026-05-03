import { registerCategoryRoutes } from "./categories.routes.js";
import { registerSpecMatrixRoutes } from "./spec-matrix.routes.js";
import { registerProductRoutes } from "./products.routes.js";
import { registerHomepageRoutes } from "./homepage.routes.js";
import { registerNavigationRoutes } from "./navigation.routes.js";
export async function registerCatalogAdminRoutes(app, services) {
    await registerCategoryRoutes(app, services);
    await registerSpecMatrixRoutes(app, services);
    await registerProductRoutes(app, services);
    await registerHomepageRoutes(app, services);
    await registerNavigationRoutes(app, services);
}
