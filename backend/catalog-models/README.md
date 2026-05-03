# Factorypeer catalog — backend data architecture

This package defines **MongoDB/Mongoose** schemas and the **relationship model** for the catalog/admin system. It is designed to map cleanly to the existing frontend **`src/lib/catalog-service`** contracts (`getTaxonomyTree`, `getRouteContext`, `getSpecMatrix`, `getProductBySlug`, `searchCatalog`).

No HTTP APIs are defined here — only persistence shapes and recommended admin workflows.

**Audit:** every entity includes optional `createdBy` / `updatedBy` (ObjectId) and numeric `documentVersion` (bumped on writes from `catalog-admin-api`), in addition to default `createdAt` / `updatedAt` timestamps. `CatalogSpecSchema` also keeps a separate business **`version`** field for schema evolution.

---

## 1. Entity relationship overview

```
CatalogCategory (taxonomy node, unlimited depth)
  ├── parentId → CatalogCategory (adjacency list)
  ├── path / slugPath — materialized URL path ("machining/milling/...")
  └── type: branch | family

CatalogSpecSchema (attached to a family node)
  ├── taxonomyNodeId → CatalogCategory (family)
  ├── summary, status, version
  └── columns[] → CatalogSpecColumn (ordered)

CatalogSpecColumn (dynamic columns per family)
  ├── key — stable machine key (maps to matrix `values[key]`)
  ├── label, dataType, filterable, sortable, searchIndex
  └── sortOrder

CatalogSpecRow (matrix row / variant configuration row)
  ├── specSchemaId → CatalogSpecSchema
  ├── values: { [columnKey]: string }
  ├── variantBindings[] — one or more ProductVariant refs per row (primary + alternates)
  └── sortOrder, status

Product (sellable product “shell”)
  ├── slug (PDP), title, status
  └── defaultVariantId → ProductVariant

ProductVariant (SKU / purchasable record)
  ├── productId → Product
  ├── sku, itemNumber, mpn, pricing, availability
  ├── optional specRowId → CatalogSpecRow (when row drives this SKU)
  └── searchIndex fields for catalog search
```

**Why adjacency list + materialized `path`:** Supports unlimited nesting without duplicating whole subtrees in documents, and allows **O(1)-ish** route resolution by unique index on `path` (matches `/category/[...slug]`).

---

## 2. Mapping to frontend `catalog-service`

| Service function | Backend source |
|------------------|----------------|
| `getTaxonomyTree()` | Published `CatalogCategory` roots + recursive children (or pre-aggregated tree cache) |
| `getRouteContext(segments)` | Lookup by `path === segments.join('/')` |
| `getSpecMatrix({ nodeId, filters, sort, page })` | `CatalogSpecSchema` + `CatalogSpecColumn` + `CatalogSpecRow` + join `ProductVariant` / `Product` for display fields |
| `getProductBySlug(slug)` | `Product` + `ProductVariant` (+ optional spec row) |
| `searchCatalog(query)` | Text index on `Product` / `ProductVariant` (+ taxonomy tags) |

DTO mappers should live next to API handlers later (not in this package); shapes should mirror `CatalogTaxonomyNode`, `CatalogSpecMatrix`, `ProductDetailPageData`, `SearchCatalogProduct`.

---

## 3. Indexing & search (future-proofing)

Recommended indexes:

- `CatalogCategory`: unique `{ tenantId, path }`, `{ parentId, slug }`, `{ status, sortOrder }`
- `Product`: unique `{ slug }`, text index on `title`, `searchText`
- `ProductVariant`: unique `{ sku }`, unique sparse `{ itemNumber }` if applicable, text on `sku`, `itemNumber`, `mpn`
- `CatalogSpecRow`: `{ specSchemaId, sortOrder }`, optional compound for facet filters on `values`

Denormalize **`productCount`** on category nodes via async job on publish, or compute in read path for admin previews only.

---

## 4. Admin CRUD architecture (recommended)

### 4.1 Category Builder

- Create/edit **branch** nodes: `slug`, `title`, `description`, `parent`, `sortOrder`, `status`.
- Enforce **unique slug among siblings**; recompute **`path`** on save (and descendants if slug changes).
- Move subtree: update `path` for node + all descendants in one transaction or background job.

### 4.2 Spec Schema Builder (per family node)

- Attach **one active published** `CatalogSpecSchema` to a `family` node (optional draft).
- Define **columns**: key, label, type, filter/sort/search flags, order.
- Versioning: bump `version` on breaking column changes; keep old rows compatible or migrate.

### 4.3 Variant Table Builder

- CRUD **rows** under a schema: `values`, `sortOrder`, `variantBindings`.
- **Multiple variants per row:** ordered list `{ productVariantId, role, sortOrder }`; UI picks **primary** for matrix display (maps to current frontend single-row display).
- Validate `values` keys against column keys.

### 4.4 Product attachment flow

1. Create **Product** (slug, title, brand, status).
2. Create one or more **ProductVariant** (SKU, itemNumber, price, etc.).
3. Link variant to matrix: set `specRowId` on variant **and/or** append variant to `CatalogSpecRow.variantBindings`.
4. Publish: flip `status` on category/schema/row/product; rebuild search index.

---

## 5. Package usage

Install Mongoose in the service that will host API routes:

```bash
npm install mongoose
```

Import schemas from `./schemas` and register models once per process.

---

## 6. Files in this package

- `contracts.ts` — DTO shapes aligned with frontend (documentation + TS types).
- `schemas/*.ts` — Mongoose schema definitions.
- `enums.ts` — shared enumerations.
