/** Seed / migration default — Cloudinary-hosted demo image (upload your own and set env for production). */
export const CLOUDINARY_DEMO_SAMPLE_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/sample.jpg";

export function catalogSeedDefaultImageUrl(): string {
  return (
    process.env["CATALOG_SEED_DEFAULT_IMAGE_URL"]?.trim() ||
    process.env["NEXT_PUBLIC_CATALOG_DEFAULT_IMAGE_URL"]?.trim() ||
    CLOUDINARY_DEMO_SAMPLE_IMAGE
  );
}
