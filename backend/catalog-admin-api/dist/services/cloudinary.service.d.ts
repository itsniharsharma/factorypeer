import { Readable } from "node:stream";
export type UploadedAssetMeta = {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
    bytes?: number;
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
    }): Promise<UploadedAssetMeta>;
}
//# sourceMappingURL=cloudinary.service.d.ts.map