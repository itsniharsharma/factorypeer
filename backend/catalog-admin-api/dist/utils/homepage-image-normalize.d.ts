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
export declare function normalizeHomepageImagePayload(input: HomepageImageInput): {
    image: {
        url: string;
        publicId?: string;
        alt?: string;
        width?: number;
        height?: number;
        format?: string;
    };
} | null;
export declare function resolveHomepageImageMerge(current: {
    image?: HomepageImageInput["image"];
}, patch: Partial<HomepageImageInput>): ReturnType<typeof normalizeHomepageImagePayload> | undefined;
//# sourceMappingURL=homepage-image-normalize.d.ts.map