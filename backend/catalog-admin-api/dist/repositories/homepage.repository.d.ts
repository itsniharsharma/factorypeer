import type { Types } from "mongoose";
import type { HomepageCategoryTileDocument, HomepagePromoBannerDocument, HomepageSupportCardDocument } from "@factorypeer/catalog-models";
import type { CatalogModels } from "../db/connection.js";
import type { ExecOpts } from "./exec-opts.js";
export declare class HomepageRepository {
    private readonly models;
    private readonly tenantId;
    constructor(models: CatalogModels, tenantId: Types.ObjectId | null);
    private tq;
    listBanners(opts?: ExecOpts & {
        status?: string;
    }): Promise<HomepagePromoBannerDocument[]>;
    findBannerById(id: Types.ObjectId, opts?: ExecOpts): Promise<HomepagePromoBannerDocument | null>;
    findBannerBySlug(slug: string, opts?: ExecOpts): Promise<HomepagePromoBannerDocument | null>;
    createBanner(doc: Record<string, unknown>, opts?: ExecOpts): Promise<HomepagePromoBannerDocument>;
    updateBanner(id: Types.ObjectId, patch: Record<string, unknown>, opts?: ExecOpts): Promise<HomepagePromoBannerDocument | null>;
    deleteBanner(id: Types.ObjectId, opts?: ExecOpts): Promise<HomepagePromoBannerDocument | null>;
    listCategoryTiles(opts?: ExecOpts & {
        status?: string;
    }): Promise<HomepageCategoryTileDocument[]>;
    findCategoryTileById(id: Types.ObjectId, opts?: ExecOpts): Promise<HomepageCategoryTileDocument | null>;
    findCategoryTileBySlug(slug: string, opts?: ExecOpts): Promise<HomepageCategoryTileDocument | null>;
    createCategoryTile(doc: Record<string, unknown>, opts?: ExecOpts): Promise<HomepageCategoryTileDocument>;
    updateCategoryTile(id: Types.ObjectId, patch: Record<string, unknown>, opts?: ExecOpts): Promise<HomepageCategoryTileDocument | null>;
    deleteCategoryTile(id: Types.ObjectId, opts?: ExecOpts): Promise<HomepageCategoryTileDocument | null>;
    listSupportCards(opts?: ExecOpts & {
        status?: string;
    }): Promise<HomepageSupportCardDocument[]>;
    findSupportCardById(id: Types.ObjectId, opts?: ExecOpts): Promise<HomepageSupportCardDocument | null>;
    findSupportCardBySlug(slug: string, opts?: ExecOpts): Promise<HomepageSupportCardDocument | null>;
    createSupportCard(doc: Record<string, unknown>, opts?: ExecOpts): Promise<HomepageSupportCardDocument>;
    updateSupportCard(id: Types.ObjectId, patch: Record<string, unknown>, opts?: ExecOpts): Promise<HomepageSupportCardDocument | null>;
    deleteSupportCard(id: Types.ObjectId, opts?: ExecOpts): Promise<HomepageSupportCardDocument | null>;
}
export default HomepageRepository;
//# sourceMappingURL=homepage.repository.d.ts.map