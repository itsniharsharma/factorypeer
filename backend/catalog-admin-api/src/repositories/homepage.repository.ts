import type { Types } from "mongoose";
import type {
  HomepageCategoryTileDocument,
  HomepagePromoBannerDocument,
  HomepageSupportCardDocument,
} from "@factorypeer/catalog-models";
import type { CatalogModels } from "../db/connection.js";
import { auditCreateFields, buildAuditedUpdate } from "../utils/audit.js";
import { tenantMatch } from "../utils/mongo.js";
import { withSession } from "../utils/query-session.js";
import type { ExecOpts } from "./exec-opts.js";

export class HomepageRepository {
  constructor(
    private readonly models: CatalogModels,
    private readonly tenantId: Types.ObjectId | null,
  ) {}

  private tq() {
    return tenantMatch(this.tenantId);
  }

  async listBanners(opts?: ExecOpts & { status?: string }): Promise<HomepagePromoBannerDocument[]> {
    const base = opts?.status ? { ...this.tq(), status: opts.status } : this.tq();
    let q = this.models.HomepagePromoBanner.find(base).sort({ sortOrder: 1, title: 1 });
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async findBannerById(
    id: Types.ObjectId,
    opts?: ExecOpts,
  ): Promise<HomepagePromoBannerDocument | null> {
    const q = this.models.HomepagePromoBanner.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async findBannerBySlug(
    slug: string,
    opts?: ExecOpts,
  ): Promise<HomepagePromoBannerDocument | null> {
    const q = this.models.HomepagePromoBanner.findOne({ slug, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async createBanner(
    doc: Record<string, unknown>,
    opts?: ExecOpts,
  ): Promise<HomepagePromoBannerDocument> {
    const payload = {
      tenantId: this.tenantId,
      ...doc,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.HomepagePromoBanner.create([payload], { session: opts.session });
      return created[0]!;
    }
    return this.models.HomepagePromoBanner.create(payload);
  }

  async updateBanner(
    id: Types.ObjectId,
    patch: Record<string, unknown>,
    opts?: ExecOpts,
  ): Promise<HomepagePromoBannerDocument | null> {
    const upd = buildAuditedUpdate(patch, opts?.actorId);
    return this.models.HomepagePromoBanner.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
      new: true,
      session: opts?.session,
    }).exec();
  }

  async deleteBanner(id: Types.ObjectId, opts?: ExecOpts): Promise<HomepagePromoBannerDocument | null> {
    return this.models.HomepagePromoBanner.findOneAndDelete({ _id: id, ...this.tq() }, {
      session: opts?.session,
    }).exec();
  }

  async listCategoryTiles(opts?: ExecOpts & { status?: string }): Promise<HomepageCategoryTileDocument[]> {
    const base = opts?.status ? { ...this.tq(), status: opts.status } : this.tq();
    let q = this.models.HomepageCategoryTile.find(base).sort({ sortOrder: 1, label: 1 });
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async findCategoryTileById(
    id: Types.ObjectId,
    opts?: ExecOpts,
  ): Promise<HomepageCategoryTileDocument | null> {
    const q = this.models.HomepageCategoryTile.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async findCategoryTileBySlug(
    slug: string,
    opts?: ExecOpts,
  ): Promise<HomepageCategoryTileDocument | null> {
    const q = this.models.HomepageCategoryTile.findOne({ slug, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async createCategoryTile(
    doc: Record<string, unknown>,
    opts?: ExecOpts,
  ): Promise<HomepageCategoryTileDocument> {
    const payload = {
      tenantId: this.tenantId,
      ...doc,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.HomepageCategoryTile.create([payload], { session: opts.session });
      return created[0]!;
    }
    return this.models.HomepageCategoryTile.create(payload);
  }

  async updateCategoryTile(
    id: Types.ObjectId,
    patch: Record<string, unknown>,
    opts?: ExecOpts,
  ): Promise<HomepageCategoryTileDocument | null> {
    const upd = buildAuditedUpdate(patch, opts?.actorId);
    return this.models.HomepageCategoryTile.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
      new: true,
      session: opts?.session,
    }).exec();
  }

  async deleteCategoryTile(
    id: Types.ObjectId,
    opts?: ExecOpts,
  ): Promise<HomepageCategoryTileDocument | null> {
    return this.models.HomepageCategoryTile.findOneAndDelete({ _id: id, ...this.tq() }, {
      session: opts?.session,
    }).exec();
  }

  async listSupportCards(opts?: ExecOpts & { status?: string }): Promise<HomepageSupportCardDocument[]> {
    const base = opts?.status ? { ...this.tq(), status: opts.status } : this.tq();
    let q = this.models.HomepageSupportCard.find(base).sort({ sortOrder: 1, title: 1 });
    q = withSession(q, opts?.session);
    return q.exec();
  }

  async findSupportCardById(
    id: Types.ObjectId,
    opts?: ExecOpts,
  ): Promise<HomepageSupportCardDocument | null> {
    const q = this.models.HomepageSupportCard.findOne({ _id: id, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async findSupportCardBySlug(
    slug: string,
    opts?: ExecOpts,
  ): Promise<HomepageSupportCardDocument | null> {
    const q = this.models.HomepageSupportCard.findOne({ slug, ...this.tq() });
    return withSession(q, opts?.session).exec();
  }

  async createSupportCard(
    doc: Record<string, unknown>,
    opts?: ExecOpts,
  ): Promise<HomepageSupportCardDocument> {
    const payload = {
      tenantId: this.tenantId,
      ...doc,
      documentVersion: 1,
      ...auditCreateFields(opts?.actorId),
    };
    if (opts?.session) {
      const created = await this.models.HomepageSupportCard.create([payload], { session: opts.session });
      return created[0]!;
    }
    return this.models.HomepageSupportCard.create(payload);
  }

  async updateSupportCard(
    id: Types.ObjectId,
    patch: Record<string, unknown>,
    opts?: ExecOpts,
  ): Promise<HomepageSupportCardDocument | null> {
    const upd = buildAuditedUpdate(patch, opts?.actorId);
    return this.models.HomepageSupportCard.findOneAndUpdate({ _id: id, ...this.tq() }, upd, {
      new: true,
      session: opts?.session,
    }).exec();
  }

  async deleteSupportCard(
    id: Types.ObjectId,
    opts?: ExecOpts,
  ): Promise<HomepageSupportCardDocument | null> {
    return this.models.HomepageSupportCard.findOneAndDelete({ _id: id, ...this.tq() }, {
      session: opts?.session,
    }).exec();
  }
}

export default HomepageRepository;
