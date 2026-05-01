import { Button } from "@/components/ui/button";

interface SupportCard {
  id: string;
  title: string;
  detail: string;
  cta: string;
}

interface SupportCardsRowProps {
  cards: SupportCard[];
}

export function SupportCardsRow({ cards }: SupportCardsRowProps) {
  return (
    <section className="rounded-sm border border-line bg-white p-2">
      <div className="grid gap-2 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.id} className="rounded-sm border border-line bg-slate-50 p-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800">{card.title}</h3>
            <p className="mt-1 text-xs text-slate-600">{card.detail}</p>
            <Button variant="secondary" size="sm" className="mt-2 h-7 text-[11px]">
              {card.cta}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
