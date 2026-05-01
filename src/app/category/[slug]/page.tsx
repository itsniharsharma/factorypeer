import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { CategoryLandingTemplate } from "@/components/catalog/category-landing-template";
import { catalogCategoryPages, getCatalogCategoryBySlug } from "@/lib/catalog-data";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return catalogCategoryPages.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCatalogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <AppShell>
      <CategoryLandingTemplate data={category} />
    </AppShell>
  );
}
