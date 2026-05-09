import { catalogServerJsonList } from "@/lib/catalog-service/fetch";
import type { CategoryComposition } from "./types.js";

/**
 * Server-side composition loader with optional caching.
 * Fetches from backend API and caches result via Next.js revalidation.
 */
export async function getCompositionBySlugPath(
  slugPath: string,
): Promise<CategoryComposition | null> {
  try {
    const { data } = await catalogServerJsonList<CategoryComposition[]>("/compositions", {
      next: { revalidate: 60 },
    });
    return data.find((composition) => composition.status === "published" && composition.slugPath === slugPath) ?? null;
  } catch (error) {
    console.error("Error fetching composition from API:", error);
    return null;
  }
}

