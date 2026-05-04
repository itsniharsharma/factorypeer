import type { SpecColumnDoc, SpecRowDoc } from "@/lib/admin-api/types";
import type { CatalogSpecColumn, CatalogSpecMatrix, CatalogSpecRow, SpecRow } from "@/lib/types";
import { catalogServerJson, catalogServerJsonList } from "./fetch";

export interface GetSpecMatrixParams {
  nodeId: string;
  filters?: Record<string, string[]>;
  sort?: string;
  page?: number;
}

export const DEFAULT_MATRIX_PAGE_SIZE = 50;

/** PDP / SKU scan: read published rows in chunks (Mongo + API limit aligned). */
const FULL_MATRIX_ROW_CHUNK = 2000;

type VariantWithProduct = {
  variant: {
    _id: string;
    sku: string;
    itemNumber?: string;
    unitPrice?: string;
    availability?: string;
    currency?: string;
    uom?: string;
  };
  product: {
    _id: string;
    slug: string;
    title: string;
  };
};

/** Backend caps variant-bundles query at 500 ids; chunk to support very large families. */
const VARIANT_BUNDLE_CHUNK = 500;

async function variantBundlesMapByIds(
  variantIds: string[],
  categoryId: string,
): Promise<Map<string, VariantWithProduct>> {
  const unique = [...new Set(variantIds.filter(Boolean))];
  const map = new Map<string, VariantWithProduct>();
  if (!unique.length) return map;

  const fetchInit = {
    next: {
      revalidate: 60,
      tags: ["catalog", "variant-bundles", `spec-matrix-${categoryId}`] as string[],
    },
  };

  for (let i = 0; i < unique.length; i += VARIANT_BUNDLE_CHUNK) {
    const chunk = unique.slice(i, i + VARIANT_BUNDLE_CHUNK);
    const bundles = await catalogServerJson<VariantWithProduct[]>(
      `/products/variant-bundles?ids=${chunk.join(",")}`,
      fetchInit,
    );
    const list = Array.isArray(bundles) ? bundles : [];
    for (const b of list) {
      const id = String(b.variant._id);
      map.set(id, b);
    }
  }
  return map;
}

function primaryBindingId(row: SpecRowDoc): string | undefined {
  const bs = row.variantBindings ?? [];
  if (bs.length === 0) return undefined;
  const primary = bs.find((b) => b.role === "primary");
  const pick = primary ?? bs[0];
  const vid = pick?.productVariantId;
  return vid != null ? String(vid) : undefined;
}

function normalizeRowsPublished(rows: SpecRowDoc[]): SpecRowDoc[] {
  return rows
    .filter((r) => r.status === "published")
    .sort((a, b) => {
      const d = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      return d !== 0 ? d : String(a._id).localeCompare(String(b._id));
    });
}

function mapColumns(columns: SpecColumnDoc[]): CatalogSpecColumn[] {
  return columns
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((c) => ({
      id: c.key,
      label: c.label,
      widthClass: c.widthClass,
    }));
}

function assembleMatrixRows(
  rowsPublished: SpecRowDoc[],
  catalogColumns: CatalogSpecColumn[],
  variantById: Map<string, VariantWithProduct>,
): CatalogSpecRow[] {
  const matrixRows: CatalogSpecRow[] = [];

  for (const row of rowsPublished) {
    const vid = primaryBindingId(row);
    let productSlug = "";
    let productTitle = "";
    let sku = "";
    let itemNumber = "";
    let unitPrice = "—";
    let availability = "—";

    if (vid) {
      const bundle = variantById.get(vid);
      if (bundle) {
        productSlug = bundle.product.slug;
        productTitle = bundle.product.title;
        sku = bundle.variant.sku;
        itemNumber = bundle.variant.itemNumber ?? "";
        const up = bundle.variant.unitPrice;
        const cur = bundle.variant.currency;
        unitPrice = up ? (cur ? `${up} ${cur}` : up) : "—";
        availability = bundle.variant.availability ?? "—";
      }
    }

    const values: Record<string, string> = {};
    for (const col of catalogColumns) {
      values[col.id] = row.values[col.id] ?? "—";
    }

    matrixRows.push({
      id: row._id,
      values,
      productSlug: productSlug || "—",
      productTitle: productTitle || row.externalKey || "Product",
      sku: sku || "—",
      itemNumber: itemNumber || "—",
      unitPrice,
      availability,
    });
  }

  return matrixRows;
}

type SchemaMeta = {
  schemaId: string;
  familySummary: string;
  catalogColumns: CatalogSpecColumn[];
};

async function loadPublishedSchemaAndColumns(categoryId: string): Promise<SchemaMeta | undefined> {
  const schema = await catalogServerJson<
    { _id: string; familySummary?: string; status: string } | null
  >(`/taxonomy/${categoryId}/spec-schema`);

  if (!schema || schema.status !== "published") return undefined;

  const columns = await catalogServerJson<SpecColumnDoc[]>(`/spec-schemas/${schema._id}/columns`);

  return {
    schemaId: schema._id,
    familySummary: schema.familySummary ?? "Configured variants for this family.",
    catalogColumns: mapColumns(columns),
  };
}

/**
 * One page of the family spec matrix — DB paginates rows; only visible bindings are batch-resolved.
 */
export async function buildSpecMatrixPage(
  categoryId: string,
  page: number,
  pageSize: number,
): Promise<CatalogSpecMatrix | undefined> {
  const meta = await loadPublishedSchemaAndColumns(categoryId);
  if (!meta) return undefined;

  let pageIndex = Math.max(0, Math.floor(page));
  const size = Math.max(1, pageSize);
  let skip = pageIndex * size;

  const rowsPath = (s: number, lim: number) =>
    `/spec-schemas/${meta.schemaId}/rows?status=published&skip=${s}&limit=${lim}`;

  let rowsRes = await catalogServerJsonList<SpecRowDoc[]>(rowsPath(skip, size), {
    next: { revalidate: 60, tags: ["catalog", `spec-rows-${meta.schemaId}`] as string[] },
  });

  const totalPublished = rowsRes.total ?? 0;
  if (totalPublished > 0) {
    const maxPage = Math.max(0, Math.ceil(totalPublished / size) - 1);
    if (pageIndex > maxPage) {
      pageIndex = maxPage;
      skip = pageIndex * size;
      rowsRes = await catalogServerJsonList<SpecRowDoc[]>(rowsPath(skip, size), {
        next: { revalidate: 60, tags: ["catalog", `spec-rows-${meta.schemaId}`] as string[] },
      });
    }
  }

  const rowsPublished = normalizeRowsPublished(rowsRes.data);

  const bindingIds: string[] = [];
  for (const row of rowsPublished) {
    const vid = primaryBindingId(row);
    if (vid) bindingIds.push(vid);
  }
  const variantById = await variantBundlesMapByIds(bindingIds, categoryId);
  const matrixRows = assembleMatrixRows(rowsPublished, meta.catalogColumns, variantById);

  return {
    familySummary: meta.familySummary,
    columns: meta.catalogColumns,
    rows: matrixRows,
    totalRowCount: totalPublished,
    matrixPage: pageIndex,
    matrixPageSize: size,
  };
}

/**
 * Full published matrix for PDP SKU lookup — loads all row docs in chunks, **one batched** variant resolve.
 */
export async function buildSpecMatrixForCategory(categoryId: string): Promise<CatalogSpecMatrix | undefined> {
  const meta = await loadPublishedSchemaAndColumns(categoryId);
  if (!meta) return undefined;

  const allRows: SpecRowDoc[] = [];
  let totalPublished = 0;
  let skip = 0;

  while (true) {
    const rowsRes = await catalogServerJsonList<SpecRowDoc[]>(
      `/spec-schemas/${meta.schemaId}/rows?status=published&skip=${skip}&limit=${FULL_MATRIX_ROW_CHUNK}`,
      {
        next: { revalidate: 60, tags: ["catalog", `spec-rows-${meta.schemaId}`] as string[] },
      },
    );

    const batch = normalizeRowsPublished(rowsRes.data);
    totalPublished = rowsRes.total ?? totalPublished;
    allRows.push(...batch);

    if (batch.length < FULL_MATRIX_ROW_CHUNK) break;
    if (totalPublished > 0 && allRows.length >= totalPublished) break;
    skip += FULL_MATRIX_ROW_CHUNK;
  }

  const bindingIds: string[] = [];
  for (const row of allRows) {
    const vid = primaryBindingId(row);
    if (vid) bindingIds.push(vid);
  }
  const variantById = await variantBundlesMapByIds(bindingIds, categoryId);
  const matrixRows = assembleMatrixRows(allRows, meta.catalogColumns, variantById);

  return {
    familySummary: meta.familySummary,
    columns: meta.catalogColumns,
    rows: matrixRows,
    totalRowCount: totalPublished || allRows.length,
  };
}

export async function getSpecMatrix(params: GetSpecMatrixParams): Promise<CatalogSpecMatrix | undefined> {
  const page = params.page ?? 0;
  return buildSpecMatrixPage(params.nodeId, page, DEFAULT_MATRIX_PAGE_SIZE);
}

/** When row has no bindings, accept linked variant.specRowId (legacy rows). */
function rowBindsVariant(row: SpecRowDoc, variantId: string): boolean {
  const bs = row.variantBindings ?? [];
  if (bs.length === 0) return true;
  return bs.some((b) => String(b.productVariantId) === String(variantId));
}

/**
 * PDP fast path: load one published spec row + schema columns (no full family matrix).
 * Returns null when linkage is missing, invalid, or unpublished — caller falls back to matrix scan by SKU.
 */
export async function specRowsForLinkedVariant(
  primary: { _id: string; sku: string; specRowId?: string | null },
  categoryIds: string[] | undefined,
): Promise<SpecRow[] | null> {
  const specRowId = primary.specRowId?.trim();
  if (!specRowId) return null;

  let row: SpecRowDoc;
  try {
    row = await catalogServerJson<SpecRowDoc>(`/spec-rows/${specRowId}`, {
      next: { revalidate: 60, tags: ["catalog", "pdp-spec", `spec-row-${specRowId}`] as string[] },
    });
  } catch {
    return null;
  }

  if (row.status !== "published") return null;

  const taxId = row.taxonomyNodeId != null ? String(row.taxonomyNodeId) : "";
  if (categoryIds?.length && taxId && !categoryIds.includes(taxId)) return null;

  if (!rowBindsVariant(row, primary._id)) return null;

  const schemaId = row.specSchemaId;
  const columns = await catalogServerJson<SpecColumnDoc[]>(`/spec-schemas/${schemaId}/columns`, {
    next: { revalidate: 60, tags: ["catalog", "pdp-spec", `spec-schema-${schemaId}`] as string[] },
  });

  const sorted = [...columns].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return sorted.map((c) => ({
    label: c.label,
    value: row.values[c.key] ?? "—",
  }));
}
