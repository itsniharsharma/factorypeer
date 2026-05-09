import { getPublicEnv } from "./public-env";

/** Same-origin demo asset on Cloudinary — safe for `next/image` when configured for `res.cloudinary.com`. */
export const CLOUDINARY_DEMO_SAMPLE_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/sample.jpg";

/** PDP/listing fallback when a product has no gallery media (must be HTTPS Cloudinary or other allowed host). */
export function getDefaultCatalogImageUrl(): string {
  return getPublicEnv().NEXT_PUBLIC_CATALOG_DEFAULT_IMAGE_URL || CLOUDINARY_DEMO_SAMPLE_IMAGE;
}
