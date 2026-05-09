import { ADMIN_CATALOG_API_BASE } from "./config";
import { AdminApiError } from "./http";
import { getCatalogActorId } from "@/config/public-env";

export type UploadedMediaAsset = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

function actorHeaders(): HeadersInit {
  const id = typeof window !== "undefined" ? localStorage.getItem("catalogActorId") : null;
  const fromEnv = getCatalogActorId();
  const actor = id ?? fromEnv;
  return actor && /^[a-f\d]{24}$/i.test(actor)
    ? { "x-catalog-actor-id": actor }
    : {};
}

/** Multipart upload — proxied to catalog-admin-api with server-side API key. */
export async function uploadCatalogMedia(file: File, folder?: string): Promise<UploadedMediaAsset> {
  const fd = new FormData();
  fd.append("file", file);
  const qs = folder ? `?folder=${encodeURIComponent(folder)}` : "";
  const headers = new Headers(actorHeaders());
  const res = await fetch(`${ADMIN_CATALOG_API_BASE}/media/upload${qs}`, {
    method: "POST",
    body: fd,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) msg = body.message;
    } catch {
      /* ignore */
    }
    throw new AdminApiError(res.status, msg);
  }
  return res.json() as Promise<UploadedMediaAsset>;
}

export async function deleteCatalogMedia(publicId: string): Promise<void> {
  const res = await fetch(`${ADMIN_CATALOG_API_BASE}/media/asset`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      ...actorHeaders(),
    },
    body: JSON.stringify({ publicId }),
    cache: "no-store",
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) msg = body.message;
    } catch {
      /* ignore */
    }
    throw new AdminApiError(res.status, msg);
  }
}
