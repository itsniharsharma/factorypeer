import type { FastifyInstance } from "fastify";
import type { CatalogAdminServices } from "../composition-root.js";
import { AppError } from "../errors/app-error.js";
import { writeContext } from "../http/write-context.js";
import { parseBody, parseParams, parseQuery } from "../validation/helpers.js";
import {
  createProductBodySchema,
  createVariantBodySchema,
  linkVariantToRowBodySchema,
  productIdParamsSchema,
  updateProductBodySchema,
  updateVariantBodySchema,
  variantIdParamsSchema,
} from "../validation/product.js";
import {
  productListQuerySchema,
  productSummaryCardsQuerySchema,
  variantListQuerySchema,
} from "../validation/list-queries.js";
import { toObjectId } from "../utils/mongo.js";

const PREFIX = "/admin/catalog/products";

export async function registerProductRoutes(app: FastifyInstance, services: CatalogAdminServices) {
  const { products } = services;

  app.get(`${PREFIX}/summary-cards`, async (req) => {
    const q = parseQuery(productSummaryCardsQuerySchema, req.query as Record<string, string>);
    const ids = q.ids as string[];
    return products.summaryCardsForProductIds(ids, writeContext(req));
  });

  app.get(PREFIX, async (req, reply) => {
    const q = parseQuery(productListQuerySchema, req.query as Record<string, string>);
    const skip = q.skip ?? 0;
    const limit = q.limit ?? 100;
    const idStrings = q.ids as string[] | undefined;
    const filter = {
      status: q.status,
      q: q.q,
      sort: q.sort,
      categoryId: q.categoryId ? toObjectId(q.categoryId) : undefined,
      ids: idStrings?.map((id) => toObjectId(id)),
    };
    const { items, total } = await products.list(skip, limit, filter, writeContext(req));
    reply.header("X-Total-Count", String(total));
    return items;
  });

  app.get(`${PREFIX}/variants/:id`, async (req) => {
    const { id } = parseParams(variantIdParamsSchema, req.params as Record<string, string>);
    return products.getVariantWithProduct(id, writeContext(req));
  });

  app.get(`${PREFIX}/:id/variants`, async (req, reply) => {
    const { id } = parseParams(productIdParamsSchema, req.params as Record<string, string>);
    const q = parseQuery(variantListQuerySchema, req.query as Record<string, string>);
    const skip = q.skip ?? 0;
    const limit = q.limit ?? 500;
    const { items, total } = await products.listVariants(id, writeContext(req), {
      status: q.status,
      q: q.q,
      skip,
      limit,
    });
    reply.header("X-Total-Count", String(total));
    return items;
  });

  app.post(`${PREFIX}/:id/variants`, async (req) => {
    const { id } = parseParams(productIdParamsSchema, req.params as Record<string, string>);
    const body = parseBody(createVariantBodySchema, req.body);
    return products.createVariant(id, body, writeContext(req));
  });

  app.get(`${PREFIX}/:id`, async (req) => {
    const { id } = parseParams(productIdParamsSchema, req.params as Record<string, string>);
    return products.getProduct(id, writeContext(req));
  });

  app.post(PREFIX, async (req) => {
    const body = parseBody(createProductBodySchema, req.body);
    return products.createProduct(body, writeContext(req));
  });

  app.patch(`${PREFIX}/:id`, async (req) => {
    const { id } = parseParams(productIdParamsSchema, req.params as Record<string, string>);
    const body = parseBody(updateProductBodySchema, req.body);
    if (Object.keys(body as Record<string, unknown>).length === 0) {
      throw new AppError("At least one field is required to update a product", 422, "VALIDATION_ERROR");
    }
    return products.updateProduct(id, body, writeContext(req));
  });

  app.delete(`${PREFIX}/:id`, async (req) => {
    const { id } = parseParams(productIdParamsSchema, req.params as Record<string, string>);
    return products.deleteProduct(id, writeContext(req));
  });

  app.patch(`${PREFIX}/variants/:id`, async (req) => {
    const { id } = parseParams(variantIdParamsSchema, req.params as Record<string, string>);
    const body = parseBody(updateVariantBodySchema, req.body);
    if (Object.keys(body as Record<string, unknown>).length === 0) {
      throw new AppError("At least one field is required to update a variant", 422, "VALIDATION_ERROR");
    }
    return products.updateVariant(id, body, writeContext(req));
  });

  app.delete(`${PREFIX}/variants/:id`, async (req) => {
    const { id } = parseParams(variantIdParamsSchema, req.params as Record<string, string>);
    return products.deleteVariant(id, writeContext(req));
  });

  app.post(`${PREFIX}/variants/:id/link-row`, async (req) => {
    const { id } = parseParams(variantIdParamsSchema, req.params as Record<string, string>);
    const body = parseBody(linkVariantToRowBodySchema, req.body);
    return products.linkVariantToRow(id, body, writeContext(req));
  });
}
