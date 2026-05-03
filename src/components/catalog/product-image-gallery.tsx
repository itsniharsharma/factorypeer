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
  const current = safe[idx] ?? safe[0];

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
    },
    [lightboxOpen],
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
      <div className="space-y-1.5">
        <button
          type="button"
          className="relative block h-56 w-full overflow-hidden border border-line bg-slate-50 text-left outline-none ring-brand focus-visible:ring-2"
          aria-label="Open image zoom"
          onClick={() => setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary supplier CDN URLs */}
          <img src={current.url} alt={current.alt} className="h-full w-full object-contain" />
        </button>
        {safe.length > 1 ? (
          <div className="grid grid-cols-5 gap-1">
            {safe.map((im, i) => (
              <button
                key={`${im.url}-${i}`}
                type="button"
                onClick={() => setIdx(i)}
                className={`relative h-12 overflow-hidden border bg-slate-50 ${
                  i === idx ? "border-brand ring-1 ring-brand" : "border-line"
                }`}
                aria-label={`Image ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {lightboxOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center border-0 bg-black/75 p-4"
          aria-label="Close zoom"
          onClick={() => setLightboxOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt}
            className="max-h-[92vh] max-w-[96vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      ) : null}
    </>
  );
}
