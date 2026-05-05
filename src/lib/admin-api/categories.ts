import { adminFetchJson } from "./http";
import type { CategoryDoc } from "./types";

export type CreateCategoryBody = {
  parentId?: string | null;
  slug: string;
  title: string;
  description?: string;
  landingImage?: {
    url: string;
    publicId?: string;
    alt?: string;
    width?: number;
    height?: number;
    format?: string;
  };
  kind: "branch" | "family";
  status?: string;
  sortOrder?: number;
};

export type UpdateCategoryBody = Partial<{
  slug: string;
  title: string;
  description: string;
  landingImage:
    | {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
      }
    | null;
  kind: "branch" | "family";
  status: string;
  sortOrder: number;
}>;

export async function getCategoryTree(): Promise<CategoryDoc[]> {
  return adminFetchJson<CategoryDoc[]>("/categories/tree");
}

export async function getCategory(id: string): Promise<CategoryDoc> {
  return adminFetchJson<CategoryDoc>(`/categories/${id}`);
}

export async function listCategoryChildren(
  parentId: string | null,
  query?: { status?: string },
): Promise<CategoryDoc[]> {
  const qs = query?.status ? `?status=${encodeURIComponent(query.status)}` : "";
  if (parentId === null) {
    return adminFetchJson<CategoryDoc[]>(`/categories/root/children${qs}`);
  }
  return adminFetchJson<CategoryDoc[]>(`/categories/${parentId}/children${qs}`);
}

export async function createCategory(body: CreateCategoryBody): Promise<CategoryDoc> {
  return adminFetchJson<CategoryDoc>("/categories", { method: "POST", json: body });
}

export async function updateCategory(id: string, body: UpdateCategoryBody): Promise<CategoryDoc> {
  return adminFetchJson<CategoryDoc>(`/categories/${id}`, { method: "PATCH", json: body });
}

export async function moveCategory(id: string, newParentId: string | null): Promise<CategoryDoc | null> {
  return adminFetchJson<CategoryDoc | null>(`/categories/${id}/move`, {
    method: "POST",
    json: { newParentId },
  });
}

export async function reorderCategorySiblings(
  anchorCategoryId: string,
  orderedIds: string[],
): Promise<CategoryDoc[]> {
  return adminFetchJson<CategoryDoc[]>(`/categories/${anchorCategoryId}/reorder-siblings`, {
    method: "POST",
    json: { orderedIds },
  });
}

export async function setCategoryKind(id: string, kind: "branch" | "family"): Promise<CategoryDoc> {
  return adminFetchJson<CategoryDoc>(`/categories/${id}/kind`, { method: "PATCH", json: { kind } });
}

export async function attachActiveSpecSchema(
  categoryId: string,
  specSchemaId: string,
): Promise<CategoryDoc | null> {
  return adminFetchJson<CategoryDoc | null>(`/categories/${categoryId}/active-spec-schema`, {
    method: "PATCH",
    json: { specSchemaId },
  });
}

export async function deleteCategory(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/categories/${id}`, { method: "DELETE" });
}
