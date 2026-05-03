import { adminFetchJson, adminFetchJsonList } from "./http";
import type {
  HomepageCategoryTileDoc,
  HomepagePromoBannerDoc,
  HomepageSupportCardDoc,
  PublishStatus,
} from "./types";

type ListQuery = { status?: PublishStatus };

function statusQs(query?: ListQuery): string {
  if (!query?.status) return "";
  return `?status=${encodeURIComponent(query.status)}`;
}

export async function listHomepagePromoBanners(
  query?: ListQuery,
): Promise<{ items: HomepagePromoBannerDoc[]; total?: number }> {
  const { data, total } = await adminFetchJsonList<HomepagePromoBannerDoc[]>(
    `/homepage/banners${statusQs(query)}`,
  );
  return { items: data, total };
}

export async function createHomepagePromoBanner(
  body: Record<string, unknown>,
): Promise<HomepagePromoBannerDoc> {
  return adminFetchJson<HomepagePromoBannerDoc>("/homepage/banners", {
    method: "POST",
    json: body,
  });
}

export async function updateHomepagePromoBanner(
  id: string,
  body: Record<string, unknown>,
): Promise<HomepagePromoBannerDoc | null> {
  return adminFetchJson<HomepagePromoBannerDoc | null>(`/homepage/banners/${id}`, {
    method: "PATCH",
    json: body,
  });
}

export async function deleteHomepagePromoBanner(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/homepage/banners/${id}`, { method: "DELETE" });
}

export async function listHomepageCategoryTiles(
  query?: ListQuery,
): Promise<{ items: HomepageCategoryTileDoc[]; total?: number }> {
  const { data, total } = await adminFetchJsonList<HomepageCategoryTileDoc[]>(
    `/homepage/category-tiles${statusQs(query)}`,
  );
  return { items: data, total };
}

export async function createHomepageCategoryTile(
  body: Record<string, unknown>,
): Promise<HomepageCategoryTileDoc> {
  return adminFetchJson<HomepageCategoryTileDoc>("/homepage/category-tiles", {
    method: "POST",
    json: body,
  });
}

export async function updateHomepageCategoryTile(
  id: string,
  body: Record<string, unknown>,
): Promise<HomepageCategoryTileDoc | null> {
  return adminFetchJson<HomepageCategoryTileDoc | null>(`/homepage/category-tiles/${id}`, {
    method: "PATCH",
    json: body,
  });
}

export async function deleteHomepageCategoryTile(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/homepage/category-tiles/${id}`, { method: "DELETE" });
}

export async function listHomepageSupportCards(
  query?: ListQuery,
): Promise<{ items: HomepageSupportCardDoc[]; total?: number }> {
  const { data, total } = await adminFetchJsonList<HomepageSupportCardDoc[]>(
    `/homepage/support-cards${statusQs(query)}`,
  );
  return { items: data, total };
}

export async function createHomepageSupportCard(
  body: Record<string, unknown>,
): Promise<HomepageSupportCardDoc> {
  return adminFetchJson<HomepageSupportCardDoc>("/homepage/support-cards", {
    method: "POST",
    json: body,
  });
}

export async function updateHomepageSupportCard(
  id: string,
  body: Record<string, unknown>,
): Promise<HomepageSupportCardDoc | null> {
  return adminFetchJson<HomepageSupportCardDoc | null>(`/homepage/support-cards/${id}`, {
    method: "PATCH",
    json: body,
  });
}

export async function deleteHomepageSupportCard(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/homepage/support-cards/${id}`, { method: "DELETE" });
}
