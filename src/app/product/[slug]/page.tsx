import { notFound } from "next/navigation";
import { ProductDetailTemplate } from "@/components/catalog/product-detail-template";
import { AppShell } from "@/components/layout/app-shell";
import { getProductDetailBySlug, productDetailPages } from "@/lib/catalog-data";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return productDetailPages.map((page) => ({ slug: page.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <AppShell>
      <ProductDetailTemplate data={product} />
    </AppShell>
  );
}
