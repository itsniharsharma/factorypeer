import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
import type { ExecOpts } from "./exec-opts.js";

export class NavigationRepository {
  constructor(
    private readonly models: CatalogModels,
    private readonly tenantId: Types.ObjectId | null,
  ) {}

  private tq() {
    return tenantMatch(this.tenantId);
  }

  async listLinkGroups(opts?: ExecOpts & { placement?: string; status?: string }) {
    const base = {
      ...this.tq(),
      ...(opts?.placement ? { placement: opts.placement } : {}),
      ...(opts?.status ? { status: opts.status } : {}),
    };
    let q = this.models.SiteLinkGroup.find(base).sort({ sortOrder: 1, title: 1 });
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async findLinkGroupById(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.SiteLinkGroup.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async findLinkGroupBySlug(slug: string, placement: string, opts?: ExecOpts) {
    const q = this.models.SiteLinkGroup.findOne({ slug, placement, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async createLinkGroup(doc: Record<string, unknown>, opts?: ExecOpts) {
    const payload = {
      tenantId: this.tenantId,
      ...doc,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.SiteLinkGroup.create([payload], { session: opts.session });
      return created[0];
    }
    return this.models.SiteLinkGroup.create(payload);
  }

  async updateLinkGroup(id: Types.ObjectId, patch: Record<string, unknown>, opts?: ExecOpts) {
    const upd = buildAuditedUpdate(patch, opts?.actorId);
    return this.models.SiteLinkGroup.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
      new: true,
      session: opts?.session,
    }).exec();
  }

  async deleteLinkGroup(id: Types.ObjectId, opts?: ExecOpts) {
    return this.models.SiteLinkGroup.findOneAndDelete({ _id: id, ...this.tq() }, {
      session: opts?.session,
    }).exec();
  }

  async listFooterContents(opts?: ExecOpts & { status?: string }) {
    const base = opts?.status ? { ...this.tq(), status: opts.status } : this.tq();
    let q = this.models.FooterContent.find(base).sort({ sortOrder: 1, brandName: 1 });
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async findFooterContentById(id: Types.ObjectId, opts?: ExecOpts) {
    const q = this.models.FooterContent.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async findFooterContentBySlug(slug: string, opts?: ExecOpts) {
    const q = this.models.FooterContent.findOne({ slug, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async createFooterContent(doc: Record<string, unknown>, opts?: ExecOpts) {
    const payload = {
      tenantId: this.tenantId,
      ...doc,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.FooterContent.create([payload], { session: opts.session });
      return created[0];
    }
    return this.models.FooterContent.create(payload);
  }

  async updateFooterContent(id: Types.ObjectId, patch: Record<string, unknown>, opts?: ExecOpts) {
    const upd = buildAuditedUpdate(patch, opts?.actorId);
    return this.models.FooterContent.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
      new: true,
      session: opts?.session,
    }).exec();
  }

  async deleteFooterContent(id: Types.ObjectId, opts?: ExecOpts) {
    return this.models.FooterContent.findOneAndDelete({ _id: id, ...this.tq() }, {
      session: opts?.session,
    }).exec();
  }
}

export default NavigationRepository;