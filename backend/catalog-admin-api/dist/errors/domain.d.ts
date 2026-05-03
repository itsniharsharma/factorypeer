import { AppError, ConflictError, NotFoundError } from "./app-error.js";
/** Stable machine codes for clients; pair with HTTP status via AppError.statusCode. */
export declare const CatalogErrorCodes: {
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONFLICT: "CONFLICT";
    readonly DUPLICATE_SLUG: "DUPLICATE_SLUG";
    readonly DUPLICATE_SKU: "DUPLICATE_SKU";
    readonly DUPLICATE_KEY: "DUPLICATE_KEY";
    readonly INVALID_MOVE: "INVALID_MOVE";
    readonly INVALID_REORDER: "INVALID_REORDER";
    readonly NOT_FAMILY: "NOT_FAMILY";
    readonly SPEC_MISMATCH: "SPEC_MISMATCH";
    readonly HAS_CHILDREN: "HAS_CHILDREN";
    readonly HAS_VARIANTS: "HAS_VARIANTS";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
};
export declare function resourceNotFound(resource: string, id?: string): NotFoundError;
export declare function slugTaken(slug: string, context?: string): ConflictError;
export declare function pathTaken(path: string): ConflictError;
export declare function productSlugTaken(slug: string): AppError;
export declare function skuTaken(sku: string): AppError;
export declare function cannotMoveUnderDescendant(): AppError;
export declare function cannotMoveUnderSelf(): AppError;
export declare function reorderMismatch(): AppError;
export declare function familyRequiredForSpec(): AppError;
export declare function specSchemaWrongCategory(): AppError;
export declare function categoryHasChildren(): AppError;
export declare function productHasVariants(): AppError;
//# sourceMappingURL=domain.d.ts.map