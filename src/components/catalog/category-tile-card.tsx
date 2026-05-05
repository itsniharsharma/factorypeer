import Image from "next/image";
import Link from "next/link";

export interface CategoryTileCardProps {
  id?: string;
  href?: string | null;
  label: string;
  image?: string | null;
  imageAlt?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  compact?: boolean;
}

export function CategoryTileCard({
  href = null,
  label,
  image = null,
  imageAlt = null,
  subtitle = null,
  ctaLabel = null,
  compact = false,
}: CategoryTileCardProps) {
  const tileImageSize = compact ? "w-20" : "w-24 sm:w-28";
  const inner = (
    <div className={`flex h-full min-h-[190px] flex-col items-center text-center ${compact ? "p-3" : "p-4"}`}>
      <div className={`relative ${tileImageSize} aspect-square overflow-hidden rounded-sm border border-slate-200 bg-slate-50`}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt?.trim() || label}
            fill
            className="object-cover object-center"
            sizes={compact ? "(max-width: 640px) 33vw, 16vw" : "(max-width: 1280px) 20vw, 14vw"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[11px] text-slate-500">
            No Image
          </div>
        )}
      </div>

      <p className={`mt-4 ${compact ? "text-sm" : "text-[15px] leading-tight"} text-slate-900 font-semibold`}>
        {label}
      </p>

      {subtitle ? (
        <p className="mt-1 text-[12px] text-slate-600">{subtitle}</p>
      ) : null}

      {ctaLabel ? <span className="mt-2 text-[12px] font-semibold text-brand">{ctaLabel}</span> : null}
    </div>
  );

  return (
    <article className="h-full border border-slate-300 bg-white">
      {href ? (
        <Link href={href} className="block h-full text-inherit no-underline hover:bg-slate-50">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </article>
  );
}

export default CategoryTileCard;
