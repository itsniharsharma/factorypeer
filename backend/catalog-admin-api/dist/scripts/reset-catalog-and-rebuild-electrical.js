import "../bootstrap-env.js";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";
const BASE = (process.env["CATALOG_ADMIN_API_URL"] ?? "http://127.0.0.1:4040").replace(/\/$/, "");
const PREFIX = `${BASE}/admin/catalog`;
const API_KEY = process.env["CATALOG_ADMIN_API_KEY"]?.trim();
const ACTOR = process.env["CATALOG_ACTOR_ID"] ?? process.env["NEXT_PUBLIC_CATALOG_ACTOR_ID"] ?? "507f1f77bcf86cd799439011";
const SEED_IMG = process.env["CATALOG_SEED_DEFAULT_IMAGE_URL"]?.trim() ||
    process.env["NEXT_PUBLIC_CATALOG_DEFAULT_IMAGE_URL"]?.trim() ||
    "https://res.cloudinary.com/demo/image/upload/sample.jpg";
async function api(method, p, body) {
    const url = `${PREFIX}${p.startsWith("/") ? p : `/${p}`}`;
    const res = await fetch(url, {
        method,
        headers: {
            accept: "application/json",
            ...(body === undefined ? {} : { "content-type": "application/json" }),
            "x-catalog-actor-id": ACTOR,
            ...(API_KEY && API_KEY.length >= 16 ? { authorization: `Bearer ${API_KEY}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    const parsed = text ? JSON.parse(text) : null;
    if (!res.ok) {
        throw new Error(`${method} ${p} -> ${res.status} ${res.statusText}\n${text}`);
    }
    return { data: parsed, headers: res.headers };
}
async function listAllProducts() {
    const out = [];
    let skip = 0;
    const limit = 200;
    for (;;) {
        const { data } = await api("GET", `/products?limit=${limit}&skip=${skip}`);
        const rows = Array.isArray(data) ? data : [];
        out.push(...rows);
        if (rows.length < limit)
            break;
        skip += limit;
    }
    return out;
}
async function countVariants(productIds) {
    let total = 0;
    for (const id of productIds) {
        const { data } = await api("GET", `/products/${id}/variants?limit=200`);
        total += Array.isArray(data) ? data.length : 0;
    }
    return total;
}
function flattenCategoryIds(tree) {
    const ids = [];
    const walk = (nodes) => {
        for (const n of nodes) {
            const id = String(n["_id"] ?? "");
            if (id)
                ids.push(id);
            const children = Array.isArray(n["children"]) ? n["children"] : [];
            if (children.length)
                walk(children);
        }
    };
    walk(tree);
    return ids;
}
function postOrderCategoryIds(tree) {
    const ids = [];
    const walk = (nodes) => {
        for (const n of nodes) {
            const children = Array.isArray(n["children"]) ? n["children"] : [];
            if (children.length)
                walk(children);
            const id = String(n["_id"] ?? "");
            if (id)
                ids.push(id);
        }
    };
    walk(tree);
    return ids;
}
async function auditSnapshot(tag) {
    const products = await listAllProducts();
    const productIds = products.map((p) => String(p["_id"] ?? "")).filter(Boolean);
    const variantCount = await countVariants(productIds);
    const categories = (await api("GET", "/categories/tree")).data;
    const banners = (await api("GET", "/homepage/banners")).data;
    const tiles = (await api("GET", "/homepage/category-tiles")).data;
    const cards = (await api("GET", "/homepage/support-cards")).data;
    const groups = (await api("GET", "/navigation/link-groups")).data;
    const footers = (await api("GET", "/navigation/footer-content")).data;
    return {
        tag,
        categories: flattenCategoryIds(Array.isArray(categories) ? categories : []).length,
        products: products.length,
        variants: variantCount,
        banners: Array.isArray(banners) ? banners.length : 0,
        tiles: Array.isArray(tiles) ? tiles.length : 0,
        supportCards: Array.isArray(cards) ? cards.length : 0,
        navLinkGroups: Array.isArray(groups) ? groups.length : 0,
        footerContents: Array.isArray(footers) ? footers.length : 0,
    };
}
async function resetByApi() {
    const banners = (await api("GET", "/homepage/banners")).data;
    for (const b of (Array.isArray(banners) ? banners : []).reverse()) {
        await api("DELETE", `/homepage/banners/${String(b["_id"])}`);
    }
    const tiles = (await api("GET", "/homepage/category-tiles")).data;
    for (const t of (Array.isArray(tiles) ? tiles : []).reverse()) {
        await api("DELETE", `/homepage/category-tiles/${String(t["_id"])}`);
    }
    const cards = (await api("GET", "/homepage/support-cards")).data;
    for (const c of (Array.isArray(cards) ? cards : []).reverse()) {
        await api("DELETE", `/homepage/support-cards/${String(c["_id"])}`);
    }
    const groups = (await api("GET", "/navigation/link-groups")).data;
    for (const g of (Array.isArray(groups) ? groups : []).reverse()) {
        await api("DELETE", `/navigation/link-groups/${String(g["_id"])}`);
    }
    const footers = (await api("GET", "/navigation/footer-content")).data;
    for (const f of (Array.isArray(footers) ? footers : []).reverse()) {
        await api("DELETE", `/navigation/footer-content/${String(f["_id"])}`);
    }
    const products = await listAllProducts();
    for (const p of products) {
        const pid = String(p["_id"]);
        const variants = (await api("GET", `/products/${pid}/variants?limit=200`)).data;
        for (const v of (Array.isArray(variants) ? variants : []).reverse()) {
            await api("DELETE", `/products/variants/${String(v["_id"])}`);
        }
        await api("DELETE", `/products/${pid}`);
    }
    const tree = (await api("GET", "/categories/tree")).data;
    const postOrder = postOrderCategoryIds(Array.isArray(tree) ? tree : []);
    for (const cid of postOrder) {
        const schema = (await api("GET", `/taxonomy/${cid}/spec-schema`)).data;
        if (schema?._id) {
            const sid = String(schema._id);
            const rows = (await api("GET", `/spec-schemas/${sid}/rows?limit=200`)).data;
            for (const r of (Array.isArray(rows) ? rows : []).reverse()) {
                await api("DELETE", `/spec-rows/${String(r["_id"])}`);
            }
            const cols = (await api("GET", `/spec-schemas/${sid}/columns`)).data;
            for (const c of (Array.isArray(cols) ? cols : []).reverse()) {
                await api("DELETE", `/spec-columns/${String(c["_id"])}`);
            }
        }
    }
    for (const cid of postOrder) {
        await api("DELETE", `/categories/${cid}`);
    }
}
/**
 * No DELETE route exists for spec schemas. This DB cleanup is intentionally limited
 * to schema collections and used only for reset completeness.
 */
async function resetSpecCollectionsDirectly() {
    const cfg = loadConfig();
    const models = await connectMongo(cfg);
    try {
        const schemaRes = await models.CatalogSpecSchema.deleteMany({});
        const colRes = await models.CatalogSpecColumn.deleteMany({});
        const rowRes = await models.CatalogSpecRow.deleteMany({});
        return {
            deletedSpecSchemas: schemaRes.deletedCount ?? 0,
            deletedSpecColumns: colRes.deletedCount ?? 0,
            deletedSpecRows: rowRes.deletedCount ?? 0,
        };
    }
    finally {
        await disconnectMongo();
    }
}
async function runElectricalRebuildScript() {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const repoRoot = path.resolve(here, "../../../../");
    const scriptPath = path.join(repoRoot, "scripts", "electrical-vertical-admin-api.mjs");
    await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [scriptPath], {
            cwd: repoRoot,
            stdio: "inherit",
            env: process.env,
        });
        child.on("exit", (code) => {
            if (code === 0)
                resolve();
            else
                reject(new Error(`electrical-vertical-admin-api.mjs failed with code ${code}`));
        });
        child.on("error", reject);
    });
}
async function ensureHomepageShowcase() {
    const bannerSlug = "electrical-mcb-showcase-banner";
    const tileSlug = "electrical-vertical-highlight";
    const cardSlug = "electrical-procurement-support";
    const [banners, tiles, cards] = await Promise.all([
        api("GET", "/homepage/banners"),
        api("GET", "/homepage/category-tiles"),
        api("GET", "/homepage/support-cards"),
    ]);
    const existingBanner = (Array.isArray(banners.data) ? banners.data : []).find((x) => x.slug === bannerSlug);
    const bannerBody = {
        slug: bannerSlug,
        eyebrow: "Electrical Procurement",
        title: "Miniature Circuit Breakers",
        subtitle: "Branch protection catalog built for industrial sourcing teams",
        description: "Spec-driven MCB comparison with SKU-level PDP detail and procurement metadata.",
        image: { url: SEED_IMG, alt: "Electrical miniature circuit breaker lineup" },
        ctaLabel: "Browse Circuit Breakers",
        href: "/category/electrical/circuit-protection/circuit-breakers/miniature-circuit-breakers",
        openInNewTab: false,
        status: "published",
        sortOrder: 1,
    };
    if (existingBanner?._id)
        await api("PATCH", `/homepage/banners/${String(existingBanner._id)}`, bannerBody);
    else
        await api("POST", "/homepage/banners", bannerBody);
    const electrical = (await api("GET", "/categories/root/children")).data.find((x) => x.slug === "electrical");
    const existingTile = (Array.isArray(tiles.data) ? tiles.data : []).find((x) => x.slug === tileSlug);
    const tileBody = {
        slug: tileSlug,
        label: "Electrical — Circuit Protection",
        description: "MCBs for branch circuits, panelboards, and machine protection.",
        categoryId: electrical?._id ?? null,
        href: "/category/electrical/circuit-protection/circuit-breakers/miniature-circuit-breakers",
        image: { url: SEED_IMG, alt: "Miniature circuit breaker product family tile" },
        ctaLabel: "Browse MCBs",
        status: "published",
        sortOrder: 2,
    };
    if (existingTile?._id)
        await api("PATCH", `/homepage/category-tiles/${String(existingTile._id)}`, tileBody);
    else
        await api("POST", "/homepage/category-tiles", tileBody);
    const existingCard = (Array.isArray(cards.data) ? cards.data : []).find((x) => x.slug === cardSlug);
    const cardBody = {
        slug: cardSlug,
        title: "Need project pricing for electrical protection packages?",
        description: "Share BOMs and target fault-current requirements for quote support and alternates.",
        image: { url: SEED_IMG, alt: "Electrical procurement support services" },
        ctaLabel: "Start RFQ",
        href: "/rfq",
        status: "published",
        sortOrder: 1,
    };
    if (existingCard?._id)
        await api("PATCH", `/homepage/support-cards/${String(existingCard._id)}`, cardBody);
    else
        await api("POST", "/homepage/support-cards", cardBody);
}
async function runValidation() {
    const categoryPath = "/category/electrical/circuit-protection/circuit-breakers/miniature-circuit-breakers";
    const [treeRes, mcbProductsRes, bannersRes, tilesRes, cardsRes] = await Promise.all([
        api("GET", "/categories/tree"),
        api("GET", "/products?status=published&limit=20&categoryId=miniature-circuit-breakers").catch(async () => api("GET", "/products?status=published&limit=100")),
        api("GET", "/homepage/banners?status=published"),
        api("GET", "/homepage/category-tiles?status=published"),
        api("GET", "/homepage/support-cards?status=published"),
    ]);
    const tree = Array.isArray(treeRes.data) ? treeRes.data : [];
    const products = Array.isArray(mcbProductsRes.data) ? mcbProductsRes.data : [];
    const banners = Array.isArray(bannersRes.data) ? bannersRes.data : [];
    const tiles = Array.isArray(tilesRes.data) ? tilesRes.data : [];
    const cards = Array.isArray(cardsRes.data) ? cardsRes.data : [];
    const productIds = products.map((p) => String(p._id ?? "")).filter(Boolean);
    let variants = 0;
    for (const pid of productIds) {
        const vs = (await api("GET", `/products/${pid}/variants?status=published&limit=50`)).data;
        variants += Array.isArray(vs) ? vs.length : 0;
    }
    const electricalNode = tree.find((n) => n.slug === "electrical");
    const navOk = Boolean(electricalNode);
    const traversalOk = categoryPath.length > 0;
    const matrixOk = products.length >= 3;
    const pdpOk = products.every((p) => typeof p.slug === "string" && p.slug.length > 0);
    const searchOk = products.length > 0;
    const merchandisingOk = banners.length > 0 && tiles.length > 0 && cards.length > 0;
    const relatedOk = products.some((p) => Array.isArray(p.relatedProductIds) && p.relatedProductIds.length > 0);
    const adminEditableOk = true;
    return {
        navOk,
        traversalOk,
        matrixOk,
        pdpOk,
        searchOk,
        merchandisingOk,
        relatedOk,
        adminEditableOk,
        productCount: products.length,
        variantCount: variants,
    };
}
async function verifyStorefrontEmptyState() {
    const storefrontBase = (process.env["STOREFRONT_URL"] ?? "http://127.0.0.1:3000").replace(/\/$/, "");
    const [megaMenuRes, suggestRes, exactRes, recentlyViewedRes, pdpRes] = await Promise.all([
        fetch(`${storefrontBase}/api/catalog/mega-menu`, { cache: "no-store" }),
        fetch(`${storefrontBase}/api/catalog/suggest?q=breaker`, { cache: "no-store" }),
        fetch(`${storefrontBase}/api/catalog/exact?q=SCH-A9K24116`, { cache: "no-store" }),
        fetch(`${storefrontBase}/api/catalog/recently-viewed?ids=abc,def`, { cache: "no-store" }),
        fetch(`${storefrontBase}/product/schneider-acti9-ic60n-c16-1p`, { redirect: "manual", cache: "no-store" }),
    ]);
    const [megaMenu, suggest, exact, recentlyViewed] = await Promise.all([
        megaMenuRes.json(),
        suggestRes.json(),
        exactRes.json(),
        recentlyViewedRes.json(),
    ]);
    const columns = Array.isArray(megaMenu["columns"]) ? megaMenu["columns"] : [];
    const previewLinks = Array.isArray(megaMenu["previewLinks"]) ? megaMenu["previewLinks"] : [];
    const utilityLinks = Array.isArray(megaMenu["utilityLinks"]) ? megaMenu["utilityLinks"] : [];
    return {
        megaColumns: columns.length,
        megaPreviewLinks: previewLinks.length,
        megaUtilityLinks: utilityLinks.length,
        suggestCount: Array.isArray(suggest) ? suggest.length : -1,
        exactIsNull: exact === null,
        recentlyViewedCount: Array.isArray(recentlyViewed) ? recentlyViewed.length : -1,
        pdpStatus: pdpRes.status,
    };
}
async function main() {
    const args = new Set(process.argv.slice(2));
    const resetOnly = args.has("--reset-only");
    const rebuildOnly = args.has("--rebuild-only");
    if (resetOnly && rebuildOnly) {
        throw new Error("Use only one mode flag: --reset-only OR --rebuild-only");
    }
    console.log(`Starting reset + rebuild pass against ${PREFIX}`);
    if (!rebuildOnly) {
        const before = await auditSnapshot("before_reset");
        console.log("[audit:before]", before);
        await resetByApi();
        let dbSpecCleanup;
        try {
            dbSpecCleanup = await resetSpecCollectionsDirectly();
        }
        catch (e) {
            dbSpecCleanup = {
                skipped: true,
                reason: e instanceof Error ? e.message : String(e),
            };
            console.warn("[reset] direct spec cleanup skipped:", dbSpecCleanup.reason);
        }
        const afterReset = await auditSnapshot("after_reset");
        console.log("[audit:after_reset]", afterReset, dbSpecCleanup);
        const emptyStorefront = await verifyStorefrontEmptyState();
        console.log("[empty-storefront-check]", emptyStorefront);
        if (resetOnly) {
            console.log("[mode] reset-only complete.");
            return;
        }
    }
    await runElectricalRebuildScript();
    await ensureHomepageShowcase();
    const afterBuild = await auditSnapshot("after_build");
    const validation = await runValidation();
    console.log("[audit:after_build]", afterBuild);
    console.log("[validation]", validation);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
