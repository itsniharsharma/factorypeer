import { getCatalogAdminApiKey, isDebugEnabled } from "@/config/server-env";

export function getCatalogAdminBearerToken(): string | undefined {
  return getCatalogAdminApiKey();
}

export function getCatalogAdminAuthHeader(): Record<string, string> {
  const token = getCatalogAdminBearerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function maskCatalogAdminBearerToken(token?: string): string | undefined {
  if (!token) return undefined;
  return `Bearer ${token.slice(0, 12)}***`;
}

export function shouldLogCatalogRequests(): boolean {
  return isDebugEnabled("FP_CATALOG_DEBUG");
}

export function logCatalogRequest(label: string, url: string, token?: string) {
  if (!shouldLogCatalogRequests()) return;
  console.info("[catalog] request", {
    label,
    url,
    hasAuthorization: Boolean(token),
    authorization: maskCatalogAdminBearerToken(token),
  });
}