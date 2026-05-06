import { Readable } from "node:stream";
export type UploadedAssetMeta = {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
};
export type CloudinarySdkConfigSource = "CLOUDINARY_URL" | "split_env";
/**
 * The Node Cloudinary SDK's `config(true)` only reads `CLOUDINARY_URL` (and account URL) from the
 * environment — it does **not** apply `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`.
 * This helper matches the product behavior: support either a single URL or the three split variables.
 *
 * @returns which source was applied, or `null` if no Cloudinary env is set (API may still start; uploads 503).
 * @throws if split env is partially set (misconfiguration)
 */
export declare function applyCloudinarySdkFromEnv(): {
    source: CloudinarySdkConfigSource;
    cloudName: string;
} | null;
/**
 * Ensures the v2 SDK has cloud_name, api_key, and api_secret. Use before migration or bulk upload.
 */
export declare function assertCloudinarySdkReadyForUpload(): {
    source: CloudinarySdkConfigSource;
    cloudName: string;
};
/**
 * Cloudinary uploads — configured via `CLOUDINARY_URL` or
 * `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`.
 */
export declare class CloudinaryService {
    constructor();
    isConfigured(): boolean;
    uploadImageBuffer(opts: {
        buffer: Buffer;
        mime: string;
        folder?: string;
    }): Promise<UploadedAssetMeta>;
    destroy(publicId: string): Promise<void>;
    /** Stream upload for large files without base64 overhead. */
    uploadImageStream(opts: {
        stream: Readable;
        mime: string;
        folder?: string;
        timeoutMs?: number;
    }): Promise<UploadedAssetMeta>;
}
//# sourceMappingURL=cloudinary.service.d.ts.map