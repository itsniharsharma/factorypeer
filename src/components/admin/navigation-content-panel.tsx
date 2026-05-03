"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminApiError,
  createFooterContent,
  createNavigationLinkGroup,
  deleteFooterContent,
  deleteNavigationLinkGroup,
  listFooterContents,
  listNavigationLinkGroups,
  seedElectricalShowcaseFooterFromAdminPanel,
  type FooterContentDoc,
  type FooterSocialLinkDoc,
  type PublishStatus,
  type SiteLinkDoc,
  type SiteLinkGroupDoc,
  type SiteLinkGroupPlacement,
  updateFooterContent,
  updateNavigationLinkGroup,
} from "@/lib/admin-api";
import { AdminModal } from "./modal";

type LinkGroupModalState = null | { mode: "create" } | { mode: "edit"; item: SiteLinkGroupDoc };
type FooterContentModalState = null | { mode: "create" } | { mode: "edit"; item: FooterContentDoc };
type ReorderTarget = null | { kind: "groups" | "footer-content"; ids: string[] };

function nextStatusForToggle(current: PublishStatus): PublishStatus {
  return current === "published" ? "draft" : "published";
}

export function NavigationContentPanel() {
  const [loading, setLoading] = useState(true);
  const [placementFilter, setPlacementFilter] = useState<SiteLinkGroupPlacement>("utility");
  const [statusFilter, setStatusFilter] = useState<"" | PublishStatus>("");
  const [linkGroups, setLinkGroups] = useState<SiteLinkGroupDoc[]>([]);
  const [footerContents, setFooterContents] = useState<FooterContentDoc[]>([]);

  const [linkGroupModal, setLinkGroupModal] = useState<LinkGroupModalState>(null);
  const [footerModal, setFooterModal] = useState<FooterContentModalState>(null);
  const [reorderTarget, setReorderTarget] = useState<ReorderTarget>(null);
  const [footerShowcaseSeeding, setFooterShowcaseSeeding] = useState(false);

  const [linkGroupForm, setLinkGroupForm] = useState({
    slug: "",
    title: "",
    placement: "utility" as SiteLinkGroupPlacement,
    description: "",
    status: "draft" as PublishStatus,
    sortOrder: "0",
    links: [] as SiteLinkDoc[],
  });

  const [footerForm, setFooterForm] = useState({
    slug: "",
    brandName: "",
    newsletterHeading: "",
    newsletterDescription: "",
    newsletterCtaLabel: "",
    newsletterCtaHref: "",
    feedbackHeading: "",
    feedbackCtaLabel: "",
    feedbackCtaHref: "",
    copyrightText: "",
    status: "draft" as PublishStatus,
    sortOrder: "0",
    socialLinks: [] as FooterSocialLinkDoc[],
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [groupsRes, footerRes] = await Promise.all([
        listNavigationLinkGroups({
          placement: placementFilter,
          status: statusFilter || undefined,
        }),
        listFooterContents({ status: statusFilter || undefined }),
      ]);
      setLinkGroups(groupsRes.items);
      setFooterContents(footerRes.items);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load navigation content");
    } finally {
      setLoading(false);
    }
  }, [placementFilter, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function applyElectricalShowcaseFooterFromPanel() {
    setFooterShowcaseSeeding(true);
    try {
      const { created, updated } = await seedElectricalShowcaseFooterFromAdminPanel();
      const parts: string[] = [];
      if (created.length) parts.push(`Created: ${created.join(", ")}`);
      if (updated.length) parts.push(`Updated: ${updated.join(", ")}`);
      toast.success(parts.length ? parts.join(" · ") : "Footer showcase data applied");
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to apply Electrical showcase footer");
    } finally {
      setFooterShowcaseSeeding(false);
    }
  }

  const linkGroupById = useMemo(() => new Map(linkGroups.map((x) => [x._id, x])), [linkGroups]);
  const footerById = useMemo(() => new Map(footerContents.map((x) => [x._id, x])), [footerContents]);

  function openCreateLinkGroup() {
    setLinkGroupForm({
      slug: "",
      title: "",
      placement: placementFilter,
      description: "",
      status: "draft",
      sortOrder: "0",
      links: [],
    });
    setLinkGroupModal({ mode: "create" });
  }

  function openEditLinkGroup(item: SiteLinkGroupDoc) {
    setLinkGroupForm({
      slug: item.slug,
      title: item.title,
      placement: item.placement,
      description: item.description ?? "",
      status: item.status,
      sortOrder: String(item.sortOrder ?? 0),
      links: (item.links ?? []).map((link) => ({ ...link })),
    });
    setLinkGroupModal({ mode: "edit", item });
  }

  function updateLinkAt(index: number, patch: Partial<SiteLinkDoc>) {
    setLinkGroupForm((prev) => {
      const links = [...prev.links];
      links[index] = { ...links[index], ...patch };
      return { ...prev, links };
    });
  }

  function addLink() {
    setLinkGroupForm((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        { label: "", href: "", status: "published", sortOrder: prev.links.length },
      ],
    }));
  }

  function removeLink(index: number) {
    setLinkGroupForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  }

  async function saveLinkGroup() {
    const sortOrder = Number.parseInt(linkGroupForm.sortOrder, 10);
    if (Number.isNaN(sortOrder)) {
      toast.error("Link group sort order must be a number");
      return;
    }
    if (!linkGroupForm.slug.trim() || !linkGroupForm.title.trim()) {
      toast.error("Link group slug and title are required");
      return;
    }
    if (linkGroupForm.links.some((x) => !x.label?.trim() || !x.href?.trim())) {
      toast.error("Every link must have a label and href");
      return;
    }

    const payload = {
      slug: linkGroupForm.slug.trim(),
      title: linkGroupForm.title.trim(),
      placement: linkGroupForm.placement,
      description: linkGroupForm.description.trim() || undefined,
      status: linkGroupForm.status,
      sortOrder,
      links: linkGroupForm.links.map((x, index) => ({
        label: x.label.trim(),
        href: x.href.trim(),
        description: x.description?.trim() || undefined,
        icon: x.icon?.trim() || undefined,
        external: Boolean(x.external),
        openInNewTab: Boolean(x.openInNewTab),
        sortOrder: x.sortOrder ?? index,
        status: x.status ?? "published",
      })),
    };

    try {
      if (linkGroupModal?.mode === "create") {
        await createNavigationLinkGroup(payload);
        toast.success("Link group created");
      } else if (linkGroupModal?.mode === "edit") {
        await updateNavigationLinkGroup(linkGroupModal.item._id, payload);
        toast.success("Link group updated");
      }
      setLinkGroupModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Link group save failed");
    }
  }

  async function removeLinkGroup(item: SiteLinkGroupDoc) {
    if (!confirm(`Delete link group "${item.title}"?`)) return;
    try {
      await deleteNavigationLinkGroup(item._id);
      toast.success("Link group deleted");
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Link group delete failed");
    }
  }

  async function toggleGroupPublish(item: SiteLinkGroupDoc) {
    try {
      await updateNavigationLinkGroup(item._id, { status: nextStatusForToggle(item.status) });
      toast.success(`Link group moved to ${nextStatusForToggle(item.status)}`);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Link group status update failed");
    }
  }

  function openCreateFooterContent() {
    setFooterForm({
      slug: "",
      brandName: "",
      newsletterHeading: "",
      newsletterDescription: "",
      newsletterCtaLabel: "",
      newsletterCtaHref: "",
      feedbackHeading: "",
      feedbackCtaLabel: "",
      feedbackCtaHref: "",
      copyrightText: "",
      status: "draft",
      sortOrder: "0",
      socialLinks: [],
    });
    setFooterModal({ mode: "create" });
  }

  function openEditFooterContent(item: FooterContentDoc) {
    setFooterForm({
      slug: item.slug,
      brandName: item.brandName ?? "",
      newsletterHeading: item.newsletterHeading ?? "",
      newsletterDescription: item.newsletterDescription ?? "",
      newsletterCtaLabel: item.newsletterCtaLabel ?? "",
      newsletterCtaHref: item.newsletterCtaHref ?? "",
      feedbackHeading: item.feedbackHeading ?? "",
      feedbackCtaLabel: item.feedbackCtaLabel ?? "",
      feedbackCtaHref: item.feedbackCtaHref ?? "",
      copyrightText: item.copyrightText ?? "",
      status: item.status,
      sortOrder: String(item.sortOrder ?? 0),
      socialLinks: (item.socialLinks ?? []).map((link) => ({ ...link })),
    });
    setFooterModal({ mode: "edit", item });
  }

  function addSocialLink() {
    setFooterForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { label: "", href: "", icon: "", sortOrder: prev.socialLinks.length }],
    }));
  }

  function updateSocialLinkAt(index: number, patch: Partial<FooterSocialLinkDoc>) {
    setFooterForm((prev) => {
      const links = [...prev.socialLinks];
      links[index] = { ...links[index], ...patch };
      return { ...prev, socialLinks: links };
    });
  }

  function removeSocialLink(index: number) {
    setFooterForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  }

  async function saveFooterContent() {
    const sortOrder = Number.parseInt(footerForm.sortOrder, 10);
    if (Number.isNaN(sortOrder)) {
      toast.error("Footer content sort order must be a number");
      return;
    }
    if (!footerForm.slug.trim()) {
      toast.error("Footer content slug is required");
      return;
    }
    if (footerForm.socialLinks.some((x) => !x.label?.trim() || !x.href?.trim())) {
      toast.error("Every social link must have a label and href");
      return;
    }

    const payload = {
      slug: footerForm.slug.trim(),
      brandName: footerForm.brandName.trim() || undefined,
      newsletterHeading: footerForm.newsletterHeading.trim() || undefined,
      newsletterDescription: footerForm.newsletterDescription.trim() || undefined,
      newsletterCtaLabel: footerForm.newsletterCtaLabel.trim() || undefined,
      newsletterCtaHref: footerForm.newsletterCtaHref.trim() || undefined,
      feedbackHeading: footerForm.feedbackHeading.trim() || undefined,
      feedbackCtaLabel: footerForm.feedbackCtaLabel.trim() || undefined,
      feedbackCtaHref: footerForm.feedbackCtaHref.trim() || undefined,
      copyrightText: footerForm.copyrightText.trim() || undefined,
      status: footerForm.status,
      sortOrder,
      socialLinks: footerForm.socialLinks.map((x, index) => ({
        label: x.label.trim(),
        href: x.href.trim(),
        icon: x.icon?.trim() || undefined,
        sortOrder: x.sortOrder ?? index,
      })),
    };

    try {
      if (footerModal?.mode === "create") {
        await createFooterContent(payload);
        toast.success("Footer content created");
      } else if (footerModal?.mode === "edit") {
        await updateFooterContent(footerModal.item._id, payload);
        toast.success("Footer content updated");
      }
      setFooterModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Footer content save failed");
    }
  }

  async function removeFooterContent(item: FooterContentDoc) {
    if (!confirm(`Delete footer content "${item.slug}"?`)) return;
    try {
      await deleteFooterContent(item._id);
      toast.success("Footer content deleted");
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Footer content delete failed");
    }
  }

  async function toggleFooterPublish(item: FooterContentDoc) {
    try {
      await updateFooterContent(item._id, { status: nextStatusForToggle(item.status) });
      toast.success(`Footer content moved to ${nextStatusForToggle(item.status)}`);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Footer content status update failed");
    }
  }

  function openReorder(kind: "groups" | "footer-content") {
    const ids = kind === "groups" ? linkGroups.map((x) => x._id) : footerContents.map((x) => x._id);
    setReorderTarget({ kind, ids });
  }

  function moveReorderIx(i: number, dir: -1 | 1) {
    if (!reorderTarget) return;
    const j = i + dir;
    if (j < 0 || j >= reorderTarget.ids.length) return;
    const ids = [...reorderTarget.ids];
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setReorderTarget({ ...reorderTarget, ids });
  }

  async function saveReorder() {
    if (!reorderTarget) return;
    try {
      for (let i = 0; i < reorderTarget.ids.length; i += 1) {
        const id = reorderTarget.ids[i];
        if (reorderTarget.kind === "groups") {
          await updateNavigationLinkGroup(id, { sortOrder: i });
        } else {
          await updateFooterContent(id, { sortOrder: i });
        }
      }
      toast.success("Order saved");
      setReorderTarget(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Reorder failed");
    }
  }

  const reorderLabels = reorderTarget
    ? reorderTarget.kind === "groups"
      ? reorderTarget.ids.map((id) => linkGroupById.get(id)?.title ?? id)
      : reorderTarget.ids.map((id) => footerById.get(id)?.slug ?? id)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Navigation & Footer Content</h1>
        <p className="text-sm text-slate-600">
          Manage utility, navigation, and <strong>footer</strong> link groups, plus footer content (brand line, newsletter,
          feedback, copyright, social links). The storefront footer reads only <strong>published</strong> records from
          here—same in local and deployed environments after you sign in to admin.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-medium text-slate-800">Change the footer after deploy:</span> set{" "}
          <span className="font-mono text-xs">Placement</span> to <strong>footer</strong>, then use{" "}
          <em>New Link Group</em> / <em>Edit</em> / <em>Publish</em> for each column. In <strong>Footer Content</strong>{" "}
          below, use <em>New Footer Content</em> or <em>Edit</em> on your block (e.g.{" "}
          <span className="font-mono text-xs">electrical-showcase-footer</span>) for the main strip. Reorder with the
          reorder buttons if you have multiple blocks or groups.
        </p>
      </div>

      <div className="rounded-sm border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl">
            <span className="font-medium text-slate-900">Electrical showcase footer (optional shortcut).</span> One click
            creates or updates the same three footer link groups and one footer content document you could add
            manually above—using identical <em>New / Edit</em> APIs. After that, ongoing edits are always through{" "}
            <em>Edit</em> on this page; deployed admins use the same controls.
          </p>
          <button
            type="button"
            className="shrink-0 rounded-sm bg-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={footerShowcaseSeeding}
            onClick={() => void applyElectricalShowcaseFooterFromPanel()}
          >
            {footerShowcaseSeeding ? "Applying…" : "Load Electrical showcase footer"}
          </button>
        </div>
      </div>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-sm">
              <span className="text-slate-600">Placement</span>
              <select
                className="mt-1 block rounded-sm border border-slate-200 px-2 py-1"
                value={placementFilter}
                onChange={(e) => setPlacementFilter(e.target.value as SiteLinkGroupPlacement)}
              >
                <option value="utility">utility</option>
                <option value="navigation">navigation</option>
                <option value="footer">footer</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="text-slate-600">Status</span>
              <select
                className="mt-1 block rounded-sm border border-slate-200 px-2 py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "" | PublishStatus)}
              >
                <option value="">any</option>
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <button type="button" className="rounded-sm border px-3 py-1 text-sm" onClick={() => openReorder("groups")}>Reorder Groups</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-1 text-sm text-white" onClick={openCreateLinkGroup}>New Link Group</button>
          </div>
        </div>
        {loading ? <p className="text-sm text-slate-600">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Slug</th>
                  <th className="px-2 py-2">Placement</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Sort</th>
                  <th className="px-2 py-2">Links</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {linkGroups.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium">{item.title}</td>
                    <td className="px-2 py-2 font-mono text-xs">{item.slug}</td>
                    <td className="px-2 py-2 text-xs">{item.placement}</td>
                    <td className="px-2 py-2 text-xs">{item.status}</td>
                    <td className="px-2 py-2 text-xs">{item.sortOrder ?? 0}</td>
                    <td className="px-2 py-2 text-xs">{item.links?.length ?? 0}</td>
                    <td className="px-2 py-2 text-right">
                      <button type="button" className="mr-2 text-xs text-brand underline" onClick={() => void toggleGroupPublish(item)}>
                        {item.status === "published" ? "Set Draft" : "Publish"}
                      </button>
                      <button type="button" className="mr-2 text-xs underline" onClick={() => openEditLinkGroup(item)}>Edit</button>
                      <button type="button" className="text-xs text-rose-600 underline" onClick={() => void removeLinkGroup(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-800">Footer Content</h2>
          <div className="flex gap-2">
            <button type="button" className="rounded-sm border px-3 py-1 text-sm" onClick={() => openReorder("footer-content")}>Reorder Footer Content</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-1 text-sm text-white" onClick={openCreateFooterContent}>New Footer Content</button>
          </div>
        </div>
        {loading ? <p className="text-sm text-slate-600">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                  <th className="px-2 py-2">Slug</th>
                  <th className="px-2 py-2">Brand</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Sort</th>
                  <th className="px-2 py-2">Social Links</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {footerContents.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-mono text-xs">{item.slug}</td>
                    <td className="px-2 py-2 text-xs">{item.brandName ?? "—"}</td>
                    <td className="px-2 py-2 text-xs">{item.status}</td>
                    <td className="px-2 py-2 text-xs">{item.sortOrder ?? 0}</td>
                    <td className="px-2 py-2 text-xs">{item.socialLinks?.length ?? 0}</td>
                    <td className="px-2 py-2 text-right">
                      <button type="button" className="mr-2 text-xs text-brand underline" onClick={() => void toggleFooterPublish(item)}>
                        {item.status === "published" ? "Set Draft" : "Publish"}
                      </button>
                      <button type="button" className="mr-2 text-xs underline" onClick={() => openEditFooterContent(item)}>Edit</button>
                      <button type="button" className="text-xs text-rose-600 underline" onClick={() => void removeFooterContent(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AdminModal
        open={linkGroupModal !== null}
        title={linkGroupModal?.mode === "edit" ? "Edit Link Group" : "New Link Group"}
        onClose={() => setLinkGroupModal(null)}
        wide
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setLinkGroupModal(null)}>Cancel</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveLinkGroup()}>Save</button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <label><span className="text-slate-600">Slug</span><input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs" value={linkGroupForm.slug} onChange={(e) => setLinkGroupForm((p) => ({ ...p, slug: e.target.value }))} /></label>
          <label><span className="text-slate-600">Title</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={linkGroupForm.title} onChange={(e) => setLinkGroupForm((p) => ({ ...p, title: e.target.value }))} /></label>
          <label><span className="text-slate-600">Placement</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={linkGroupForm.placement} onChange={(e) => setLinkGroupForm((p) => ({ ...p, placement: e.target.value as SiteLinkGroupPlacement }))}><option value="utility">utility</option><option value="navigation">navigation</option><option value="footer">footer</option></select></label>
          <label><span className="text-slate-600">Status</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={linkGroupForm.status} onChange={(e) => setLinkGroupForm((p) => ({ ...p, status: e.target.value as PublishStatus }))}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
          <label className="md:col-span-2"><span className="text-slate-600">Description</span><textarea className="mt-1 w-full rounded-sm border px-2 py-1" rows={2} value={linkGroupForm.description} onChange={(e) => setLinkGroupForm((p) => ({ ...p, description: e.target.value }))} /></label>
          <label><span className="text-slate-600">Sort Order</span><input className="mt-1 w-full rounded-sm border px-2 py-1" inputMode="numeric" value={linkGroupForm.sortOrder} onChange={(e) => setLinkGroupForm((p) => ({ ...p, sortOrder: e.target.value }))} /></label>
        </div>

        <div className="mt-4 rounded-sm border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Links</h3>
            <button type="button" className="text-xs text-brand underline" onClick={addLink}>Add Link</button>
          </div>
          <div className="space-y-3">
            {linkGroupForm.links.map((link, idx) => (
              <div key={`${link.label}-${idx}`} className="rounded-sm border border-slate-200 p-2">
                <div className="grid gap-2 text-xs md:grid-cols-2">
                  <label><span className="text-slate-600">Label</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={link.label} onChange={(e) => updateLinkAt(idx, { label: e.target.value })} /></label>
                  <label><span className="text-slate-600">Href</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={link.href} onChange={(e) => updateLinkAt(idx, { href: e.target.value })} /></label>
                  <label><span className="text-slate-600">Description</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={link.description ?? ""} onChange={(e) => updateLinkAt(idx, { description: e.target.value })} /></label>
                  <label><span className="text-slate-600">Icon</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={link.icon ?? ""} onChange={(e) => updateLinkAt(idx, { icon: e.target.value })} /></label>
                  <label><span className="text-slate-600">Status</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={link.status ?? "published"} onChange={(e) => updateLinkAt(idx, { status: e.target.value as PublishStatus })}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
                  <label><span className="text-slate-600">Sort</span><input className="mt-1 w-full rounded-sm border px-2 py-1" inputMode="numeric" value={String(link.sortOrder ?? idx)} onChange={(e) => updateLinkAt(idx, { sortOrder: Number.parseInt(e.target.value || "0", 10) })} /></label>
                  <label className="flex items-center gap-2 pt-5"><input type="checkbox" checked={Boolean(link.external)} onChange={(e) => updateLinkAt(idx, { external: e.target.checked })} /><span>External</span></label>
                  <label className="flex items-center gap-2 pt-5"><input type="checkbox" checked={Boolean(link.openInNewTab)} onChange={(e) => updateLinkAt(idx, { openInNewTab: e.target.checked })} /><span>Open in new tab</span></label>
                </div>
                <div className="mt-2 text-right">
                  <button type="button" className="text-xs text-rose-600 underline" onClick={() => removeLink(idx)}>Remove</button>
                </div>
              </div>
            ))}
            {linkGroupForm.links.length === 0 ? <p className="text-xs text-slate-500">No links yet.</p> : null}
          </div>
        </div>
      </AdminModal>

      <AdminModal
        open={footerModal !== null}
        title={footerModal?.mode === "edit" ? "Edit Footer Content" : "New Footer Content"}
        onClose={() => setFooterModal(null)}
        wide
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setFooterModal(null)}>Cancel</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveFooterContent()}>Save</button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <label><span className="text-slate-600">Slug</span><input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs" value={footerForm.slug} onChange={(e) => setFooterForm((p) => ({ ...p, slug: e.target.value }))} /></label>
          <label><span className="text-slate-600">Brand Name</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.brandName} onChange={(e) => setFooterForm((p) => ({ ...p, brandName: e.target.value }))} /></label>
          <label><span className="text-slate-600">Status</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.status} onChange={(e) => setFooterForm((p) => ({ ...p, status: e.target.value as PublishStatus }))}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
          <label><span className="text-slate-600">Sort Order</span><input className="mt-1 w-full rounded-sm border px-2 py-1" inputMode="numeric" value={footerForm.sortOrder} onChange={(e) => setFooterForm((p) => ({ ...p, sortOrder: e.target.value }))} /></label>
          <label><span className="text-slate-600">Newsletter Heading</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.newsletterHeading} onChange={(e) => setFooterForm((p) => ({ ...p, newsletterHeading: e.target.value }))} /></label>
          <label><span className="text-slate-600">Newsletter CTA Label</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.newsletterCtaLabel} onChange={(e) => setFooterForm((p) => ({ ...p, newsletterCtaLabel: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="text-slate-600">Newsletter Description</span><textarea className="mt-1 w-full rounded-sm border px-2 py-1" rows={2} value={footerForm.newsletterDescription} onChange={(e) => setFooterForm((p) => ({ ...p, newsletterDescription: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="text-slate-600">Newsletter CTA Href</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.newsletterCtaHref} onChange={(e) => setFooterForm((p) => ({ ...p, newsletterCtaHref: e.target.value }))} /></label>
          <label><span className="text-slate-600">Feedback Heading</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.feedbackHeading} onChange={(e) => setFooterForm((p) => ({ ...p, feedbackHeading: e.target.value }))} /></label>
          <label><span className="text-slate-600">Feedback CTA Label</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.feedbackCtaLabel} onChange={(e) => setFooterForm((p) => ({ ...p, feedbackCtaLabel: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="text-slate-600">Feedback CTA Href</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.feedbackCtaHref} onChange={(e) => setFooterForm((p) => ({ ...p, feedbackCtaHref: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="text-slate-600">Copyright Text</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.copyrightText} onChange={(e) => setFooterForm((p) => ({ ...p, copyrightText: e.target.value }))} /></label>
        </div>

        <div className="mt-4 rounded-sm border border-slate-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Social Links</h3>
            <button type="button" className="text-xs text-brand underline" onClick={addSocialLink}>Add Social Link</button>
          </div>
          <div className="space-y-3">
            {footerForm.socialLinks.map((link, idx) => (
              <div key={`${link.label}-${idx}`} className="rounded-sm border border-slate-200 p-2">
                <div className="grid gap-2 text-xs md:grid-cols-2">
                  <label><span className="text-slate-600">Label</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={link.label} onChange={(e) => updateSocialLinkAt(idx, { label: e.target.value })} /></label>
                  <label><span className="text-slate-600">Href</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={link.href} onChange={(e) => updateSocialLinkAt(idx, { href: e.target.value })} /></label>
                  <label><span className="text-slate-600">Icon</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={link.icon ?? ""} onChange={(e) => updateSocialLinkAt(idx, { icon: e.target.value })} /></label>
                  <label><span className="text-slate-600">Sort</span><input className="mt-1 w-full rounded-sm border px-2 py-1" inputMode="numeric" value={String(link.sortOrder ?? idx)} onChange={(e) => updateSocialLinkAt(idx, { sortOrder: Number.parseInt(e.target.value || "0", 10) })} /></label>
                </div>
                <div className="mt-2 text-right">
                  <button type="button" className="text-xs text-rose-600 underline" onClick={() => removeSocialLink(idx)}>Remove</button>
                </div>
              </div>
            ))}
            {footerForm.socialLinks.length === 0 ? <p className="text-xs text-slate-500">No social links yet.</p> : null}
          </div>
        </div>
      </AdminModal>

      <AdminModal
        open={reorderTarget !== null}
        title={reorderTarget ? `Reorder ${reorderTarget.kind}` : ""}
        onClose={() => setReorderTarget(null)}
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setReorderTarget(null)}>Cancel</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveReorder()}>Save Order</button>
          </div>
        }
      >
        {reorderTarget ? (
          <ul className="space-y-1">
            {reorderTarget.ids.map((id, i) => (
              <li key={id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate">{reorderLabels[i]}</span>
                <button type="button" className="text-xs underline" onClick={() => moveReorderIx(i, -1)}>Up</button>
                <button type="button" className="text-xs underline" onClick={() => moveReorderIx(i, 1)}>Down</button>
              </li>
            ))}
          </ul>
        ) : null}
      </AdminModal>
    </div>
  );
}

export default NavigationContentPanel;
