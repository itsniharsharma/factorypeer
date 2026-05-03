import {
  createFooterContent,
  createNavigationLinkGroup,
  listFooterContents,
  listNavigationLinkGroups,
  updateFooterContent,
  updateNavigationLinkGroup,
} from "./navigation-content";

const MCB_PATH =
  "/category/electrical/circuit-protection/circuit-breakers/miniature-circuit-breakers" as const;

export const ELECTRICAL_SHOWCASE_FOOTER_CONTENT_SLUG = "electrical-showcase-footer";

function publishedLinks(
  rows: Array<{ label: string; href: string; sortOrder: number }>,
): Array<Record<string, unknown>> {
  return rows.map((row) => ({
    label: row.label,
    href: row.href,
    sortOrder: row.sortOrder,
    status: "published",
  }));
}

const SHOWCASE_FOOTER_LINK_GROUPS: Array<{
  slug: string;
  title: string;
  sortOrder: number;
  links: Array<{ label: string; href: string; sortOrder: number }>;
}> = [
  {
    slug: "electrical-footer-shop",
    title: "Shop Electrical",
    sortOrder: 0,
    links: [
      { label: "Electrical", href: "/category/electrical", sortOrder: 0 },
      { label: "Circuit Protection", href: "/category/electrical/circuit-protection", sortOrder: 1 },
      {
        label: "Circuit Breakers",
        href: "/category/electrical/circuit-protection/circuit-breakers",
        sortOrder: 2,
      },
      { label: "Miniature Circuit Breakers", href: MCB_PATH, sortOrder: 3 },
    ],
  },
  {
    slug: "electrical-footer-support",
    title: "Support & RFQ",
    sortOrder: 1,
    links: [
      { label: "Request a quote", href: "/rfq", sortOrder: 0 },
      { label: "Search catalog", href: "/search", sortOrder: 1 },
      { label: "Help center", href: "/help", sortOrder: 2 },
    ],
  },
  {
    slug: "electrical-footer-legal",
    title: "Legal",
    sortOrder: 2,
    links: [
      { label: "Privacy policy", href: "/privacy", sortOrder: 0 },
      { label: "Terms of use", href: "/terms", sortOrder: 1 },
      { label: "Accessibility", href: "/accessibility", sortOrder: 2 },
    ],
  },
];

/**
 * Applies the Electrical vertical footer presets using the same admin-catalog HTTP helpers
 * as **Navigation & Footer** create/update actions (browser session, admin UI).
 */
export async function seedElectricalShowcaseFooterFromAdminPanel(): Promise<{
  created: string[];
  updated: string[];
}> {
  const created: string[] = [];
  const updated: string[] = [];

  const { items: existingGroups } = await listNavigationLinkGroups({ placement: "footer" });

  for (const g of SHOWCASE_FOOTER_LINK_GROUPS) {
    const payload: Record<string, unknown> = {
      slug: g.slug,
      title: g.title,
      placement: "footer",
      status: "published",
      sortOrder: g.sortOrder,
      links: publishedLinks(g.links),
    };
    const hit = existingGroups.find((x) => x.slug === g.slug);
    if (hit) {
      await updateNavigationLinkGroup(hit._id, payload);
      updated.push(`link group "${g.title}"`);
    } else {
      await createNavigationLinkGroup(payload);
      created.push(`link group "${g.title}"`);
    }
  }

  const { items: footers } = await listFooterContents();
  const footerPayload: Record<string, unknown> = {
    slug: ELECTRICAL_SHOWCASE_FOOTER_CONTENT_SLUG,
    brandName: "Factorypeer",
    newsletterHeading: "Procurement & product alerts",
    newsletterDescription:
      "Get branch availability notes, alternates, and spec updates for industrial electrical SKUs.",
    newsletterCtaLabel: "Email signup",
    newsletterCtaHref: "/email-signup",
    feedbackHeading: "Site feedback",
    feedbackCtaLabel: "Tell us what to improve",
    feedbackCtaHref: "/feedback",
    copyrightText: `© ${new Date().getFullYear()} Factorypeer. Catalog content is for demonstration.`,
    status: "published",
    sortOrder: 0,
    socialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/factorypeer", icon: "in", sortOrder: 0 },
      { label: "YouTube", href: "https://www.youtube.com/", icon: "▶", sortOrder: 1 },
    ],
  };

  const footerHit = footers.find((f) => f.slug === ELECTRICAL_SHOWCASE_FOOTER_CONTENT_SLUG);
  if (footerHit) {
    await updateFooterContent(footerHit._id, footerPayload);
    updated.push("footer content");
  } else {
    await createFooterContent(footerPayload);
    created.push("footer content");
  }

  return { created, updated };
}
