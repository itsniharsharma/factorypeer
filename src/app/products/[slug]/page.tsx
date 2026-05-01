import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProductListingTemplate } from "@/components/catalog/product-listing-template";
import { getProductListingBySlug, productListingPages } from "@/lib/catalog-data";

interface ProductsPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return productListingPages.map((page) => ({ slug: page.slug }));
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { slug } = await params;
  const listing = getProductListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  return (
    <AppShell>
      <ProductListingTemplate data={listing} />
    </AppShell>
  );
}
