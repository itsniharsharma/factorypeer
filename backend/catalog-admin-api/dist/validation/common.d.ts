import { z } from "zod";
export declare const objectIdString: z.ZodString;
export declare const publishStatusSchema: z.ZodEnum<["draft", "published", "archived"]>;
export declare const catalogCategoryKindSchema: z.ZodEnum<["branch", "family"]>;
export declare const variantBindingRoleSchema: z.ZodEnum<["primary", "alternate"]>;
export declare const specColumnDataTypeSchema: z.ZodEnum<["string", "number", "boolean", "enum", "dimension"]>;
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
//# sourceMappingURL=common.d.ts.map