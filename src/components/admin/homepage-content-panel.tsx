"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminApiError,
  createHomepageCategoryTile,
  createHomepagePromoBanner,
  createHomepageSupportCard,
  deleteHomepageCategoryTile,
  deleteHomepagePromoBanner,
  deleteHomepageSupportCard,
  listHomepageCategoryTiles,
  listHomepagePromoBanners,
  listHomepageSupportCards,
  type HomepageCategoryTileDoc,
  type HomepagePromoBannerDoc,
  type HomepageSupportCardDoc,
  type PublishStatus,
  updateHomepageCategoryTile,
  updateHomepagePromoBanner,
  updateHomepageSupportCard,
} from "@/lib/admin-api";
import { AdminModal } from "./modal";

type BannerModalState = null | { mode: "create" } | { mode: "edit"; item: HomepagePromoBannerDoc };
type TileModalState = null | { mode: "create" } | { mode: "edit"; item: HomepageCategoryTileDoc };
type CardModalState = null | { mode: "create" } | { mode: "edit"; item: HomepageSupportCardDoc };
type ReorderKind = "banners" | "tiles" | "cards";

function nextStatusForToggle(current: PublishStatus): PublishStatus {
  return current === "published" ? "draft" : "published";
}

export function HomepageContentPanel() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<HomepagePromoBannerDoc[]>([]);
  const [tiles, setTiles] = useState<HomepageCategoryTileDoc[]>([]);
  const [cards, setCards] = useState<HomepageSupportCardDoc[]>([]);

  const [bannerModal, setBannerModal] = useState<BannerModalState>(null);
  const [tileModal, setTileModal] = useState<TileModalState>(null);
  const [cardModal, setCardModal] = useState<CardModalState>(null);

  const [bannerForm, setBannerForm] = useState({
    slug: "",
    eyebrow: "",
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    imageAlt: "",
    ctaLabel: "",
    href: "",
    openInNewTab: false,
    status: "draft" as PublishStatus,
    sortOrder: "0",
  });

  const [tileForm, setTileForm] = useState({
    slug: "",
    label: "",
    description: "",
    categoryId: "",
    href: "",
    imageUrl: "",
    imageAlt: "",
    icon: "",
    ctaLabel: "",
    status: "draft" as PublishStatus,
    sortOrder: "0",
  });

  const [cardForm, setCardForm] = useState({
    slug: "",
    title: "",
    description: "",
    icon: "",
    ctaLabel: "",
    href: "",
    status: "draft" as PublishStatus,
    sortOrder: "0",
  });

  const [reorderState, setReorderState] = useState<null | { kind: ReorderKind; ids: string[] }>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bannerRes, tileRes, cardRes] = await Promise.all([
        listHomepagePromoBanners(),
        listHomepageCategoryTiles(),
        listHomepageSupportCards(),
      ]);
      setBanners(bannerRes.items);
      setTiles(tileRes.items);
      setCards(cardRes.items);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load homepage content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const bannerById = useMemo(() => new Map(banners.map((x) => [x._id, x])), [banners]);
  const tileById = useMemo(() => new Map(tiles.map((x) => [x._id, x])), [tiles]);
  const cardById = useMemo(() => new Map(cards.map((x) => [x._id, x])), [cards]);

  function openCreateBanner() {
    setBannerForm({
      slug: "",
      eyebrow: "",
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      imageAlt: "",
      ctaLabel: "",
      href: "",
      openInNewTab: false,
      status: "draft",
      sortOrder: "0",
    });
    setBannerModal({ mode: "create" });
  }

  function openEditBanner(item: HomepagePromoBannerDoc) {
    setBannerForm({
      slug: item.slug,
      eyebrow: item.eyebrow ?? "",
      title: item.title,
      subtitle: item.subtitle ?? "",
      description: item.description ?? "",
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt ?? "",
      ctaLabel: item.ctaLabel ?? "",
      href: item.href ?? "",
      openInNewTab: Boolean(item.openInNewTab),
      status: item.status,
      sortOrder: String(item.sortOrder ?? 0),
    });
    setBannerModal({ mode: "edit", item });
  }

  async function saveBanner() {
    const sortOrder = Number.parseInt(bannerForm.sortOrder, 10);
    if (Number.isNaN(sortOrder)) {
      toast.error("Banner sort order must be a number");
      return;
    }
    if (!bannerForm.slug.trim() || !bannerForm.title.trim() || !bannerForm.imageUrl.trim()) {
      toast.error("Banner slug, title, and image URL are required");
      return;
    }

    const payload = {
      slug: bannerForm.slug.trim(),
      eyebrow: bannerForm.eyebrow.trim() || undefined,
      title: bannerForm.title.trim(),
      subtitle: bannerForm.subtitle.trim() || undefined,
      description: bannerForm.description.trim() || undefined,
      imageUrl: bannerForm.imageUrl.trim(),
      imageAlt: bannerForm.imageAlt.trim() || undefined,
      ctaLabel: bannerForm.ctaLabel.trim() || undefined,
      href: bannerForm.href.trim() || undefined,
      openInNewTab: bannerForm.openInNewTab,
      status: bannerForm.status,
      sortOrder,
    };

    try {
      if (bannerModal?.mode === "create") {
        await createHomepagePromoBanner(payload);
        toast.success("Banner created");
      } else if (bannerModal?.mode === "edit") {
        await updateHomepagePromoBanner(bannerModal.item._id, payload);
        toast.success("Banner updated");
      }
      setBannerModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Banner save failed");
    }
  }

  async function removeBanner(item: HomepagePromoBannerDoc) {
    if (!confirm(`Delete banner "${item.title}"?`)) return;
    try {
      await deleteHomepagePromoBanner(item._id);
      toast.success("Banner deleted");
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Banner delete failed");
    }
  }

  async function toggleBannerPublish(item: HomepagePromoBannerDoc) {
    try {
      await updateHomepagePromoBanner(item._id, { status: nextStatusForToggle(item.status) });
      toast.success(`Banner moved to ${nextStatusForToggle(item.status)}`);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Banner status update failed");
    }
  }

  function openCreateTile() {
    setTileForm({
      slug: "",
      label: "",
      description: "",
      categoryId: "",
      href: "",
      imageUrl: "",
      imageAlt: "",
      icon: "",
      ctaLabel: "",
      status: "draft",
      sortOrder: "0",
    });
    setTileModal({ mode: "create" });
  }

  function openEditTile(item: HomepageCategoryTileDoc) {
    setTileForm({
      slug: item.slug,
      label: item.label,
      description: item.description ?? "",
      categoryId: item.categoryId ?? "",
      href: item.href ?? "",
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt ?? "",
      icon: item.icon ?? "",
      ctaLabel: item.ctaLabel ?? "",
      status: item.status,
      sortOrder: String(item.sortOrder ?? 0),
    });
    setTileModal({ mode: "edit", item });
  }

  async function saveTile() {
    const sortOrder = Number.parseInt(tileForm.sortOrder, 10);
    if (Number.isNaN(sortOrder)) {
      toast.error("Tile sort order must be a number");
      return;
    }
    if (!tileForm.slug.trim() || !tileForm.label.trim() || !tileForm.imageUrl.trim()) {
      toast.error("Tile slug, label, and image URL are required");
      return;
    }

    const categoryId = tileForm.categoryId.trim();
    const payload = {
      slug: tileForm.slug.trim(),
      label: tileForm.label.trim(),
      description: tileForm.description.trim() || undefined,
      categoryId: categoryId ? categoryId : null,
      href: tileForm.href.trim() || undefined,
      imageUrl: tileForm.imageUrl.trim(),
      imageAlt: tileForm.imageAlt.trim() || undefined,
      icon: tileForm.icon.trim() || undefined,
      ctaLabel: tileForm.ctaLabel.trim() || undefined,
      status: tileForm.status,
      sortOrder,
    };

    try {
      if (tileModal?.mode === "create") {
        await createHomepageCategoryTile(payload);
        toast.success("Category tile created");
      } else if (tileModal?.mode === "edit") {
        await updateHomepageCategoryTile(tileModal.item._id, payload);
        toast.success("Category tile updated");
      }
      setTileModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Category tile save failed");
    }
  }

  async function removeTile(item: HomepageCategoryTileDoc) {
    if (!confirm(`Delete category tile "${item.label}"?`)) return;
    try {
      await deleteHomepageCategoryTile(item._id);
      toast.success("Category tile deleted");
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Category tile delete failed");
    }
  }

  async function toggleTilePublish(item: HomepageCategoryTileDoc) {
    try {
      await updateHomepageCategoryTile(item._id, { status: nextStatusForToggle(item.status) });
      toast.success(`Category tile moved to ${nextStatusForToggle(item.status)}`);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Category tile status update failed");
    }
  }

  function openCreateCard() {
    setCardForm({
      slug: "",
      title: "",
      description: "",
      icon: "",
      ctaLabel: "",
      href: "",
      status: "draft",
      sortOrder: "0",
    });
    setCardModal({ mode: "create" });
  }

  function openEditCard(item: HomepageSupportCardDoc) {
    setCardForm({
      slug: item.slug,
      title: item.title,
      description: item.description ?? "",
      icon: item.icon ?? "",
      ctaLabel: item.ctaLabel ?? "",
      href: item.href ?? "",
      status: item.status,
      sortOrder: String(item.sortOrder ?? 0),
    });
    setCardModal({ mode: "edit", item });
  }

  async function saveCard() {
    const sortOrder = Number.parseInt(cardForm.sortOrder, 10);
    if (Number.isNaN(sortOrder)) {
      toast.error("Support card sort order must be a number");
      return;
    }
    if (!cardForm.slug.trim() || !cardForm.title.trim()) {
      toast.error("Support card slug and title are required");
      return;
    }

    const payload = {
      slug: cardForm.slug.trim(),
      title: cardForm.title.trim(),
      description: cardForm.description.trim() || undefined,
      icon: cardForm.icon.trim() || undefined,
      ctaLabel: cardForm.ctaLabel.trim() || undefined,
      href: cardForm.href.trim() || undefined,
      status: cardForm.status,
      sortOrder,
    };

    try {
      if (cardModal?.mode === "create") {
        await createHomepageSupportCard(payload);
        toast.success("Support card created");
      } else if (cardModal?.mode === "edit") {
        await updateHomepageSupportCard(cardModal.item._id, payload);
        toast.success("Support card updated");
      }
      setCardModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Support card save failed");
    }
  }

  async function removeCard(item: HomepageSupportCardDoc) {
    if (!confirm(`Delete support card "${item.title}"?`)) return;
    try {
      await deleteHomepageSupportCard(item._id);
      toast.success("Support card deleted");
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Support card delete failed");
    }
  }

  async function toggleCardPublish(item: HomepageSupportCardDoc) {
    try {
      await updateHomepageSupportCard(item._id, { status: nextStatusForToggle(item.status) });
      toast.success(`Support card moved to ${nextStatusForToggle(item.status)}`);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Support card status update failed");
    }
  }

  function openReorder(kind: ReorderKind) {
    const ids =
      kind === "banners"
        ? banners.map((x) => x._id)
        : kind === "tiles"
          ? tiles.map((x) => x._id)
          : cards.map((x) => x._id);
    setReorderState({ kind, ids });
  }

  function moveReorderIx(i: number, dir: -1 | 1) {
    if (!reorderState) return;
    const j = i + dir;
    if (j < 0 || j >= reorderState.ids.length) return;
    const next = [...reorderState.ids];
    [next[i], next[j]] = [next[j], next[i]];
    setReorderState({ ...reorderState, ids: next });
  }

  async function saveReorder() {
    if (!reorderState) return;
    try {
      for (let i = 0; i < reorderState.ids.length; i += 1) {
        const id = reorderState.ids[i];
        if (reorderState.kind === "banners") {
          await updateHomepagePromoBanner(id, { sortOrder: i });
        } else if (reorderState.kind === "tiles") {
          await updateHomepageCategoryTile(id, { sortOrder: i });
        } else {
          await updateHomepageSupportCard(id, { sortOrder: i });
        }
      }
      toast.success("Order saved");
      setReorderState(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Reorder failed");
    }
  }

  const reorderItems = reorderState
    ? reorderState.kind === "banners"
      ? reorderState.ids.map((id) => bannerById.get(id)?.title ?? id)
      : reorderState.kind === "tiles"
        ? reorderState.ids.map((id) => tileById.get(id)?.label ?? id)
        : reorderState.ids.map((id) => cardById.get(id)?.title ?? id)
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Homepage Content</h1>
        <p className="text-sm text-slate-600">Manage promo banners, category tiles, and support cards for storefront homepage merchandising.</p>
      </div>

      <section className="rounded-sm border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-800">Promo Banners</h2>
          <div className="flex gap-2">
            <button type="button" className="rounded-sm border px-3 py-1 text-sm" onClick={() => openReorder("banners")}>Reorder</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-1 text-sm text-white" onClick={openCreateBanner}>New Banner</button>
          </div>
        </div>
        {loading ? <p className="text-sm text-slate-600">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Slug</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Sort</th>
                  <th className="px-2 py-2">Image URL</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium">{item.title}</td>
                    <td className="px-2 py-2 font-mono text-xs">{item.slug}</td>
                    <td className="px-2 py-2 text-xs">{item.status}</td>
                    <td className="px-2 py-2 text-xs">{item.sortOrder ?? 0}</td>
                    <td className="max-w-[220px] truncate px-2 py-2 text-xs text-slate-600">{item.imageUrl}</td>
                    <td className="px-2 py-2 text-right">
                      <button type="button" className="mr-2 text-xs text-brand underline" onClick={() => void toggleBannerPublish(item)}>
                        {item.status === "published" ? "Set Draft" : "Publish"}
                      </button>
                      <button type="button" className="mr-2 text-xs underline" onClick={() => openEditBanner(item)}>Edit</button>
                      <button type="button" className="text-xs text-rose-600 underline" onClick={() => void removeBanner(item)}>Delete</button>
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
          <h2 className="text-base font-semibold text-slate-800">Category Tiles</h2>
          <div className="flex gap-2">
            <button type="button" className="rounded-sm border px-3 py-1 text-sm" onClick={() => openReorder("tiles")}>Reorder</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-1 text-sm text-white" onClick={openCreateTile}>New Tile</button>
          </div>
        </div>
        {loading ? <p className="text-sm text-slate-600">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                  <th className="px-2 py-2">Label</th>
                  <th className="px-2 py-2">Slug</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Sort</th>
                  <th className="px-2 py-2">CategoryId</th>
                  <th className="px-2 py-2">Image URL</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tiles.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium">{item.label}</td>
                    <td className="px-2 py-2 font-mono text-xs">{item.slug}</td>
                    <td className="px-2 py-2 text-xs">{item.status}</td>
                    <td className="px-2 py-2 text-xs">{item.sortOrder ?? 0}</td>
                    <td className="px-2 py-2 font-mono text-xs text-slate-600">{item.categoryId ?? "—"}</td>
                    <td className="max-w-[220px] truncate px-2 py-2 text-xs text-slate-600">{item.imageUrl}</td>
                    <td className="px-2 py-2 text-right">
                      <button type="button" className="mr-2 text-xs text-brand underline" onClick={() => void toggleTilePublish(item)}>
                        {item.status === "published" ? "Set Draft" : "Publish"}
                      </button>
                      <button type="button" className="mr-2 text-xs underline" onClick={() => openEditTile(item)}>Edit</button>
                      <button type="button" className="text-xs text-rose-600 underline" onClick={() => void removeTile(item)}>Delete</button>
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
          <h2 className="text-base font-semibold text-slate-800">Support Cards</h2>
          <div className="flex gap-2">
            <button type="button" className="rounded-sm border px-3 py-1 text-sm" onClick={() => openReorder("cards")}>Reorder</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-1 text-sm text-white" onClick={openCreateCard}>New Card</button>
          </div>
        </div>
        {loading ? <p className="text-sm text-slate-600">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Slug</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Sort</th>
                  <th className="px-2 py-2">CTA</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium">{item.title}</td>
                    <td className="px-2 py-2 font-mono text-xs">{item.slug}</td>
                    <td className="px-2 py-2 text-xs">{item.status}</td>
                    <td className="px-2 py-2 text-xs">{item.sortOrder ?? 0}</td>
                    <td className="px-2 py-2 text-xs text-slate-700">{item.ctaLabel ?? "—"}</td>
                    <td className="px-2 py-2 text-right">
                      <button type="button" className="mr-2 text-xs text-brand underline" onClick={() => void toggleCardPublish(item)}>
                        {item.status === "published" ? "Set Draft" : "Publish"}
                      </button>
                      <button type="button" className="mr-2 text-xs underline" onClick={() => openEditCard(item)}>Edit</button>
                      <button type="button" className="text-xs text-rose-600 underline" onClick={() => void removeCard(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <AdminModal
        open={bannerModal !== null}
        title={bannerModal?.mode === "edit" ? "Edit Promo Banner" : "New Promo Banner"}
        onClose={() => setBannerModal(null)}
        wide
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setBannerModal(null)}>Cancel</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveBanner()}>Save</button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <label><span className="text-slate-600">Slug</span><input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs" value={bannerForm.slug} onChange={(e) => setBannerForm((p) => ({ ...p, slug: e.target.value }))} /></label>
          <label><span className="text-slate-600">Title</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={bannerForm.title} onChange={(e) => setBannerForm((p) => ({ ...p, title: e.target.value }))} /></label>
          <label><span className="text-slate-600">Eyebrow</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={bannerForm.eyebrow} onChange={(e) => setBannerForm((p) => ({ ...p, eyebrow: e.target.value }))} /></label>
          <label><span className="text-slate-600">Subtitle</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={bannerForm.subtitle} onChange={(e) => setBannerForm((p) => ({ ...p, subtitle: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="text-slate-600">Description</span><textarea className="mt-1 w-full rounded-sm border px-2 py-1" rows={2} value={bannerForm.description} onChange={(e) => setBannerForm((p) => ({ ...p, description: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="text-slate-600">Image URL</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={bannerForm.imageUrl} onChange={(e) => setBannerForm((p) => ({ ...p, imageUrl: e.target.value }))} /></label>
          <label><span className="text-slate-600">Image Alt</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={bannerForm.imageAlt} onChange={(e) => setBannerForm((p) => ({ ...p, imageAlt: e.target.value }))} /></label>
          <label><span className="text-slate-600">CTA Label</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={bannerForm.ctaLabel} onChange={(e) => setBannerForm((p) => ({ ...p, ctaLabel: e.target.value }))} /></label>
          <label><span className="text-slate-600">Href</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={bannerForm.href} onChange={(e) => setBannerForm((p) => ({ ...p, href: e.target.value }))} /></label>
          <label><span className="text-slate-600">Status</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={bannerForm.status} onChange={(e) => setBannerForm((p) => ({ ...p, status: e.target.value as PublishStatus }))}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
          <label><span className="text-slate-600">Sort Order</span><input className="mt-1 w-full rounded-sm border px-2 py-1" inputMode="numeric" value={bannerForm.sortOrder} onChange={(e) => setBannerForm((p) => ({ ...p, sortOrder: e.target.value }))} /></label>
          <label className="flex items-center gap-2 pt-6"><input type="checkbox" checked={bannerForm.openInNewTab} onChange={(e) => setBannerForm((p) => ({ ...p, openInNewTab: e.target.checked }))} /><span>Open in new tab</span></label>
        </div>
      </AdminModal>

      <AdminModal
        open={tileModal !== null}
        title={tileModal?.mode === "edit" ? "Edit Category Tile" : "New Category Tile"}
        onClose={() => setTileModal(null)}
        wide
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setTileModal(null)}>Cancel</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveTile()}>Save</button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <label><span className="text-slate-600">Slug</span><input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs" value={tileForm.slug} onChange={(e) => setTileForm((p) => ({ ...p, slug: e.target.value }))} /></label>
          <label><span className="text-slate-600">Label</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={tileForm.label} onChange={(e) => setTileForm((p) => ({ ...p, label: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="text-slate-600">Description</span><textarea className="mt-1 w-full rounded-sm border px-2 py-1" rows={2} value={tileForm.description} onChange={(e) => setTileForm((p) => ({ ...p, description: e.target.value }))} /></label>
          <label><span className="text-slate-600">Category ID</span><input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs" value={tileForm.categoryId} onChange={(e) => setTileForm((p) => ({ ...p, categoryId: e.target.value }))} /></label>
          <label><span className="text-slate-600">Href</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={tileForm.href} onChange={(e) => setTileForm((p) => ({ ...p, href: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className="text-slate-600">Image URL</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={tileForm.imageUrl} onChange={(e) => setTileForm((p) => ({ ...p, imageUrl: e.target.value }))} /></label>
          <label><span className="text-slate-600">Image Alt</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={tileForm.imageAlt} onChange={(e) => setTileForm((p) => ({ ...p, imageAlt: e.target.value }))} /></label>
          <label><span className="text-slate-600">Icon</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={tileForm.icon} onChange={(e) => setTileForm((p) => ({ ...p, icon: e.target.value }))} /></label>
          <label><span className="text-slate-600">CTA Label</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={tileForm.ctaLabel} onChange={(e) => setTileForm((p) => ({ ...p, ctaLabel: e.target.value }))} /></label>
          <label><span className="text-slate-600">Status</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={tileForm.status} onChange={(e) => setTileForm((p) => ({ ...p, status: e.target.value as PublishStatus }))}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
          <label><span className="text-slate-600">Sort Order</span><input className="mt-1 w-full rounded-sm border px-2 py-1" inputMode="numeric" value={tileForm.sortOrder} onChange={(e) => setTileForm((p) => ({ ...p, sortOrder: e.target.value }))} /></label>
        </div>
      </AdminModal>

      <AdminModal
        open={cardModal !== null}
        title={cardModal?.mode === "edit" ? "Edit Support Card" : "New Support Card"}
        onClose={() => setCardModal(null)}
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setCardModal(null)}>Cancel</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveCard()}>Save</button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm">
          <label><span className="text-slate-600">Slug</span><input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs" value={cardForm.slug} onChange={(e) => setCardForm((p) => ({ ...p, slug: e.target.value }))} /></label>
          <label><span className="text-slate-600">Title</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={cardForm.title} onChange={(e) => setCardForm((p) => ({ ...p, title: e.target.value }))} /></label>
          <label><span className="text-slate-600">Description</span><textarea className="mt-1 w-full rounded-sm border px-2 py-1" rows={3} value={cardForm.description} onChange={(e) => setCardForm((p) => ({ ...p, description: e.target.value }))} /></label>
          <label><span className="text-slate-600">Icon</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={cardForm.icon} onChange={(e) => setCardForm((p) => ({ ...p, icon: e.target.value }))} /></label>
          <label><span className="text-slate-600">CTA Label</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={cardForm.ctaLabel} onChange={(e) => setCardForm((p) => ({ ...p, ctaLabel: e.target.value }))} /></label>
          <label><span className="text-slate-600">Href</span><input className="mt-1 w-full rounded-sm border px-2 py-1" value={cardForm.href} onChange={(e) => setCardForm((p) => ({ ...p, href: e.target.value }))} /></label>
          <label><span className="text-slate-600">Status</span><select className="mt-1 w-full rounded-sm border px-2 py-1" value={cardForm.status} onChange={(e) => setCardForm((p) => ({ ...p, status: e.target.value as PublishStatus }))}><option value="draft">draft</option><option value="published">published</option><option value="archived">archived</option></select></label>
          <label><span className="text-slate-600">Sort Order</span><input className="mt-1 w-full rounded-sm border px-2 py-1" inputMode="numeric" value={cardForm.sortOrder} onChange={(e) => setCardForm((p) => ({ ...p, sortOrder: e.target.value }))} /></label>
        </div>
      </AdminModal>

      <AdminModal
        open={reorderState !== null}
        title={reorderState ? `Reorder ${reorderState.kind}` : ""}
        onClose={() => setReorderState(null)}
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setReorderState(null)}>Cancel</button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveReorder()}>Save Order</button>
          </div>
        }
      >
        {reorderState ? (
          <ul className="space-y-1">
            {reorderState.ids.map((id, i) => (
              <li key={id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate">{reorderItems[i]}</span>
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

export default HomepageContentPanel;
