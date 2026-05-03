import { z } from "zod";
export declare function parseBody<T>(schema: z.ZodSchema<T>, body: unknown): T;
export declare function parseParams<T>(schema: z.ZodSchema<T>, params: Record<string, string | undefined>): T;
export declare function parseQuery<T>(schema: z.ZodSchema<T>, query: Record<string, string | string[] | undefined>): T;
//# sourceMappingURL=helpers.d.ts.map