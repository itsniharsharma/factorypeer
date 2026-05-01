import Image from "next/image";
import { CategoryTile } from "@/lib/types";

interface CategoryTileGridProps {
  tiles: CategoryTile[];
}

export function CategoryTileGrid({ tiles }: CategoryTileGridProps) {
  return (
    <section className="rounded-sm border border-line bg-white p-2">
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Shop by Category
        </h2>
        <a href="#" className="text-xs font-semibold text-brand hover:underline">
          View All
        </a>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {tiles.map((tile) => (
          <article
            key={tile.id}
            className="rounded-sm border border-line bg-white p-1.5 text-center"
          >
            <div className="relative h-24 w-full overflow-hidden rounded-sm border border-line bg-slate-100">
              <Image src={tile.image} alt={tile.label} fill className="object-cover" />
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-800">{tile.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
