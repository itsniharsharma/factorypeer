import { AppError, ConflictError, NotFoundError } from "./app-error.js";
/** Stable machine codes for clients; pair with HTTP status via AppError.statusCode. */
export const CatalogErrorCodes = {
    NOT_FOUND: "NOT_FOUND",
    CONFLICT: "CONFLICT",
    DUPLICATE_SLUG: "DUPLICATE_SLUG",
    DUPLICATE_SKU: "DUPLICATE_SKU",
    DUPLICATE_KEY: "DUPLICATE_KEY",
    INVALID_MOVE: "INVALID_MOVE",
    INVALID_REORDER: "INVALID_REORDER",
    NOT_FAMILY: "NOT_FAMILY",
    SPEC_MISMATCH: "SPEC_MISMATCH",
    HAS_CHILDREN: "HAS_CHILDREN",
    HAS_VARIANTS: "HAS_VARIANTS",
    VALIDATION_ERROR: "VALIDATION_ERROR",
};
export function resourceNotFound(resource, id) {
    return new NotFoundError(resource, id);
}
export function slugTaken(slug, context = "category") {
    return new ConflictError(`The ${context} slug "${slug}" is already used at this level in the taxonomy. Choose a different slug.`, CatalogErrorCodes.CONFLICT);
}
export function pathTaken(path) {
    return new ConflictError(`The URL path "${path}" is already assigned to another category. Slugs must remain unique within the tree.`, CatalogErrorCodes.CONFLICT);
}
export function productSlugTaken(slug) {
    return new AppError(`A product with slug "${slug}" already exists. Product slugs must be globally unique.`, 409, CatalogErrorCodes.DUPLICATE_SLUG);
}
export function skuTaken(sku) {
    return new AppError(`SKU "${sku}" is already in use. Each variant SKU must be unique.`, 409, CatalogErrorCodes.DUPLICATE_SKU);
}
export function cannotMoveUnderDescendant() {
    return new AppError("A category cannot be moved under one of its own descendants (that would create a cycle).", 400, CatalogErrorCodes.INVALID_MOVE);
}
export function cannotMoveUnderSelf() {
    return new AppError("A category cannot be its own parent.", 400, CatalogErrorCodes.INVALID_MOVE);
}
export function reorderMismatch() {
    return new AppError("Reorder failed: the orderedIds list must include every sibling under the same parent exactly once, with no extras.", 400, CatalogErrorCodes.INVALID_REORDER);
}
export function familyRequiredForSpec() {
    return new AppError("Spec schemas can only be attached to categories marked as family (leaf) nodes.", 400, CatalogErrorCodes.NOT_FAMILY);
}
export function specSchemaWrongCategory() {
    return new AppError("This spec schema belongs to a different category. Create or select the schema for this family node only.", 400, CatalogErrorCodes.SPEC_MISMATCH);
}
export function categoryHasChildren() {
    return new AppError("Delete or move child categories first before removing this node.", 400, CatalogErrorCodes.HAS_CHILDREN);
}
export function productHasVariants() {
    return new AppError("Remove all product variants before deleting the product record.", 400, CatalogErrorCodes.HAS_VARIANTS);
}
export function variantPublishRequiresSpecRow() {
    return new AppError("Publishing requires a spec matrix link for this product's family: set variant.specRowId, use Link to row, or add this variant as a binding on a published spec row.", 422, CatalogErrorCodes.VALIDATION_ERROR);
}
export function publishedSpecRowRequiresBindings() {
    return new AppError("A published spec matrix row must list at least one variant binding.", 422, CatalogErrorCodes.VALIDATION_ERROR);
}
export function specRowNotLinkedToProductFamily() {
    return new AppError("That spec row is not on a published family schema for a category this product is assigned to.", 422, CatalogErrorCodes.SPEC_MISMATCH);
}
