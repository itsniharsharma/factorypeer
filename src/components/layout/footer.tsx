import { getFooterContent, getFooterLinkGroups } from "@/lib/catalog-service";

type FooterLink = { label: string; href: string };
type FooterSection = { title: string; links: FooterLink[] };

const footerSectionsFallback: Record<string, FooterSection> = {
  about: {
    title: "About Us",
    links: [
      { label: "Careers", href: "/careers" },
      { label: "Customers", href: "/customers" },
      { label: "Suppliers", href: "/suppliers" },
      { label: "Impact", href: "/impact" },
      { label: "Investors", href: "/investors" },
      { label: "Media", href: "/media" },
    ],
  },
  orderSupport: {
    title: "Order Support",
    links: [
      { label: "Existing Orders", href: "/orders" },
      { label: "Returns, Warranty and Cancellations", href: "/returns" },
      { label: "Extended Protection Plan", href: "/protection-plan" },
      { label: "Invoices", href: "/invoices" },
      { label: "Special Orders", href: "/special-orders" },
    ],
  },
  gotYourBack: {
    title: "FactoryPeer's Got Your Back",
    links: [
      { label: "FactoryPeer KnowHow", href: "/knowhow" },
      { label: "Product Collections", href: "/collections" },
      { label: "Services and Solutions", href: "/services" },
      { label: "Industries", href: "/industries" },
    ],
  },
  connect: {
    title: "Connect",
    links: [
      { label: "Call Us (1-800-SUPPLY)", href: "tel:18007775979" },
      { label: "Branch Locations", href: "/locations" },
      { label: "Catalog Request", href: "/catalog-request" },
      { label: "Help", href: "/help" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Terms of Access", href: "/terms/access" },
      { label: "Terms of Sale", href: "/terms/sale" },
      { label: "Shipping and Delivery", href: "/shipping" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Sitemap", href: "/sitemap" },
      { label: "Accessibility Statement", href: "/accessibility" },
    ],
  },
};

const socialBgByIndex = ["bg-[#3b5998]", "bg-[#0a66c2]", "bg-[#ff0000]", "bg-[#1da1f2]", "bg-[#b029a3]"];

export async function Footer() {
  const [footerContent, footerGroups] = await Promise.all([
    getFooterContent().catch(() => undefined),
    getFooterLinkGroups().catch(() => []),
  ]);

  const bySlug = new Map(footerGroups.map((group) => [group.slug, group]));
  const section = (slug: string, fallback: FooterSection): FooterSection => {
    const group = bySlug.get(slug);
    if (!group?.links?.length) return fallback;
    return {
      title: group.title || fallback.title,
      links: group.links.map((link) => ({ label: link.label, href: link.href || "#" })),
    };
  };

  const aboutSection = section("footer-about-us", footerSectionsFallback.about);
  const orderSupportSection = section("footer-order-support", footerSectionsFallback.orderSupport);
  const gotYourBackSection = section("footer-factorypeer-back", footerSectionsFallback.gotYourBack);
  const connectSection = section("footer-connect", footerSectionsFallback.connect);
  const legalSection = section("footer-legal", footerSectionsFallback.legal);

  const socialLinks = footerContent?.socialLinks?.length
    ? footerContent.socialLinks
    : [
        { label: "Facebook", href: "https://www.facebook.com/fastenalcompany", icon: "f" },
        { label: "LinkedIn", href: "https://linkedin.com/company/fastenal", icon: "in" },
        { label: "YouTube", href: "https://youtube.com/fastenal", icon: "▶" },
        { label: "X", href: "https://twitter.com/fastenal", icon: "t" },
        { label: "Instagram", href: "https://www.instagram.com/fastenal_company", icon: "ig" },
      ];

  const newsletterHeading = footerContent?.newsletterHeading ?? "Sign Up For Email";
  const feedbackHeading = footerContent?.feedbackHeading ?? "Feedback";
  const feedbackCtaLabel = footerContent?.feedbackCtaLabel ?? "Help Us Improve";
  const copyrightText =
    footerContent?.copyrightText ?? "© 1994 - 2026, FactoryPeer, Inc. All Rights Reserved.";

  return (
    <footer className="border-t border-slate-700 bg-slate-800 text-slate-100">
      <div className="mx-auto max-w-[1440px] px-3 py-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <section>
            <h3 className="text-[18px] font-bold text-white">{aboutSection.title}</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
              {aboutSection.links.map((link) => (
                <li key={link.label}><a href={link.href || "#"} className="hover:text-white">{link.label}</a></li>
              ))}
            </ul>

            <div className="mt-8">
              <h4 className="text-[18px] font-bold text-white">{newsletterHeading}</h4>
              <div className="mt-3 flex max-w-[340px] overflow-hidden border border-slate-300 bg-white">
                <input
                  type="email"
                  aria-label="Email Address"
                  placeholder="Email Address"
                  className="h-10 flex-1 px-4 text-sm text-slate-900 outline-none"
                />
                <button
                  type="button"
                  className="h-10 border-l border-slate-300 bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600"
                >
                  {footerContent?.newsletterCtaLabel ?? "Submit"}
                </button>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[18px] font-bold text-white">{orderSupportSection.title}</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
              {orderSupportSection.links.map((link) => (
                <li key={link.label}><a href={link.href || "#"} className="hover:text-white">{link.label}</a></li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[18px] font-bold text-white">{gotYourBackSection.title}</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
              {gotYourBackSection.links.map((link) => (
                <li key={link.label}><a href={link.href || "#"} className="hover:text-white">{link.label}</a></li>
              ))}
            </ul>

            {/* Mobile app promo removed per request */}
          </section>

          <section>
            <h3 className="text-[18px] font-bold text-white">{connectSection.title}</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
              {connectSection.links.map((link, index) => (
                <li key={link.label}>
                  <a href={link.href || "#"} className={index === 0 ? "italic hover:text-white" : "hover:text-white"}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-2">
              {socialLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href || "#"}
                  aria-label={link.label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${socialBgByIndex[idx] ?? socialBgByIndex[socialBgByIndex.length - 1]}`}
                >
                  {link.icon ?? link.label.slice(0, 2)}
                </a>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[18px] font-bold text-white">{feedbackHeading}</p>
              <button
                type="button"
                className="mt-3 inline-flex h-10 items-center justify-center rounded-sm border-2 border-white px-5 text-sm font-bold text-white hover:bg-white hover:text-slate-800"
              >
                {feedbackCtaLabel}
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="border-t border-slate-700 bg-black">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 px-3 py-5 text-center text-xs text-slate-200 lg:flex-row lg:justify-center lg:gap-4">
          {legalSection.links.map((link, idx) => (
            <span key={link.label} className="contents">
              <a href={link.href || "#"} className="hover:text-white">{link.label}</a>
              {idx < legalSection.links.length - 1 ? <span className="hidden text-slate-500 lg:inline">|</span> : null}
            </span>
          ))}
        </div>
        <p className="pb-5 text-center text-xs text-slate-300">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
