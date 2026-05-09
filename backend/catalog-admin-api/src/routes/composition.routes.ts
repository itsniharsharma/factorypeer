import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { CatalogAdminServices } from "../composition-root.js";
import { writeContext } from "../http/write-context.js";
import { parseBody, parseParams, parseQuery } from "../validation/helpers.js";
import {
  createCompositionBodySchema,
  updateCompositionOverviewBodySchema,
  addFamilySectionBodySchema,
  updateFamilySectionBodySchema,
  reorderFamilySectionsBodySchema,
  updateCompositionSeoBodySchema,
} from "../validation/composition.js";

const PREFIX = "/admin/catalog/compositions";

const idParamsSchema = z.object({ id: z.string().min(1) });
const categoryIdParamsSchema = z.object({ categoryId: z.string().min(1) });
const idSectionIdParamsSchema = z.object({
  id: z.string().min(1),
  sectionId: z.string().min(1),
});

export async function registerCompositionRoutes(
  app: FastifyInstance,
  services: CatalogAdminServices,
) {
  const { compositions } = services;

  // List all compositions
  app.get(PREFIX, async (req) => {
    return compositions.list(writeContext(req));
  });

  // Get composition by ID
  app.get(`${PREFIX}/:id`, async (req) => {
    const { id } = parseParams(idParamsSchema, req.params as Record<string, string>);
    return compositions.getById(id, writeContext(req));
  });

  // Get composition by category ID
  app.get(`${PREFIX}/category/:categoryId`, async (req) => {
    const { categoryId } = parseParams(categoryIdParamsSchema, req.params as Record<string, string>);
    return compositions.getByCategory(categoryId, writeContext(req));
  });

  // Create new composition
  app.post(PREFIX, async (req) => {
    const body = parseBody(createCompositionBodySchema, req.body);
    return compositions.create(body, writeContext(req));
  });

  // Update overview section
  app.patch(`${PREFIX}/:id/overview`, async (req) => {
    const { id } = parseParams(idParamsSchema, req.params as Record<string, string>);
    const body = parseBody(updateCompositionOverviewBodySchema, req.body);
    return compositions.updateOverviewSection(id, body.overviewSection, writeContext(req));
  });

  // Add family section
  app.post(`${PREFIX}/:id/family-sections`, async (req) => {
    const { id } = parseParams(idParamsSchema, req.params as Record<string, string>);
    const body = parseBody(addFamilySectionBodySchema, req.body);
    return compositions.addFamilySection(id, body.familySection, writeContext(req));
  });

  // Update family section
  app.patch(`${PREFIX}/:id/family-sections/:sectionId`, async (req) => {
    const { id, sectionId } = parseParams(
      idSectionIdParamsSchema,
      req.params as Record<string, string>,
    );
    const body = parseBody(updateFamilySectionBodySchema, req.body);
    return compositions.updateFamilySection(id, sectionId, body, writeContext(req));
  });

  // Delete family section
  app.delete(`${PREFIX}/:id/family-sections/:sectionId`, async (req) => {
    const { id, sectionId } = parseParams(
      idSectionIdParamsSchema,
      req.params as Record<string, string>,
    );
    return compositions.deleteFamilySection(id, sectionId, writeContext(req));
  });

  // Reorder family sections
  app.post(`${PREFIX}/:id/reorder-family-sections`, async (req) => {
    const { id } = parseParams(idParamsSchema, req.params as Record<string, string>);
    const body = parseBody(reorderFamilySectionsBodySchema, req.body);
    return compositions.reorderFamilySections(id, body.orderedIds, writeContext(req));
  });

  // Update SEO
  app.patch(`${PREFIX}/:id/seo`, async (req) => {
    const { id } = parseParams(idParamsSchema, req.params as Record<string, string>);
    const body = parseBody(updateCompositionSeoBodySchema, req.body);
    return compositions.updateSeo(id, body.seo, writeContext(req));
  });

  // Publish composition
  app.post(`${PREFIX}/:id/publish`, async (req) => {
    const { id } = parseParams(idParamsSchema, req.params as Record<string, string>);
    return compositions.publish(id, writeContext(req));
  });

  // Archive composition
  app.post(`${PREFIX}/:id/archive`, async (req) => {
    const { id } = parseParams(idParamsSchema, req.params as Record<string, string>);
    return compositions.archive(id, writeContext(req));
  });

  // Delete composition
  app.delete(`${PREFIX}/:id`, async (req) => {
    const { id } = parseParams(idParamsSchema, req.params as Record<string, string>);
    return compositions.delete(id, writeContext(req));
  });
}
