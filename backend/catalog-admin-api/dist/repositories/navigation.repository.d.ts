import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import type { ExecOpts } from "./exec-opts.js";
export declare class NavigationRepository {
    private readonly models;
    private readonly tenantId;
    constructor(models: CatalogModels, tenantId: Types.ObjectId | null);
    private tq;
    listLinkGroups(opts?: ExecOpts & {
        placement?: string;
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findLinkGroupById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findLinkGroupBySlug(slug: string, placement: string, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    createLinkGroup(doc: Record<string, unknown>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateLinkGroup(id: Types.ObjectId, patch: Record<string, unknown>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteLinkGroup(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").SiteLinkGroupDocument, {}, {}> & {
        slug: string;
        title: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        placement: "utility" | "navigation" | "footer";
        links: Types.DocumentArray<{
            status: "draft" | "published" | "archived";
            sortOrder: number;
            label: string;
            href: string;
            openInNewTab: boolean;
            metadata: any;
            external: boolean;
            description?: string | null | undefined;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        description?: string | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    listFooterContents(opts?: ExecOpts & {
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
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
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findFooterContentById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
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
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findFooterContentBySlug(slug: string, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
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
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    createFooterContent(doc: Record<string, unknown>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
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
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateFooterContent(id: Types.ObjectId, patch: Record<string, unknown>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
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
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteFooterContent(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").FooterContentDocument, {}, {}> & {
        slug: string;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        metadata: any;
        socialLinks: Types.DocumentArray<{
            sortOrder: number;
            label: string;
            href: string;
            icon?: string | null | undefined;
        }, Types.Subdocument<import("bson").ObjectId, any, {
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
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
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
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
export default NavigationRepository;
//# sourceMappingURL=navigation.repository.d.ts.map