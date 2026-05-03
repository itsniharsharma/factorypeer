"use client";

import { useCallback, useEffect, useState } from "react";

export type GalleryImage = { url: string; alt: string };

interface ProductImageGalleryProps {
  images: GalleryImage[];
  productTitle: string;
}

export function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const safe = images.length > 0 ? images : [{ url: "/images/product-thumb.svg", alt: productTitle }];
  const [idx, setIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);
  const current = safe[idx] ?? safe[0];
  const lbCurrent = safe[lbIdx] ?? safe[0];

  const openLightbox = useCallback(() => {
    setLbIdx(idx);
    setLightboxOpen(true);
  }, [idx]);

  const step = useCallback(
    (delta: number) => {
      setLbIdx((i) => {
        const n = safe.length;
        if (n <= 1) return i;
        return (i + delta + n) % n;
      });
    },
    [safe.length],
  );

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    },
    [lightboxOpen, step],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  useEffect(() => {
    setIdx(0);
  }, [images]);

  return (
    <>
      <div className="flex flex-col gap-1.5 md:flex-row md:items-stretch md:gap-2">
        {safe.length > 1 ? (
          <div
            className="flex shrink-0 flex-row gap-1 overflow-x-auto pb-0.5 md:w-[68px] md:flex-col md:overflow-y-auto md:pb-0 md:pr-0.5"
            role="tablist"
            aria-label="Product images"
          >
            {safe.map((im, i) => (
              <button
                key={`${im.url}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === idx}
                onClick={() => setIdx(i)}
                className={`relative h-11 w-11 shrink-0 overflow-hidden border bg-white md:h-[52px] md:w-full ${
                  i === idx ? "border-brand ring-1 ring-brand" : "border-line hover:border-slate-400"
                }`}
                aria-label={`Thumbnail ${i + 1} of ${safe.length}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt="" className="h-full w-full object-contain p-0.5" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="relative flex aspect-[4/3] w-full cursor-zoom-in items-center justify-center overflow-hidden border border-line bg-white text-left outline-none ring-brand focus-visible:ring-2"
            aria-label={`View larger image ${idx + 1} of ${safe.length}`}
            onClick={openLightbox}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.alt} className="max-h-full max-w-full object-contain p-1" />
            <span className="pointer-events-none absolute bottom-1 right-1 bg-slate-900/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
              Zoom
            </span>
          </button>
        </div>
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out flex-col bg-black/88 p-3 md:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="mb-2 flex shrink-0 cursor-default items-center justify-between gap-2 text-[11px] text-white/90"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-medium">
              {lbIdx + 1} / {safe.length}
            </span>
            <span className="hidden text-white/60 sm:inline">Esc close · ← → navigate</span>
            <button
              type="button"
              className="rounded border border-white/30 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide hover:bg-white/10"
              onClick={() => setLightboxOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-8 md:px-14">
            {safe.length > 1 ? (
              <>
                <button
                  type="button"
                  className="absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded border border-white/25 bg-black/50 text-lg text-white hover:bg-black/70 md:left-1"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="absolute right-0 z-10 flex h-10 w-10 items-center justify-center rounded border border-white/25 bg-black/50 text-lg text-white hover:bg-black/70 md:right-1"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                >
                  ›
                </button>
              </>
            ) : null}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lbCurrent.url}
              alt={lbCurrent.alt}
              className="max-h-[min(88vh,920px)] max-w-full cursor-default object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
