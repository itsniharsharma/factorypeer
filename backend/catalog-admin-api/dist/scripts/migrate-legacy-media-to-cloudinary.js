/**
 * Uploads non-Cloudinary product/homepage media into Cloudinary and rewrites `image` + `publicId`.
 * Run: npm run migrate:media --prefix backend/catalog-admin-api
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { loadConfig } from "../config.js";
import { connectMongo, disconnectMongo } from "../db/connection.js";
import { catalogSeedDefaultImageUrl } from "../config/cdn-defaults.js";
cloudinary.config(true);
function publicRoot() {
    return path.resolve(process.cwd(), "..", "..", "public");
}
function isCloudinaryDeliveryUrl(url) {
    return /^https?:\/\/res\.cloudinary\.com\//i.test(url.trim());
}
async function uploadToCloudinary(sourceUrl, folder) {
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
        return cloudinary.uploader.upload(raw, { folder, resource_type: "auto", invalidate: true });
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
                const res = await uploadToCloudinary(m.url, "factorypeer/migrated/products");
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
            const res = await uploadToCloudinary(url, folder);
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
    if (!process.env["CLOUDINARY_URL"] && !process.env["CLOUDINARY_CLOUD_NAME"]) {
        console.error("Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME before migration.");
        process.exit(1);
    }
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
