import { z } from "zod";
import { objectIdString, publishStatusSchema } from "./common.js";

const metadataSchema = z.record(z.unknown()).optional().default({});

export const linkGroupPlacementSchema = z.enum(["utility", "navigation", "footer"]);

const linkItemSchema = z.object({
  label: z.string().min(1).max(200),
  href: z.string().min(1).max(2000),
  description: z.string().max(500).optional(),
  icon: z.string().max(120).optional(),
  external: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  status: publishStatusSchema.optional(),
  metadata: metadataSchema,
});

const footerSocialLinkSchema = z.object({
  label: z.string().min(1).max(200),
  href: z.string().min(1).max(2000),
  icon: z.string().max(120).optional(),
  sortOrder: z.number().int().optional(),
});

const navigationListQueryBaseSchema = z.object({
  status: publishStatusSchema.optional(),
  placement: linkGroupPlacementSchema.optional(),
});

const linkGroupBaseSchema = {
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  placement: linkGroupPlacementSchema,
  description: z.string().max(2000).optional(),
  status: publishStatusSchema.optional(),
  sortOrder: z.number().int().optional(),
  links: z.array(linkItemSchema).optional().default([]),
  metadata: metadataSchema,
};

export const navigationListQuerySchema = navigationListQueryBaseSchema;
export const createLinkGroupBodySchema = z.object(linkGroupBaseSchema);
export const updateLinkGroupBodySchema = z
  .object({
    slug: z.string().min(1).max(200).optional(),
    title: z.string().min(1).max(300).optional(),
    placement: linkGroupPlacementSchema.optional(),
    description: z.string().max(2000).optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    links: z.array(linkItemSchema).optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

const footerContentBaseSchema = {
  slug: z.string().min(1).max(200),
  brandName: z.string().max(200).optional(),
  newsletterHeading: z.string().max(200).optional(),
  newsletterDescription: z.string().max(1000).optional(),
  newsletterCtaLabel: z.string().max(120).optional(),
  newsletterCtaHref: z.string().max(2000).optional(),
  feedbackHeading: z.string().max(200).optional(),
  feedbackCtaLabel: z.string().max(120).optional(),
  feedbackCtaHref: z.string().max(2000).optional(),
  copyrightText: z.string().max(500).optional(),
  status: publishStatusSchema.optional(),
  sortOrder: z.number().int().optional(),
  socialLinks: z.array(footerSocialLinkSchema).optional().default([]),
  metadata: metadataSchema,
};

export const footerContentListQuerySchema = z.object({
  status: publishStatusSchema.optional(),
});

export const createFooterContentBodySchema = z.object(footerContentBaseSchema);
export const updateFooterContentBodySchema = z
  .object({
    slug: z.string().min(1).max(200).optional(),
    brandName: z.string().max(200).optional(),
    newsletterHeading: z.string().max(200).optional(),
    newsletterDescription: z.string().max(1000).optional(),
    newsletterCtaLabel: z.string().max(120).optional(),
    newsletterCtaHref: z.string().max(2000).optional(),
    feedbackHeading: z.string().max(200).optional(),
    feedbackCtaLabel: z.string().max(120).optional(),
    feedbackCtaHref: z.string().max(2000).optional(),
    copyrightText: z.string().max(500).optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    socialLinks: z.array(footerSocialLinkSchema).optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

export const navigationContentIdParamsSchema = z.object({
  id: objectIdString,
});
