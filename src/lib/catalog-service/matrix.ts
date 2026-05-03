import type { SpecColumnDoc, SpecRowDoc } from "@/lib/admin-api/types";
import type { CatalogSpecColumn, CatalogSpecMatrix, CatalogSpecRow } from "@/lib/types";
import { catalogServerJson, catalogServerJsonList } from "./fetch";

export interface GetSpecMatrixParams {
  nodeId: string;
  filters?: Record<string, string[]>;
  sort?: string;
  page?: number;
}

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

function primaryBindingId(row: SpecRowDoc): string | undefined {
  const bs = row.variantBindings ?? [];
  if (bs.length === 0) return undefined;
  const primary = bs.find((b) => b.role === "primary");
  const pick = primary ?? bs[0];
  const vid = pick?.productVariantId;
  return vid != null ? String(vid) : undefined;
}

/** Full matrix for a family category (published schema + published rows). */
export async function buildSpecMatrixForCategory(categoryId: string): Promise<CatalogSpecMatrix | undefined> {
  const schema = await catalogServerJson<
    { _id: string; familySummary?: string; status: string } | null
  >(`/taxonomy/${categoryId}/spec-schema`);

  if (!schema || schema.status !== "published") return undefined;

  const schemaId = schema._id;
  const [columns, rowsRes] = await Promise.all([
    catalogServerJson<SpecColumnDoc[]>(`/spec-schemas/${schemaId}/columns`),
    catalogServerJsonList<SpecRowDoc[]>(`/spec-schemas/${schemaId}/rows?status=published`),
  ]);

  const rowsPublished = rowsRes.data.filter((r) => r.status === "published");

  const catalogColumns: CatalogSpecColumn[] = columns
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((c) => ({
      id: c.key,
      label: c.label,
      widthClass: c.widthClass,
    }));

  const variantCache = new Map<string, VariantWithProduct | undefined>();

  async function resolveVariant(id: string): Promise<VariantWithProduct | undefined> {
    if (variantCache.has(id)) return variantCache.get(id);
    try {
      const bundle = await catalogServerJson<VariantWithProduct>(`/products/variants/${id}`, {
        next: { revalidate: 60, tags: ["catalog", `variant-${id}`] },
      });
      variantCache.set(id, bundle);
      return bundle;
    } catch {
      variantCache.set(id, undefined);
      return undefined;
    }
  }

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
      const bundle = await resolveVariant(vid);
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

  return {
    familySummary: schema.familySummary ?? "Configured variants for this family.",
    columns: catalogColumns,
    rows: matrixRows,
  };
}

export async function getSpecMatrix(params: GetSpecMatrixParams): Promise<CatalogSpecMatrix | undefined> {
  const full = await buildSpecMatrixForCategory(params.nodeId);
  if (!full) return undefined;

  let { rows } = full;
  const page = params.page ?? 0;
  const pageSize = 50;
  const start = page * pageSize;
  rows = rows.slice(start, start + pageSize);

  return {
    ...full,
    rows,
  };
}
