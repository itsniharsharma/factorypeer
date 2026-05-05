import { cache } from "react";
import { catalogServerJsonList } from "./fetch";
import { cacheAside } from "@/lib/cache/redis-cache";

type LinkStatus = "draft" | "published" | "archived";
type Placement = "utility" | "navigation" | "footer";

type SiteLink = {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  external?: boolean;
  openInNewTab?: boolean;
  sortOrder?: number;
  status?: LinkStatus;
};

type SiteLinkGroup = {
  _id: string;
  slug: string;
  title: string;
  placement: Placement;
  description?: string;
  status: LinkStatus;
  sortOrder?: number;
  links?: SiteLink[];
};

type FooterSocialLink = {
  label: string;
  href: string;
  icon?: string;
  sortOrder?: number;
};

type FooterContent = {
  _id: string;
  slug: string;
  brandName?: string;
  newsletterHeading?: string;
  newsletterDescription?: string;
  newsletterCtaLabel?: string;
  newsletterCtaHref?: string;
  feedbackHeading?: string;
  feedbackCtaLabel?: string;
  feedbackCtaHref?: string;
  copyrightText?: string;
  status: LinkStatus;
  sortOrder?: number;
  socialLinks?: FooterSocialLink[];
};

function bySortOrder(a?: number, b?: number): number {
  return (a ?? 0) - (b ?? 0);
}

function withPublishedStatus(path: string): string {
  return path.includes("?") ? `${path}&status=published` : `${path}?status=published`;
}

export const getNavigationLinkGroups = cache(async (placement: Placement): Promise<SiteLinkGroup[]> => {
  return cacheAside({
    namespace: "navigation",
    key: `link-groups:${placement}`,
    ttlSeconds: 10 * 60,
    staleWhileRevalidateSeconds: 2 * 60,
    label: `nav-${placement}`,
    loader: async () => {
      const path = withPublishedStatus(`/navigation/link-groups?placement=${placement}`);
      const res = await catalogServerJsonList<SiteLinkGroup[]>(path, {
        next: { revalidate: 60, tags: ["catalog", "merchandising", `nav-${placement}`] },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      return data
        .map((group) => ({
          ...group,
          links: (group.links ?? [])
            .filter((link) => (link.status ?? "published") === "published")
            .sort((a, b) => bySortOrder(a.sortOrder, b.sortOrder)),
        }))
        .sort((a, b) => bySortOrder(a.sortOrder, b.sortOrder));
    },
  });
});

export const getUtilityLinkGroup = cache(async (): Promise<SiteLinkGroup | undefined> => {
  const groups = await getNavigationLinkGroups("utility");
  return groups[0];
});

export const getMegaMenuUtilityLinks = cache(async (): Promise<SiteLink[]> => {
  const groups = await getNavigationLinkGroups("navigation");
  return groups[0]?.links ?? [];
});

export const getFooterLinkGroups = cache(async (): Promise<SiteLinkGroup[]> => {
  return getNavigationLinkGroups("footer");
});

export const getFooterContent = cache(async (): Promise<FooterContent | undefined> => {
  return cacheAside({
    namespace: "navigation",
    key: "footer-content",
    ttlSeconds: 10 * 60,
    staleWhileRevalidateSeconds: 2 * 60,
    label: "footer-content",
    loader: async () => {
      const res = await catalogServerJsonList<FooterContent[]>(withPublishedStatus("/navigation/footer-content"), {
        next: { revalidate: 60, tags: ["catalog", "merchandising", "footer-content"] },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      return data.sort((a, b) => bySortOrder(a.sortOrder, b.sortOrder))[0];
    },
  });
});
