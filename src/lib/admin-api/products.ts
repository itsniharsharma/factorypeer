import { adminFetchJson, adminFetchJsonList } from "./http";
import type { ProductDoc, ProductVariantDoc } from "./types";

export type ProductListQuery = {
  skip?: number;
  limit?: number;
  status?: string;
  q?: string;
  sort?: "title" | "-title" | "updatedAt" | "-updatedAt" | "sortOrder";
  /** Filter to products tagged with this catalog category */
  categoryId?: string;
};

export async function listProducts(query?: ProductListQuery): Promise<{ products: ProductDoc[]; total?: number }> {
  const sp = new URLSearchParams();
  if (query?.skip != null) sp.set("skip", String(query.skip));
  if (query?.limit != null) sp.set("limit", String(query.limit));
  if (query?.status) sp.set("status", query.status);
  if (query?.q) sp.set("q", query.q);
  if (query?.sort) sp.set("sort", query.sort);
  if (query?.categoryId) sp.set("categoryId", query.categoryId);
  const qs = sp.toString() ? `?${sp.toString()}` : "";
  const { data, total } = await adminFetchJsonList<ProductDoc[]>(`/products${qs}`);
  return { products: data, total };
}

export async function getProduct(id: string): Promise<ProductDoc> {
  return adminFetchJson<ProductDoc>(`/products/${id}`);
}

export async function createProduct(body: Record<string, unknown>): Promise<ProductDoc> {
  return adminFetchJson<ProductDoc>("/products", { method: "POST", json: body });
}

export async function updateProduct(id: string, body: Record<string, unknown>): Promise<ProductDoc> {
  return adminFetchJson<ProductDoc>(`/products/${id}`, { method: "PATCH", json: body });
}

export async function deleteProduct(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/products/${id}`, { method: "DELETE" });
}

export type VariantListQuery = {
  skip?: number;
  limit?: number;
  status?: string;
  q?: string;
};

export async function listVariants(
  productId: string,
  query?: VariantListQuery,
): Promise<{ variants: ProductVariantDoc[]; total?: number }> {
  const sp = new URLSearchParams();
  if (query?.skip != null) sp.set("skip", String(query.skip));
  if (query?.limit != null) sp.set("limit", String(query.limit));
  if (query?.status) sp.set("status", query.status);
  if (query?.q) sp.set("q", query.q);
  const qs = sp.toString() ? `?${sp.toString()}` : "";
  const { data, total } = await adminFetchJsonList<ProductVariantDoc[]>(
    `/products/${productId}/variants${qs}`,
  );
  return { variants: data, total };
}

export async function createVariant(productId: string, body: Record<string, unknown>): Promise<ProductVariantDoc> {
  return adminFetchJson<ProductVariantDoc>(`/products/${productId}/variants`, {
    method: "POST",
    json: body,
  });
}

export async function updateVariant(id: string, body: Record<string, unknown>): Promise<ProductVariantDoc> {
  return adminFetchJson<ProductVariantDoc>(`/products/variants/${id}`, { method: "PATCH", json: body });
}

export async function deleteVariant(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/products/variants/${id}`, { method: "DELETE" });
}

export async function linkVariantToRow(
  variantId: string,
  body: { specRowId: string; syncBindings?: boolean; bindingRole?: "primary" | "alternate" },
): Promise<ProductVariantDoc | null> {
  return adminFetchJson<ProductVariantDoc | null>(`/products/variants/${variantId}/link-row`, {
    method: "POST",
    json: body,
  });
}
