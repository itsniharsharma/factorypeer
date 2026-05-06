"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AdminApiError,
  createFooterContent,
  createNavigationLinkGroup,
  deleteFooterContent,
  deleteNavigationLinkGroup,
  listFooterContents,
  listNavigationLinkGroups,
  type FooterAppDownloadBlockDoc,
  type FooterAppDownloadLinkDoc,
  type FooterColumnDoc,
  type FooterConnectBlockDoc,
  type FooterContentDoc,
  type FooterLinkDoc,
  type FooterNewsletterBlockDoc,
  type FooterSocialLinkDoc,
  type PublishStatus,
  type SiteLinkDoc,
  type SiteLinkGroupDoc,
  type SiteLinkGroupPlacement,
  updateFooterContent,
  updateNavigationLinkGroup,
} from "@/lib/admin-api";
import {
  buildFooterContentPayload,
  createEmptyFooterDraft,
  footerContentToDraft,
  type FooterContentDraft,
} from "@/lib/footer-content";
import { AdminModal } from "./modal";

type LinkGroupModalState = null | { mode: "create" } | { mode: "edit"; item: SiteLinkGroupDoc };
type FooterModalState = null | { mode: "create" } | { mode: "edit"; item: FooterContentDoc };

const placements: SiteLinkGroupPlacement[] = ["utility", "navigation"];

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function nextStatusForToggle(current: PublishStatus): PublishStatus {
  return current === "published" ? "draft" : "published";
}

export function NavigationContentPanel() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | PublishStatus>("");
  const [placementFilter, setPlacementFilter] = useState<SiteLinkGroupPlacement>("utility");
  const [linkGroups, setLinkGroups] = useState<SiteLinkGroupDoc[]>([]);
  const [footerDocs, setFooterDocs] = useState<FooterContentDoc[]>([]);

  const [linkModal, setLinkModal] = useState<LinkGroupModalState>(null);
  const [footerModal, setFooterModal] = useState<FooterModalState>(null);

  const [linkGroupForm, setLinkGroupForm] = useState({
    slug: "",
    title: "",
    placement: "utility" as SiteLinkGroupPlacement,
    description: "",
    status: "draft" as PublishStatus,
    sortOrder: "0",
    links: [] as SiteLinkDoc[],
  });
  const [footerForm, setFooterForm] = useState<FooterContentDraft>(createEmptyFooterDraft());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [groupsRes, footerRes] = await Promise.all([
        listNavigationLinkGroups({ placement: placementFilter, status: statusFilter || undefined }),
        listFooterContents({ status: statusFilter || undefined }),
      ]);
      setLinkGroups(groupsRes.items);
      setFooterDocs(footerRes.items);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load CMS content");
    } finally {
      setLoading(false);
    }
  }, [placementFilter, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveFooter() {
    try {
      const payload = buildFooterContentPayload(footerForm);

      if (footerModal?.mode === "create") await createFooterContent(payload);
      else if (footerModal?.mode === "edit") await updateFooterContent(footerModal.item._id, payload);
      toast.success("Footer content saved");
      setFooterModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save footer");
    }
  }

  async function saveLinkGroup() {
    try {
      const sortOrder = Number.parseInt(linkGroupForm.sortOrder, 10);
      if (Number.isNaN(sortOrder)) throw new Error("Sort order must be numeric");
      if (!linkGroupForm.slug.trim() || !linkGroupForm.title.trim()) throw new Error("Slug and title are required");
      const payload = {
        slug: linkGroupForm.slug.trim(),
        title: linkGroupForm.title.trim(),
        placement: linkGroupForm.placement,
        description: linkGroupForm.description.trim() || undefined,
        status: linkGroupForm.status,
        sortOrder,
        links: linkGroupForm.links.map((l, i) => ({
          label: l.label?.trim() || "",
          href: l.href?.trim() || "",
          external: Boolean(l.external),
          openInNewTab: Boolean(l.openInNewTab),
          sortOrder: l.sortOrder ?? i,
          status: l.status ?? "published",
        })),
      };
      if (payload.links.some((l) => !l.label || !l.href)) throw new Error("Each link needs label and URL");
      if (linkModal?.mode === "create") await createNavigationLinkGroup(payload);
      else if (linkModal?.mode === "edit") await updateNavigationLinkGroup(linkModal.item._id, payload);
      toast.success("Navigation group saved");
      setLinkModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save group");
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-xl font-bold text-slate-900">Navigation & Footer CMS</h1>
        <p className="text-sm text-slate-600">Build the full storefront footer from Mongo content: pre-footer band, columns, newsletter, app links, connect/social, and legal strip.</p>
      </header>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="flex gap-2">
            <label className="text-sm"><span className="text-slate-600">Placement</span><select className="mt-1 block rounded-sm border px-2 py-1" value={placementFilter} onChange={(e) => setPlacementFilter(e.target.value as SiteLinkGroupPlacement)}>{placements.map((p) => <option key={p} value={p}>{p}</option>)}</select></label>
            <label className="text-sm"><span className="text-slate-600">Status</span><select className="mt-1 block rounded-sm border px-2 py-1" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "" | PublishStatus)}><option value="">any</option><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
          </div>
          <button type="button" className="rounded-sm bg-brand px-3 py-1 text-sm text-white" onClick={() => { setLinkGroupForm({ slug: "", title: "", placement: placementFilter, description: "", status: "draft", sortOrder: "0", links: [] }); setLinkModal({ mode: "create" }); }}>New Link Group</button>
        </div>
        {loading ? <p className="text-sm text-slate-600">Loading…</p> : <div className="space-y-2">{linkGroups.map((g) => <div key={g._id} className="flex items-center justify-between rounded-sm border px-3 py-2 text-sm"><div><div className="font-medium">{g.title}</div><div className="font-mono text-xs text-slate-500">{g.slug}</div></div><div className="flex gap-2"><button className="text-xs underline" onClick={() => { setLinkGroupForm({ slug: g.slug, title: g.title, placement: g.placement, description: g.description ?? "", status: g.status, sortOrder: String(g.sortOrder ?? 0), links: (g.links ?? []).map((x) => ({ ...x })) }); setLinkModal({ mode: "edit", item: g }); }}>Edit</button><button className="text-xs underline" onClick={() => void updateNavigationLinkGroup(g._id, { status: nextStatusForToggle(g.status) }).then(load)}>Toggle</button><button className="text-xs text-rose-600 underline" onClick={() => void deleteNavigationLinkGroup(g._id).then(load)}>Delete</button></div></div>)}</div>}
      </section>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Footer Content Documents</h2>
          <button type="button" className="rounded-sm bg-brand px-3 py-1 text-sm text-white" onClick={() => { setFooterForm(createEmptyFooterDraft()); setFooterModal({ mode: "create" }); }}>New Footer Doc</button>
        </div>
        {loading ? <p className="text-sm text-slate-600">Loading…</p> : <div className="space-y-2">{footerDocs.map((d) => <div key={d._id} className="flex items-center justify-between rounded-sm border px-3 py-2 text-sm"><div><div className="font-medium">{d.slug}</div><div className="text-xs text-slate-500">columns {d.columns?.length ?? 0} · social {d.socialLinks?.length ?? 0} · legal {d.legalLinks?.length ?? 0}</div></div><div className="flex gap-2"><button className="text-xs underline" onClick={() => { setFooterForm(footerContentToDraft(d)); setFooterModal({ mode: "edit", item: d }); }}>Edit</button><button className="text-xs underline" onClick={() => void updateFooterContent(d._id, { status: nextStatusForToggle(d.status) }).then(load)}>Toggle</button><button className="text-xs text-rose-600 underline" onClick={() => void deleteFooterContent(d._id).then(load)}>Delete</button></div></div>)}</div>}
      </section>

      <AdminModal open={linkModal !== null} title={linkModal?.mode === "edit" ? "Edit Link Group" : "New Link Group"} onClose={() => setLinkModal(null)} wide footer={<div className="mt-6 flex justify-end gap-2 border-t pt-4"><button className="rounded-sm border px-3 py-2 text-sm" onClick={() => setLinkModal(null)}>Cancel</button><button className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveLinkGroup()}>Save</button></div>}>
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <label><span className="text-slate-600">Slug</span><input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs" value={linkGroupForm.slug} onChange={(e) => setLinkGroupForm((p) => ({ ...p, slug: e.target.value }))} /></label>
          <label><span className="text-slate-600">Title</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={linkGroupForm.title} onChange={(e) => setLinkGroupForm((p) => ({ ...p, title: e.target.value }))} /></label>
          <label><span className="text-slate-600">Placement</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={linkGroupForm.placement} onChange={(e) => setLinkGroupForm((p) => ({ ...p, placement: e.target.value as SiteLinkGroupPlacement }))}>{placements.map((p) => <option key={p} value={p}>{p}</option>)}</select></label>
          <label><span className="text-slate-600">Status</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={linkGroupForm.status} onChange={(e) => setLinkGroupForm((p) => ({ ...p, status: e.target.value as PublishStatus }))}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
        </div>
      </AdminModal>

      <AdminModal open={footerModal !== null} title={footerModal?.mode === "edit" ? "Edit Footer CMS" : "New Footer CMS"} onClose={() => setFooterModal(null)} wide footer={<div className="mt-6 flex justify-end gap-2 border-t pt-4"><button className="rounded-sm border px-3 py-2 text-sm" onClick={() => setFooterModal(null)}>Cancel</button><button className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveFooter()}>Save Footer</button></div>}>
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <label><span className="text-slate-600">Slug</span><input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs" value={footerForm.slug} onChange={(e) => setFooterForm((p) => ({ ...p, slug: e.target.value }))} /></label>
            <label><span className="text-slate-600">Status</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.status} onChange={(e) => setFooterForm((p) => ({ ...p, status: e.target.value as PublishStatus }))}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
            <label className="md:col-span-2"><span className="text-slate-600">Pre-footer heading</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.preFooterHeading} onChange={(e) => setFooterForm((p) => ({ ...p, preFooterHeading: e.target.value }))} /></label>
            <label className="md:col-span-2"><span className="text-slate-600">Pre-footer body</span><textarea rows={4} className="mt-1 w-full rounded-sm border px-2 py-1" value={footerForm.preFooterBody} onChange={(e) => setFooterForm((p) => ({ ...p, preFooterBody: e.target.value }))} /></label>
          </div>

          <div className="rounded-sm border p-3">
            <div className="mb-2 flex items-center justify-between"><h3 className="font-semibold">Footer Columns</h3><button className="text-xs text-brand underline" onClick={() => setFooterForm((p) => ({ ...p, columns: [...p.columns, { title: "", sortOrder: p.columns.length, links: [] }] }))}>Add Column</button></div>
            <div className="space-y-3">{footerForm.columns.map((c, i) => <div key={`${i}-${c.title}`} className="rounded border p-2"><div className="mb-2 flex items-center gap-2"><input className="flex-1 rounded border px-2 py-1" placeholder="Column title" value={c.title} onChange={(e) => setFooterForm((p) => { const columns = [...p.columns]; columns[i] = { ...columns[i], title: e.target.value }; return { ...p, columns }; })} /><button className="text-xs underline" onClick={() => setFooterForm((p) => ({ ...p, columns: move(p.columns, i, i - 1) }))}>Up</button><button className="text-xs underline" onClick={() => setFooterForm((p) => ({ ...p, columns: move(p.columns, i, i + 1) }))}>Down</button><button className="text-xs text-brand underline" onClick={() => setFooterForm((p) => { const columns = [...p.columns]; const links = columns[i].links ?? []; columns[i] = { ...columns[i], links: [...links, { label: "", href: "", external: false, openInNewTab: false, sortOrder: links.length }] }; return { ...p, columns }; })}>Add Link</button><button className="text-xs text-rose-600 underline" onClick={() => setFooterForm((p) => ({ ...p, columns: p.columns.filter((_, ix) => ix !== i) }))}>Delete</button></div><div className="space-y-2">{(c.links ?? []).map((l, j) => <div key={`${j}-${l.label}`} className="grid gap-2 md:grid-cols-5"><input className="rounded border px-2 py-1 text-xs" placeholder="Label" value={l.label} onChange={(e) => setFooterForm((p) => { const cols = [...p.columns]; const links = [...(cols[i].links ?? [])]; links[j] = { ...links[j], label: e.target.value }; cols[i] = { ...cols[i], links }; return { ...p, columns: cols }; })} /><input className="rounded border px-2 py-1 text-xs md:col-span-2" placeholder="URL" value={l.href} onChange={(e) => setFooterForm((p) => { const cols = [...p.columns]; const links = [...(cols[i].links ?? [])]; links[j] = { ...links[j], href: e.target.value }; cols[i] = { ...cols[i], links }; return { ...p, columns: cols }; })} /><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={Boolean(l.openInNewTab)} onChange={(e) => setFooterForm((p) => { const cols = [...p.columns]; const links = [...(cols[i].links ?? [])]; links[j] = { ...links[j], openInNewTab: e.target.checked }; cols[i] = { ...cols[i], links }; return { ...p, columns: cols }; })} />new tab</label><div className="flex gap-2 text-xs"><button className="underline" onClick={() => setFooterForm((p) => { const cols = [...p.columns]; cols[i] = { ...cols[i], links: move(cols[i].links ?? [], j, j - 1) }; return { ...p, columns: cols }; })}>Up</button><button className="underline" onClick={() => setFooterForm((p) => { const cols = [...p.columns]; cols[i] = { ...cols[i], links: move(cols[i].links ?? [], j, j + 1) }; return { ...p, columns: cols }; })}>Down</button><button className="text-rose-600 underline" onClick={() => setFooterForm((p) => { const cols = [...p.columns]; cols[i] = { ...cols[i], links: (cols[i].links ?? []).filter((_, ix) => ix !== j) }; return { ...p, columns: cols }; })}>Delete</button></div></div>)}</div></div>)}</div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border p-3"><h3 className="mb-2 font-semibold">Newsletter</h3><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Heading" value={footerForm.newsletter.title ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, newsletter: { ...p.newsletter, title: e.target.value } }))} /><textarea className="mb-2 w-full rounded border px-2 py-1" rows={2} placeholder="Body" value={footerForm.newsletter.body ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, newsletter: { ...p.newsletter, body: e.target.value } }))} /><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Input placeholder" value={footerForm.newsletter.inputPlaceholder ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, newsletter: { ...p.newsletter, inputPlaceholder: e.target.value } }))} /><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Button label" value={footerForm.newsletter.buttonLabel ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, newsletter: { ...p.newsletter, buttonLabel: e.target.value } }))} /><input className="w-full rounded border px-2 py-1" placeholder="Submit URL" value={footerForm.newsletter.submitHref ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, newsletter: { ...p.newsletter, submitHref: e.target.value } }))} /></div>
            <div className="rounded border p-3"><h3 className="mb-2 font-semibold">App Download Block</h3><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Title" value={footerForm.appDownloads.title ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, appDownloads: { ...p.appDownloads, title: e.target.value } }))} /><textarea className="mb-2 w-full rounded border px-2 py-1" rows={2} placeholder="Subtitle" value={footerForm.appDownloads.subtitle ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, appDownloads: { ...p.appDownloads, subtitle: e.target.value } }))} /><input className="mb-2 w-full rounded border px-2 py-1" placeholder="App Store image URL" value={footerForm.appDownloads.appStore?.imageUrl ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, appDownloads: { ...p.appDownloads, appStore: { ...(p.appDownloads.appStore ?? {}), imageUrl: e.target.value } } }))} /><input className="mb-2 w-full rounded border px-2 py-1" placeholder="App Store link" value={footerForm.appDownloads.appStore?.href ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, appDownloads: { ...p.appDownloads, appStore: { ...(p.appDownloads.appStore ?? {}), href: e.target.value } } }))} /><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Google Play image URL" value={footerForm.appDownloads.googlePlay?.imageUrl ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, appDownloads: { ...p.appDownloads, googlePlay: { ...(p.appDownloads.googlePlay ?? {}), imageUrl: e.target.value } } }))} /><input className="w-full rounded border px-2 py-1" placeholder="Google Play link" value={footerForm.appDownloads.googlePlay?.href ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, appDownloads: { ...p.appDownloads, googlePlay: { ...(p.appDownloads.googlePlay ?? {}), href: e.target.value } } }))} /></div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded border p-3"><h3 className="mb-2 font-semibold">Connect / Social</h3><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Heading" value={footerForm.connect.heading ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, connect: { ...p.connect, heading: e.target.value } }))} /><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Phone subtitle" value={footerForm.connect.phoneSubtitle ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, connect: { ...p.connect, phoneSubtitle: e.target.value } }))} /><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Feedback CTA label" value={footerForm.connect.feedbackCtaLabel ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, connect: { ...p.connect, feedbackCtaLabel: e.target.value } }))} /><input className="w-full rounded border px-2 py-1" placeholder="Feedback CTA URL" value={footerForm.connect.feedbackCtaHref ?? ""} onChange={(e) => setFooterForm((p) => ({ ...p, connect: { ...p.connect, feedbackCtaHref: e.target.value } }))} /><div className="mt-2 flex gap-2"><button className="text-xs text-brand underline" onClick={() => setFooterForm((p) => ({ ...p, socialLinks: [...p.socialLinks, { label: "", href: "", icon: "", openInNewTab: true, sortOrder: p.socialLinks.length }] }))}>Add Social Link</button></div><div className="mt-2 space-y-2">{footerForm.socialLinks.map((s, i) => <div key={`${i}-${s.label}`} className="grid gap-2 md:grid-cols-4"><input className="rounded border px-2 py-1 text-xs" placeholder="Label" value={s.label} onChange={(e) => setFooterForm((p) => { const social = [...p.socialLinks]; social[i] = { ...social[i], label: e.target.value }; return { ...p, socialLinks: social }; })} /><input className="rounded border px-2 py-1 text-xs md:col-span-2" placeholder="URL" value={s.href} onChange={(e) => setFooterForm((p) => { const social = [...p.socialLinks]; social[i] = { ...social[i], href: e.target.value }; return { ...p, socialLinks: social }; })} /><div className="flex gap-2 text-xs"><button className="underline" onClick={() => setFooterForm((p) => ({ ...p, socialLinks: move(p.socialLinks, i, i - 1) }))}>Up</button><button className="underline" onClick={() => setFooterForm((p) => ({ ...p, socialLinks: move(p.socialLinks, i, i + 1) }))}>Down</button><button className="text-rose-600 underline" onClick={() => setFooterForm((p) => ({ ...p, socialLinks: p.socialLinks.filter((_, ix) => ix !== i) }))}>Delete</button></div></div>)}</div></div>
            <div className="rounded border p-3"><h3 className="mb-2 font-semibold">Legal Strip</h3><input className="mb-2 w-full rounded border px-2 py-1" placeholder="Copyright text" value={footerForm.copyrightText} onChange={(e) => setFooterForm((p) => ({ ...p, copyrightText: e.target.value }))} /><button className="text-xs text-brand underline" onClick={() => setFooterForm((p) => ({ ...p, legalLinks: [...p.legalLinks, { label: "", href: "", external: false, openInNewTab: false, sortOrder: p.legalLinks.length }] }))}>Add Legal Link</button><div className="mt-2 space-y-2">{footerForm.legalLinks.map((l, i) => <div key={`${i}-${l.label}`} className="grid gap-2 md:grid-cols-5"><input className="rounded border px-2 py-1 text-xs" placeholder="Label" value={l.label} onChange={(e) => setFooterForm((p) => { const legalLinks = [...p.legalLinks]; legalLinks[i] = { ...legalLinks[i], label: e.target.value }; return { ...p, legalLinks }; })} /><input className="rounded border px-2 py-1 text-xs md:col-span-2" placeholder="URL" value={l.href} onChange={(e) => setFooterForm((p) => { const legalLinks = [...p.legalLinks]; legalLinks[i] = { ...legalLinks[i], href: e.target.value }; return { ...p, legalLinks }; })} /><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={Boolean(l.openInNewTab)} onChange={(e) => setFooterForm((p) => { const legalLinks = [...p.legalLinks]; legalLinks[i] = { ...legalLinks[i], openInNewTab: e.target.checked }; return { ...p, legalLinks }; })} />new tab</label><div className="flex gap-2 text-xs"><button className="underline" onClick={() => setFooterForm((p) => ({ ...p, legalLinks: move(p.legalLinks, i, i - 1) }))}>Up</button><button className="underline" onClick={() => setFooterForm((p) => ({ ...p, legalLinks: move(p.legalLinks, i, i + 1) }))}>Down</button><button className="text-rose-600 underline" onClick={() => setFooterForm((p) => ({ ...p, legalLinks: p.legalLinks.filter((_, ix) => ix !== i) }))}>Delete</button></div></div>)}</div></div>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}

export default NavigationContentPanel;
