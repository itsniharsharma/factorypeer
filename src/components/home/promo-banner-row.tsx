import Image from "next/image";
import { PromoBanner } from "@/lib/types";

interface PromoBannerRowProps {
  banners: PromoBanner[];
}

export function PromoBannerRow({ banners }: PromoBannerRowProps) {
  return (
    <section className="grid gap-1.5 lg:grid-cols-3">
      {banners.map((banner) => {
        const cta = banner.ctaLabel?.trim() || "Learn More";
        const target = banner.href?.trim() || "#";
        const ctaNewTab = Boolean(banner.openInNewTab);
        return (
          <article key={banner.id} className="overflow-hidden rounded-sm border border-slate-300">
            <div className="relative h-52 bg-slate-700">
              <Image
                src={banner.image}
                alt={banner.imageAlt?.trim() || banner.title}
                fill
                className="object-cover object-center opacity-100 brightness-110 contrast-105 saturate-110"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900/65 via-slate-900/25 to-transparent p-3">
                {banner.eyebrow ? (
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                    {banner.eyebrow}
                  </p>
                ) : null}
                <h3 className="text-lg font-bold text-white">{banner.title}</h3>
                <p className="mt-1 text-sm text-slate-100">{banner.subtitle}</p>
                <a
                  href={target}
                  {...(ctaNewTab ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="mt-2 inline-flex text-sm font-bold text-brand hover:text-brand-dark"
                >
                  {cta} →
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
