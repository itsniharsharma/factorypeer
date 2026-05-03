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
  count?: number | null;
  compact?: boolean;
}

export function CategoryTileCard({
  href = null,
  label,
  image = null,
  imageAlt = null,
  subtitle = null,
  ctaLabel = null,
  count = null,
  compact = false,
}: CategoryTileCardProps) {
  const inner = (
    <div className={`flex flex-col items-center text-center ${compact ? "p-2" : "p-3"}`}>
      <div className={`relative ${compact ? "h-20" : "h-[110px]"} w-full overflow-hidden bg-slate-50 rounded-sm`}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt?.trim() || label}
            fill
            className="object-contain object-center"
            sizes={compact ? "(max-width: 640px) 33vw, 16vw" : "(max-width: 1280px) 20vw, 14vw"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[11px] text-slate-500">
            No Image
          </div>
        )}
      </div>

      <p className={`mt-3 ${compact ? "text-sm" : "text-[14px] leading-tight"} text-slate-900 font-semibold`}>
        {label}
      </p>

      {subtitle ? (
        <p className="mt-1 text-[12px] text-slate-600">{subtitle}</p>
      ) : null}

      {count != null ? (
        <p className="mt-2 text-[11px] font-semibold text-slate-700">{count.toLocaleString()} Products</p>
      ) : null}

      {ctaLabel ? <span className="mt-2 text-[12px] font-semibold text-brand">{ctaLabel}</span> : null}
    </div>
  );

  return (
    <article className={`border border-slate-300 bg-white ${compact ? "" : "px-3 py-4"}`}>
      {href ? (
        <Link href={href} className="flex flex-col items-center text-inherit no-underline hover:opacity-95">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </article>
  );
}

export default CategoryTileCard;
