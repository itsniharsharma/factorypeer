"use client";

import { useRef, useState } from "react";
import { AdminApiError } from "@/lib/admin-api";
import { deleteCatalogMedia, uploadCatalogMedia, type UploadedMediaAsset } from "@/lib/admin-api/media";
import type { ProductMediaItemDoc } from "@/lib/admin-api/types";

/** Editor row — `url` may be empty until upload completes. */
export type ProductMediaRow = Partial<ProductMediaItemDoc> & { sortOrder: number };

type Props = {
  items: ProductMediaRow[];
  onChange: (items: ProductMediaRow[]) => void;
};

export function ProductMediaEditor({ items, onChange }: Props) {
  const [busyIdx, setBusyIdx] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  function setRow(i: number, patch: Partial<ProductMediaRow>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch } as ProductMediaRow;
    onChange(next);
  }

  async function handleFile(i: number, file: File) {
    setErr(null);
    setBusyIdx(i);
    try {
      const meta: UploadedMediaAsset = await uploadCatalogMedia(file, "products/gallery");
      const prevPid = items[i]?.publicId;
      setRow(i, {
        url: meta.url,
        publicId: meta.publicId,
        width: meta.width,
        height: meta.height,
        format: meta.format,
        sortOrder: i,
      });
      if (prevPid && prevPid !== meta.publicId) {
        try {
          await deleteCatalogMedia(prevPid);
        } catch {
          /* ignore */
        }
      }
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : "Upload failed");
    } finally {
      setBusyIdx(null);
    }
  }

  async function removeRow(i: number) {
    const pid = items[i]?.publicId;
    const next = items.filter((_, j) => j !== i).map((m, j) => ({ ...m, sortOrder: j }));
    onChange(next);
    if (pid) {
      try {
        await deleteCatalogMedia(pid);
      } catch {
        /* ignore */
      }
    }
  }

  function addRow() {
    onChange([...items, { url: "", sortOrder: items.length }]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-slate-600">Product images</span>
        <button type="button" className="rounded-sm border px-2 py-1 text-xs" onClick={addRow}>
          Add slot
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-500">No images. Add a slot, then upload.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((row, i) => (
            <li key={i} className="rounded-sm border border-slate-200 p-3">
              <div className="flex flex-wrap items-start gap-3">
                {row.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={row.url}
                    alt={row.alt || ""}
                    className="h-24 max-w-[200px] rounded-sm border object-contain"
                  />
                ) : (
                  <div className="flex h-24 w-[120px] items-center justify-center rounded-sm border border-dashed text-xs text-slate-400">
                    No file
                  </div>
                )}
                <div className="min-w-[200px] flex-1 space-y-2">
                  <input
                    ref={(el) => {
                      fileRefs.current[i] = el;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (f) void handleFile(i, f);
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-sm bg-slate-800 px-2 py-1 text-xs text-white disabled:opacity-50"
                      disabled={busyIdx === i}
                      onClick={() => fileRefs.current[i]?.click()}
                    >
                      {busyIdx === i ? "Uploading…" : row.url ? "Replace" : "Upload"}
                    </button>
                    <button type="button" className="rounded-sm border px-2 py-1 text-xs" onClick={() => void removeRow(i)}>
                      Remove
                    </button>
                  </div>
                  <label className="block text-xs">
                    <span className="text-slate-600">Alt text</span>
                    <input
                      className="mt-1 w-full rounded-sm border px-2 py-1"
                      value={row.alt ?? ""}
                      onChange={(e) => setRow(i, { alt: e.target.value || undefined })}
                    />
                  </label>
                  {row.publicId ? (
                    <p className="font-mono text-[10px] text-slate-400">publicId: {row.publicId}</p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {err ? <p className="text-xs text-rose-600">{err}</p> : null}
    </div>
  );
}
