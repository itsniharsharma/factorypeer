import { catalogSeedDefaultImageUrl } from "../config/cdn-defaults.js";
/** Cloudinary HTTPS URLs only — override via CATALOG_SEED_DEFAULT_IMAGE_URL for production branding. */
export function getHomepagePromoBannerSeeds() {
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
const CATEGORY_TILE_SLUGS = [
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
export function getHomepageCategoryTileSeeds() {
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
];
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
};
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
};
export const footerLinkGroupSeeds = [
    {
        slug: "footer-about-us",
        title: "About Us",
        placement: "footer",
        status: "published",
        sortOrder: 0,
        links: [
            { label: "Careers", href: "/careers" },
            { label: "Customers", href: "/customers" },
            { label: "Suppliers", href: "/suppliers" },
            { label: "Impact", href: "/impact" },
            { label: "Investors", href: "/investors" },
            { label: "Media", href: "/media" },
        ],
    },
    {
        slug: "footer-order-support",
        title: "Order Support",
        placement: "footer",
        status: "published",
        sortOrder: 1,
        links: [
            { label: "Existing Orders", href: "/orders" },
            { label: "Returns, Warranty and Cancellations", href: "/returns" },
            { label: "Extended Protection Plan", href: "/protection-plan" },
            { label: "Invoices", href: "/invoices" },
            { label: "Special Orders", href: "/special-orders" },
        ],
    },
    {
        slug: "footer-factorypeer-back",
        title: "Factorypeer's Got Your Back",
        placement: "footer",
        status: "published",
        sortOrder: 2,
        links: [
            { label: "FactoryPeer KnowHow", href: "/knowhow" },
            { label: "Product Collections", href: "/collections" },
            { label: "Services and Solutions", href: "/services" },
            { label: "Industries", href: "/industries" },
        ],
    },
    {
        slug: "footer-connect",
        title: "Connect",
        placement: "footer",
        status: "published",
        sortOrder: 3,
        links: [
            { label: "Call Us (1-800-SUPPLY)", href: "tel:18007775979" },
            { label: "Branch Locations", href: "/locations" },
            { label: "Catalog Request", href: "/catalog-request" },
            { label: "Help", href: "/help" },
        ],
    },
    {
        slug: "footer-legal",
        title: "Legal",
        placement: "footer",
        status: "published",
        sortOrder: 4,
        links: [
            { label: "Terms of Access", href: "/terms/access" },
            { label: "Terms of Sale", href: "/terms/sale" },
            { label: "Shipping and Delivery", href: "/shipping" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Sitemap", href: "/sitemap" },
            { label: "Accessibility Statement", href: "/accessibility" },
        ],
    },
];
export const footerContentSeed = {
    slug: "global-footer",
    brandName: "Factorypeer",
    newsletterHeading: "Sign Up For Email",
    newsletterDescription: "Get product updates, programs, and procurement support insights.",
    newsletterCtaLabel: "Submit",
    newsletterCtaHref: "/email-signup",
    feedbackHeading: "Feedback",
    feedbackCtaLabel: "Help Us Improve",
    feedbackCtaHref: "/feedback",
    copyrightText: "© 1994 - 2026, FactoryPeer, Inc. All Rights Reserved.",
    status: "published",
    sortOrder: 0,
    socialLinks: [
        { label: "Facebook", href: "https://www.facebook.com/fastenalcompany", icon: "f", sortOrder: 0 },
        { label: "LinkedIn", href: "https://linkedin.com/company/fastenal", icon: "in", sortOrder: 1 },
        { label: "YouTube", href: "https://youtube.com/fastenal", icon: "▶", sortOrder: 2 },
        { label: "X", href: "https://twitter.com/fastenal", icon: "t", sortOrder: 3 },
        { label: "Instagram", href: "https://www.instagram.com/fastenal_company", icon: "ig", sortOrder: 4 },
    ],
};
