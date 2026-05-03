import { z } from "zod";
export declare const catalogMediaAssetSchema: z.ZodObject<{
    url: z.ZodString;
    publicId: z.ZodOptional<z.ZodString>;
    alt: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    format: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    publicId?: string | undefined;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    format?: string | undefined;
}, {
    url: string;
    publicId?: string | undefined;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    format?: string | undefined;
}>;
export declare const homepageBannerListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
}>;
export declare const createHomepageBannerBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodString;
    eyebrow: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }>>;
    imageAlt: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    href: z.ZodOptional<z.ZodString>;
    openInNewTab: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    title: string;
    metadata: Record<string, unknown>;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}, {
    slug: string;
    title: string;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}>, {
    slug: string;
    title: string;
    metadata: Record<string, unknown>;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}, {
    slug: string;
    title: string;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}>;
export declare const updateHomepageBannerBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    eyebrow: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    subtitle: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }>>;
    imageAlt: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    href: z.ZodOptional<z.ZodString>;
    openInNewTab: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}>, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}>;
export declare const homepageTileListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
}>;
export declare const createHomepageTileBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    href: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }>>;
    imageAlt: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    label: string;
    metadata: Record<string, unknown>;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    categoryId?: string | null | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}, {
    slug: string;
    label: string;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}>, {
    slug: string;
    label: string;
    metadata: Record<string, unknown>;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    categoryId?: string | null | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}, {
    slug: string;
    label: string;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}>;
export declare const updateHomepageTileBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    href: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }>>;
    imageAlt: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    label?: string | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    label?: string | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}>, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    label?: string | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    sortOrder?: number | undefined;
    label?: string | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
    imageAlt?: string | undefined;
}>;
export declare const homepageSupportCardListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
}>;
export declare const createHomepageSupportCardBodySchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }>>;
    icon: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    href: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    slug: string;
    title: string;
    metadata: Record<string, unknown>;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
}, {
    slug: string;
    title: string;
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
}>;
export declare const updateHomepageSupportCardBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }, {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    }>>;
    icon: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    href: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
}>, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    image?: {
        url: string;
        publicId?: string | undefined;
        alt?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        format?: string | undefined;
    } | undefined;
    ctaLabel?: string | undefined;
}>;
export declare const homepageContentIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=homepage-content.d.ts.map