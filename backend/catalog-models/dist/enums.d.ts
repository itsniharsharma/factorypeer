/** Publish state for taxonomy, spec entities, and products. */
export type PublishStatus = "draft" | "published" | "archived";
/** Category node kind: branch navigates; family holds spec matrix + SKUs. */
export type CatalogCategoryKind = "branch" | "family";
/** Role when multiple variants attach to one matrix row. */
export type VariantBindingRole = "primary" | "alternate";
/** Column value semantics for validation and future facets. */
export type SpecColumnDataType = "string" | "number" | "boolean" | "enum" | "dimension";
//# sourceMappingURL=enums.d.ts.map