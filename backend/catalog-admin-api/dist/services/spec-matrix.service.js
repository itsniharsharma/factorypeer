import { withTransaction } from "../db/with-transaction.js";
import { AppError } from "../errors/app-error.js";
import { familyRequiredForSpec, resourceNotFound } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
function eo(ctx, session) {
    return { actorId: ctx?.actorUserId ?? undefined, session };
}
export class SpecMatrixService {
    categories;
    specSchemas;
    columns;
    rows;
    constructor(categories, specSchemas, columns, rows) {
        this.categories = categories;
        this.specSchemas = specSchemas;
        this.columns = columns;
        this.rows = rows;
    }
    async getSchemaForCategory(categoryId, ctx) {
        const catId = toObjectId(categoryId);
        const cat = await this.categories.findById(catId, eo(ctx));
        if (!cat)
            throw resourceNotFound("CatalogCategory", categoryId);
        const id = cat.activeSpecSchemaId;
        if (!id)
            return null;
        return this.specSchemas.findById(id, eo(ctx));
    }
    async createSchema(categoryId, input, ctx) {
        const catId = toObjectId(categoryId);
        const cat = await this.categories.findById(catId, eo(ctx));
        if (!cat)
            throw resourceNotFound("CatalogCategory", categoryId);
        if (cat.kind !== "family") {
            throw familyRequiredForSpec();
        }
        return this.specSchemas.create({
            taxonomyNodeId: catId,
            familySummary: input.familySummary ?? "",
            status: input.status,
        }, eo(ctx));
    }
    async updateSchema(schemaId, patch, ctx) {
        const sid = toObjectId(schemaId);
        const doc = await this.specSchemas.updateById(sid, patch, eo(ctx));
        if (!doc)
            throw resourceNotFound("CatalogSpecSchema", schemaId);
        return doc;
    }
    async getSchema(schemaId, ctx) {
        const sid = toObjectId(schemaId);
        const doc = await this.specSchemas.findById(sid, eo(ctx));
        if (!doc)
            throw resourceNotFound("CatalogSpecSchema", schemaId);
        return doc;
    }
    async publishSchema(schemaId, ctx) {
        const sid = toObjectId(schemaId);
        return withTransaction(async (session) => {
            const opt = eo(ctx, session);
            const doc = await this.specSchemas.updateById(sid, {
                status: "published",
                publishedAt: new Date(),
            }, opt);
            if (!doc)
                throw resourceNotFound("CatalogSpecSchema", schemaId);
            await this.categories.updateById(doc.taxonomyNodeId, {
                activeSpecSchemaId: sid,
                publishedAt: new Date(),
            }, opt);
            return doc;
        });
    }
    async listColumns(schemaId, ctx) {
        return this.columns.listBySpecSchema(toObjectId(schemaId), eo(ctx));
    }
    async addColumn(schemaId, input, ctx) {
        const s = await this.specSchemas.findById(toObjectId(schemaId), eo(ctx));
        if (!s)
            throw resourceNotFound("CatalogSpecSchema", schemaId);
        return this.columns.create({
            specSchemaId: toObjectId(schemaId),
            key: input["key"],
            label: input["label"],
            dataType: input["dataType"],
            filterable: input["filterable"],
            sortable: input["sortable"],
            searchIndex: input["searchIndex"],
            enumOptions: input["enumOptions"],
            unit: input["unit"],
            widthClass: input["widthClass"],
            sortOrder: input["sortOrder"],
        }, eo(ctx));
    }
    async updateColumn(columnId, patch, ctx) {
        const c = await this.columns.updateById(toObjectId(columnId), patch, eo(ctx));
        if (!c)
            throw resourceNotFound("CatalogSpecColumn", columnId);
        return c;
    }
    async deleteColumn(columnId, ctx) {
        const c = await this.columns.deleteById(toObjectId(columnId), eo(ctx));
        if (!c)
            throw resourceNotFound("CatalogSpecColumn", columnId);
        return c;
    }
    async listRows(schemaId, ctx, listOpts) {
        const specId = toObjectId(schemaId);
        const [list, total] = await Promise.all([
            this.rows.listBySpecSchema(specId, {
                ...eo(ctx),
                status: listOpts?.status,
                skip: listOpts?.skip,
                limit: listOpts?.limit,
            }),
            this.rows.countBySpecSchema(specId, {
                ...eo(ctx),
                status: listOpts?.status,
            }),
        ]);
        const items = list.map((r) => this.serializeRow(r));
        return { items, total };
    }
    async addRow(schemaId, input, ctx) {
        const s = await this.specSchemas.findById(toObjectId(schemaId), eo(ctx));
        if (!s)
            throw resourceNotFound("CatalogSpecSchema", schemaId);
        const bindings = (input.variantBindings ?? []).map((b, i) => ({
            productVariantId: toObjectId(b.productVariantId),
            role: b.role ?? "primary",
            sortOrder: b.sortOrder ?? i,
        }));
        const hasBindings = bindings.length > 0;
        if (hasBindings) {
            return withTransaction(async (session) => {
                const opt = eo(ctx, session);
                const row = await this.rows.create({
                    specSchemaId: toObjectId(schemaId),
                    taxonomyNodeId: s.taxonomyNodeId,
                    values: input.values ?? {},
                    variantBindings: bindings,
                    externalKey: input.externalKey,
                    status: input.status,
                    sortOrder: input.sortOrder,
                }, opt);
                if (!row)
                    throw new AppError("Could not create spec matrix row.", 500, "CREATE_FAILED");
                return this.serializeRow(row);
            });
        }
        const row = await this.rows.create({
            specSchemaId: toObjectId(schemaId),
            taxonomyNodeId: s.taxonomyNodeId,
            values: input.values ?? {},
            variantBindings: bindings,
            externalKey: input.externalKey,
            status: input.status,
            sortOrder: input.sortOrder,
        }, eo(ctx));
        if (!row)
            throw new AppError("Could not create spec matrix row.", 500, "CREATE_FAILED");
        return this.serializeRow(row);
    }
    async updateRow(rowId, patch, ctx) {
        const existing = await this.rows.findById(toObjectId(rowId), eo(ctx));
        if (!existing)
            throw resourceNotFound("CatalogSpecRow", rowId);
        const variantBindings = patch.variantBindings
            ? patch.variantBindings.map((b, i) => ({
                productVariantId: toObjectId(b.productVariantId),
                role: b.role ?? "primary",
                sortOrder: b.sortOrder ?? i,
            }))
            : undefined;
        const run = async (session) => {
            const opt = eo(ctx, session);
            const row = await this.rows.updateById(toObjectId(rowId), {
                values: patch.values,
                variantBindings,
                externalKey: patch.externalKey === undefined ? undefined : patch.externalKey,
                status: patch.status,
                sortOrder: patch.sortOrder,
            }, opt);
            return row ? this.serializeRow(row) : null;
        };
        if (patch.variantBindings !== undefined) {
            return withTransaction(async (session) => run(session));
        }
        return run();
    }
    async setRowBindings(rowId, bindings, ctx) {
        return withTransaction(async (session) => {
            const opt = eo(ctx, session);
            const mapped = bindings.map((b, i) => ({
                productVariantId: toObjectId(b.productVariantId),
                role: b.role ?? "primary",
                sortOrder: b.sortOrder ?? i,
            }));
            const row = await this.rows.updateById(toObjectId(rowId), { variantBindings: mapped }, opt);
            if (!row)
                throw resourceNotFound("CatalogSpecRow", rowId);
            return this.serializeRow(row);
        });
    }
    async deleteRow(rowId, ctx) {
        const r = await this.rows.deleteById(toObjectId(rowId), eo(ctx));
        if (!r)
            throw resourceNotFound("CatalogSpecRow", rowId);
        return r;
    }
    async reorderRows(schemaId, orderedIds, ctx) {
        return withTransaction(async (session) => {
            const opt = eo(ctx, session);
            const oid = orderedIds.map((x) => toObjectId(x));
            await this.rows.setSortOrders(oid.map((id, i) => ({ id, sortOrder: i })), opt);
            const list = await this.rows.listBySpecSchema(toObjectId(schemaId), opt);
            return list.map((r) => this.serializeRow(r));
        });
    }
    serializeRow(row) {
        const o = row.toObject();
        const values = o["values"];
        if (values instanceof Map) {
            o["values"] = Object.fromEntries(values);
        }
        return o;
    }
}
