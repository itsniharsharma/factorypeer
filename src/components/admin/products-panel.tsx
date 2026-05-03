"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminApiError,
  createProduct,
  createVariant,
  deleteProduct,
  deleteVariant,
  getCategoryTree,
  linkVariantToRow,
  listProducts,
  listVariants,
  updateProduct,
  updateVariant,
  type CategoryDoc,
  type ProductDoc,
  type ProductVariantDoc,
} from "@/lib/admin-api";
import { AdminModal } from "./modal";

const PAGE_SIZE = 20;

function flattenCategories(nodes: CategoryDoc[], out: { id: string; label: string }[] = [], prefix = ""): { id: string; label: string }[] {
  for (const n of nodes) {
    out.push({ id: n._id, label: `${prefix}${n.title} (${n.slug})` });
    if (n.children?.length) flattenCategories(n.children, out, `${prefix}  `);
  }
  return out;
}

export function ProductsPanel() {
  const [tree, setTree] = useState<CategoryDoc[]>([]);
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [total, setTotal] = useState<number | undefined>();
  const [skip, setSkip] = useState(0);
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState<"title" | "-title" | "updatedAt" | "-updatedAt" | "sortOrder">("-updatedAt");
  const [loading, setLoading] = useState(true);
  const [variantsProduct, setVariantsProduct] = useState<ProductDoc | null>(null);
  const [variants, setVariants] = useState<ProductVariantDoc[]>([]);
  const [variantsTotal, setVariantsTotal] = useState<number | undefined>();
  const [variantsLoading, setVariantsLoading] = useState(false);

  const [productModal, setProductModal] = useState<null | { mode: "create" } | { mode: "edit"; p: ProductDoc }>(null);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [productStatus, setProductStatus] = useState("draft");
  const [categoryIds, setCategoryIds] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [defaultVariantId, setDefaultVariantId] = useState("");

  const [variantModal, setVariantModal] = useState<
    null | { mode: "create"; productId: string } | { mode: "edit"; v: ProductVariantDoc }
  >(null);
  const [vSku, setVSku] = useState("");
  const [vItemNumber, setVItemNumber] = useState("");
  const [vMpn, setVMpn] = useState("");
  const [vManufacturer, setVManufacturer] = useState("");
  const [vUnitPrice, setVUnitPrice] = useState("");
  const [vCurrency, setVCurrency] = useState("");
  const [vAvailability, setVAvailability] = useState("");
  const [vUom, setVUom] = useState("");
  const [vStatus, setVStatus] = useState("draft");
  const [vSpecRowId, setVSpecRowId] = useState("");
  const [vSearchBlob, setVSearchBlob] = useState("");
  const [vSortOrder, setVSortOrder] = useState("");

  const [linkModal, setLinkModal] = useState<null | { variant: ProductVariantDoc }>(null);
  const [linkSpecRowId, setLinkSpecRowId] = useState("");
  const [linkSyncBindings, setLinkSyncBindings] = useState(true);
  const [linkRole, setLinkRole] = useState<"primary" | "alternate">("primary");

  const flatCats = useMemo(() => flattenCategories(tree), [tree]);

  const loadTree = useCallback(async () => {
    try {
      setTree(await getCategoryTree());
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load categories");
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { products: list, total: t } = await listProducts({
        skip,
        limit: PAGE_SIZE,
        q: q || undefined,
        status: statusFilter || undefined,
        sort,
      });
      setProducts(list);
      setTotal(t);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [skip, q, statusFilter, sort]);

  useEffect(() => {
    void loadTree();
  }, [loadTree]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const loadVariants = useCallback(async (p: ProductDoc) => {
    setVariantsLoading(true);
    try {
      const { variants: vs, total: vt } = await listVariants(p._id, { limit: 200 });
      setVariants(vs);
      setVariantsTotal(vt);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Failed to load variants");
    } finally {
      setVariantsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (variantsProduct) void loadVariants(variantsProduct);
  }, [variantsProduct, loadVariants]);

  function openCreateProduct() {
    setSlug("");
    setTitle("");
    setBrand("");
    setProductStatus("draft");
    setCategoryIds(new Set());
    setSearchText("");
    setSortOrder("");
    setDefaultVariantId("");
    setProductModal({ mode: "create" });
  }

  function openEditProduct(p: ProductDoc) {
    setSlug(p.slug);
    setTitle(p.title);
    setBrand(p.brand ?? "");
    setProductStatus(p.status);
    setCategoryIds(new Set(p.categoryIds ?? []));
    setSearchText(p.searchText ?? "");
    setSortOrder(p.sortOrder != null ? String(p.sortOrder) : "");
    setDefaultVariantId(p.defaultVariantId ?? "");
    setProductModal({ mode: "edit", p });
  }

  function toggleCategory(id: string) {
    setCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function saveProduct() {
    const so = sortOrder.trim() ? Number.parseInt(sortOrder, 10) : undefined;
    if (sortOrder.trim() && Number.isNaN(so)) {
      toast.error("Sort order must be a number");
      return;
    }
    try {
      const ids = [...categoryIds];
      if (productModal?.mode === "create") {
        await createProduct({
          slug,
          title,
          brand: brand || undefined,
          status: productStatus,
          categoryIds: ids.length ? ids : undefined,
          searchText: searchText || undefined,
          sortOrder: so,
        });
        toast.success("Product created");
      } else if (productModal?.mode === "edit") {
        const dvid = defaultVariantId.trim();
        await updateProduct(productModal.p._id, {
          slug,
          title,
          brand: brand || null,
          status: productStatus,
          categoryIds: ids,
          searchText: searchText || undefined,
          sortOrder: so,
          defaultVariantId: dvid ? dvid : null,
        });
        toast.success("Product updated");
      }
      setProductModal(null);
      await loadProducts();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Save failed");
    }
  }

  async function handleDeleteProduct(p: ProductDoc) {
    if (!confirm(`Delete product "${p.title}"? All variants must be removed first.`)) return;
    try {
      await deleteProduct(p._id);
      toast.success("Product deleted");
      if (variantsProduct?._id === p._id) setVariantsProduct(null);
      await loadProducts();
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Delete failed");
    }
  }

  function openCreateVariant(productId: string) {
    setVSku("");
    setVItemNumber("");
    setVMpn("");
    setVManufacturer("");
    setVUnitPrice("");
    setVCurrency("");
    setVAvailability("");
    setVUom("");
    setVStatus("draft");
    setVSpecRowId("");
    setVSearchBlob("");
    setVSortOrder("");
    setVariantModal({ mode: "create", productId });
  }

  function openEditVariant(v: ProductVariantDoc) {
    setVSku(v.sku);
    setVItemNumber(v.itemNumber ?? "");
    setVMpn(v.mpn ?? "");
    setVManufacturer(v.manufacturer ?? "");
    setVUnitPrice(v.unitPrice ?? "");
    setVCurrency(v.currency ?? "");
    setVAvailability(v.availability ?? "");
    setVUom(v.uom ?? "");
    setVStatus(v.status);
    setVSpecRowId(v.specRowId ?? "");
    setVSearchBlob(v.searchBlob ?? "");
    setVSortOrder(v.sortOrder != null ? String(v.sortOrder) : "");
    setVariantModal({ mode: "edit", v });
  }

  async function saveVariant() {
    const so = vSortOrder.trim() ? Number.parseInt(vSortOrder, 10) : undefined;
    if (vSortOrder.trim() && Number.isNaN(so)) {
      toast.error("Variant sort order must be a number");
      return;
    }
    const specRow = vSpecRowId.trim();
    try {
      if (variantModal?.mode === "create") {
        await createVariant(variantModal.productId, {
          sku: vSku,
          itemNumber: vItemNumber || undefined,
          mpn: vMpn || undefined,
          manufacturer: vManufacturer || undefined,
          unitPrice: vUnitPrice || undefined,
          currency: vCurrency || undefined,
          availability: vAvailability || undefined,
          uom: vUom || undefined,
          status: vStatus,
          specRowId: specRow ? specRow : null,
          searchBlob: vSearchBlob || undefined,
          sortOrder: so,
        });
        toast.success("Variant created");
      } else if (variantModal?.mode === "edit") {
        await updateVariant(variantModal.v._id, {
          sku: vSku,
          itemNumber: vItemNumber || null,
          mpn: vMpn || null,
          manufacturer: vManufacturer || null,
          unitPrice: vUnitPrice || undefined,
          currency: vCurrency || undefined,
          availability: vAvailability || undefined,
          uom: vUom || null,
          status: vStatus,
          specRowId: specRow ? specRow : null,
          searchBlob: vSearchBlob || undefined,
          sortOrder: so,
        });
        toast.success("Variant updated");
      }
      setVariantModal(null);
      if (variantsProduct) await loadVariants(variantsProduct);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Save failed");
    }
  }

  async function handleDeleteVariant(v: ProductVariantDoc) {
    if (!confirm(`Delete variant SKU ${v.sku}?`)) return;
    try {
      await deleteVariant(v._id);
      toast.success("Variant deleted");
      if (variantsProduct) await loadVariants(variantsProduct);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Delete failed");
    }
  }

  function openLinkRow(v: ProductVariantDoc) {
    setLinkSpecRowId("");
    setLinkSyncBindings(true);
    setLinkRole("primary");
    setLinkModal({ variant: v });
  }

  async function saveLinkRow() {
    if (!linkModal || !linkSpecRowId.trim()) {
      toast.error("Spec row ID required");
      return;
    }
    try {
      await linkVariantToRow(linkModal.variant._id, {
        specRowId: linkSpecRowId.trim(),
        syncBindings: linkSyncBindings,
        bindingRole: linkRole,
      });
      toast.success("Variant linked to row");
      setLinkModal(null);
      if (variantsProduct) await loadVariants(variantsProduct);
    } catch (e) {
      toast.error(e instanceof AdminApiError ? e.message : "Link failed");
    }
  }

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setSkip(0);
    setQ(searchInput.trim());
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">Products</h1>
        <p className="text-sm text-slate-600">Manage catalog products and variants. Link variants to spec matrix rows from the variant menu.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-sm border border-slate-200 bg-white p-4">
        <form onSubmit={applySearch} className="flex flex-1 flex-wrap items-end gap-2">
          <label className="min-w-[200px] flex-1 text-sm">
            <span className="text-slate-600">Search</span>
            <input
              className="mt-1 w-full rounded-sm border border-slate-200 px-2 py-2"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Title / search text"
            />
          </label>
          <button type="submit" className="rounded-sm bg-slate-800 px-3 py-2 text-sm text-white">
            Search
          </button>
        </form>
        <label className="text-sm">
          <span className="text-slate-600">Status</span>
          <select
            className="mt-1 block rounded-sm border border-slate-200 px-2 py-2"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setSkip(0);
            }}
          >
            <option value="">Any</option>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="text-slate-600">Sort</span>
          <select
            className="mt-1 block rounded-sm border border-slate-200 px-2 py-2"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as typeof sort);
              setSkip(0);
            }}
          >
            <option value="-updatedAt">Updated ↓</option>
            <option value="updatedAt">Updated ↑</option>
            <option value="title">Title A–Z</option>
            <option value="-title">Title Z–A</option>
            <option value="sortOrder">Sort order</option>
          </select>
        </label>
        <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={openCreateProduct}>
          New product
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-600">Loading products…</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-sm border border-slate-200 bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Slug</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Categories</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-900">{p.title}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-700">{p.slug}</td>
                    <td className="px-3 py-2 text-xs">{p.status}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{(p.categoryIds ?? []).length} ids</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        className="mr-2 text-xs text-brand underline"
                        onClick={() => setVariantsProduct(p)}
                      >
                        Variants
                      </button>
                      <button type="button" className="mr-2 text-xs underline" onClick={() => openEditProduct(p)}>
                        Edit
                      </button>
                      <button type="button" className="text-xs text-rose-600 underline" onClick={() => void handleDeleteProduct(p)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
            <span>
              {total != null ? (
                <>
                  {skip + 1}–{Math.min(skip + products.length, total)} of {total}
                </>
              ) : (
                `${products.length} loaded`
              )}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-sm border px-3 py-1 disabled:opacity-40"
                disabled={skip <= 0}
                onClick={() => setSkip((s) => Math.max(0, s - PAGE_SIZE))}
              >
                Previous
              </button>
              <button
                type="button"
                className="rounded-sm border px-3 py-1 disabled:opacity-40"
                disabled={total != null ? skip + PAGE_SIZE >= total : products.length < PAGE_SIZE}
                onClick={() => setSkip((s) => s + PAGE_SIZE)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {variantsProduct ? (
        <div className="mt-8 rounded-sm border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Variants — {variantsProduct.title}</h2>
              <p className="font-mono text-xs text-slate-500">{variantsProduct._id}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded-sm border px-3 py-1 text-sm" onClick={() => setVariantsProduct(null)}>
                Close
              </button>
              <button
                type="button"
                className="rounded-sm bg-brand px-3 py-1 text-sm text-white"
                onClick={() => openCreateVariant(variantsProduct._id)}
              >
                New variant
              </button>
            </div>
          </div>
          {variantsLoading ? (
            <p className="text-sm text-slate-600">Loading variants…</p>
          ) : (
            <>
              <p className="mb-2 text-xs text-slate-500">
                {variantsTotal != null ? `${variantsTotal} variant(s)` : `${variants.length} variant(s)`}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                      <th className="px-2 py-2">SKU</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2">Price</th>
                      <th className="px-2 py-2">Spec row</th>
                      <th className="px-2 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v) => (
                      <tr key={v._id} className="border-b border-slate-100">
                        <td className="px-2 py-2 font-mono text-xs">{v.sku}</td>
                        <td className="px-2 py-2 text-xs">{v.status}</td>
                        <td className="px-2 py-2 text-xs">
                          {v.unitPrice ?? "—"} {v.currency ?? ""}
                        </td>
                        <td className="max-w-[200px] truncate px-2 py-2 font-mono text-xs text-slate-600">{v.specRowId ?? "—"}</td>
                        <td className="px-2 py-2 text-right">
                          <button type="button" className="mr-2 text-xs text-brand underline" onClick={() => openLinkRow(v)}>
                            Link row
                          </button>
                          <button type="button" className="mr-2 text-xs underline" onClick={() => openEditVariant(v)}>
                            Edit
                          </button>
                          <button type="button" className="text-xs text-rose-600 underline" onClick={() => void handleDeleteVariant(v)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      ) : null}

      <AdminModal
        open={productModal !== null}
        title={productModal?.mode === "edit" ? "Edit product" : "New product"}
        onClose={() => setProductModal(null)}
        wide
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setProductModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveProduct()}>
              Save
            </button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <label className="md:col-span-1">
            <span className="text-slate-600">Slug</span>
            <input
              className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="kebab-case"
            />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Title</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Brand</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Status</span>
            <select className="mt-1 w-full rounded-sm border px-2 py-1" value={productStatus} onChange={(e) => setProductStatus(e.target.value)}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="text-slate-600">Search text</span>
            <textarea className="mt-1 w-full rounded-sm border px-2 py-1" rows={2} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Sort order</span>
            <input
              className="mt-1 w-full rounded-sm border px-2 py-1"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              inputMode="numeric"
            />
          </label>
          {productModal?.mode === "edit" ? (
            <label className="md:col-span-1">
              <span className="text-slate-600">Default variant ID</span>
              <input
                className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs"
                value={defaultVariantId}
                onChange={(e) => setDefaultVariantId(e.target.value)}
                placeholder="optional ObjectId"
              />
            </label>
          ) : null}
          <div className="md:col-span-2">
            <span className="text-slate-600">Categories</span>
            <div className="mt-1 max-h-40 overflow-y-auto rounded-sm border border-slate-200 p-2">
              {flatCats.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-2 py-0.5 text-xs">
                  <input type="checkbox" checked={categoryIds.has(c.id)} onChange={() => toggleCategory(c.id)} />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        open={variantModal !== null}
        title={variantModal?.mode === "edit" ? "Edit variant" : "New variant"}
        onClose={() => setVariantModal(null)}
        wide
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setVariantModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveVariant()}>
              Save
            </button>
          </div>
        }
      >
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <label className="md:col-span-1">
            <span className="text-slate-600">SKU</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1 font-mono" value={vSku} onChange={(e) => setVSku(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Status</span>
            <select className="mt-1 w-full rounded-sm border px-2 py-1" value={vStatus} onChange={(e) => setVStatus(e.target.value)}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Item number</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={vItemNumber} onChange={(e) => setVItemNumber(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">MPN</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={vMpn} onChange={(e) => setVMpn(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Manufacturer</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={vManufacturer} onChange={(e) => setVManufacturer(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Unit price</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={vUnitPrice} onChange={(e) => setVUnitPrice(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Currency</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={vCurrency} onChange={(e) => setVCurrency(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Availability</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={vAvailability} onChange={(e) => setVAvailability(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">UOM</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={vUom} onChange={(e) => setVUom(e.target.value)} />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Spec row ID</span>
            <input
              className="mt-1 w-full rounded-sm border px-2 py-1 font-mono text-xs"
              value={vSpecRowId}
              onChange={(e) => setVSpecRowId(e.target.value)}
              placeholder="optional — link matrix row"
            />
          </label>
          <label className="md:col-span-1">
            <span className="text-slate-600">Sort order</span>
            <input className="mt-1 w-full rounded-sm border px-2 py-1" value={vSortOrder} onChange={(e) => setVSortOrder(e.target.value)} />
          </label>
          <label className="md:col-span-2">
            <span className="text-slate-600">Search blob</span>
            <textarea className="mt-1 w-full rounded-sm border px-2 py-1" rows={2} value={vSearchBlob} onChange={(e) => setVSearchBlob(e.target.value)} />
          </label>
        </div>
      </AdminModal>

      <AdminModal
        open={linkModal !== null}
        title="Link variant to spec row"
        onClose={() => setLinkModal(null)}
        footer={
          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button type="button" className="rounded-sm border px-3 py-2 text-sm" onClick={() => setLinkModal(null)}>
              Cancel
            </button>
            <button type="button" className="rounded-sm bg-brand px-3 py-2 text-sm text-white" onClick={() => void saveLinkRow()}>
              Link
            </button>
          </div>
        }
      >
        <p className="mb-3 text-sm text-slate-600">
          Sets <code className="font-mono text-xs">variant.specRowId</code> and optionally syncs row bindings (default on).
        </p>
        <label className="block text-sm">
          <span className="text-slate-600">Spec row ID</span>
          <input
            className="mt-1 w-full rounded-sm border px-2 py-2 font-mono text-xs"
            value={linkSpecRowId}
            onChange={(e) => setLinkSpecRowId(e.target.value)}
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={linkSyncBindings} onChange={(e) => setLinkSyncBindings(e.target.checked)} />
          Sync bindings on row
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-slate-600">Binding role</span>
          <select className="mt-1 w-full rounded-sm border px-2 py-2" value={linkRole} onChange={(e) => setLinkRole(e.target.value as "primary" | "alternate")}>
            <option value="primary">primary</option>
            <option value="alternate">alternate</option>
          </select>
        </label>
      </AdminModal>
    </div>
  );
}
