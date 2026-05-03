import { z } from "zod";
export declare const objectIdString: z.ZodString;
export declare const publishStatusSchema: z.ZodEnum<["draft", "published", "archived"]>;
export declare const catalogCategoryKindSchema: z.ZodEnum<["branch", "family"]>;
export declare const variantBindingRoleSchema: z.ZodEnum<["primary", "alternate"]>;
export declare const specColumnDataTypeSchema: z.ZodEnum<["string", "number", "boolean", "enum", "dimension"]>;
//# sourceMappingURL=common.d.ts.map