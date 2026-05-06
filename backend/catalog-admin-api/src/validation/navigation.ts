import { z } from "zod";
import { objectIdString, publishStatusSchema } from "./common.js";

const metadataSchema = z.record(z.unknown()).optional().default({});
const hrefSchema = z
  .string()
  .min(1)
  .max(2000)
  .refine((v) => /^(https?:\/\/|mailto:|tel:|\/)/i.test(v), {
    message: "URL must start with /, http(s)://, mailto:, or tel:",
  });

export const linkGroupPlacementSchema = z.enum(["utility", "navigation", "footer"]);

const linkItemSchema = z.object({
  label: z.string().min(1).max(200),
  href: hrefSchema,
  description: z.string().max(500).optional(),
  icon: z.string().max(120).optional(),
  external: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  status: publishStatusSchema.optional(),
  metadata: metadataSchema,
});

const footerLinkSchema = z.object({
  label: z.string().min(1).max(200),
  href: hrefSchema,
  external: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const footerColumnSchema = z.object({
  title: z.string().min(1).max(300),
  sortOrder: z.number().int().optional(),
  links: z.array(footerLinkSchema).optional().default([]),
});

const footerSocialLinkSchema = z.object({
  label: z.string().min(1).max(200),
  href: hrefSchema,
  icon: z.string().max(120).optional(),
  openInNewTab: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const footerCtaBlockSchema = z.object({
  title: z.string().max(200).optional(),
  body: z.string().max(3000).optional(),
  ctaLabel: z.string().max(120).optional(),
  ctaHref: hrefSchema.optional(),
  ctaExternal: z.boolean().optional(),
  ctaOpenInNewTab: z.boolean().optional(),
});

const newsletterBlockSchema = z.object({
  title: z.string().max(200).optional(),
  body: z.string().max(3000).optional(),
  inputPlaceholder: z.string().max(200).optional(),
  buttonLabel: z.string().max(120).optional(),
  submitHref: hrefSchema.optional(),
  submitExternal: z.boolean().optional(),
  submitOpenInNewTab: z.boolean().optional(),
});

const appDownloadLinkSchema = z.object({
  label: z.string().max(120).optional(),
  href: hrefSchema.optional(),
  imageUrl: z.string().url().max(2000).optional(),
  openInNewTab: z.boolean().optional(),
});

const appDownloadBlockSchema = z.object({
  title: z.string().max(200).optional(),
  subtitle: z.string().max(1000).optional(),
  appStore: appDownloadLinkSchema.optional().default({}),
  googlePlay: appDownloadLinkSchema.optional().default({}),
});

const connectBlockSchema = z.object({
  heading: z.string().max(200).optional(),
  phoneSubtitle: z.string().max(300).optional(),
  feedbackCtaLabel: z.string().max(120).optional(),
  feedbackCtaHref: hrefSchema.optional(),
  feedbackCtaExternal: z.boolean().optional(),
  feedbackCtaOpenInNewTab: z.boolean().optional(),
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
  preFooterHeading: z.string().max(300).optional(),
  preFooterBody: z.string().max(10000).optional(),
  columns: z.array(footerColumnSchema).optional().default([]),
  newsletter: newsletterBlockSchema.optional().default({}),
  appDownloads: appDownloadBlockSchema.optional().default({}),
  connect: connectBlockSchema.optional().default({}),
  contact: footerCtaBlockSchema.optional().default({}),
  copyrightText: z.string().max(500).optional(),
  status: publishStatusSchema.optional(),
  sortOrder: z.number().int().optional(),
  socialLinks: z.array(footerSocialLinkSchema).optional().default([]),
  legalLinks: z.array(footerLinkSchema).optional().default([]),
  metadata: metadataSchema,
};

export const footerContentListQuerySchema = z.object({
  status: publishStatusSchema.optional(),
});

export const createFooterContentBodySchema = z.object(footerContentBaseSchema);
export const updateFooterContentBodySchema = z
  .object({
    slug: z.string().min(1).max(200).optional(),
    preFooterHeading: z.string().max(300).optional(),
    preFooterBody: z.string().max(10000).optional(),
    columns: z.array(footerColumnSchema).optional(),
    newsletter: newsletterBlockSchema.optional(),
    appDownloads: appDownloadBlockSchema.optional(),
    connect: connectBlockSchema.optional(),
    contact: footerCtaBlockSchema.optional(),
    copyrightText: z.string().max(500).optional(),
    status: publishStatusSchema.optional(),
    sortOrder: z.number().int().optional(),
    socialLinks: z.array(footerSocialLinkSchema).optional(),
    legalLinks: z.array(footerLinkSchema).optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

export const navigationContentIdParamsSchema = z.object({
  id: objectIdString,
});
