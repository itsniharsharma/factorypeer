import { getFooterContent } from "@/lib/catalog-service";
import {
  footerContentHasRenderableContent,
  sortBySortOrder,
  type FooterColumnDoc,
  type FooterLinkDoc,
  type FooterSocialLinkDoc,
} from "@/lib/footer-content";

function linkTarget(openInNewTab?: boolean) {
  return openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

function socialTone(label: string): string {
  const key = label.trim().toLowerCase();
  if (key.includes("linkedin")) return "bg-[#0a66c2]";
  if (key.includes("youtube")) return "bg-[#ff0000]";
  if (key.includes("facebook")) return "bg-[#4267b2]";
  if (key.includes("instagram")) return "bg-[#a13db3]";
  if (key === "x" || key.includes("twitter")) return "bg-[#1d9bf0]";
  return "bg-slate-500";
}

function socialGlyph(label: string, icon?: string) {
  const value = icon?.trim() || label.trim();
  return value.length > 3 ? value.slice(0, 2) : value;
}

export async function Footer() {
  const footerContent = await getFooterContent().catch(() => undefined);
  if (!footerContent || !footerContentHasRenderableContent(footerContent)) return null;

  const columns: FooterColumnDoc[] = sortBySortOrder(footerContent.columns)
    .map((column) => ({ ...column, links: sortBySortOrder(column.links) }))
    .filter((column) => column.title?.trim() && (column.links?.length ?? 0) > 0);
  const legalLinks: FooterLinkDoc[] = sortBySortOrder(footerContent.legalLinks);
  const socialLinks: FooterSocialLinkDoc[] = sortBySortOrder(footerContent.socialLinks);

  return (
    <footer className="mt-10 border-t border-[#1f2937] bg-[#24313d] text-slate-200">
      {(footerContent.preFooterHeading?.trim() || footerContent.preFooterBody?.trim()) ? (
        <section className="bg-white px-4 py-8 text-[#627084] md:px-6">
          <div className="mx-auto max-w-[1440px]">
            {footerContent.preFooterHeading?.trim() ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {footerContent.preFooterHeading}
              </p>
            ) : null}
            {footerContent.preFooterBody?.trim() ? (
              <p className="max-w-[1320px] text-[13px] leading-6 md:text-[14px] md:leading-7">
                {footerContent.preFooterBody}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
          <section className="space-y-5">
            <div>
              <h3 className="text-[18px] font-semibold text-white">About Us</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                  {(columns[0]?.links ?? []).map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a href={link.href} className="hover:text-white hover:underline" {...linkTarget(link.openInNewTab)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {footerContent.newsletter?.title?.trim() ? (
              <div>
                <h4 className="text-[18px] font-semibold text-white">{footerContent.newsletter.title}</h4>
                <div className="mt-2 flex w-full max-w-[320px] overflow-hidden rounded-sm border border-slate-400 bg-white">
                  <input
                    readOnly
                    value={footerContent.newsletter.inputPlaceholder?.trim() || "Email Address"}
                    className="min-w-0 flex-1 bg-white px-3 py-2 text-[14px] text-slate-700 outline-none placeholder:text-slate-500"
                  />
                  {footerContent.newsletter.buttonLabel?.trim() ? (
                    <a
                      href={footerContent.newsletter.submitHref?.trim() || "#"}
                      className="border-l border-slate-400 bg-[#323b46] px-4 py-2 text-sm font-semibold text-white hover:bg-[#27313b]"
                      {...linkTarget(footerContent.newsletter.submitOpenInNewTab)}
                    >
                      {footerContent.newsletter.buttonLabel}
                    </a>
                  ) : null}
                </div>
                {footerContent.newsletter.body?.trim() ? <p className="mt-2 max-w-[300px] text-xs leading-5 text-slate-400">{footerContent.newsletter.body}</p> : null}
              </div>
            ) : null}
          </section>

          <section>
            <h3 className="text-[18px] font-semibold text-white">Order Support</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-300">
              {(columns[1]?.links ?? []).map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a href={link.href} className="hover:text-white hover:underline" {...linkTarget(link.openInNewTab)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-5">
            <div>
              <h3 className="text-[18px] font-semibold text-white">FactoryPeer&apos;s Got Your Back</h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {(columns[2]?.links ?? []).map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a href={link.href} className="hover:text-white hover:underline" {...linkTarget(link.openInNewTab)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {footerContent.appDownloads?.title?.trim() ? (
              <div>
                <h4 className="text-[18px] font-semibold text-white">{footerContent.appDownloads.title}</h4>
                {footerContent.appDownloads.subtitle?.trim() ? (
                  <p className="mt-1 text-sm text-slate-300">{footerContent.appDownloads.subtitle}</p>
                ) : null}
                <div className="mt-3 flex flex-col gap-2">
                  {footerContent.appDownloads.appStore?.href ? (
                    <a href={footerContent.appDownloads.appStore.href} {...linkTarget(footerContent.appDownloads.appStore.openInNewTab)}>
                      {footerContent.appDownloads.appStore.imageUrl ? (
                        <img
                          src={footerContent.appDownloads.appStore.imageUrl}
                          alt={footerContent.appDownloads.appStore.label || "App Store"}
                          className="h-10 w-auto"
                        />
                      ) : (
                        <span className="inline-flex h-10 items-center rounded bg-black px-3 text-xs text-white">{footerContent.appDownloads.appStore.label || "App Store"}</span>
                      )}
                    </a>
                  ) : null}
                  {footerContent.appDownloads.googlePlay?.href ? (
                    <a href={footerContent.appDownloads.googlePlay.href} {...linkTarget(footerContent.appDownloads.googlePlay.openInNewTab)}>
                      {footerContent.appDownloads.googlePlay.imageUrl ? (
                        <img
                          src={footerContent.appDownloads.googlePlay.imageUrl}
                          alt={footerContent.appDownloads.googlePlay.label || "Google Play"}
                          className="h-10 w-auto"
                        />
                      ) : (
                        <span className="inline-flex h-10 items-center rounded bg-black px-3 text-xs text-white">{footerContent.appDownloads.googlePlay.label || "Google Play"}</span>
                      )}
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>

          <section>
            <h3 className="text-[18px] font-semibold text-white">Connect</h3>
            {footerContent.connect?.phoneSubtitle?.trim() ? (
              <p className="mt-1 text-sm italic text-slate-300">{footerContent.connect.phoneSubtitle}</p>
            ) : null}

            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {(columns[3]?.links ?? []).map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a href={link.href} className="hover:text-white hover:underline" {...linkTarget(link.openInNewTab)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {socialLinks.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    aria-label={link.label}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm ${socialTone(link.label)}`}
                    {...linkTarget(link.openInNewTab)}
                  >
                    {socialGlyph(link.label, link.icon)}
                  </a>
                ))}
              </div>
            ) : null}

            {footerContent.connect?.feedbackCtaLabel?.trim() && footerContent.connect?.feedbackCtaHref?.trim() ? (
              <div className="mt-6">
                <h4 className="text-[18px] font-semibold text-white">Feedback</h4>
                <a
                  href={footerContent.connect.feedbackCtaHref}
                  className="mt-2 inline-flex rounded-sm border-2 border-white px-5 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#24313d]"
                  {...linkTarget(footerContent.connect.feedbackCtaOpenInNewTab)}
                >
                  {footerContent.connect.feedbackCtaLabel}
                </a>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <div className="border-t border-black bg-black">
        <div className="mx-auto max-w-[1440px] px-4 py-4 text-center text-xs text-slate-300 md:px-6">
          {legalLinks.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {legalLinks.map((link, index) => (
                <span key={`${link.label}-${link.href}`} className="inline-flex items-center gap-2">
                  <a href={link.href} className="hover:text-white hover:underline" {...linkTarget(link.openInNewTab)}>
                    {link.label}
                  </a>
                  {index < legalLinks.length - 1 ? <span className="text-slate-500">|</span> : null}
                </span>
              ))}
            </div>
          ) : null}
          {footerContent.copyrightText?.trim() ? <p className="mt-2">{footerContent.copyrightText}</p> : null}
        </div>
      </div>
    </footer>
  );
}
