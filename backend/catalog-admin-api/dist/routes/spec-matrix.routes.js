import { writeContext } from "../http/write-context.js";
import { parseBody, parseParams, parseQuery } from "../validation/helpers.js";
import { createSpecColumnBodySchema, createSpecRowBodySchema, createSpecSchemaBodySchema, reorderRowsBodySchema, setRowBindingsBodySchema, specColumnIdParamsSchema, specRowIdParamsSchema, specSchemaIdParamsSchema, taxonomySpecSchemaParamsSchema, updateSpecColumnBodySchema, updateSpecRowBodySchema, updateSpecSchemaBodySchema, } from "../validation/spec.js";
import { specRowListQuerySchema } from "../validation/list-queries.js";
const PREFIX = "/admin/catalog";
export async function registerSpecMatrixRoutes(app, services) {
    const { specMatrix } = services;
    app.get(`${PREFIX}/taxonomy/:categoryId/spec-schema`, async (req) => {
        const { categoryId } = parseParams(taxonomySpecSchemaParamsSchema, req.params);
        return specMatrix.getSchemaForCategory(categoryId, writeContext(req));
    });
    app.post(`${PREFIX}/taxonomy/:categoryId/spec-schema`, async (req) => {
        const { categoryId } = parseParams(taxonomySpecSchemaParamsSchema, req.params);
        const body = parseBody(createSpecSchemaBodySchema, req.body);
        return specMatrix.createSchema(categoryId, body, writeContext(req));
    });
    app.get(`${PREFIX}/spec-schemas/:id`, async (req) => {
        const { id } = parseParams(specSchemaIdParamsSchema, req.params);
        return specMatrix.getSchema(id, writeContext(req));
    });
    app.patch(`${PREFIX}/spec-schemas/:id`, async (req) => {
        const { id } = parseParams(specSchemaIdParamsSchema, req.params);
        const body = parseBody(updateSpecSchemaBodySchema, req.body);
        return specMatrix.updateSchema(id, body, writeContext(req));
    });
    app.post(`${PREFIX}/spec-schemas/:id/publish`, async (req) => {
        const { id } = parseParams(specSchemaIdParamsSchema, req.params);
        return specMatrix.publishSchema(id, writeContext(req));
    });
    app.get(`${PREFIX}/spec-schemas/:id/columns`, async (req) => {
        const { id } = parseParams(specSchemaIdParamsSchema, req.params);
        return specMatrix.listColumns(id, writeContext(req));
    });
    app.post(`${PREFIX}/spec-schemas/:id/columns`, async (req) => {
        const { id } = parseParams(specSchemaIdParamsSchema, req.params);
        const body = parseBody(createSpecColumnBodySchema, req.body);
        return specMatrix.addColumn(id, body, writeContext(req));
    });
    app.patch(`${PREFIX}/spec-columns/:id`, async (req) => {
        const { id } = parseParams(specColumnIdParamsSchema, req.params);
        const body = parseBody(updateSpecColumnBodySchema, req.body);
        return specMatrix.updateColumn(id, body, writeContext(req));
    });
    app.delete(`${PREFIX}/spec-columns/:id`, async (req) => {
        const { id } = parseParams(specColumnIdParamsSchema, req.params);
        return specMatrix.deleteColumn(id, writeContext(req));
    });
    app.get(`${PREFIX}/spec-schemas/:id/rows`, async (req, reply) => {
        const { id } = parseParams(specSchemaIdParamsSchema, req.params);
        const q = parseQuery(specRowListQuerySchema, req.query);
        const skip = q.skip ?? 0;
        const limit = q.limit ?? 500;
        const { items, total } = await specMatrix.listRows(id, writeContext(req), { status: q.status, skip, limit });
        reply.header("X-Total-Count", String(total));
        return items;
    });
    app.post(`${PREFIX}/spec-schemas/:id/rows/reorder`, async (req) => {
        const { id } = parseParams(specSchemaIdParamsSchema, req.params);
        const body = parseBody(reorderRowsBodySchema, req.body);
        return specMatrix.reorderRows(id, body.orderedIds, writeContext(req));
    });
    app.post(`${PREFIX}/spec-schemas/:id/rows`, async (req) => {
        const { id } = parseParams(specSchemaIdParamsSchema, req.params);
        const body = parseBody(createSpecRowBodySchema, req.body);
        return specMatrix.addRow(id, body, writeContext(req));
    });
    app.get(`${PREFIX}/spec-rows/:id`, async (req) => {
        const { id } = parseParams(specRowIdParamsSchema, req.params);
        return specMatrix.getRow(id, writeContext(req));
    });
    app.patch(`${PREFIX}/spec-rows/:id`, async (req) => {
        const { id } = parseParams(specRowIdParamsSchema, req.params);
        const body = parseBody(updateSpecRowBodySchema, req.body);
        return specMatrix.updateRow(id, body, writeContext(req));
    });
    app.post(`${PREFIX}/spec-rows/:id/bindings`, async (req) => {
        const { id } = parseParams(specRowIdParamsSchema, req.params);
        const body = parseBody(setRowBindingsBodySchema, req.body);
        return specMatrix.setRowBindings(id, body.bindings, writeContext(req));
    });
    app.delete(`${PREFIX}/spec-rows/:id`, async (req) => {
        const { id } = parseParams(specRowIdParamsSchema, req.params);
        return specMatrix.deleteRow(id, writeContext(req));
    });
}
