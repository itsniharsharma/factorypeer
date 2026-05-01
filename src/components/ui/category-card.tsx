import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="rounded-sm border border-line bg-white p-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {category.segment}
      </p>
      <h3 className="mt-1 text-sm font-bold text-slate-900">{category.name}</h3>
      <p className="mt-2 text-xs text-slate-600">{category.skuCount.toLocaleString()} SKUs</p>
    </article>
  );
}
