import { catalogSeedDefaultImageUrl } from "../config/cdn-defaults.js";

/** Cloudinary HTTPS URLs only — override via CATALOG_SEED_DEFAULT_IMAGE_URL for production branding. */
export function getHomepagePromoBannerSeeds(): Array<Record<string, unknown>> {
  const url = catalogSeedDefaultImageUrl();
  return [
    {
      slug: "electrical-essentials",
      eyebrow: "Industrial Supply",
      title: "Electrical Essentials",
      subtitle: "Switchgear and motor control inventory",
      image: { url },
      status: "published",
      sortOrder: 0,
    },
    {
      slug: "plant-safety-readiness",
      eyebrow: "Industrial Supply",
      title: "Plant Safety Readiness",
      subtitle: "PPE and compliance products in stock",
      image: { url },
      status: "published",
      sortOrder: 1,
    },
    {
      slug: "fastener-bulk-supply",
      eyebrow: "Industrial Supply",
      title: "Fastener Bulk Supply",
      subtitle: "High-volume hardware replenishment",
      image: { url },
      status: "published",
      sortOrder: 2,
    },
  ];
}

const CATEGORY_TILE_SLUGS: Array<[string, string]> = [
  ["electrical", "Electrical"],
  ["mechanical", "Mechanical"],
  ["safety", "Safety"],
  ["fasteners", "Fasteners"],
  ["pneumatics", "Pneumatics"],
  ["hydraulics", "Hydraulics"],
  ["automation", "Automation"],
  ["material-handling", "Material Handling"],
  ["power-transmission", "Power Transmission"],
  ["tools", "Tools"],
  ["facility-maintenance", "Facility Maintenance"],
  ["welding", "Welding"],
  ["bearings", "Bearings"],
  ["belts-chains", "Belts & Chains"],
  ["motors", "Motors"],
  ["valves", "Valves"],
  ["sensors", "Sensors"],
  ["controls", "Controls"],
  ["lubrication", "Lubrication"],
  ["safety-signs", "Safety Signs"],
  ["cleaning-supplies", "Cleaning Supplies"],
];

export function getHomepageCategoryTileSeeds(): Array<Record<string, unknown>> {
  const url = catalogSeedDefaultImageUrl();
  return CATEGORY_TILE_SLUGS.map(([slug, label], i) => ({
    slug,
    label,
    image: { url },
    status: "published",
    sortOrder: i,
  }));
}

export const homepageSupportCardSeeds = [
  {
    slug: "bulk-ordering-and-rfq",
    title: "Bulk Ordering and RFQ",
    description: "Upload line-item lists and receive contract pricing support.",
    ctaLabel: "Start RFQ",
    href: "/rfq",
    status: "published",
    sortOrder: 0,
  },
  {
    slug: "inventory-management-programs",
    title: "Inventory Management Programs",
    description: "Scheduled replenishment, min-max, and plant-level stocking plans.",
    ctaLabel: "Explore Programs",
    href: "/programs",
    status: "published",
    sortOrder: 1,
  },
  {
    slug: "technical-product-support",
    title: "Technical Product Support",
    description: "Cross-reference alternatives and sourcing help for downtime events.",
    ctaLabel: "Contact Specialist",
    href: "/support",
    status: "published",
    sortOrder: 2,
  },
] as const;

export const utilityLinkGroupSeed = {
  slug: "utility-links",
  title: "Utility Links",
  placement: "utility",
  status: "published",
  sortOrder: 0,
  links: [
    { label: "Contract Pricing", href: "/pricing" },
    { label: "Bulk RFQ", href: "/rfq" },
    { label: "Fleet Programs", href: "/programs/fleet" },
    { label: "Branch Pickup", href: "/branch-pickup" },
    { label: "Help Center", href: "/help" },
  ],
} as const;

export const megaMenuUtilityLinkGroupSeed = {
  slug: "mega-menu-utility-links",
  title: "Mega Menu Utilities",
  placement: "navigation",
  status: "published",
  sortOrder: 0,
  links: [
    { label: "Purchased Products", href: "/purchased-products" },
    { label: "Custom Product Center", href: "/custom-product-center" },
    { label: "Replacement Parts", href: "/replacement-parts" },
    { label: "Digital Catalogs", href: "/digital-catalogs" },
  ],
} as const;

export const footerCmsSeed = {
  slug: "global-footer",
  preFooterBody:
    "FactoryPeer is a trusted source for MRO supplies and industrial products. We help maintenance, reliability, and operations teams get the products and support they need, with broad selection, fast ordering, and responsive technical help.",
  status: "published",
  sortOrder: 0,
  columns: [
    {
      title: "About Us",
      sortOrder: 0,
      links: [
        { label: "Company", href: "/company", sortOrder: 0 },
        { label: "Careers", href: "/careers", sortOrder: 1 },
        { label: "Customers", href: "/customers", sortOrder: 2 },
        { label: "Suppliers", href: "/suppliers", sortOrder: 3 },
        { label: "Impact", href: "/impact", sortOrder: 4 },
        { label: "Media", href: "/media", sortOrder: 5 },
      ],
    },
    {
      title: "Order Support",
      sortOrder: 1,
      links: [
        { label: "Existing Orders", href: "/orders", sortOrder: 0 },
        { label: "Returns, Warranty and Cancellations", href: "/returns", sortOrder: 1 },
        { label: "Extended Protection Plan", href: "/protection-plan", sortOrder: 2 },
        { label: "Invoices", href: "/invoices", sortOrder: 3 },
        { label: "Special Orders", href: "/special-orders", sortOrder: 4 },
      ],
    },
    {
      title: "FactoryPeer's Got Your Back",
      sortOrder: 2,
      links: [
        { label: "FactoryPeer KnowHow", href: "/knowhow", sortOrder: 0 },
        { label: "Product Collections", href: "/collections", sortOrder: 1 },
        { label: "Services and Solutions", href: "/services", sortOrder: 2 },
        { label: "Industries", href: "/industries", sortOrder: 3 },
      ],
    },
    {
      title: "Connect",
      sortOrder: 3,
      links: [
        { label: "Call Us (1-800-FACTORY)", href: "tel:18003226867", sortOrder: 0 },
        { label: "Branch Locations", href: "/locations", sortOrder: 1 },
        { label: "Catalog Request", href: "/catalog-request", sortOrder: 2 },
        { label: "Help", href: "/help", sortOrder: 3 },
      ],
    },
  ],
  newsletter: {
    title: "Sign Up For Email",
    body: "Get product updates, programs, and procurement support insights.",
    inputPlaceholder: "Email Address",
    buttonLabel: "Subscribe",
    submitHref: "/email-signup",
  },
  appDownloads: {
    title: "We're Mobile",
    subtitle: "Mobile Features",
    appStore: {
      label: "Download on the App Store",
      href: "https://www.apple.com/app-store/",
      imageUrl: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
      openInNewTab: true,
    },
    googlePlay: {
      label: "Get it on Google Play",
      href: "https://play.google.com/store",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
      openInNewTab: true,
    },
  },
  connect: {
    heading: "Connect",
    phoneSubtitle: "Call Us (1-800-FACTORY)",
    feedbackCtaLabel: "Help Us Improve",
    feedbackCtaHref: "/feedback",
  },
  socialLinks: [
    { label: "Facebook", href: "https://facebook.com", icon: "f", sortOrder: 0, openInNewTab: true },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "in", sortOrder: 1, openInNewTab: true },
    { label: "YouTube", href: "https://youtube.com", icon: "▶", sortOrder: 2, openInNewTab: true },
    { label: "X", href: "https://x.com", icon: "x", sortOrder: 3, openInNewTab: true },
    { label: "Instagram", href: "https://instagram.com", icon: "ig", sortOrder: 4, openInNewTab: true },
  ],
  legalLinks: [
    { label: "Terms of Access", href: "/terms/access", sortOrder: 0 },
    { label: "Terms of Sale", href: "/terms/sale", sortOrder: 1 },
    { label: "Shipping and Delivery", href: "/shipping", sortOrder: 2 },
    { label: "Privacy Policy", href: "/privacy", sortOrder: 3 },
    { label: "Sitemap", href: "/sitemap", sortOrder: 4 },
    { label: "Accessibility Statement", href: "/accessibility", sortOrder: 5 },
  ],
  copyrightText: "© 2026 FactoryPeer, Inc. All rights reserved.",
} as const;

