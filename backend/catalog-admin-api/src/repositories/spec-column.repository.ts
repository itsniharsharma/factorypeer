import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
import type { ExecOpts } from "./exec-opts.js";

export class SpecColumnRepository {
  constructor(
    private readonly models: CatalogModels,
    private readonly tenantId: Types.ObjectId | null,
  ) {}

  private tq() {
    return tenantMatch(this.tenantId);
  }

  async listBySpecSchema(specSchemaId: Types.ObjectId, opts?: ExecOpts) {
    let q = this.models.CatalogSpecColumn.find({ specSchemaId, ...this.tq() }).sort({
      sortOrder: 1,
      key: 1,
    });
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async findById(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.CatalogSpecColumn.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async create(
    data: {
      specSchemaId: Types.ObjectId;
      key: string;
      label: string;
      dataType?: string;
      filterable?: boolean;
      sortable?: boolean;
      searchIndex?: boolean;
      enumOptions?: string[];
      unit?: string;
      widthClass?: string;
      sortOrder?: number;
    },
    opts?: ExecOpts,
  ) {
    const doc = {
      tenantId: this.tenantId,
      specSchemaId: data.specSchemaId,
      key: data.key,
      label: data.label,
      dataType: data.dataType ?? "string",
      filterable: data.filterable ?? false,
      sortable: data.sortable ?? false,
      searchIndex: data.searchIndex ?? false,
      enumOptions: data.enumOptions,
      unit: data.unit,
      widthClass: data.widthClass,
      sortOrder: data.sortOrder ?? 0,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.CatalogSpecColumn.create([doc], { session: opts.session });
      return created[0];
    }
    return this.models.CatalogSpecColumn.create(doc);
  }

  async updateById(
    id: Types.ObjectId,
    patch: Partial<{
      label: string;
      dataType: string;
      filterable: boolean;
      sortable: boolean;
      searchIndex: boolean;
      enumOptions: string[];
      unit: string | null;
      widthClass: string | null;
      sortOrder: number;
    }>,
    opts?: ExecOpts,
  ) {
    const upd = buildAuditedUpdate(patch as Record<string, unknown>, opts?.actorId);
    return this.models.CatalogSpecColumn
      .findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
        new: true,
        session: opts?.session,
      })
      .exec();
  }

  async deleteById(id: Types.ObjectId, opts?: ExecOpts) {
    return this.models.CatalogSpecColumn
      .findOneAndDelete({ _id: id, ...this.tq() }, { session: opts?.session })
      .exec();
  }

  async deleteBySpecSchema(specSchemaId: Types.ObjectId, opts?: ExecOpts) {
    await this.models.CatalogSpecColumn.deleteMany(
      { specSchemaId, ...this.tq() },
      { session: opts?.session },
    ).exec();
  }
}
