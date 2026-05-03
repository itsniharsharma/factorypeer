export function normalizeHomepageImagePayload(input) {
    const img = input.image?.url?.trim() ? input.image : null;
    if (!img?.url)
        return null;
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
export function resolveHomepageImageMerge(current, patch) {
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
