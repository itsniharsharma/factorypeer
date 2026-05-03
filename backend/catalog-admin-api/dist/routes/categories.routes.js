import { writeContext } from "../http/write-context.js";
import { parseBody, parseParams, parseQuery } from "../validation/helpers.js";
import { attachSpecSchemaBodySchema, categoryIdParamsSchema, createCategoryBodySchema, moveCategoryBodySchema, reorderSiblingsBodySchema, setCategoryKindBodySchema, updateCategoryBodySchema, } from "../validation/category.js";
import { categoryChildrenQuerySchema } from "../validation/list-queries.js";
const PREFIX = "/admin/catalog/categories";
export async function registerCategoryRoutes(app, services) {
    const { categories } = services;
    app.get(`${PREFIX}/tree`, async (req) => categories.getTree(writeContext(req)));
    app.get(`${PREFIX}/root/children`, async (req) => {
        const q = parseQuery(categoryChildrenQuerySchema, req.query);
        return categories.listChildren(null, writeContext(req), { status: q.status });
    });
    app.get(`${PREFIX}/:id/children`, async (req) => {
        const { id } = parseParams(categoryIdParamsSchema, req.params);
        const q = parseQuery(categoryChildrenQuerySchema, req.query);
        return categories.listChildren(id, writeContext(req), { status: q.status });
    });
    app.get(`${PREFIX}/:id`, async (req) => {
        const { id } = parseParams(categoryIdParamsSchema, req.params);
        return categories.getById(id, writeContext(req));
    });
    app.post(PREFIX, async (req) => {
        const body = parseBody(createCategoryBodySchema, req.body);
        return categories.create(body, writeContext(req));
    });
    app.patch(`${PREFIX}/:id`, async (req) => {
        const { id } = parseParams(categoryIdParamsSchema, req.params);
        const body = parseBody(updateCategoryBodySchema, req.body);
        return categories.update(id, body, writeContext(req));
    });
    app.post(`${PREFIX}/:id/move`, async (req) => {
        const { id } = parseParams(categoryIdParamsSchema, req.params);
        const body = parseBody(moveCategoryBodySchema, req.body);
        return categories.move(id, body.newParentId, writeContext(req));
    });
    app.post(`${PREFIX}/:id/reorder-siblings`, async (req) => {
        const { id } = parseParams(categoryIdParamsSchema, req.params);
        const body = parseBody(reorderSiblingsBodySchema, req.body);
        return categories.reorderSiblings(id, body.orderedIds, writeContext(req));
    });
    app.patch(`${PREFIX}/:id/kind`, async (req) => {
        const { id } = parseParams(categoryIdParamsSchema, req.params);
        const body = parseBody(setCategoryKindBodySchema, req.body);
        return categories.setKind(id, body.kind, writeContext(req));
    });
    app.patch(`${PREFIX}/:id/active-spec-schema`, async (req) => {
        const { id } = parseParams(categoryIdParamsSchema, req.params);
        const body = parseBody(attachSpecSchemaBodySchema, req.body);
        return categories.attachActiveSpecSchema(id, body.specSchemaId, writeContext(req));
    });
    app.delete(`${PREFIX}/:id`, async (req) => {
        const { id } = parseParams(categoryIdParamsSchema, req.params);
        return categories.delete(id, writeContext(req));
    });
}
