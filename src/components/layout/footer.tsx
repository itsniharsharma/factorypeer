import { getFooterContent, getFooterLinkGroups } from "@/lib/catalog-service";

const socialBgByIndex = ["bg-[#3b5998]", "bg-[#0a66c2]", "bg-[#ff0000]", "bg-[#1da1f2]", "bg-[#b029a3]"];

export async function Footer() {
  const [footerContent, footerGroups] = await Promise.all([
    getFooterContent().catch(() => undefined),
    getFooterLinkGroups().catch(() => []),
  ]);

  const groups = (footerGroups ?? []).filter((g) => (g.links?.length ?? 0) > 0);
  const socialLinks = footerContent?.socialLinks ?? [];
  const hasTopContent =
    Boolean(footerContent?.brandName?.trim()) ||
    Boolean(footerContent?.newsletterHeading?.trim()) ||
    Boolean(footerContent?.feedbackHeading?.trim());
  const hasFooterData =
    hasTopContent || groups.length > 0 || socialLinks.length > 0 || Boolean(footerContent?.copyrightText?.trim());
  if (!hasFooterData) return null;

  return (
    <footer className="border-t border-slate-700 bg-slate-800 text-slate-100">
      <div className="mx-auto max-w-[1440px] px-3 py-6">
        {hasTopContent ? (
          <section className="mb-6 grid gap-4 border-b border-slate-700 pb-5 md:grid-cols-3">
            <div>
              {footerContent?.brandName?.trim() ? (
                <h2 className="text-lg font-bold text-white">{footerContent.brandName}</h2>
              ) : null}
            </div>
            <div>
              {footerContent?.newsletterHeading?.trim() ? (
                <>
                  <h3 className="text-sm font-semibold text-white">{footerContent.newsletterHeading}</h3>
                  {footerContent.newsletterDescription?.trim() ? (
                    <p className="mt-1 text-xs text-slate-300">{footerContent.newsletterDescription}</p>
                  ) : null}
                  {footerContent.newsletterCtaLabel?.trim() && footerContent.newsletterCtaHref?.trim() ? (
                    <a
                      href={footerContent.newsletterCtaHref}
                      className="mt-2 inline-block text-xs font-semibold text-white hover:underline"
                    >
                      {footerContent.newsletterCtaLabel}
                    </a>
                  ) : null}
                </>
              ) : null}
            </div>
            <div>
              {footerContent?.feedbackHeading?.trim() ? (
                <>
                  <h3 className="text-sm font-semibold text-white">{footerContent.feedbackHeading}</h3>
                  {footerContent.feedbackCtaLabel?.trim() && footerContent.feedbackCtaHref?.trim() ? (
                    <a
                      href={footerContent.feedbackCtaHref}
                      className="mt-2 inline-block text-xs font-semibold text-white hover:underline"
                    >
                      {footerContent.feedbackCtaLabel}
                    </a>
                  ) : null}
                </>
              ) : null}
            </div>
          </section>
        ) : null}

        {groups.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <section key={group._id}>
                <h3 className="text-[18px] font-bold text-white">{group.title}</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
                  {(group.links ?? []).map((link) => (
                    <li key={`${group._id}-${link.label}`}>
                      <a href={link.href || "#"} className="hover:text-white">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : null}

        {socialLinks.length > 0 ? (
          <div className="mt-6 flex gap-2">
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
        ) : null}
      </div>

      {footerContent?.copyrightText?.trim() ? (
        <div className="border-t border-slate-700 bg-black">
          <p className="py-4 text-center text-xs text-slate-300">{footerContent.copyrightText}</p>
        </div>
      ) : null}
    </footer>
  );
}
