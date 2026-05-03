import { z } from "zod";
import { objectIdString, publishStatusSchema } from "./common.js";
const metadataSchema = z.record(z.unknown()).optional().default({});
export const catalogMediaAssetSchema = z.object({
    url: z.string().min(1).max(2000),
    publicId: z.string().max(500).optional(),
    alt: z.string().max(500).optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    format: z.string().max(32).optional(),
});
const homepageListQuerySchema = z.object({
    status: publishStatusSchema.optional(),
});
const homepageBannerBaseSchema = {
    slug: z.string().min(1).max(200),
    eyebrow: z.string().max(200).optional(),
    title: z.string().min(1).max(500),
    subtitle: z.string().max(500).optional(),
    description: z.string().max(2000).optional(),
    image: catalogMediaAssetSchema.optional(),
    imageAlt: z.string().max(500).optional(),
    ctaLabel: z.string().max(120).optional(),
    href: z.string().max(2000).optional(),
    openInNewTab: z.boolean().optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    metadata: metadataSchema,
};
export const homepageBannerListQuerySchema = homepageListQuerySchema;
export const createHomepageBannerBodySchema = z
    .object(homepageBannerBaseSchema)
    .refine((d) => Boolean(d.image?.url?.trim()), {
    message: "Provide `image.url`",
    path: ["image"],
});
export const updateHomepageBannerBodySchema = z
    .object({
    slug: z.string().min(1).max(200).optional(),
    eyebrow: z.string().max(200).optional(),
    title: z.string().min(1).max(500).optional(),
    subtitle: z.string().max(500).optional(),
    description: z.string().max(2000).optional(),
    image: catalogMediaAssetSchema.optional(),
    imageAlt: z.string().max(500).optional(),
    ctaLabel: z.string().max(120).optional(),
    href: z.string().max(2000).optional(),
    openInNewTab: z.boolean().optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    metadata: z.record(z.unknown()).optional(),
})
    .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });
const homepageTileBaseSchema = {
    slug: z.string().min(1).max(200),
    label: z.string().min(1).max(300),
    description: z.string().max(2000).optional(),
    categoryId: objectIdString.optional().nullable(),
    href: z.string().max(2000).optional(),
    image: catalogMediaAssetSchema.optional(),
    imageAlt: z.string().max(500).optional(),
    icon: z.string().max(120).optional(),
    ctaLabel: z.string().max(120).optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    metadata: metadataSchema,
};
export const homepageTileListQuerySchema = homepageListQuerySchema;
export const createHomepageTileBodySchema = z
    .object(homepageTileBaseSchema)
    .refine((d) => Boolean(d.image?.url?.trim()), {
    message: "Provide `image.url`",
    path: ["image"],
});
export const updateHomepageTileBodySchema = z
    .object({
    slug: z.string().min(1).max(200).optional(),
    label: z.string().min(1).max(300).optional(),
    description: z.string().max(2000).optional(),
    categoryId: objectIdString.optional().nullable(),
    href: z.string().max(2000).optional(),
    image: catalogMediaAssetSchema.optional(),
    imageAlt: z.string().max(500).optional(),
    icon: z.string().max(120).optional(),
    ctaLabel: z.string().max(120).optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    metadata: z.record(z.unknown()).optional(),
})
    .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });
const homepageSupportCardBaseSchema = {
    slug: z.string().min(1).max(200),
    title: z.string().min(1).max(300),
    description: z.string().max(2000).optional(),
    image: catalogMediaAssetSchema.optional(),
    icon: z.string().max(120).optional(),
    ctaLabel: z.string().max(120).optional(),
    href: z.string().max(2000).optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    metadata: metadataSchema,
};
export const homepageSupportCardListQuerySchema = homepageListQuerySchema;
export const createHomepageSupportCardBodySchema = z.object(homepageSupportCardBaseSchema);
export const updateHomepageSupportCardBodySchema = z
    .object({
    slug: z.string().min(1).max(200).optional(),
    title: z.string().min(1).max(300).optional(),
    description: z.string().max(2000).optional(),
    image: catalogMediaAssetSchema.optional(),
    icon: z.string().max(120).optional(),
    ctaLabel: z.string().max(120).optional(),
    href: z.string().max(2000).optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    metadata: z.record(z.unknown()).optional(),
})
    .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });
export const homepageContentIdParamsSchema = z.object({
    id: objectIdString,
});
