import { z } from "zod";
import { objectIdString, publishStatusSchema } from "./common.js";

const maxList = (n: number) => z.array(objectIdString).max(n).optional();

const productMediaItemSchema = z.object({
  url: z.string().min(1).max(2000),
  alt: z.string().max(500).optional(),
  sortOrder: z.number().int().optional(),
});

const productAttachmentSchema = z.object({
  title: z.string().min(1).max(500),
  url: z.string().min(1).max(2000),
  docType: z.enum(["manual", "datasheet", "sds", "certification", "drawing", "other"]).optional(),
  sortOrder: z.number().int().optional(),
});

export const createProductBodySchema = z.object({
  slug: z.string().min(1).max(300).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i),
  title: z.string().min(1).max(500),
  brand: z.string().max(200).optional(),
  status: publishStatusSchema.optional(),
  categoryIds: z.array(objectIdString).optional(),
  searchText: z.string().max(10000).optional(),
  sortOrder: z.number().int().optional(),
  media: z.array(productMediaItemSchema).max(24).optional(),
  longDescription: z.string().max(50000).optional(),
  features: z.array(z.string().max(500)).max(80).optional(),
  applications: z.array(z.string().max(500)).max(80).optional(),
  marketingBullets: z.array(z.string().max(300)).max(40).optional(),
  attachments: z.array(productAttachmentSchema).max(40).optional(),
  relatedProductIds: maxList(48),
  compatibleProductIds: maxList(48),
  recommendedProductIds: maxList(48),
});

export const updateProductBodySchema = z
  .object({
    slug: z.string().min(1).max(300).optional(),
    title: z.string().min(1).max(500).optional(),
    brand: z.string().max(200).optional().nullable(),
    status: publishStatusSchema.optional(),
    categoryIds: z.array(objectIdString).optional(),
    searchText: z.string().max(10000).optional(),
    sortOrder: z.number().int().optional(),
    defaultVariantId: objectIdString.optional().nullable(),
    media: z.array(productMediaItemSchema).max(24).optional(),
    longDescription: z.string().max(50000).optional().nullable(),
    features: z.array(z.string().max(500)).max(80).optional(),
    applications: z.array(z.string().max(500)).max(80).optional(),
    marketingBullets: z.array(z.string().max(300)).max(40).optional(),
    attachments: z.array(productAttachmentSchema).max(40).optional(),
    relatedProductIds: maxList(48),
    compatibleProductIds: maxList(48),
    recommendedProductIds: maxList(48),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

export const createVariantBodySchema = z.object({
  sku: z.string().min(1).max(120),
  itemNumber: z.string().max(120).optional(),
  mpn: z.string().max(120).optional(),
  manufacturer: z.string().max(200).optional(),
  unitPrice: z.string().max(50).optional(),
  currency: z.string().max(10).optional(),
  availability: z.string().max(200).optional(),
  uom: z.string().max(50).optional(),
  leadTime: z.string().max(500).optional(),
  moq: z.number().int().min(1).max(1_000_000).optional().nullable(),
  packaging: z.string().max(200).optional(),
  status: publishStatusSchema.optional(),
  specRowId: objectIdString.optional().nullable(),
  searchBlob: z.string().max(5000).optional(),
  sortOrder: z.number().int().optional(),
});

export const updateVariantBodySchema = z
  .object({
    sku: z.string().min(1).max(120).optional(),
    itemNumber: z.string().max(120).optional().nullable(),
    mpn: z.string().max(120).optional().nullable(),
    manufacturer: z.string().max(200).optional().nullable(),
    unitPrice: z.string().max(50).optional(),
    currency: z.string().max(10).optional(),
    availability: z.string().max(200).optional(),
    uom: z.string().max(50).optional().nullable(),
    leadTime: z.string().max(500).optional().nullable(),
    moq: z.number().int().min(1).max(1_000_000).optional().nullable(),
    packaging: z.string().max(200).optional().nullable(),
    status: publishStatusSchema.optional(),
    specRowId: objectIdString.optional().nullable(),
    searchBlob: z.string().max(5000).optional(),
    sortOrder: z.number().int().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "At least one field required" });

export const linkVariantToRowBodySchema = z.object({
  specRowId: objectIdString,
  /** When true (default), append binding on row and set variant.specRowId */
  syncBindings: z.boolean().optional().default(true),
  bindingRole: z.enum(["primary", "alternate"]).optional().default("primary"),
});

export const productIdParamsSchema = z.object({
  id: objectIdString,
});

export const variantIdParamsSchema = z.object({
  id: objectIdString,
});
