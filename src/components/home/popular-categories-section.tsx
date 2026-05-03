import CategoryTileCard from "@/components/catalog/category-tile-card";
import { Category } from "@/lib/types";

interface PopularCategoriesSectionProps {
  categories: Category[];
}

export function PopularCategoriesSection({ categories }: PopularCategoriesSectionProps) {
  return (
    <section className="rounded-sm border border-line bg-white p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
          Popular Product Categories
        </h2>
        <a href="#" className="text-xs font-semibold text-brand hover:underline">
          Shop Categories
        </a>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryTileCard
            key={category.id}
            label={category.name}
            subtitle={category.segment}
            count={category.skuCount}
            href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
            compact
          />
        ))}
      </div>
    </section>
  );
}
