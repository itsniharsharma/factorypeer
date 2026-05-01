import Image from "next/image";
import { CategoryTile } from "@/lib/types";

interface CategoryTileGridProps {
  tiles: CategoryTile[];
}

export function CategoryTileGrid({ tiles }: CategoryTileGridProps) {
  return (
    <section className="border border-slate-300 bg-white">
      <div className="border-b border-slate-300 px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Browse Products
            </p>
            <h2 className="mt-1 text-[18px] font-bold leading-tight text-slate-900">
              The One Item You Need + 1.5 Million More
            </h2>
          </div>
          <a href="#" className="whitespace-nowrap text-xs font-semibold text-brand hover:text-brand-dark">
            View All Product Categories →
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {tiles.map((tile) => (
          <article
            key={tile.id}
            className="flex min-h-[192px] flex-col items-center justify-start border-r border-b border-slate-300 bg-white px-3 py-4 text-center last:border-r-0"
          >
            <div className="relative h-[110px] w-full overflow-hidden bg-white">
              <Image
                src={tile.image}
                alt={tile.label}
                fill
                className="object-contain object-center"
                sizes="(max-width: 1280px) 20vw, 14vw"
              />
            </div>
            <p className="mt-4 max-w-[132px] text-[14px] leading-tight text-slate-900">
              {tile.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
