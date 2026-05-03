"use client";

import { useRef, useState } from "react";
import { AdminApiError } from "@/lib/admin-api";
import { deleteCatalogMedia, uploadCatalogMedia, type UploadedMediaAsset } from "@/lib/admin-api/media";
import type { CatalogMediaAssetDoc } from "@/lib/admin-api/types";

type Props = {
  label: string;
  /** Cloudinary folder prefix (e.g. homepage/banners). */
  folder: string;
  value: CatalogMediaAssetDoc | null;
  onChange: (next: CatalogMediaAssetDoc | null) => void;
  altText: string;
  onAltChange: (alt: string) => void;
};

export function CatalogMediaField({ label, folder, value, onChange, altText, onAltChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function applyUpload(file: File) {
    setErr(null);
    setBusy(true);
    try {
      const meta: UploadedMediaAsset = await uploadCatalogMedia(file, folder);
      const oldPid = value?.publicId;
      onChange({
        url: meta.url,
        publicId: meta.publicId,
        alt: altText.trim() || undefined,
        width: meta.width,
        height: meta.height,
        format: meta.format,
      });
      if (oldPid && oldPid !== meta.publicId) {
        try {
          await deleteCatalogMedia(oldPid);
        } catch {
          /* best-effort */
        }
      }
    } catch (e) {
      setErr(e instanceof AdminApiError ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    void applyUpload(file);
  }

  async function remove() {
    const pid = value?.publicId;
    onChange(null);
    onAltChange("");
    if (pid) {
      try {
        await deleteCatalogMedia(pid);
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-slate-600">{label}</span>
      {value?.url ? (
        <div className="flex flex-wrap items-start gap-3">
          {/* Admin preview — avoid next/image remote config churn */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt={altText || ""}
            className="h-28 max-w-[min(100%,280px)] rounded-sm border border-slate-200 object-contain"
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-sm border px-2 py-1 text-xs"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? "Uploading…" : "Replace"}
            </button>
            <button type="button" className="text-left text-xs text-rose-600 underline" onClick={() => void remove()}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="w-full rounded-sm border border-dashed border-slate-300 px-3 py-6 text-sm text-slate-600"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Choose image or drag target (click)"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onPick}
      />
      <label className="block">
        <span className="text-xs text-slate-600">Alt text</span>
        <input
          className="mt-1 w-full rounded-sm border px-2 py-1 text-sm"
          value={altText}
          onChange={(e) => onAltChange(e.target.value)}
        />
      </label>
      {err ? <p className="text-xs text-rose-600">{err}</p> : null}
    </div>
  );
}
