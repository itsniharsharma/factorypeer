import { parseBody } from "../validation/helpers.js";
import { deleteMediaBodySchema } from "../validation/media-upload.js";
const PREFIX = "/admin/catalog/media";
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;
export function registerMediaRoutes(app, cloudinary) {
    app.post(`${PREFIX}/upload`, async (req, reply) => {
        if (!cloudinary.isConfigured()) {
            return reply.status(503).send({
                error: "MEDIA_UNAVAILABLE",
                message: "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_* credentials.",
                requestId: req.id,
            });
        }
        const file = await req.file();
        if (!file) {
            return reply.status(400).send({
                error: "NO_FILE",
                message: "Multipart field `file` is required.",
                requestId: req.id,
            });
        }
        const mime = file.mimetype ?? "";
        if (!ALLOWED_MIME.has(mime)) {
            return reply.status(415).send({
                error: "UNSUPPORTED_MEDIA_TYPE",
                message: `Allowed types: ${[...ALLOWED_MIME].join(", ")}`,
                requestId: req.id,
            });
        }
        const rawFolder = typeof req.query.folder === "string"
            ? req.query.folder?.trim()
            : "";
        const resolvedFolder = rawFolder ? rawFolder.replace(/^\/+|\/+$/g, "") : undefined;
        const buf = await file.toBuffer();
        if (buf.length > MAX_BYTES) {
            return reply.status(413).send({
                error: "FILE_TOO_LARGE",
                message: `Max upload size is ${MAX_BYTES} bytes.`,
                requestId: req.id,
            });
        }
        try {
            const meta = await cloudinary.uploadImageBuffer({
                buffer: buf,
                mime,
                folder: resolvedFolder || undefined,
            });
            return {
                url: meta.url,
                publicId: meta.publicId,
                width: meta.width,
                height: meta.height,
                format: meta.format,
                bytes: meta.bytes,
            };
        }
        catch (e) {
            req.log.error(e, "cloudinary upload failed");
            return reply.status(502).send({
                error: "UPLOAD_FAILED",
                message: e instanceof Error ? e.message : "Upload failed",
                requestId: req.id,
            });
        }
    });
    app.delete(`${PREFIX}/asset`, async (req, reply) => {
        if (!cloudinary.isConfigured()) {
            return reply.status(503).send({
                error: "MEDIA_UNAVAILABLE",
                message: "Cloudinary is not configured.",
                requestId: req.id,
            });
        }
        const body = parseBody(deleteMediaBodySchema, req.body);
        await cloudinary.destroy(body.publicId);
        return { ok: true };
    });
}
