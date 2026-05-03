"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  addSpecColumn,
  AdminApiError,
  createSpecSchema,
  deleteSpecColumn,
  getCategoryTree,
  getSchemaForCategory,
  listSpecColumns,
  publishSpecSchema,
  updateSpecColumn,
  updateSpecSchema,
  type CategoryDoc,
  type SpecColumnDoc,
  type SpecSchemaDoc,
} from "@/lib/admin-api";
import { AdminModal } from "./modal";

function flattenFamilies(nodes: CategoryDoc[], out: CategoryDoc[] = []): CategoryDoc[] {
  for (const n of nodes) {
    if (n.kind === "family") out.push(n);
    if (n.children?.length) flattenFamilies(n.children, out);
  }
  return out;
}

export function SpecSchemasPanel() {
  const [tree, setTree] = useState<CategoryDoc[]>([]);
  const [familyId, setFamilyId] = useState("");
  const [schema, setSchema] = useState<SpecSchemaDoc | null>(null);
  const [columns, setColumns] = useState<SpecColumnDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [colModal, setColModal] = useState<null | { mode: "create" } | { mode: "edit"; col: SpecColumnDoc }>(null);
  const [summary, setSummary] = useState("");

  const families = useMemo(() => flattenFamilies(tree), [tree]);

  const loadTree = useCallback(async () => {
    try {
      const t = await getCategoryTree();
      setTree(t);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load categories");
    }
  }, []);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  const loadSchemaBundle = useCallback(async (catId: string) => {
    if (!catId) return;
    setLoading(true);
    try {
      const s = await getSchemaForCategory(catId);
      setSchema(s);
      setSummary(s?.familySummary ?? "");
      if (s?._id) {
        const cols = await listSpecColumns(s._id);
        setColumns(cols);
      } else {
        setColumns([]);
      }
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load schema");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (familyId) void loadSchemaBundle(familyId);
  }, [familyId, loadSchemaBundle]);

  async function handleCreateSchema() {
    if (!familyId) return;
    try {
      const s = await createSpecSchema(familyId, { familySummary: summary || "", status: "draft" });
      toast.success("Spec schema created");
      setSchema(s);
      setSummary(s.familySummary ?? "");
      const cols = await listSpecColumns(s._id);
      setColumns(cols);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Create failed");
    }
  }

  async function handleSaveSchemaMeta() {
    if (!schema) return;
    try {
      const s = await updateSpecSchema(schema._id, { familySummary: summary });
      toast.success("Schema updated");
      setSchema(s);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Update failed");
    }
  }

  async function handlePublish() {
    if (!schema) return;
    try {
      const s = await publishSpecSchema(schema._id);
      toast.success("Schema published and attached to category");
      setSchema(s);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Publish failed");
    }
  }

  const [colKey, setColKey] = useState("");
  const [colLabel, setColLabel] = useState("");
  const [colType, setColType] = useState("string");

  async function submitColumn() {
    if (!schema) return;
    try {
      if (colModal?.mode === "create") {
        await addSpecColumn(schema._id, {
          key: colKey.trim(),
          label: colLabel.trim(),
          dataType: colType,
        });
        toast.success("Column added");
      } else if (colModal?.mode === "edit") {
        await updateSpecColumn(colModal.col._id, {
          label: colLabel.trim(),
          dataType: colType,
        });
        toast.success("Column updated");
      }
      setColModal(null);
      const cols = await listSpecColumns(schema._id);
      setColumns(cols);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Save column failed");
    }
  }

  function openCreateColumn() {
    setColKey("");
    setColLabel("");
    setColType("string");
    setColModal({ mode: "create" });
  }

  function openEditColumn(c: SpecColumnDoc) {
    setColKey(c.key);
    setColLabel(c.label);
    setColType(c.dataType ?? "string");
    setColModal({ mode: "edit", col: c });
  }

  async function handleDeleteColumn(c: SpecColumnDoc) {
    if (!confirm(`Delete column ${c.key}?`)) return;
    try {
      await deleteSpecColumn(c._id);
      toast.success("Column deleted");
      if (schema) {
        const cols = await listSpecColumns(schema._id);
        setColumns(cols);
      }
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-slate-900">Spec schemas</h1>
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
        <p className="text-sm text-slate-600">Choose a family category to view or create its spec schema.</p>
      ) : loading ? (
        <p className="text-sm text-slate-600">Loading…</p>
      ) : (
        <div className="space-y-6">
          {!schema ? (
            <div className="rounded-sm border border-amber-200 bg-amber-50 p-4 text-sm">
              <p className="mb-2">No schema yet for this family. Create one to define columns and rows.</p>
              <label className="block">
                <span className="text-slate-700">Family summary</span>
                <textarea
                  className="mt-1 w-full max-w-xl rounded-sm border px-2 py-1"
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="mt-2 rounded-sm bg-brand px-3 py-2 text-sm text-white"
                onClick={() => void handleCreateSchema()}
              >
                Create draft schema
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-sm border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-500">Schema ID</p>
                    <p className="font-mono text-xs">{schema._id}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Status: <strong>{schema.status}</strong> · version {schema.version ?? "—"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-sm bg-emerald-600 px-3 py-2 text-sm text-white"
                    onClick={() => void handlePublish()}
                  >
                    Publish
                  </button>
                </div>
                <label className="mt-4 block text-sm">
                  <span className="text-slate-600">Family summary</span>
                  <textarea
                    className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-1"
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="mt-2 rounded-sm border border-slate-200 px-3 py-2 text-sm"
                  onClick={() => void handleSaveSchemaMeta()}
                >
                  Save summary
                </button>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800">Columns</h2>
                  <button type="button" className="text-sm text-brand underline" onClick={openCreateColumn}>
                    Add column
                  </button>
                </div>
                <div className="overflow-x-auto rounded-sm border border-slate-200 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                        <th className="px-3 py-2">Key</th>
                        <th className="px-3 py-2">Label</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {columns.map((c) => (
                        <tr key={c._id} className="border-b border-slate-100">
                          <td className="px-3 py-2 font-mono text-xs">{c.key}</td>
                          <td className="px-3 py-2">{c.label}</td>
                          <td className="px-3 py-2">{c.dataType}</td>
                          <td className="px-3 py-2 text-right">
                            <button type="button" className="mr-2 text-xs underline" onClick={() => openEditColumn(c)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-xs text-rose-600 underline"
                              onClick={() => void handleDeleteColumn(c)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <AdminModal
        open={colModal !== null}
        title={colModal?.mode === "edit" ? "Edit column" : "New column"}
        onClose={() => setColModal(null)}
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setColModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void submitColumn()}>
              Save
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="text-slate-600">Key (camelCase)</span>
            <input
              className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs disabled:bg-slate-50"
              disabled={colModal?.mode === "edit"}
              value={colKey}
              onChange={(e) => setColKey(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-slate-600">Label</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={colLabel} onChange={(e) => setColLabel(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-slate-600">Data type</span>
            <select className="mt-1 w-full rounded-sm border px-2 py-1" value={colType} onChange={(e) => setColType(e.target.value)}>
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
              <option value="enum">enum</option>
              <option value="dimension">dimension</option>
            </select>
          </label>
        </div>
      </AdminModal>
    </div>
  );
}
