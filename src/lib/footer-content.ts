export type FooterStatus = "draft" | "published" | "archived";

export type FooterSocialLinkDoc = {
  label: string;
  href: string;
  icon?: string;
  openInNewTab?: boolean;
  sortOrder?: number;
};

export type FooterLinkDoc = {
  label: string;
  href: string;
  external?: boolean;
  openInNewTab?: boolean;
  sortOrder?: number;
};

export type FooterColumnDoc = {
  title: string;
  sortOrder?: number;
  links: FooterLinkDoc[];
};

export type FooterCtaBlockDoc = {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  ctaOpenInNewTab?: boolean;
};

export type FooterNewsletterBlockDoc = {
  title?: string;
  body?: string;
  inputPlaceholder?: string;
  buttonLabel?: string;
  submitHref?: string;
  submitExternal?: boolean;
  submitOpenInNewTab?: boolean;
};

export type FooterAppDownloadLinkDoc = {
  label?: string;
  href?: string;
  imageUrl?: string;
  openInNewTab?: boolean;
};

export type FooterAppDownloadBlockDoc = {
  title?: string;
  subtitle?: string;
  appStore?: FooterAppDownloadLinkDoc;
  googlePlay?: FooterAppDownloadLinkDoc;
};

export type FooterConnectBlockDoc = {
  heading?: string;
  phoneSubtitle?: string;
  feedbackCtaLabel?: string;
  feedbackCtaHref?: string;
  feedbackCtaExternal?: boolean;
  feedbackCtaOpenInNewTab?: boolean;
};

export type FooterContentDoc = {
  _id: string;
  slug: string;
  preFooterHeading?: string;
  preFooterBody?: string;
  columns: FooterColumnDoc[];
  newsletter?: FooterNewsletterBlockDoc;
  appDownloads?: FooterAppDownloadBlockDoc;
  connect?: FooterConnectBlockDoc;
  contact?: FooterCtaBlockDoc;
  copyrightText?: string;
  status: FooterStatus;
  sortOrder?: number;
  socialLinks: FooterSocialLinkDoc[];
  legalLinks: FooterLinkDoc[];
  metadata?: Record<string, unknown>;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type FooterContentDraft = {
  slug: string;
  preFooterHeading: string;
  preFooterBody: string;
  status: FooterStatus;
  sortOrder: string;
  columns: FooterColumnDoc[];
  newsletter: FooterNewsletterBlockDoc;
  appDownloads: FooterAppDownloadBlockDoc;
  connect: FooterConnectBlockDoc;
  socialLinks: FooterSocialLinkDoc[];
  legalLinks: FooterLinkDoc[];
  copyrightText: string;
};

export type FooterContentPayload = {
  slug: string;
  preFooterHeading?: string;
  preFooterBody?: string;
  columns?: FooterColumnDoc[];
  newsletter?: FooterNewsletterBlockDoc;
  appDownloads?: FooterAppDownloadBlockDoc;
  connect?: FooterConnectBlockDoc;
  contact?: FooterCtaBlockDoc;
  copyrightText?: string;
  status?: FooterStatus;
  sortOrder?: number;
  socialLinks?: FooterSocialLinkDoc[];
  legalLinks?: FooterLinkDoc[];
  metadata?: Record<string, unknown>;
};

export function sortBySortOrder<T extends { sortOrder?: number }>(items?: readonly T[] | null): T[] {
  return [...(items ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function cloneFooterLink(link: FooterLinkDoc): FooterLinkDoc {
  return { ...link };
}

function cloneFooterColumn(column: FooterColumnDoc): FooterColumnDoc {
  return { ...column, links: (column.links ?? []).map(cloneFooterLink) };
}

function cloneFooterSocialLink(link: FooterSocialLinkDoc): FooterSocialLinkDoc {
  return { ...link };
}

function cloneFooterDownloadLink(link?: FooterAppDownloadLinkDoc): FooterAppDownloadLinkDoc {
  return { ...(link ?? {}) };
}

export function createEmptyFooterDraft(): FooterContentDraft {
  return {
    slug: "",
    preFooterHeading: "",
    preFooterBody: "",
    status: "draft",
    sortOrder: "0",
    columns: [],
    newsletter: {
      title: "",
      body: "",
      inputPlaceholder: "",
      buttonLabel: "",
      submitHref: "",
      submitExternal: false,
      submitOpenInNewTab: false,
    },
    appDownloads: {
      title: "",
      subtitle: "",
      appStore: {
        label: "",
        href: "",
        imageUrl: "",
        openInNewTab: true,
      },
      googlePlay: {
        label: "",
        href: "",
        imageUrl: "",
        openInNewTab: true,
      },
    },
    connect: {
      heading: "",
      phoneSubtitle: "",
      feedbackCtaLabel: "",
      feedbackCtaHref: "",
      feedbackCtaExternal: false,
      feedbackCtaOpenInNewTab: false,
    },
    socialLinks: [],
    legalLinks: [],
    copyrightText: "",
  };
}

export function footerContentToDraft(doc: FooterContentDoc): FooterContentDraft {
  return {
    slug: doc.slug,
    preFooterHeading: doc.preFooterHeading ?? "",
    preFooterBody: doc.preFooterBody ?? "",
    status: doc.status,
    sortOrder: String(doc.sortOrder ?? 0),
    columns: (doc.columns ?? []).map(cloneFooterColumn),
    newsletter: {
      title: doc.newsletter?.title ?? "",
      body: doc.newsletter?.body ?? "",
      inputPlaceholder: doc.newsletter?.inputPlaceholder ?? "",
      buttonLabel: doc.newsletter?.buttonLabel ?? "",
      submitHref: doc.newsletter?.submitHref ?? "",
      submitExternal: Boolean(doc.newsletter?.submitExternal),
      submitOpenInNewTab: Boolean(doc.newsletter?.submitOpenInNewTab),
    },
    appDownloads: {
      title: doc.appDownloads?.title ?? "",
      subtitle: doc.appDownloads?.subtitle ?? "",
      appStore: cloneFooterDownloadLink(doc.appDownloads?.appStore),
      googlePlay: cloneFooterDownloadLink(doc.appDownloads?.googlePlay),
    },
    connect: {
      heading: doc.connect?.heading ?? "",
      phoneSubtitle: doc.connect?.phoneSubtitle ?? "",
      feedbackCtaLabel: doc.connect?.feedbackCtaLabel ?? "",
      feedbackCtaHref: doc.connect?.feedbackCtaHref ?? "",
      feedbackCtaExternal: Boolean(doc.connect?.feedbackCtaExternal),
      feedbackCtaOpenInNewTab: Boolean(doc.connect?.feedbackCtaOpenInNewTab),
    },
    socialLinks: (doc.socialLinks ?? []).map(cloneFooterSocialLink),
    legalLinks: (doc.legalLinks ?? []).map(cloneFooterLink),
    copyrightText: doc.copyrightText ?? "",
  };
}

export function buildFooterContentPayload(draft: FooterContentDraft): FooterContentPayload {
  const sortOrder = Number.parseInt(draft.sortOrder, 10);
  if (Number.isNaN(sortOrder)) {
    throw new Error("Sort order must be numeric");
  }
  if (!draft.slug.trim()) {
    throw new Error("Footer slug is required");
  }

  const columns = draft.columns.map((column, columnIndex) => ({
    title: column.title.trim(),
    sortOrder: column.sortOrder ?? columnIndex,
    links: (column.links ?? []).map((link, linkIndex) => ({
      label: link.label.trim(),
      href: link.href.trim(),
      external: Boolean(link.external),
      openInNewTab: Boolean(link.openInNewTab),
      sortOrder: link.sortOrder ?? linkIndex,
    })),
  }));

  const socialLinks = draft.socialLinks.map((link, index) => ({
    label: link.label.trim(),
    href: link.href.trim(),
    icon: link.icon?.trim() || undefined,
    openInNewTab: Boolean(link.openInNewTab),
    sortOrder: link.sortOrder ?? index,
  }));

  const legalLinks = draft.legalLinks.map((link, index) => ({
    label: link.label.trim(),
    href: link.href.trim(),
    external: Boolean(link.external),
    openInNewTab: Boolean(link.openInNewTab),
    sortOrder: link.sortOrder ?? index,
  }));

  if (columns.some((column) => !column.title || column.links.some((link) => !link.label || !link.href))) {
    throw new Error("Each footer column and link requires title/label and URL");
  }
  if (socialLinks.some((link) => !link.label || !link.href)) {
    throw new Error("Social links require label and URL");
  }
  if (legalLinks.some((link) => !link.label || !link.href)) {
    throw new Error("Legal links require label and URL");
  }

  return {
    slug: draft.slug.trim(),
    preFooterHeading: draft.preFooterHeading.trim() || undefined,
    preFooterBody: draft.preFooterBody.trim() || undefined,
    status: draft.status,
    sortOrder,
    columns,
    newsletter: {
      title: draft.newsletter.title?.trim() || undefined,
      body: draft.newsletter.body?.trim() || undefined,
      inputPlaceholder: draft.newsletter.inputPlaceholder?.trim() || undefined,
      buttonLabel: draft.newsletter.buttonLabel?.trim() || undefined,
      submitHref: draft.newsletter.submitHref?.trim() || undefined,
      submitExternal: Boolean(draft.newsletter.submitExternal),
      submitOpenInNewTab: Boolean(draft.newsletter.submitOpenInNewTab),
    },
    appDownloads: {
      title: draft.appDownloads.title?.trim() || undefined,
      subtitle: draft.appDownloads.subtitle?.trim() || undefined,
      appStore: {
        label: draft.appDownloads.appStore?.label?.trim() || undefined,
        href: draft.appDownloads.appStore?.href?.trim() || undefined,
        imageUrl: draft.appDownloads.appStore?.imageUrl?.trim() || undefined,
        openInNewTab: Boolean(draft.appDownloads.appStore?.openInNewTab),
      },
      googlePlay: {
        label: draft.appDownloads.googlePlay?.label?.trim() || undefined,
        href: draft.appDownloads.googlePlay?.href?.trim() || undefined,
        imageUrl: draft.appDownloads.googlePlay?.imageUrl?.trim() || undefined,
        openInNewTab: Boolean(draft.appDownloads.googlePlay?.openInNewTab),
      },
    },
    connect: {
      heading: draft.connect.heading?.trim() || undefined,
      phoneSubtitle: draft.connect.phoneSubtitle?.trim() || undefined,
      feedbackCtaLabel: draft.connect.feedbackCtaLabel?.trim() || undefined,
      feedbackCtaHref: draft.connect.feedbackCtaHref?.trim() || undefined,
      feedbackCtaExternal: Boolean(draft.connect.feedbackCtaExternal),
      feedbackCtaOpenInNewTab: Boolean(draft.connect.feedbackCtaOpenInNewTab),
    },
    socialLinks,
    legalLinks,
    copyrightText: draft.copyrightText.trim() || undefined,
  };
}

export function footerContentHasRenderableContent(doc?: FooterContentDoc | null): boolean {
  if (!doc) return false;

  return Boolean(
    doc.preFooterBody?.trim() ||
      (doc.columns?.some((column) => column.title?.trim() && (column.links?.length ?? 0) > 0) ?? false) ||
      doc.newsletter?.title?.trim() ||
      doc.appDownloads?.title?.trim() ||
      doc.connect?.heading?.trim() ||
      (doc.socialLinks?.length ?? 0) > 0 ||
      (doc.legalLinks?.length ?? 0) > 0 ||
      doc.copyrightText?.trim(),
  );
}
