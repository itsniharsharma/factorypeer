import type { FastifyInstance } from "fastify";
import type { CatalogAdminServices } from "../composition-root.js";
import { writeContext } from "../http/write-context.js";
import { parseBody, parseParams, parseQuery } from "../validation/helpers.js";
import {
  createHomepageBannerBodySchema,
  createHomepageSupportCardBodySchema,
  createHomepageTileBodySchema,
  homepageBannerListQuerySchema,
  homepageContentIdParamsSchema,
  homepageSupportCardListQuerySchema,
  homepageTileListQuerySchema,
  updateHomepageBannerBodySchema,
  updateHomepageSupportCardBodySchema,
  updateHomepageTileBodySchema,
} from "../validation/homepage-content.js";
const PREFIX = "/admin/catalog/homepage";

export async function registerHomepageRoutes(app: FastifyInstance, services: CatalogAdminServices) {
  const { homepage } = services as any;

  app.get(`${PREFIX}/banners`, async (req) => {
    const q = parseQuery(homepageBannerListQuerySchema, req.query as Record<string, string>);
    return homepage.listBanners(writeContext(req), q.status);
  });

  app.get(`${PREFIX}/banners/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    return homepage.getBanner(id, writeContext(req));
  });

  app.post(`${PREFIX}/banners`, async (req) => {
    const body = parseBody(createHomepageBannerBodySchema, req.body);
    return homepage.createBanner(body, writeContext(req));
  });

  app.patch(`${PREFIX}/banners/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    const body = parseBody(updateHomepageBannerBodySchema, req.body);
    return homepage.updateBanner(id, body, writeContext(req));
  });

  app.delete(`${PREFIX}/banners/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    return homepage.deleteBanner(id, writeContext(req));
  });

  app.get(`${PREFIX}/category-tiles`, async (req) => {
    const q = parseQuery(homepageTileListQuerySchema, req.query as Record<string, string>);
    return homepage.listCategoryTiles(writeContext(req), q.status);
  });

  app.get(`${PREFIX}/category-tiles/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    return homepage.getCategoryTile(id, writeContext(req));
  });

  app.post(`${PREFIX}/category-tiles`, async (req) => {
    const body = parseBody(createHomepageTileBodySchema, req.body);
    return homepage.createCategoryTile(body, writeContext(req));
  });

  app.patch(`${PREFIX}/category-tiles/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    const body = parseBody(updateHomepageTileBodySchema, req.body);
    return homepage.updateCategoryTile(id, body, writeContext(req));
  });

  app.delete(`${PREFIX}/category-tiles/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    return homepage.deleteCategoryTile(id, writeContext(req));
  });

  app.get(`${PREFIX}/support-cards`, async (req) => {
    const q = parseQuery(homepageSupportCardListQuerySchema, req.query as Record<string, string>);
    return homepage.listSupportCards(writeContext(req), q.status);
  });

  app.get(`${PREFIX}/support-cards/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    return homepage.getSupportCard(id, writeContext(req));
  });

  app.post(`${PREFIX}/support-cards`, async (req) => {
    const body = parseBody(createHomepageSupportCardBodySchema, req.body);
    return homepage.createSupportCard(body, writeContext(req));
  });

  app.patch(`${PREFIX}/support-cards/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    const body = parseBody(updateHomepageSupportCardBodySchema, req.body);
    return homepage.updateSupportCard(id, body, writeContext(req));
  });

  app.delete(`${PREFIX}/support-cards/:id`, async (req) => {
    const { id } = parseParams(homepageContentIdParamsSchema, req.params as Record<string, string>);
    return homepage.deleteSupportCard(id, writeContext(req));
  });
}

export default registerHomepageRoutes;
