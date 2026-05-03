import { v2 as cloudinary } from "cloudinary";
/**
 * Cloudinary uploads — configured via `CLOUDINARY_URL` or
 * `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`.
 */
export class CloudinaryService {
    constructor() {
        cloudinary.config(true);
    }
    isConfigured() {
        return Boolean(process.env["CLOUDINARY_URL"]?.trim() ||
            (process.env["CLOUDINARY_CLOUD_NAME"]?.trim() &&
                process.env["CLOUDINARY_API_KEY"]?.trim() &&
                process.env["CLOUDINARY_API_SECRET"]?.trim()));
    }
    async uploadImageBuffer(opts) {
        const folder = opts.folder ?? "factorypeer/catalog";
        const dataUri = `data:${opts.mime};base64,${opts.buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(dataUri, {
            folder,
            resource_type: "image",
            overwrite: false,
            invalidate: true,
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        };
    }
    async destroy(publicId) {
        const id = publicId.trim();
        if (!id || !this.isConfigured())
            return;
        try {
            await cloudinary.uploader.destroy(id);
        }
        catch {
            /* best-effort cleanup */
        }
    }
    /** Stream upload for large files without base64 overhead. */
    async uploadImageStream(opts) {
        const folder = opts.folder ?? "factorypeer/catalog";
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder, resource_type: "image", overwrite: false, invalidate: true }, (err, res) => {
                if (err || !res)
                    return reject(err ?? new Error("Cloudinary upload failed"));
                resolve({
                    url: res.secure_url,
                    publicId: res.public_id,
                    width: res.width,
                    height: res.height,
                    format: res.format,
                    bytes: res.bytes,
                });
            });
            opts.stream.pipe(uploadStream);
        });
        return result;
    }
}
