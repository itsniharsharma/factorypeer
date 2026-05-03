import type { PromoBanner, CategoryTile, SupportCTA, CatalogTaxonomyNode } from "@/lib/types";
import { catalogServerJsonList } from "./fetch";
import { getTaxonomyTree } from "./taxonomy";
import { getDefaultCatalogImageUrl } from "@/config/cdn-defaults";

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
  const res = await catalogServerJsonList<HomepagePromoBannerDoc[]>("/homepage/banners?status=published");
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
}

export async function getHomepageCategoryTiles(): Promise<CategoryTile[]> {
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
}

/** Home browse grid is taxonomy-driven only (no merchandising fallback content). */
export async function getHomepageBrowseCategoryTiles(limit = 14): Promise<CategoryTile[]> {
  const tree = await getTaxonomyTree();
  const out: CategoryTile[] = [];
  const visit = (nodes: CatalogTaxonomyNode[], prefix: string[]) => {
    for (const node of nodes) {
      if (out.length >= limit) return;
      const href = `/category/${[...prefix, node.slug].join("/")}`;
      out.push({
        id: node.id,
        label: node.title,
        href,
        image: getDefaultCatalogImageUrl(),
        imageAlt: `${node.title} category`,
      });
      if (node.children.length) visit(node.children, [...prefix, node.slug]);
      if (out.length >= limit) return;
    }
  };
  visit(tree, []);
  return out;
}

export async function getHomepageSupportCards(): Promise<SupportCTA[]> {
  const res = await catalogServerJsonList<HomepageSupportCardDoc[]>("/homepage/support-cards?status=published");
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
}

const homepageService = {};
export default homepageService;
