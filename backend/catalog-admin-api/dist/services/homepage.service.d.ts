import { HomepageRepository } from "../repositories/homepage.repository.js";
import type { WriteContext } from "../types/write-context.js";
import type { HomepageCategoryTileDocument, HomepagePromoBannerDocument, HomepageSupportCardDocument } from "@factorypeer/catalog-models";
export declare class HomepageService {
    private readonly repo;
    constructor(repo: HomepageRepository);
    listBanners(ctx?: WriteContext, status?: string): Promise<HomepagePromoBannerDocument[]>;
    getBanner(id: string, ctx?: WriteContext): Promise<HomepagePromoBannerDocument>;
    createBanner(body: {
        slug: string;
        eyebrow?: string;
        title: string;
        subtitle?: string;
        description?: string;
        imageUrl: string;
        imageAlt?: string;
        ctaLabel?: string;
        href?: string;
        openInNewTab?: boolean;
        status?: string;
        sortOrder?: number;
        metadata?: Record<string, unknown>;
    }, ctx?: WriteContext): Promise<HomepagePromoBannerDocument>;
    updateBanner(id: string, patch: Partial<{
        slug: string;
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
        imageUrl: string;
        imageAlt: string;
        ctaLabel: string;
        href: string;
        openInNewTab: boolean;
        status: string;
        sortOrder: number;
        metadata: Record<string, unknown>;
    }>, ctx?: WriteContext): Promise<HomepagePromoBannerDocument | null>;
    deleteBanner(id: string, ctx?: WriteContext): Promise<HomepagePromoBannerDocument | null>;
    listCategoryTiles(ctx?: WriteContext, status?: string): Promise<HomepageCategoryTileDocument[]>;
    getCategoryTile(id: string, ctx?: WriteContext): Promise<HomepageCategoryTileDocument>;
    createCategoryTile(body: {
        slug: string;
        label: string;
        description?: string;
        categoryId?: string | null;
        href?: string;
        imageUrl: string;
        imageAlt?: string;
        icon?: string;
        ctaLabel?: string;
        status?: string;
        sortOrder?: number;
        metadata?: Record<string, unknown>;
    }, ctx?: WriteContext): Promise<HomepageCategoryTileDocument>;
    updateCategoryTile(id: string, patch: Partial<{
        slug: string;
        label: string;
        description: string;
        categoryId: string | null;
        href: string;
        imageUrl: string;
        imageAlt: string;
        icon: string;
        ctaLabel: string;
        status: string;
        sortOrder: number;
        metadata: Record<string, unknown>;
    }>, ctx?: WriteContext): Promise<HomepageCategoryTileDocument | null>;
    deleteCategoryTile(id: string, ctx?: WriteContext): Promise<HomepageCategoryTileDocument | null>;
    listSupportCards(ctx?: WriteContext, status?: string): Promise<HomepageSupportCardDocument[]>;
    getSupportCard(id: string, ctx?: WriteContext): Promise<HomepageSupportCardDocument>;
    createSupportCard(body: {
        slug: string;
        title: string;
        description?: string;
        icon?: string;
        ctaLabel?: string;
        href?: string;
        status?: string;
        sortOrder?: number;
        metadata?: Record<string, unknown>;
    }, ctx?: WriteContext): Promise<HomepageSupportCardDocument>;
    updateSupportCard(id: string, patch: Partial<{
        slug: string;
        title: string;
        description: string;
        icon: string;
        ctaLabel: string;
        href: string;
        status: string;
        sortOrder: number;
        metadata: Record<string, unknown>;
    }>, ctx?: WriteContext): Promise<HomepageSupportCardDocument | null>;
    deleteSupportCard(id: string, ctx?: WriteContext): Promise<HomepageSupportCardDocument | null>;
}
export default HomepageService;
//# sourceMappingURL=homepage.service.d.ts.map