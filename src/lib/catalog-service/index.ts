import type { SearchCatalogProduct } from "@/lib/types";
import { searchCatalog } from "./products";

export {
  CatalogFetchError,
  catalogServerJson,
  catalogServerJsonList,
  DEFAULT_REVALIDATE_SECONDS,
} from "./fetch";
export type { CatalogRouteContext } from "./taxonomy";
export {
  getTaxonomyTree,
  getRouteContext,
  getMegaMenuNavigation,
  buildMegaMenuGroups,
  pathHrefFromSegments,
  sortTaxonomySiblings,
  findTaxonomyNodeById,
} from "./taxonomy";
export {
  getSpecMatrix,
  buildSpecMatrixForCategory,
  buildSpecMatrixPage,
  DEFAULT_MATRIX_PAGE_SIZE,
  specRowsForLinkedVariant,
} from "./matrix";
export type { GetSpecMatrixParams } from "./matrix";
export {
  getProductBySlug,
  getProductSlugs,
  searchCatalog,
  getProductListingBySlug,
  getProductListingSlugs,
  getProductsByIds,
  getFeaturedHomeProducts,
} from "./products";
export {
  getHomepagePromoBanners,
  getHomepageCategoryTiles,
  getHomepageBrowseCategoryTiles,
  getHomepageSupportCards,
} from "./homepage";
export {
  getNavigationLinkGroups,
  getUtilityLinkGroup,
  getMegaMenuUtilityLinks,
  getFooterLinkGroups,
  getFooterContent,
} from "./navigation";

export async function getSearchAutocomplete(query: string, limit = 6): Promise<SearchCatalogProduct[]> {
  const results = await searchCatalog(query);
  return results.slice(0, limit);
}

/** Best-effort exact match on SKU / item # / MPN / slug among current search hits. */
export async function getExactCatalogSearchMatch(query: string): Promise<SearchCatalogProduct | undefined> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return undefined;
  const batch = await searchCatalog(query);
  return batch.find(
    (p) =>
      p.sku.toLowerCase() === normalized ||
      p.itemNumber.toLowerCase() === normalized ||
      p.mpn.toLowerCase() === normalized ||
      p.slug.toLowerCase() === normalized,
  );
}
