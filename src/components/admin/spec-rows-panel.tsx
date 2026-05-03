"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminApiError,
  createSpecRow,
  deleteSpecRow,
  getCategoryTree,
  getSchemaForCategory,
  listSpecColumns,
  listSpecRows,
  reorderSpecRows,
  updateSpecRow,
  type CategoryDoc,
  type SpecColumnDoc,
  type SpecRowDoc,
} from "@/lib/admin-api";
import { AdminModal } from "./modal";

function flattenFamilies(nodes: CategoryDoc[], out: CategoryDoc[] = []): CategoryDoc[] {
  for (const n of nodes) {
    if (n.kind === "family") out.push(n);
    if (n.children?.length) flattenFamilies(n.children, out);
  }
  return out;
}

export function SpecRowsPanel() {
  const [tree, setTree] = useState<CategoryDoc[]>([]);
  const [familyId, setFamilyId] = useState("");
  const [schemaId, setSchemaId] = useState<string | null>(null);
  const [columns, setColumns] = useState<SpecColumnDoc[]>([]);
  const [rows, setRows] = useState<SpecRowDoc[]>([]);
  const [total, setTotal] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [rowModal, setRowModal] = useState<null | { mode: "create" } | { mode: "edit"; row: SpecRowDoc }>(null);
  const [valueFields, setValueFields] = useState<Record<string, string>>({});
  const [rowStatus, setRowStatus] = useState("draft");
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const families = useMemo(() => flattenFamilies(tree), [tree]);

  const loadTree = useCallback(async () => {
    try {
      setTree(await getCategoryTree());
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load tree");
    }
  }, []);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  const loadAll = useCallback(
    async (catId: string) => {
      if (!catId) return;
      setLoading(true);
      try {
        const sch = await getSchemaForCategory(catId);
        if (!sch) {
          setSchemaId(null);
          setColumns([]);
          setRows([]);
          setOrderedIds([]);
          setTotal(undefined);
          return;
        }
        setSchemaId(sch._id);
        const [cols, r] = await Promise.all([
          listSpecColumns(sch._id),
          // Omit limit so upstream uses its default (see catalog-admin-api spec rows route).
          listSpecRows(sch._id),
        ]);
        setColumns(cols);
        setRows(r.rows);
        setTotal(r.total);
        setOrderedIds(r.rows.map((x) => x._id));
      } catch (e) {
        toast.error(e instanceof AdminApiError ? e.message : "Load failed");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (familyId) void loadAll(familyId);
  }, [familyId, loadAll]);

  function openCreateRow() {
    const init: Record<string, string> = {};
    for (const c of columns) init[c.key] = "";
    setValueFields(init);
    setRowStatus("draft");
    setRowModal({ mode: "create" });
  }

  function openEditRow(row: SpecRowDoc) {
    setValueFields({ ...row.values });
    setRowStatus(row.status);
    setRowModal({ mode: "edit", row });
  }

  async function saveRow() {
    if (!schemaId) return;
    try {
      if (rowModal?.mode === "create") {
        await createSpecRow(schemaId, {
          values: valueFields,
          status: rowStatus,
        });
        toast.success("Row created");
      } else if (rowModal?.mode === "edit") {
        await updateSpecRow(rowModal.row._id, {
          values: valueFields,
          status: rowStatus,
        });
        toast.success("Row updated");
      }
      setRowModal(null);
      if (familyId) await loadAll(familyId);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Save failed");
    }
  }

  async function handleDeleteRow(r: SpecRowDoc) {
    if (!confirm("Delete this spec row?")) return;
    try {
      await deleteSpecRow(r._id);
      toast.success("Row deleted");
      if (familyId) await loadAll(familyId);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Delete failed");
    }
  }

  function moveRowIx(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[i], next[j]] = [next[j], next[i]];
    setOrderedIds(next);
  }

  async function saveReorder() {
    if (!schemaId || orderedIds.length === 0) return;
    try {
      await reorderSpecRows(schemaId, orderedIds);
      toast.success("Row order saved");
      if (familyId) await loadAll(familyId);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Reorder failed");
    }
  }

  const colKeys = columns.map((c) => c.key);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">Spec rows (variant matrix)</h1>
        <p className="text-sm text-slate-600">Select a family with a published or draft schema. Columns drive row cells.</p>
      </div>

      <div className="mb-4 rounded-sm border border-slate-200 bg-white p-4">
        <label className="block text-sm">
          <span className="text-slate-600">Family category</span>
          <select
            className="mt-1 w-full max-w-xl rounded-sm border border-slate-200 px-2 py-2"
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
          >
            <option value="">Select…</option>
            {families.map((f) => (
              <option key={f._id} value={f._id}>
                {f.title} — {f.path}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!familyId ? (
        <p className="text-sm text-slate-600">Select a category.</p>
      ) : loading ? (
        <p className="text-sm text-slate-600">Loading…</p>
      ) : !schemaId ? (
        <p className="text-sm text-amber-800">No spec schema for this family. Create one under Spec schemas first.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-mono text-slate-600">
              Schema <span className="text-slate-900">{schemaId}</span>
              {total != null ? ` · ${total} rows` : null}
            </p>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={openCreateRow}>
              New row
            </button>
          </div>

          <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-sm font-medium text-slate-800">Reorder rows</p>
            <ul className="space-y-1">
              {orderedIds.map((id, i) => {
                const row = rows.find((r) => r._id === id);
                return (
                  <li key={id} className="flex items-center gap-2 text-sm">
                    <span className="flex-1 truncate font-mono text-xs">{row?.externalKey || id}</span>
                    <button type="button" className="text-xs underline" onClick={() => moveRowIx(i, -1)}>
                      Up
                    </button>
                    <button type="button" className="text-xs underline" onClick={() => moveRowIx(i, 1)}>
                      Down
                    </button>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="mt-2 rounded-sm border bg-white px-3 py-1 text-sm" onClick={() => void saveReorder()}>
              Save row order
            </button>
          </div>

          <div className="overflow-x-auto rounded-sm border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                  {colKeys.map((k) => (
                    <th key={k} className="px-3 py-2">
                      {k}
                    </th>
                  ))}
                  <th className="px-3 py-2">status</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100">
                    {colKeys.map((k) => (
                      <td key={k} className="px-3 py-2 text-slate-800">
                        {r.values[k] ?? "—"}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-xs">{r.status}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" className="mr-2 text-xs underline" onClick={() => openEditRow(r)}>
                        Edit
                      </button>
                      <button type="button" className="text-xs text-rose-600 underline" onClick={() => void handleDeleteRow(r)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminModal
        open={rowModal !== null}
        title={rowModal?.mode === "edit" ? "Edit spec row" : "New spec row"}
        onClose={() => setRowModal(null)}
        wide
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setRowModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveRow()}>
              Save
            </button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm md:grid-cols-2">
          {columns.map((c) => (
            <label key={c._id} className="block md:col-span-1">
              <span className="text-slate-600">{c.label}</span>
              <input
                className="mt-1 w-full rounded-sm border px-2 py-1"
                value={valueFields[c.key] ?? ""}
                onChange={(e) => setValueFields((prev) => ({ ...prev, [c.key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="block md:col-span-2">
            <span className="text-slate-600">Status</span>
            <select
              className="mt-1 w-full rounded-sm border px-2 py-1"
              value={rowStatus}
              onChange={(e) => setRowStatus(e.target.value)}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
        </div>
      </AdminModal>
    </div>
  );
}
