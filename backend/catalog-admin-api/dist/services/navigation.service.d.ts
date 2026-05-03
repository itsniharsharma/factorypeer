import type { WriteContext } from "../types/write-context.js";
import { NavigationRepository } from "../repositories/navigation.repository.js";
export declare class NavigationService {
    private readonly repo;
    constructor(repo: NavigationRepository);
    listLinkGroups(ctx?: WriteContext, placement?: string, status?: string): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: import("mongoose").Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }> & {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getLinkGroup(id: string, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: import("mongoose").Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }> & {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createLinkGroup(body: {
        slug: string;
        title: string;
        placement: "utility" | "navigation" | "footer";
        description?: string;
        status?: string;
        sortOrder?: number;
        links?: Array<Record<string, unknown>>;
        metadata?: Record<string, unknown>;
    }, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: import("mongoose").Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }> & {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateLinkGroup(id: string, patch: Partial<{
        slug: string;
        title: string;
        placement: "utility" | "navigation" | "footer";
        description: string;
        status: string;
        sortOrder: number;
        links: Array<Record<string, unknown>>;
        metadata: Record<string, unknown>;
    }>, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: import("mongoose").Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }> & {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteLinkGroup(id: string, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: import("mongoose").Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }> & {
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    listFooterContents(ctx?: WriteContext, status?: string): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: import("mongoose").Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        brandName?: string | null | undefined;
        newsletterHeading?: string | null | undefined;
        newsletterDescription?: string | null | undefined;
        newsletterCtaLabel?: string | null | undefined;
        newsletterCtaHref?: string | null | undefined;
        feedbackHeading?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
        copyrightText?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getFooterContent(id: string, ctx?: WriteContext): Promise<import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: import("mongoose").Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        brandName?: string | null | undefined;
        newsletterHeading?: string | null | undefined;
        newsletterDescription?: string | null | undefined;
        newsletterCtaLabel?: string | null | undefined;
        newsletterCtaHref?: string | null | undefined;
        feedbackHeading?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
        copyrightText?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createFooterContent(body: {
        slug: string;
        brandName?: string;
        newsletterHeading?: string;
        newsletterDescription?: string;
        newsletterCtaLabel?: string;
        newsletterCtaHref?: string;
        feedbackHeading?: string;
        feedbackCtaLabel?: string;
        feedbackCtaHref?: string;
        copyrightText?: string;
        status?: string;
        sortOrder?: number;
        socialLinks?: Array<Record<string, unknown>>;
        metadata?: Record<string, unknown>;
    }, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: import("mongoose").Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        brandName?: string | null | undefined;
        newsletterHeading?: string | null | undefined;
        newsletterDescription?: string | null | undefined;
        newsletterCtaLabel?: string | null | undefined;
        newsletterCtaHref?: string | null | undefined;
        feedbackHeading?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
        copyrightText?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateFooterContent(id: string, patch: Partial<{
        slug: string;
        brandName: string;
        newsletterHeading: string;
        newsletterDescription: string;
        newsletterCtaLabel: string;
        newsletterCtaHref: string;
        feedbackHeading: string;
        feedbackCtaLabel: string;
        feedbackCtaHref: string;
        copyrightText: string;
        status: string;
        sortOrder: number;
        socialLinks: Array<Record<string, unknown>>;
        metadata: Record<string, unknown>;
    }>, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: import("mongoose").Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        brandName?: string | null | undefined;
        newsletterHeading?: string | null | undefined;
        newsletterDescription?: string | null | undefined;
        newsletterCtaLabel?: string | null | undefined;
        newsletterCtaHref?: string | null | undefined;
        feedbackHeading?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
        copyrightText?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteFooterContent(id: string, ctx?: WriteContext): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: import("mongoose").Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }> & {
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }>;
        tenantId?: import("mongoose").Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: import("mongoose").Types.ObjectId | null | undefined;
        updatedBy?: import("mongoose").Types.ObjectId | null | undefined;
        brandName?: string | null | undefined;
        newsletterHeading?: string | null | undefined;
        newsletterDescription?: string | null | undefined;
        newsletterCtaLabel?: string | null | undefined;
        newsletterCtaHref?: string | null | undefined;
        feedbackHeading?: string | null | undefined;
        feedbackCtaLabel?: string | null | undefined;
        feedbackCtaHref?: string | null | undefined;
        copyrightText?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
export default NavigationService;
//# sourceMappingURL=navigation.service.d.ts.map