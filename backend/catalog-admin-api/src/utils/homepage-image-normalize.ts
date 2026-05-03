export type HomepageImageInput = {
  image?: {
    url: string;
    publicId?: string;
    alt?: string;
    width?: number;
    height?: number;
    format?: string;
  };
  /** API may send alt alongside upload form — folded into `image.alt`. */
  imageAlt?: string;
};

export function normalizeHomepageImagePayload(input: HomepageImageInput): {
  image: {
    url: string;
    publicId?: string;
    alt?: string;
    width?: number;
    height?: number;
    format?: string;
  };
} | null {
  const img = input.image?.url?.trim() ? input.image : null;
  if (!img?.url) return null;
  const url = img.url.trim();
  return {
    image: {
      url,
      publicId: img.publicId?.trim(),
      alt: img.alt?.trim() ?? input.imageAlt?.trim(),
      width: img.width,
      height: img.height,
      format: img.format?.trim(),
    },
  };
}

export function resolveHomepageImageMerge(
  current: {
    image?: HomepageImageInput["image"];
  },
  patch: Partial<HomepageImageInput>,
): ReturnType<typeof normalizeHomepageImagePayload> | undefined {
  if (patch.image === undefined && patch.imageAlt === undefined) {
    return undefined;
  }
  if (patch.image !== undefined) {
    return normalizeHomepageImagePayload({ image: patch.image, imageAlt: patch.imageAlt });
  }
  if (patch.imageAlt !== undefined && current.image?.url) {
    return normalizeHomepageImagePayload({
      image: { ...current.image, alt: patch.imageAlt },
      imageAlt: patch.imageAlt,
    });
  }
  return undefined;
}
