/**
 * Uploads non-Cloudinary product/homepage media into Cloudinary and rewrites `image` + `publicId`.
 * Run: npm run migrate:media --prefix backend/catalog-admin-api
 */
import "../bootstrap-env.js";
import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";
import { catalogSeedDefaultImageUrl } from "../config/cdn-defaults.js";
import { assertCloudinarySdkReadyForUpload } from "../services/cloudinary.service.js";
function publicRoot() {
    return path.resolve(process.cwd(), "..", "..", "public");
}
function isCloudinaryDeliveryUrl(url) {
    return /^https?:\/\/res\.cloudinary\.com\//i.test(url.trim());
}
/** Cloudinary remote-upload fetches the URL server-side; 404 means the origin no longer serves the file (not an SDK bug). */
function isRemoteSourceUnreachable(err) {
    const o = err;
    if (o.http_code === 404)
        return true;
    const msg = String(o.message ?? err);
    return /resource not found|status code 404|\b404\b/i.test(msg);
}
/** Retry variants: full URL, then path-only (query strings often break older third-party CDNs). */
function httpsUploadVariants(url) {
    const trimmed = url.trim();
    const out = [trimmed];
    try {
        const u = new URL(trimmed);
        const bare = `${u.origin}${u.pathname}`;
        if (bare !== trimmed)
            out.push(bare);
    }
    catch {
        /* ignore invalid URL — first attempt will throw */
    }
    return [...new Set(out)];
}
/**
 * Upload by remote HTTPS URL. If the origin returns 404 (dead Unsplash/legacy links), retries without `?query`,
 * then uploads {@link catalogSeedDefaultImageUrl} so the row still lands on your Cloudinary account.
 */
async function uploadHttpsToCloudinary(remoteUrl, folder, opts) {
    const variants = httpsUploadVariants(remoteUrl);
    let lastUnreachable;
    for (let i = 0; i < variants.length; i++) {
        const attempt = variants[i];
        try {
            return await cloudinary.uploader.upload(attempt, {
                folder,
                resource_type: "auto",
                invalidate: true,
            });
        }
        catch (e) {
            if (!isRemoteSourceUnreachable(e))
                throw e;
            lastUnreachable = e;
            if (i < variants.length - 1) {
                console.warn(`[migrate] remote 404 for ${opts?.label ?? "asset"} — retrying without query (${remoteUrl.slice(0, 88)}…)`);
                continue;
            }
        }
    }
    const fallback = catalogSeedDefaultImageUrl();
    console.warn(`[migrate] remote still unreachable (${remoteUrl.slice(0, 96)}…) — uploading fallback seed: ${fallback}`);
    try {
        return await cloudinary.uploader.upload(fallback, {
            folder,
            resource_type: "auto",
            invalidate: true,
        });
    }
    catch (fallbackErr) {
        throw new Error(`Migration could not fetch ${remoteUrl} and fallback upload failed (${fallback}): ${String(lastUnreachable)} | ${String(fallbackErr)}`);
    }
}
async function uploadToCloudinary(sourceUrl, folder, opts) {
    const raw = sourceUrl.trim();
    if (raw.startsWith("/")) {
        const rel = raw.replace(/^\/+/, "");
        const abs = path.join(publicRoot(), rel);
        if (!fs.existsSync(abs)) {
            throw new Error(`Local file missing for ${raw}: ${abs}`);
        }
        const buf = fs.readFileSync(abs);
        const mime = rel.endsWith(".svg")
            ? "image/svg+xml"
            : rel.endsWith(".png")
                ? "image/png"
                : rel.endsWith(".webp")
                    ? "image/webp"
                    : rel.endsWith(".gif")
                        ? "image/gif"
                        : "image/jpeg";
        const dataUri = `data:${mime};base64,${buf.toString("base64")}`;
        return cloudinary.uploader.upload(dataUri, { folder, resource_type: "auto", invalidate: true });
    }
    if (/^https?:\/\//i.test(raw)) {
        return uploadHttpsToCloudinary(raw, folder, opts);
    }
    throw new Error(`Unsupported media URL: ${raw}`);
}
async function migrateProducts(models) {
    const Product = models.Product;
    const cursor = Product.find({}).cursor();
    let updated = 0;
    for await (const doc of cursor) {
        const media = doc.media;
        if (!media?.length)
            continue;
        let changed = false;
        const next = [];
        for (const m of media) {
            if (!m?.url)
                continue;
            if (isCloudinaryDeliveryUrl(m.url)) {
                next.push(m);
                continue;
            }
            try {
                const res = await uploadToCloudinary(m.url, "factorypeer/migrated/products", {
                    label: `product ${String(doc._id)}`,
                });
                next.push({
                    url: res.secure_url,
                    publicId: res.public_id,
                    alt: m.alt,
                    width: res.width,
                    height: res.height,
                    format: res.format,
                    sortOrder: m.sortOrder,
                });
                changed = true;
            }
            catch (e) {
                console.warn(`[migrate] skip product ${String(doc._id)} url=${m.url}`, e);
                next.push(m);
            }
        }
        if (changed) {
            await Product.updateOne({ _id: doc._id }, { $set: { media: next } });
            updated += 1;
        }
    }
    console.log(`[migrate] products touched: ${updated}`);
}
async function migrateHomepage(models, modelName, folder) {
    const Model = models[modelName];
    const docs = await Model.find({});
    let n = 0;
    for (const doc of docs) {
        const o = doc.toObject();
        const image = o["image"];
        const legacyUrl = o["imageUrl"];
        const url = image?.url ?? legacyUrl;
        if (!url?.trim())
            continue;
        if (isCloudinaryDeliveryUrl(url))
            continue;
        try {
            const res = await uploadToCloudinary(url, folder, {
                label: `${String(modelName)} ${String(doc._id)}`,
            });
            const alt = o["imageAlt"] ?? image?.alt;
            await Model.updateOne({ _id: doc._id }, {
                $set: {
                    image: {
                        url: res.secure_url,
                        publicId: res.public_id,
                        alt,
                        width: res.width,
                        height: res.height,
                        format: res.format,
                    },
                },
                $unset: { imageUrl: "", imageAlt: "" },
            });
            n += 1;
        }
        catch (e) {
            console.warn(`[migrate] skip ${String(modelName)} ${String(doc._id)}`, e);
        }
    }
    console.log(`[migrate] ${String(modelName)} migrated rows: ${n}`);
}
async function main() {
    const cld = assertCloudinarySdkReadyForUpload();
    console.log(`[migrate] Cloudinary: source=${cld.source} cloud_name=${cld.cloudName}`);
    const config = loadConfig();
    const models = await connectMongo(config);
    console.log("[migrate] reference seed URL:", catalogSeedDefaultImageUrl());
    await migrateProducts(models);
    await migrateHomepage(models, "HomepagePromoBanner", "factorypeer/migrated/homepage/banners");
    await migrateHomepage(models, "HomepageCategoryTile", "factorypeer/migrated/homepage/tiles");
    await migrateHomepage(models, "HomepageSupportCard", "factorypeer/migrated/homepage/support");
    await disconnectMongo();
    console.log("[migrate] complete.");
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
