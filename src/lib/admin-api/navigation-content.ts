import { adminFetchJson, adminFetchJsonList } from "./http";
import type {
  FooterContentDoc,
  PublishStatus,
  SiteLinkGroupDoc,
  SiteLinkGroupPlacement,
} from "./types";

type LinkGroupListQuery = {
  status?: PublishStatus;
  placement?: SiteLinkGroupPlacement;
};

function toQs(query?: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v) sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export async function listNavigationLinkGroups(
  query?: LinkGroupListQuery,
): Promise<{ items: SiteLinkGroupDoc[]; total?: number }> {
  const { data, total } = await adminFetchJsonList<SiteLinkGroupDoc[]>(
    `/navigation/link-groups${toQs({ status: query?.status, placement: query?.placement })}`,
  );
  return { items: data, total };
}

export async function createNavigationLinkGroup(
  body: Record<string, unknown>,
): Promise<SiteLinkGroupDoc> {
  return adminFetchJson<SiteLinkGroupDoc>("/navigation/link-groups", {
    method: "POST",
    json: body,
  });
}

export async function updateNavigationLinkGroup(
  id: string,
  body: Record<string, unknown>,
): Promise<SiteLinkGroupDoc | null> {
  return adminFetchJson<SiteLinkGroupDoc | null>(`/navigation/link-groups/${id}`, {
    method: "PATCH",
    json: body,
  });
}

export async function deleteNavigationLinkGroup(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/navigation/link-groups/${id}`, { method: "DELETE" });
}

export async function listFooterContents(
  query?: { status?: PublishStatus },
): Promise<{ items: FooterContentDoc[]; total?: number }> {
  const { data, total } = await adminFetchJsonList<FooterContentDoc[]>(
    `/navigation/footer-content${toQs({ status: query?.status })}`,
  );
  return { items: data, total };
}

export async function createFooterContent(body: Record<string, unknown>): Promise<FooterContentDoc> {
  return adminFetchJson<FooterContentDoc>("/navigation/footer-content", {
    method: "POST",
    json: body,
  });
}

export async function updateFooterContent(
  id: string,
  body: Record<string, unknown>,
): Promise<FooterContentDoc | null> {
  return adminFetchJson<FooterContentDoc | null>(`/navigation/footer-content/${id}`, {
    method: "PATCH",
    json: body,
  });
}

export async function deleteFooterContent(id: string): Promise<unknown> {
  return adminFetchJson<unknown>(`/navigation/footer-content/${id}`, { method: "DELETE" });
}
