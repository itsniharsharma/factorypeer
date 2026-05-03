import type { ClientSession, Types } from "mongoose";
import type { CategoryRepository } from "../repositories/category.repository.js";
import type { SpecSchemaRepository } from "../repositories/spec-schema.repository.js";
import type { SpecColumnRepository } from "../repositories/spec-column.repository.js";
import type { SpecRowRepository } from "../repositories/spec-row.repository.js";
import type { VariantBindingInput } from "../repositories/spec-row.repository.js";
import type { ExecOpts } from "../repositories/exec-opts.js";
import { withTransaction } from "../db/with-transaction.js";
import { AppError } from "../errors/app-error.js";
import { familyRequiredForSpec, resourceNotFound } from "../errors/domain.js";
import { toObjectId } from "../utils/mongo.js";
import type { WriteContext } from "../types/write-context.js";

function eo(ctx?: WriteContext, session?: ClientSession): ExecOpts {
  return { actorId: ctx?.actorUserId ?? undefined, session };
}

export class SpecMatrixService {
  constructor(
    private readonly categories: CategoryRepository,
    private readonly specSchemas: SpecSchemaRepository,
    private readonly columns: SpecColumnRepository,
    private readonly rows: SpecRowRepository,
  ) {}

  async getSchemaForCategory(categoryId: string, ctx?: WriteContext) {
    const catId = toObjectId(categoryId);
    const cat = await this.categories.findById(catId, eo(ctx));
    if (!cat) throw resourceNotFound("CatalogCategory", categoryId);
    const id = cat.activeSpecSchemaId as Types.ObjectId | null | undefined;
    if (!id) return null;
    return this.specSchemas.findById(id, eo(ctx));
  }

  async createSchema(categoryId: string, input: { familySummary?: string; status?: string }, ctx?: WriteContext) {
    const catId = toObjectId(categoryId);
    const cat = await this.categories.findById(catId, eo(ctx));
    if (!cat) throw resourceNotFound("CatalogCategory", categoryId);
    if (cat.kind !== "family") {
      throw familyRequiredForSpec();
    }
    return this.specSchemas.create(
      {
        taxonomyNodeId: catId,
        familySummary: input.familySummary ?? "",
        status: input.status,
      },
      eo(ctx),
    );
  }

  async updateSchema(schemaId: string, patch: { familySummary?: string; status?: string }, ctx?: WriteContext) {
    const sid = toObjectId(schemaId);
    const doc = await this.specSchemas.updateById(sid, patch, eo(ctx));
    if (!doc) throw resourceNotFound("CatalogSpecSchema", schemaId);
    return doc;
  }

  async getSchema(schemaId: string, ctx?: WriteContext) {
    const sid = toObjectId(schemaId);
    const doc = await this.specSchemas.findById(sid, eo(ctx));
    if (!doc) throw resourceNotFound("CatalogSpecSchema", schemaId);
    return doc;
  }

  async publishSchema(schemaId: string, ctx?: WriteContext) {
    const sid = toObjectId(schemaId);
    return withTransaction(async (session) => {
      const opt = eo(ctx, session);
      const doc = await this.specSchemas.updateById(
        sid,
        {
          status: "published",
          publishedAt: new Date(),
        },
        opt,
      );
      if (!doc) throw resourceNotFound("CatalogSpecSchema", schemaId);
      await this.categories.updateById(
        doc.taxonomyNodeId as Types.ObjectId,
        {
          activeSpecSchemaId: sid,
          publishedAt: new Date(),
        },
        opt,
      );
      return doc;
    });
  }

  async listColumns(schemaId: string, ctx?: WriteContext) {
    return this.columns.listBySpecSchema(toObjectId(schemaId), eo(ctx));
  }

  async addColumn(schemaId: string, input: Record<string, unknown>, ctx?: WriteContext) {
    const s = await this.specSchemas.findById(toObjectId(schemaId), eo(ctx));
    if (!s) throw resourceNotFound("CatalogSpecSchema", schemaId);
    return this.columns.create(
      {
        specSchemaId: toObjectId(schemaId),
        key: input["key"] as string,
        label: input["label"] as string,
        dataType: input["dataType"] as string | undefined,
        filterable: input["filterable"] as boolean | undefined,
        sortable: input["sortable"] as boolean | undefined,
        searchIndex: input["searchIndex"] as boolean | undefined,
        enumOptions: input["enumOptions"] as string[] | undefined,
        unit: input["unit"] as string | undefined,
        widthClass: input["widthClass"] as string | undefined,
        sortOrder: input["sortOrder"] as number | undefined,
      },
      eo(ctx),
    );
  }

  async updateColumn(columnId: string, patch: Record<string, unknown>, ctx?: WriteContext) {
    const c = await this.columns.updateById(toObjectId(columnId), patch as never, eo(ctx));
    if (!c) throw resourceNotFound("CatalogSpecColumn", columnId);
    return c;
  }

  async deleteColumn(columnId: string, ctx?: WriteContext) {
    const c = await this.columns.deleteById(toObjectId(columnId), eo(ctx));
    if (!c) throw resourceNotFound("CatalogSpecColumn", columnId);
    return c;
  }

  async listRows(
    schemaId: string,
    ctx?: WriteContext,
    listOpts?: { status?: string; skip?: number; limit?: number },
  ) {
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
    type RowDoc = (typeof list)[number];
    const items = list.map((r: RowDoc) => this.serializeRow(r));
    return { items, total };
  }

  async addRow(
    schemaId: string,
    input: {
      values?: Record<string, string>;
      variantBindings?: Array<{
        productVariantId: string;
        role?: "primary" | "alternate";
        sortOrder?: number;
      }>;
      externalKey?: string;
      status?: string;
      sortOrder?: number;
    },
    ctx?: WriteContext,
  ) {
    const s = await this.specSchemas.findById(toObjectId(schemaId), eo(ctx));
    if (!s) throw resourceNotFound("CatalogSpecSchema", schemaId);
    const bindings: VariantBindingInput[] = (input.variantBindings ?? []).map((b, i) => ({
      productVariantId: toObjectId(b.productVariantId),
      role: b.role ?? "primary",
      sortOrder: b.sortOrder ?? i,
    }));

    const hasBindings = bindings.length > 0;
    if (hasBindings) {
      return withTransaction(async (session) => {
        const opt = eo(ctx, session);
        const row = await this.rows.create(
          {
            specSchemaId: toObjectId(schemaId),
            taxonomyNodeId: s.taxonomyNodeId as Types.ObjectId,
            values: input.values ?? {},
            variantBindings: bindings,
            externalKey: input.externalKey,
            status: input.status,
            sortOrder: input.sortOrder,
          },
          opt,
        );
        if (!row) throw new AppError("Could not create spec matrix row.", 500, "CREATE_FAILED");
        return this.serializeRow(row);
      });
    }

    const row = await this.rows.create(
      {
        specSchemaId: toObjectId(schemaId),
        taxonomyNodeId: s.taxonomyNodeId as Types.ObjectId,
        values: input.values ?? {},
        variantBindings: bindings,
        externalKey: input.externalKey,
        status: input.status,
        sortOrder: input.sortOrder,
      },
      eo(ctx),
    );
    if (!row) throw new AppError("Could not create spec matrix row.", 500, "CREATE_FAILED");
    return this.serializeRow(row);
  }

  async updateRow(
    rowId: string,
    patch: {
      values?: Record<string, string>;
      variantBindings?: Array<{
        productVariantId: string;
        role?: "primary" | "alternate";
        sortOrder?: number;
      }>;
      externalKey?: string | null;
      status?: string;
      sortOrder?: number;
    },
    ctx?: WriteContext,
  ) {
    const existing = await this.rows.findById(toObjectId(rowId), eo(ctx));
    if (!existing) throw resourceNotFound("CatalogSpecRow", rowId);
    const variantBindings = patch.variantBindings
      ? patch.variantBindings.map((b, i) => ({
          productVariantId: toObjectId(b.productVariantId),
          role: b.role ?? "primary",
          sortOrder: b.sortOrder ?? i,
        }))
      : undefined;

    const run = async (session?: ClientSession) => {
      const opt = eo(ctx, session);
      const row = await this.rows.updateById(
        toObjectId(rowId),
        {
          values: patch.values,
          variantBindings,
          externalKey: patch.externalKey === undefined ? undefined : patch.externalKey,
          status: patch.status,
          sortOrder: patch.sortOrder,
        },
        opt,
      );
      return row ? this.serializeRow(row) : null;
    };

    if (patch.variantBindings !== undefined) {
      return withTransaction(async (session) => run(session));
    }
    return run();
  }

  async setRowBindings(
    rowId: string,
    bindings: Array<{
      productVariantId: string;
      role?: "primary" | "alternate";
      sortOrder?: number;
    }>,
    ctx?: WriteContext,
  ) {
    return withTransaction(async (session) => {
      const opt = eo(ctx, session);
      const mapped: VariantBindingInput[] = bindings.map((b, i) => ({
        productVariantId: toObjectId(b.productVariantId),
        role: b.role ?? "primary",
        sortOrder: b.sortOrder ?? i,
      }));
      const row = await this.rows.updateById(toObjectId(rowId), { variantBindings: mapped }, opt);
      if (!row) throw resourceNotFound("CatalogSpecRow", rowId);
      return this.serializeRow(row);
    });
  }

  async deleteRow(rowId: string, ctx?: WriteContext) {
    const r = await this.rows.deleteById(toObjectId(rowId), eo(ctx));
    if (!r) throw resourceNotFound("CatalogSpecRow", rowId);
    return r;
  }

  async reorderRows(schemaId: string, orderedIds: string[], ctx?: WriteContext) {
    return withTransaction(async (session) => {
      const opt = eo(ctx, session);
      const oid = orderedIds.map((x) => toObjectId(x));
      await this.rows.setSortOrders(oid.map((id, i) => ({ id, sortOrder: i })), opt);
      const list = await this.rows.listBySpecSchema(toObjectId(schemaId), opt);
      type RowDoc = (typeof list)[number];
      return list.map((r: RowDoc) => this.serializeRow(r));
    });
  }

  private serializeRow(row: {
    toObject: () => Record<string, unknown>;
    values?: Map<string, string>;
  }) {
    const o = row.toObject();
    const values = o["values"];
    if (values instanceof Map) {
      o["values"] = Object.fromEntries(values);
    }
    return o;
  }
}
