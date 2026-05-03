import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProductListingTemplate } from "@/components/catalog/product-listing-template";
import { getProductListingBySlug, getProductListingSlugs } from "@/lib/catalog-service";

export const revalidate = 60;

interface ProductsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getProductListingSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { slug } = await params;
  let listing: Awaited<ReturnType<typeof getProductListingBySlug>>;
  try {
    listing = await getProductListingBySlug(slug);
  } catch {
    notFound();
  }

  if (!listing) {
    notFound();
  }

  return (
    <AppShell>
      <ProductListingTemplate data={listing} />
    </AppShell>
  );
}
