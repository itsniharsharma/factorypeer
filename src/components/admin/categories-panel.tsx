"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  attachActiveSpecSchema,
  createCategory,
  deleteCategory,
  getCategoryTree,
  listCategoryChildren,
  moveCategory,
  reorderCategorySiblings,
  updateCategory,
  type CategoryDoc,
  type CatalogMediaAssetDoc,
  AdminApiError,
} from "@/lib/admin-api";
import { AdminModal } from "./modal";
import { CatalogMediaField } from "./catalog-media-field";

function flattenFamilyCategories(nodes: CategoryDoc[], out: CategoryDoc[] = []): CategoryDoc[] {
  for (const n of nodes) {
    if (n.kind === "family") out.push(n);
    if (n.children?.length) flattenFamilyCategories(n.children, out);
  }
  return out;
}

function flattenAll(nodes: CategoryDoc[], out: { id: string; label: string }[] = [], prefix = ""): { id: string; label: string }[] {
  for (const n of nodes) {
    out.push({ id: n._id, label: `${prefix}${n.title} (${n.slug})` });
    if (n.children?.length) flattenAll(n.children, out, `${prefix}  `);
  }
  return out;
}

function TreeNodes({
  nodes,
  depth,
  onEdit,
  onDelete,
  onAddChild,
  onMove,
  onReorderKids,
}: {
  nodes: CategoryDoc[];
  depth: number;
  onEdit: (c: CategoryDoc) => void;
  onDelete: (c: CategoryDoc) => void;
  onAddChild: (parent: CategoryDoc) => void;
  onMove: (c: CategoryDoc) => void;
  onReorderKids: (cat: CategoryDoc) => void;
}) {
  return (
    <ul className={depth ? "ml-4 border-l border-slate-200 pl-3" : ""}>
      {nodes.map((n) => (
        <li key={n._id} className="py-1">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-slate-900">{n.title}</span>
            <span className="text-xs text-slate-500">{n.slug}</span>
            <span className="rounded bg-slate-100 px-1 text-xs uppercase text-slate-600">{n.kind}</span>
            <span className="text-xs text-slate-400">{n.status}</span>
            {n.landingImage?.url ? <span className="text-xs text-slate-500">image</span> : null}
            <div className="ml-auto flex flex-wrap gap-1">
              <button type="button" className="text-xs text-brand underline" onClick={() => onAddChild(n)}>
                Add child
              </button>
              <button type="button" className="text-xs text-slate-600 underline" onClick={() => onReorderKids(n)}>
                Reorder children
              </button>
              <button type="button" className="text-xs underline" onClick={() => onEdit(n)}>
                Edit
              </button>
              <button type="button" className="text-xs underline" onClick={() => onMove(n)}>
                Move
              </button>
              <button type="button" className="text-xs text-rose-600 underline" onClick={() => onDelete(n)}>
                Delete
              </button>
            </div>
          </div>
          {n.children && n.children.length > 0 ? (
            <TreeNodes
              nodes={n.children}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              onMove={onMove}
              onReorderKids={onReorderKids}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function CategoriesPanel() {
  const [tree, setTree] = useState<CategoryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<
    | null
    | { mode: "create"; parent: CategoryDoc | null }
    | { mode: "edit"; cat: CategoryDoc }
    | { mode: "move"; cat: CategoryDoc }
    | { mode: "reorder"; parentId: string | null }
  >(null);

  const [formSlug, setFormSlug] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formKind, setFormKind] = useState<"branch" | "family">("branch");
  const [formStatus, setFormStatus] = useState("draft");
  const [formImage, setFormImage] = useState<CatalogMediaAssetDoc | null>(null);
  const [formImageAlt, setFormImageAlt] = useState("");
  const [moveParentId, setMoveParentId] = useState("");
  const [siblings, setSiblings] = useState<CategoryDoc[]>([]);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const flatOptions = useMemo(() => flattenAll(tree), [tree]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const t = await getCategoryTree();
      setTree(t);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate(parent: CategoryDoc | null) {
    setFormSlug("");
    setFormTitle("");
    setFormDesc("");
    setFormKind("branch");
    setFormStatus("draft");
    setFormImage(null);
    setFormImageAlt("");
    setModal({ mode: "create", parent });
  }

  function openEdit(cat: CategoryDoc) {
    setFormSlug(cat.slug);
    setFormTitle(cat.title);
    setFormDesc(cat.description ?? "");
    setFormKind(cat.kind);
    setFormStatus(cat.status);
    setFormImage(cat.landingImage ?? null);
    setFormImageAlt(cat.landingImage?.alt ?? "");
    setModal({ mode: "edit", cat });
  }

  function openMove(cat: CategoryDoc) {
    setMoveParentId(cat.parentId ?? "");
    setModal({ mode: "move", cat });
  }

  async function openReorder(parentId: string | null) {
    setModal({ mode: "reorder", parentId });
    try {
      const kids = await listCategoryChildren(parentId);
      setSiblings(kids);
      setOrderedIds(kids.map((k) => k._id));
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load children");
    }
  }

  async function submitCreate() {
    if (!modal || modal.mode !== "create") return;
    try {
      await createCategory({
        parentId: modal.parent ? modal.parent._id : null,
        slug: formSlug.trim(),
        title: formTitle.trim(),
        description: formDesc,
        landingImage: formImage
          ? {
              ...formImage,
              alt: formImageAlt.trim() || undefined,
            }
          : undefined,
        kind: formKind,
        status: formStatus,
      });
      toast.success("Category created");
      setModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Create failed");
    }
  }

  async function submitEdit() {
    if (!modal || modal.mode !== "edit") return;
    try {
      await updateCategory(modal.cat._id, {
        slug: formSlug.trim(),
        title: formTitle.trim(),
        description: formDesc,
        landingImage: formImage
          ? {
              ...formImage,
              alt: formImageAlt.trim() || undefined,
            }
          : null,
        kind: formKind,
        status: formStatus,
      });
      toast.success("Category updated");
      setModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Update failed");
    }
  }

  async function submitMove() {
    if (!modal || modal.mode !== "move") return;
    const raw = moveParentId.trim();
    try {
      await moveCategory(modal.cat._id, raw === "" ? null : raw);
      toast.success("Category moved");
      setModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Move failed");
    }
  }

  async function submitReorder() {
    if (!modal || modal.mode !== "reorder" || orderedIds.length === 0) return;
    try {
      await reorderCategorySiblings(orderedIds[0], orderedIds);
      toast.success("Order saved");
      setModal(null);
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Reorder failed");
    }
  }

  async function handleDelete(cat: CategoryDoc) {
    if (!confirm(`Delete category "${cat.title}"? Child categories must be removed first.`)) return;
    try {
      await deleteCategory(cat._id);
      toast.success("Category deleted");
      await load();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Delete failed");
    }
  }

  function moveIx(from: number, dir: -1 | 1) {
    const to = from + dir;
    if (to < 0 || to >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[from], next[to]] = [next[to], next[from]];
    setOrderedIds(next);
  }

  const familyPickers = useMemo(() => flattenFamilyCategories(tree), [tree]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-slate-900">Categories</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm"
            onClick={() => openCreate(null)}
          >
            New root category
          </button>
          <button
            type="button"
            className="rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm"
            onClick={() => openReorder(null)}
          >
            Reorder root
          </button>
          {familyPickers.length > 0 ? (
            <select
              className="rounded-sm border border-slate-200 px-2 py-2 text-sm"
              defaultValue=""
              onChange={async (e) => {
                const id = e.target.value;
                e.target.value = "";
                if (!id) return;
                const schemaId = prompt("Attach active spec schema — enter Spec Schema ID (24 hex):");
                if (!schemaId?.trim()) return;
                try {
                  await attachActiveSpecSchema(id, schemaId.trim());
                  toast.success("Active spec schema attached");
                  await load();
                } catch (err) {
                  toast.error(err instanceof AdminApiError ? err.message : "Attach failed");
                }
              }}
            >
              <option value="">Attach schema to family…</option>
              {familyPickers.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.title}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600">Loading taxonomy…</p>
      ) : (
        <div className="rounded-sm border border-slate-200 bg-white p-4">
          <TreeNodes
            nodes={tree}
            depth={0}
            onEdit={openEdit}
            onDelete={handleDelete}
            onAddChild={(p) => openCreate(p)}
            onMove={openMove}
            onReorderKids={(cat) => void openReorder(cat._id)}
          />
        </div>
      )}

      <AdminModal
        open={modal?.mode === "create"}
        title={modal?.mode === "create" ? `New category${modal.parent ? ` under “${modal.parent.title}”` : ""}` : ""}
        onClose={() => setModal(null)}
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={submitCreate}>
              Create
            </button>
          </div>
        }
      >
        {modal?.mode === "create" ? (
          <div className="space-y-3 text-sm">
            <label className="block">
              <span className="text-slate-600">Slug</span>
              <input
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-slate-600">Title</span>
              <input
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-slate-600">Description</span>
              <textarea
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                rows={3}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </label>
            <CatalogMediaField
              label="Category landing image"
              folder="categories/landing"
              value={formImage}
              onChange={setFormImage}
              altText={formImageAlt}
              onAltChange={setFormImageAlt}
            />
            <label className="block">
              <span className="text-slate-600">Kind</span>
              <select
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                value={formKind}
                onChange={(e) => setFormKind(e.target.value as "branch" | "family")}
              >
                <option value="branch">branch</option>
                <option value="family">family</option>
              </select>
            </label>
            <label className="block">
              <span className="text-slate-600">Status</span>
              <select
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </label>
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={modal?.mode === "edit"}
        title="Edit category"
        onClose={() => setModal(null)}
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={submitEdit}>
              Save
            </button>
          </div>
        }
      >
        {modal?.mode === "edit" ? (
          <div className="space-y-3 text-sm">
            <label className="block">
              <span className="text-slate-600">Slug</span>
              <input
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-slate-600">Title</span>
              <input
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-slate-600">Description</span>
              <textarea
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                rows={3}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </label>
            <CatalogMediaField
              label="Category landing image"
              folder="categories/landing"
              value={formImage}
              onChange={setFormImage}
              altText={formImageAlt}
              onAltChange={setFormImageAlt}
            />
            <label className="block">
              <span className="text-slate-600">Kind</span>
              <select
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                value={formKind}
                onChange={(e) => setFormKind(e.target.value as "branch" | "family")}
              >
                <option value="branch">branch</option>
                <option value="family">family</option>
              </select>
            </label>
            <label className="block">
              <span className="text-slate-600">Status</span>
              <select
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
                <option value="archived">archived</option>
              </select>
            </label>
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={modal?.mode === "move"}
        title="Move category"
        onClose={() => setModal(null)}
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={submitMove}>
              Move
            </button>
          </div>
        }
      >
        {modal?.mode === "move" ? (
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              Moving <strong>{modal.cat.title}</strong>. Set new parent category ID, or leave empty for root.
            </p>
            <label className="block">
              <span className="text-slate-600">New parent ID (optional)</span>
              <input
                className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1 font-mono text-xs"
                placeholder="24-char hex or blank for root"
                value={moveParentId}
                onChange={(e) => setMoveParentId(e.target.value)}
              />
            </label>
            <p className="text-xs text-slate-500">Known categories:</p>
            <select
              className="w-full rounded-sm border border-slate-200 px-2 py-1 text-xs"
              onChange={(e) => setMoveParentId(e.target.value)}
              value=""
            >
              <option value="">— pick to fill parent ID —</option>
              {flatOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </AdminModal>

      <AdminModal
        open={modal?.mode === "reorder"}
        title={modal?.mode === "reorder" ? `Reorder children (${modal.parentId ?? "root"})` : ""}
        onClose={() => setModal(null)}
        wide
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={submitReorder}>
              Save order
            </button>
          </div>
        }
      >
        {modal?.mode === "reorder" ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">Use up/down to sort. Save sends the full sibling list to the API.</p>
            <ul className="space-y-1">
              {orderedIds.map((id, i) => {
                const row = siblings.find((s) => s._id === id);
                return (
                  <li key={id} className="flex items-center gap-2 rounded-sm border border-slate-100 px-2 py-1 text-sm">
                    <span className="flex-1">{row?.title ?? id}</span>
                    <button type="button" className="text-xs underline" onClick={() => moveIx(i, -1)}>
                      Up
                    </button>
                    <button type="button" className="text-xs underline" onClick={() => moveIx(i, 1)}>
                      Down
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="pt-2">
              <span className="text-xs text-slate-500">Reorder another parent: </span>
              <select
                className="mt-1 rounded-sm border px-2 py-1 text-xs"
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__root") void openReorder(null);
                  else if (v) void openReorder(v);
                }}
                defaultValue=""
              >
                <option value="">Jump to…</option>
                <option value="__root">Root level</option>
                {flatOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    Children of {o.label.trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
}
