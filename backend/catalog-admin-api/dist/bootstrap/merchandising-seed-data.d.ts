/** Cloudinary HTTPS URLs only — override via CATALOG_SEED_DEFAULT_IMAGE_URL for production branding. */
export declare function getHomepagePromoBannerSeeds(): Array<Record<string, unknown>>;
export declare function getHomepageCategoryTileSeeds(): Array<Record<string, unknown>>;
export declare const homepageSupportCardSeeds: readonly [{
    readonly slug: "bulk-ordering-and-rfq";
    readonly title: "Bulk Ordering and RFQ";
    readonly description: "Upload line-item lists and receive contract pricing support.";
    readonly ctaLabel: "Start RFQ";
    readonly href: "/rfq";
    readonly status: "published";
    readonly sortOrder: 0;
}, {
    readonly slug: "inventory-management-programs";
    readonly title: "Inventory Management Programs";
    readonly description: "Scheduled replenishment, min-max, and plant-level stocking plans.";
    readonly ctaLabel: "Explore Programs";
    readonly href: "/programs";
    readonly status: "published";
    readonly sortOrder: 1;
}, {
    readonly slug: "technical-product-support";
    readonly title: "Technical Product Support";
    readonly description: "Cross-reference alternatives and sourcing help for downtime events.";
    readonly ctaLabel: "Contact Specialist";
    readonly href: "/support";
    readonly status: "published";
    readonly sortOrder: 2;
}];
export declare const utilityLinkGroupSeed: {
    readonly slug: "utility-links";
    readonly title: "Utility Links";
    readonly placement: "utility";
    readonly status: "published";
    readonly sortOrder: 0;
    readonly links: readonly [{
        readonly label: "Contract Pricing";
        readonly href: "/pricing";
    }, {
        readonly label: "Bulk RFQ";
        readonly href: "/rfq";
    }, {
        readonly label: "Fleet Programs";
        readonly href: "/programs/fleet";
    }, {
        readonly label: "Branch Pickup";
        readonly href: "/branch-pickup";
    }, {
        readonly label: "Help Center";
        readonly href: "/help";
    }];
};
export declare const megaMenuUtilityLinkGroupSeed: {
    readonly slug: "mega-menu-utility-links";
    readonly title: "Mega Menu Utilities";
    readonly placement: "navigation";
    readonly status: "published";
    readonly sortOrder: 0;
    readonly links: readonly [{
        readonly label: "Purchased Products";
        readonly href: "/purchased-products";
    }, {
        readonly label: "Custom Product Center";
        readonly href: "/custom-product-center";
    }, {
        readonly label: "Replacement Parts";
        readonly href: "/replacement-parts";
    }, {
        readonly label: "Digital Catalogs";
        readonly href: "/digital-catalogs";
    }];
};
export declare const footerLinkGroupSeeds: readonly [{
    readonly slug: "footer-about-us";
    readonly title: "About Us";
    readonly placement: "footer";
    readonly status: "published";
    readonly sortOrder: 0;
    readonly links: readonly [{
        readonly label: "Careers";
        readonly href: "/careers";
    }, {
        readonly label: "Customers";
        readonly href: "/customers";
    }, {
        readonly label: "Suppliers";
        readonly href: "/suppliers";
    }, {
        readonly label: "Impact";
        readonly href: "/impact";
    }, {
        readonly label: "Investors";
        readonly href: "/investors";
    }, {
        readonly label: "Media";
        readonly href: "/media";
    }];
}, {
    readonly slug: "footer-order-support";
    readonly title: "Order Support";
    readonly placement: "footer";
    readonly status: "published";
    readonly sortOrder: 1;
    readonly links: readonly [{
        readonly label: "Existing Orders";
        readonly href: "/orders";
    }, {
        readonly label: "Returns, Warranty and Cancellations";
        readonly href: "/returns";
    }, {
        readonly label: "Extended Protection Plan";
        readonly href: "/protection-plan";
    }, {
        readonly label: "Invoices";
        readonly href: "/invoices";
    }, {
        readonly label: "Special Orders";
        readonly href: "/special-orders";
    }];
}, {
    readonly slug: "footer-factorypeer-back";
    readonly title: "Factorypeer's Got Your Back";
    readonly placement: "footer";
    readonly status: "published";
    readonly sortOrder: 2;
    readonly links: readonly [{
        readonly label: "FactoryPeer KnowHow";
        readonly href: "/knowhow";
    }, {
        readonly label: "Product Collections";
        readonly href: "/collections";
    }, {
        readonly label: "Services and Solutions";
        readonly href: "/services";
    }, {
        readonly label: "Industries";
        readonly href: "/industries";
    }];
}, {
    readonly slug: "footer-connect";
    readonly title: "Connect";
    readonly placement: "footer";
    readonly status: "published";
    readonly sortOrder: 3;
    readonly links: readonly [{
        readonly label: "Call Us (1-800-SUPPLY)";
        readonly href: "tel:18007775979";
    }, {
        readonly label: "Branch Locations";
        readonly href: "/locations";
    }, {
        readonly label: "Catalog Request";
        readonly href: "/catalog-request";
    }, {
        readonly label: "Help";
        readonly href: "/help";
    }];
}, {
    readonly slug: "footer-legal";
    readonly title: "Legal";
    readonly placement: "footer";
    readonly status: "published";
    readonly sortOrder: 4;
    readonly links: readonly [{
        readonly label: "Terms of Access";
        readonly href: "/terms/access";
    }, {
        readonly label: "Terms of Sale";
        readonly href: "/terms/sale";
    }, {
        readonly label: "Shipping and Delivery";
        readonly href: "/shipping";
    }, {
        readonly label: "Privacy Policy";
        readonly href: "/privacy";
    }, {
        readonly label: "Sitemap";
        readonly href: "/sitemap";
    }, {
        readonly label: "Accessibility Statement";
        readonly href: "/accessibility";
    }];
}];
export declare const footerContentSeed: {
    readonly slug: "global-footer";
    readonly brandName: "Factorypeer";
    readonly newsletterHeading: "Sign Up For Email";
    readonly newsletterDescription: "Get product updates, programs, and procurement support insights.";
    readonly newsletterCtaLabel: "Submit";
    readonly newsletterCtaHref: "/email-signup";
    readonly feedbackHeading: "Feedback";
    readonly feedbackCtaLabel: "Help Us Improve";
    readonly feedbackCtaHref: "/feedback";
    readonly copyrightText: "© 1994 - 2026, FactoryPeer, Inc. All Rights Reserved.";
    readonly status: "published";
    readonly sortOrder: 0;
    readonly socialLinks: readonly [{
        readonly label: "Facebook";
        readonly href: "https://www.facebook.com/fastenalcompany";
        readonly icon: "f";
        readonly sortOrder: 0;
    }, {
        readonly label: "LinkedIn";
        readonly href: "https://linkedin.com/company/fastenal";
        readonly icon: "in";
        readonly sortOrder: 1;
    }, {
        readonly label: "YouTube";
        readonly href: "https://youtube.com/fastenal";
        readonly icon: "▶";
        readonly sortOrder: 2;
    }, {
        readonly label: "X";
        readonly href: "https://twitter.com/fastenal";
        readonly icon: "t";
        readonly sortOrder: 3;
    }, {
        readonly label: "Instagram";
        readonly href: "https://www.instagram.com/fastenal_company";
        readonly icon: "ig";
        readonly sortOrder: 4;
    }];
};
//# sourceMappingURL=merchandising-seed-data.d.ts.map