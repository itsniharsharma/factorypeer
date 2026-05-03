import { z } from "zod";
export declare const linkGroupPlacementSchema: z.ZodEnum<["utility", "navigation", "footer"]>;
export declare const navigationListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    placement: z.ZodOptional<z.ZodEnum<["utility", "navigation", "footer"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    placement?: "utility" | "navigation" | "footer" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    placement?: "utility" | "navigation" | "footer" | undefined;
}>;
export declare const createLinkGroupBodySchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    placement: z.ZodEnum<["utility", "navigation", "footer"]>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    links: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        external: z.ZodOptional<z.ZodBoolean>;
        openInNewTab: z.ZodOptional<z.ZodBoolean>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
        metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        metadata: Record<string, unknown>;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }, {
        label: string;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }>, "many">>>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    title: string;
    placement: "utility" | "navigation" | "footer";
    metadata: Record<string, unknown>;
    links: {
        label: string;
        metadata: Record<string, unknown>;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }[];
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
}, {
    slug: string;
    title: string;
    placement: "utility" | "navigation" | "footer";
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    links?: {
        label: string;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }[] | undefined;
}>;
export declare const updateLinkGroupBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    placement: z.ZodOptional<z.ZodEnum<["utility", "navigation", "footer"]>>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    links: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        external: z.ZodOptional<z.ZodBoolean>;
        openInNewTab: z.ZodOptional<z.ZodBoolean>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
        status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
        metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        metadata: Record<string, unknown>;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }, {
        label: string;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }>, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    placement?: "utility" | "navigation" | "footer" | undefined;
    metadata?: Record<string, unknown> | undefined;
    links?: {
        label: string;
        metadata: Record<string, unknown>;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }[] | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    placement?: "utility" | "navigation" | "footer" | undefined;
    metadata?: Record<string, unknown> | undefined;
    links?: {
        label: string;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }[] | undefined;
}>, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    placement?: "utility" | "navigation" | "footer" | undefined;
    metadata?: Record<string, unknown> | undefined;
    links?: {
        label: string;
        metadata: Record<string, unknown>;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }[] | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    placement?: "utility" | "navigation" | "footer" | undefined;
    metadata?: Record<string, unknown> | undefined;
    links?: {
        label: string;
        href: string;
        status?: "draft" | "published" | "archived" | undefined;
        description?: string | undefined;
        sortOrder?: number | undefined;
        metadata?: Record<string, unknown> | undefined;
        openInNewTab?: boolean | undefined;
        external?: boolean | undefined;
        icon?: string | undefined;
    }[] | undefined;
}>;
export declare const footerContentListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
}>;
export declare const createFooterContentBodySchema: z.ZodObject<{
    slug: z.ZodString;
    brandName: z.ZodOptional<z.ZodString>;
    newsletterHeading: z.ZodOptional<z.ZodString>;
    newsletterDescription: z.ZodOptional<z.ZodString>;
    newsletterCtaLabel: z.ZodOptional<z.ZodString>;
    newsletterCtaHref: z.ZodOptional<z.ZodString>;
    feedbackHeading: z.ZodOptional<z.ZodString>;
    feedbackCtaLabel: z.ZodOptional<z.ZodString>;
    feedbackCtaHref: z.ZodOptional<z.ZodString>;
    copyrightText: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    socialLinks: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        icon: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }, {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }>, "many">>>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    metadata: Record<string, unknown>;
    socialLinks: {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }[];
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    brandName?: string | undefined;
    newsletterHeading?: string | undefined;
    newsletterDescription?: string | undefined;
    newsletterCtaLabel?: string | undefined;
    newsletterCtaHref?: string | undefined;
    feedbackHeading?: string | undefined;
    feedbackCtaLabel?: string | undefined;
    feedbackCtaHref?: string | undefined;
    copyrightText?: string | undefined;
}, {
    slug: string;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    socialLinks?: {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }[] | undefined;
    brandName?: string | undefined;
    newsletterHeading?: string | undefined;
    newsletterDescription?: string | undefined;
    newsletterCtaLabel?: string | undefined;
    newsletterCtaHref?: string | undefined;
    feedbackHeading?: string | undefined;
    feedbackCtaLabel?: string | undefined;
    feedbackCtaHref?: string | undefined;
    copyrightText?: string | undefined;
}>;
export declare const updateFooterContentBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    brandName: z.ZodOptional<z.ZodString>;
    newsletterHeading: z.ZodOptional<z.ZodString>;
    newsletterDescription: z.ZodOptional<z.ZodString>;
    newsletterCtaLabel: z.ZodOptional<z.ZodString>;
    newsletterCtaHref: z.ZodOptional<z.ZodString>;
    feedbackHeading: z.ZodOptional<z.ZodString>;
    feedbackCtaLabel: z.ZodOptional<z.ZodString>;
    feedbackCtaHref: z.ZodOptional<z.ZodString>;
    copyrightText: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    socialLinks: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        icon: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }, {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }>, "many">>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    socialLinks?: {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }[] | undefined;
    brandName?: string | undefined;
    newsletterHeading?: string | undefined;
    newsletterDescription?: string | undefined;
    newsletterCtaLabel?: string | undefined;
    newsletterCtaHref?: string | undefined;
    feedbackHeading?: string | undefined;
    feedbackCtaLabel?: string | undefined;
    feedbackCtaHref?: string | undefined;
    copyrightText?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    socialLinks?: {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }[] | undefined;
    brandName?: string | undefined;
    newsletterHeading?: string | undefined;
    newsletterDescription?: string | undefined;
    newsletterCtaLabel?: string | undefined;
    newsletterCtaHref?: string | undefined;
    feedbackHeading?: string | undefined;
    feedbackCtaLabel?: string | undefined;
    feedbackCtaHref?: string | undefined;
    copyrightText?: string | undefined;
}>, {
    status?: "draft" | "published" | "archived" | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    socialLinks?: {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }[] | undefined;
    brandName?: string | undefined;
    newsletterHeading?: string | undefined;
    newsletterDescription?: string | undefined;
    newsletterCtaLabel?: string | undefined;
    newsletterCtaHref?: string | undefined;
    feedbackHeading?: string | undefined;
    feedbackCtaLabel?: string | undefined;
    feedbackCtaHref?: string | undefined;
    copyrightText?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    socialLinks?: {
        label: string;
        href: string;
        sortOrder?: number | undefined;
        icon?: string | undefined;
    }[] | undefined;
    brandName?: string | undefined;
    newsletterHeading?: string | undefined;
    newsletterDescription?: string | undefined;
    newsletterCtaLabel?: string | undefined;
    newsletterCtaHref?: string | undefined;
    feedbackHeading?: string | undefined;
    feedbackCtaLabel?: string | undefined;
    feedbackCtaHref?: string | undefined;
    copyrightText?: string | undefined;
}>;
export declare const navigationContentIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=navigation.d.ts.map