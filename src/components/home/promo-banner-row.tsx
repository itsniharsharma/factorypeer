import Image from "next/image";
import { PromoBanner } from "@/lib/types";

interface PromoBannerRowProps {
  banners: PromoBanner[];
}

export function PromoBannerRow({ banners }: PromoBannerRowProps) {
  return (
    <section className="rounded-sm border border-line bg-white p-2">
      <div className="grid gap-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <article key={banner.id} className="overflow-hidden rounded-sm border border-line">
            <div className="relative h-36">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
            </div>
            <div className="border-t border-line bg-white px-2 py-1.5">
              <p className="text-xs font-bold text-slate-900">{banner.title}</p>
              <p className="text-[11px] text-slate-600">{banner.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
