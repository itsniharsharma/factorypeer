import { z } from "zod";
export declare const homepageBannerListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
}>;
export declare const createHomepageBannerBodySchema: z.ZodObject<{
    slug: z.ZodString;
    eyebrow: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodString;
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
    imageUrl: string;
    description?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    slug: string;
    title: string;
    imageUrl: string;
    description?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}>;
export declare const updateHomepageBannerBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    eyebrow: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    subtitle: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    imageAlt: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    href: z.ZodOptional<z.ZodString>;
    openInNewTab: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    imageUrl?: string | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    imageUrl?: string | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}>, {
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    imageUrl?: string | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    openInNewTab?: boolean | undefined;
    imageUrl?: string | undefined;
    eyebrow?: string | undefined;
    subtitle?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}>;
export declare const homepageTileListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
}>;
export declare const createHomepageTileBodySchema: z.ZodObject<{
    slug: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    href: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodString;
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
    imageUrl: string;
    description?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryId?: string | null | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    slug: string;
    label: string;
    imageUrl: string;
    description?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}>;
export declare const updateHomepageTileBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    href: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    imageAlt: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    slug?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    label?: string | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    imageUrl?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    description?: string | undefined;
    slug?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    label?: string | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    imageUrl?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}>, {
    description?: string | undefined;
    slug?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    label?: string | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    imageUrl?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    description?: string | undefined;
    slug?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    label?: string | undefined;
    categoryId?: string | null | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    imageUrl?: string | undefined;
    imageAlt?: string | undefined;
    ctaLabel?: string | undefined;
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
    description?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    slug: string;
    title: string;
    description?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    ctaLabel?: string | undefined;
}>;
export declare const updateHomepageSupportCardBodySchema: z.ZodEffects<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    ctaLabel: z.ZodOptional<z.ZodString>;
    href: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["draft", "published", "archived"]>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    ctaLabel?: string | undefined;
}>, {
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
    ctaLabel?: string | undefined;
}, {
    description?: string | undefined;
    slug?: string | undefined;
    title?: string | undefined;
    status?: "draft" | "published" | "archived" | undefined;
    sortOrder?: number | undefined;
    metadata?: Record<string, unknown> | undefined;
    href?: string | undefined;
    icon?: string | undefined;
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