import type { PromoBanner, CategoryTile, SupportCTA, CatalogTaxonomyNode } from "@/lib/types";
import { catalogServerJsonList } from "./fetch";
import { cacheAside } from "@/lib/cache/redis-cache";
import {
  getTaxonomyTree,
  pathHrefFromSegments,
  sortTaxonomySiblings,
} from "./taxonomy";

type HomepagePromoBannerDoc = {
  _id: string;
  title: string;
  subtitle?: string;
  image?: { url?: string; alt?: string };
  imageAlt?: string;
  eyebrow?: string;
  ctaLabel?: string;
  href?: string;
  openInNewTab?: boolean;
};

type HomepageCategoryTileDoc = {
  _id: string;
  label: string;
  image?: { url?: string; alt?: string };
  imageAlt?: string;
  categoryId?: string | null;
  href?: string;
  ctaLabel?: string;
};

type HomepageSupportCardDoc = {
  _id: string;
  title: string;
  description?: string;
  image?: { url?: string; alt?: string };
  ctaLabel?: string;
  href?: string;
};

function findCategoryPathSegments(
  nodes: CatalogTaxonomyNode[],
  categoryId: string,
  prefix: string[] = [],
): string[] | undefined {
  for (const n of nodes) {
    const path = [...prefix, n.slug];
    if (n.id === categoryId) return path;
    const sub = findCategoryPathSegments(n.children ?? [], categoryId, path);
    if (sub) return sub;
  }
  return undefined;
}

function resolveCategoryTileHref(
  tree: CatalogTaxonomyNode[],
  tile: HomepageCategoryTileDoc,
): string {
  const raw = tile.href?.trim();
  if (raw) return raw;
  const cid = tile.categoryId;
  if (!cid) return "#";
  const segments = findCategoryPathSegments(tree, cid);
  if (!segments?.length) return "#";
  return `/category/${segments.join("/")}`;
}

export async function getHomepagePromoBanners(): Promise<PromoBanner[]> {
  return cacheAside({
    namespace: "homepage",
    key: "promo-banners",
    ttlSeconds: 10 * 60,
    staleWhileRevalidateSeconds: 2 * 60,
    label: "homepage-promo-banners",
    loader: async () => {
      const res = await catalogServerJsonList<HomepagePromoBannerDoc[]>('/homepage/banners?status=published');
      const data = Array.isArray(res.data) ? res.data : [];
      return data.map((b) => ({
        id: b._id,
        title: b.title,
        subtitle: b.subtitle ?? "",
        image: b.image?.url ?? "",
        imageAlt: b.image?.alt ?? b.imageAlt,
        eyebrow: b.eyebrow,
        ctaLabel: b.ctaLabel,
        href: b.href,
        openInNewTab: b.openInNewTab,
      }));
    },
  });
}

export async function getHomepageCategoryTiles(): Promise<CategoryTile[]> {
  return cacheAside({
    namespace: "homepage",
    key: "category-tiles",
    ttlSeconds: 10 * 60,
    staleWhileRevalidateSeconds: 2 * 60,
    label: "homepage-category-tiles",
    loader: async () => {
      const [res, tree] = await Promise.all([
        catalogServerJsonList<HomepageCategoryTileDoc[]>("/homepage/category-tiles?status=published"),
        getTaxonomyTree(),
      ]);
      const data = Array.isArray(res.data) ? res.data : [];
      return data.map((tile) => ({
        id: tile._id,
        label: tile.label,
        image: tile.image?.url ?? "",
        href: resolveCategoryTileHref(tree, tile),
        imageAlt: tile.image?.alt ?? tile.imageAlt,
        ctaLabel: tile.ctaLabel,
      }));
    },
  });
}

/** Top-level (root) categories only; card links to first browseable path under each root (taxonomy sortOrder). */
export async function getHomepageBrowseCategoryTiles(limit = 14): Promise<CategoryTile[]> {
  return cacheAside({
    namespace: "homepage",
    key: `browse-category-tiles:${limit}`,
    ttlSeconds: 10 * 60,
    staleWhileRevalidateSeconds: 2 * 60,
    label: "homepage-browse-category-tiles",
    loader: async () => {
      const tree = await getTaxonomyTree();
      const roots = sortTaxonomySiblings(tree).slice(0, limit);
      return roots.map((node) => ({
        id: node.id,
        label: node.title,
        href: pathHrefFromSegments([node.slug]),
        image: node.landingImage?.url,
        imageAlt: node.landingImage?.alt ?? `${node.title} category`,
      }));
    },
  });
}

export async function getHomepageSupportCards(): Promise<SupportCTA[]> {
  return cacheAside({
    namespace: "homepage",
    key: "support-cards",
    ttlSeconds: 10 * 60,
    staleWhileRevalidateSeconds: 2 * 60,
    label: "homepage-support-cards",
    loader: async () => {
      const res = await catalogServerJsonList<HomepageSupportCardDoc[]>('/homepage/support-cards?status=published');
      const data = Array.isArray(res.data) ? res.data : [];
      return data.map((card) => ({
        id: card._id,
        title: card.title,
        description: card.description ?? "",
        action: card.ctaLabel ?? "Learn More",
        href: card.href,
        image: card.image?.url,
        imageAlt: card.image?.alt,
      }));
    },
  });
}

const homepageService = {};
export default homepageService;
