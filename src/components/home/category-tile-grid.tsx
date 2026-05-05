import { CategoryTile } from "@/lib/types";
import CategoryTileCard from "@/components/catalog/category-tile-card";
import Link from "next/link";

interface CategoryTileGridProps {
  tiles: CategoryTile[];
}

export function CategoryTileGrid({ tiles }: CategoryTileGridProps) {
  if (!tiles.length) return null;
  return (
    <section className="border border-slate-300 bg-white">
      <div className="border-b border-slate-300 px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Browse Products
            </p>
            <h2 className="mt-1 text-[18px] font-bold leading-tight text-slate-900">Browse Category Catalog</h2>
          </div>
          <Link href="/category" className="whitespace-nowrap text-xs font-semibold text-brand hover:text-brand-dark">
            View All Product Categories →
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {tiles.map((tile) => {
          const rawHref = tile.href?.trim();
          const dest = rawHref && rawHref !== "#" ? rawHref : undefined;
          return (
            <CategoryTileCard
              key={tile.id}
              href={dest}
              label={tile.label}
              image={tile.image}
              imageAlt={tile.imageAlt}
              ctaLabel={tile.ctaLabel}
              compact
            />
          );
        })}
      </div>
    </section>
  );
}
