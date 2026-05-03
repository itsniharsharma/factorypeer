import Image from "next/image";
import type { SupportCTA } from "@/lib/types";

interface SupportCardsRowProps {
  cards: SupportCTA[];
}

export function SupportCardsRow({ cards }: SupportCardsRowProps) {
  return (
    <section>
      <div className="border border-slate-300 bg-white px-3 py-2.5">
        <h2 className="text-[18px] font-bold leading-tight text-slate-900">Supplies and Solutions for Every Industry</h2>
      </div>
      <div className="grid gap-0 border border-slate-300 border-t-0 bg-[#efefef] md:grid-cols-3">
        {cards.map((card, idx) => (
          <article
            key={card.id}
            className={`flex min-h-[152px] items-start justify-between gap-4 border-slate-300 px-4 py-4 ${idx < cards.length - 1 ? 'border-r' : ''}`}
          >
            <div className="max-w-[220px]">
              <h3 className="text-[17px] font-bold leading-tight text-slate-900">{card.title}</h3>
              <p className="mt-2 text-[14px] leading-snug text-slate-800">{card.description}</p>
              <div className="mt-4 text-[14px] leading-snug text-brand">
                <a
                  href={card.href?.trim() || "#"}
                  className="font-semibold hover:underline"
                >
                  {card.action}
                </a>
              </div>
            </div>
            <div className="relative flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center overflow-hidden rounded-sm bg-brand shadow-[4px_4px_0_rgba(0,0,0,0.12)]">
              {card.image ? (
                <Image
                  src={card.image}
                  alt={card.imageAlt ?? card.title}
                  width={72}
                  height={72}
                  className="h-full w-full object-cover"
                  sizes="72px"
                />
              ) : (
                <div className="h-7 w-7 rounded-[2px] border-2 border-white/85" />
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
