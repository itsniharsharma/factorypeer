import { Button } from "@/components/ui/button";
import { PromoStripItem } from "@/lib/types";

interface HeroBannerSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  promoItems: PromoStripItem[];
}

export function HeroBannerSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  promoItems,
}: HeroBannerSectionProps) {
  return (
    <section className="grid gap-2 xl:grid-cols-[1.45fr_0.85fr]">
      <div className="rounded-sm border border-line bg-gradient-to-r from-slate-900 to-slate-700 p-4 text-white shadow-xs">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">
          {eyebrow}
        </p>
        <h1 className="mt-1 max-w-2xl text-[28px] font-extrabold leading-tight tracking-tight">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-snug text-slate-200">{description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="primary" size="sm">
            {primaryAction}
          </Button>
          <Button variant="secondary" size="sm" className="border-slate-300">
            {secondaryAction}
          </Button>
        </div>
      </div>

      <aside className="rounded-sm border border-line bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Featured Programs
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">High-volume support, compressed</p>
          </div>
          <a href="#" className="text-xs font-semibold text-brand hover:underline">
            View all
          </a>
        </div>

        <div className="mt-2 space-y-2">
          {promoItems.map((item) => (
            <article key={item.id} className="rounded-sm border border-line bg-slate-50 p-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-1 text-xs font-medium leading-snug text-slate-900">{item.value}</p>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}
