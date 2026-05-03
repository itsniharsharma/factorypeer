import { adminFetchJson, adminFetchJsonList } from "./http";
import type { SpecColumnDoc, SpecRowDoc, SpecSchemaDoc } from "./types";

export async function getSchemaForCategory(categoryId: string): Promise<SpecSchemaDoc | null> {
  return adminFetchJson<SpecSchemaDoc | null>(`/taxonomy/${categoryId}/spec-schema`);
}

export async function createSpecSchema(
  categoryId: string,
  body: { familySummary?: string; status?: string },
): Promise<SpecSchemaDoc> {
  return adminFetchJson<SpecSchemaDoc>(`/taxonomy/${categoryId}/spec-schema`, {
    method: "POST",
    json: body,
  });
}

export async function updateSpecSchema(
  id: string,
  body: { familySummary?: string; status?: string },
): Promise<SpecSchemaDoc> {
  return adminFetchJson<SpecSchemaDoc>(`/spec-schemas/${id}`, { method: "PATCH", json: body });
}

export async function publishSpecSchema(id: string): Promise<SpecSchemaDoc> {
  return adminFetchJson<SpecSchemaDoc>(`/spec-schemas/${id}/publish`, { method: "POST" });
}

export async function listSpecColumns(schemaId: string): Promise<SpecColumnDoc[]> {
  return adminFetchJson<SpecColumnDoc[]>(`/spec-schemas/${schemaId}/columns`);
}

export async function addSpecColumn(
  schemaId: string,
  body: Record<string, unknown>,
): Promise<SpecColumnDoc> {
  return adminFetchJson<SpecColumnDoc>(`/spec-schemas/${schemaId}/columns`, {
    method: "POST",
    json: body,
  });
}

export async function updateSpecColumn(id: string, body: Record<string, unknown>): Promise<SpecColumnDoc> {
  return adminFetchJson<SpecColumnDoc>(`/spec-columns/${id}`, { method: "PATCH", json: body });
}

export async function deleteSpecColumn(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/spec-columns/${id}`, { method: "DELETE" });
}

export async function listSpecRows(
  schemaId: string,
  query?: { skip?: number; limit?: number; status?: string },
): Promise<{ rows: SpecRowDoc[]; total?: number }> {
  const sp = new URLSearchParams();
  if (query?.skip != null) sp.set("skip", String(query.skip));
  if (query?.limit != null) sp.set("limit", String(query.limit));
  if (query?.status) sp.set("status", query.status);
  const qs = sp.toString() ? `?${sp.toString()}` : "";
  const { data, total } = await adminFetchJsonList<SpecRowDoc[]>(
    `/spec-schemas/${schemaId}/rows${qs}`,
  );
  return { rows: data, total };
}

export async function createSpecRow(
  schemaId: string,
  body: Record<string, unknown>,
): Promise<SpecRowDoc> {
  return adminFetchJson<SpecRowDoc>(`/spec-schemas/${schemaId}/rows`, { method: "POST", json: body });
}

export async function updateSpecRow(id: string, body: Record<string, unknown>): Promise<SpecRowDoc | null> {
  return adminFetchJson<SpecRowDoc | null>(`/spec-rows/${id}`, { method: "PATCH", json: body });
}

export async function setSpecRowBindings(
  id: string,
  bindings: Array<{ productVariantId: string; role?: string; sortOrder?: number }>,
): Promise<SpecRowDoc | null> {
  return adminFetchJson<SpecRowDoc | null>(`/spec-rows/${id}/bindings`, {
    method: "POST",
    json: { bindings },
  });
}

export async function deleteSpecRow(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/spec-rows/${id}`, { method: "DELETE" });
}

export async function reorderSpecRows(schemaId: string, orderedIds: string[]): Promise<SpecRowDoc[]> {
  return adminFetchJson<SpecRowDoc[]>(`/spec-schemas/${schemaId}/rows/reorder`, {
    method: "POST",
    json: { orderedIds },
  });
}
