import { notFound } from "next/navigation";
import { ProductDetailTemplate } from "@/components/catalog/product-detail-template";
import { RecentlyViewedTracker } from "@/components/catalog/recently-viewed-tracker";
import { AppShell } from "@/components/layout/app-shell";
import { getProductBySlug, getProductSlugs } from "@/lib/catalog-service";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: Awaited<ReturnType<typeof getProductBySlug>>;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <AppShell>
      <RecentlyViewedTracker slug={product.slug} />
      <ProductDetailTemplate data={product} />
    </AppShell>
  );
}
