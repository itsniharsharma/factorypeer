import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";

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
export function applyCloudinarySdkFromEnv():
  | { source: CloudinarySdkConfigSource; cloudName: string }
  | null {
  const url = process.env["CLOUDINARY_URL"]?.trim();
  const cloudName = process.env["CLOUDINARY_CLOUD_NAME"]?.trim();
  const apiKey = process.env["CLOUDINARY_API_KEY"]?.trim();
  const apiSecret = process.env["CLOUDINARY_API_SECRET"]?.trim();

  const splitCount = [cloudName, apiKey, apiSecret].filter(Boolean).length;
  if (splitCount > 0 && splitCount < 3) {
    throw new Error(
      "Cloudinary: incomplete split credentials — set all of CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, or use CLOUDINARY_URL only.",
    );
  }

  if (url) {
    if (!url.toLowerCase().startsWith("cloudinary://")) {
      throw new Error(
        "Invalid CLOUDINARY_URL: protocol must be cloudinary:// (see Cloudinary dashboard / API environment variable).",
      );
    }
    cloudinary.config(true);
    const c = cloudinary.config() as { cloud_name?: string };
    const name = c.cloud_name;
    if (!name) {
      throw new Error("Cloudinary: CLOUDINARY_URL was set but did not produce a cloud_name (check the URL).");
    }
    return { source: "CLOUDINARY_URL", cloudName: name };
  }

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return { source: "split_env", cloudName: cloudName };
  }

  return null;
}

/**
 * Ensures the v2 SDK has cloud_name, api_key, and api_secret. Use before migration or bulk upload.
 */
export function assertCloudinarySdkReadyForUpload(): { source: CloudinarySdkConfigSource; cloudName: string } {
  const applied = applyCloudinarySdkFromEnv();
  if (!applied) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_URL, or set CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.",
    );
  }
  const c = cloudinary.config() as { cloud_name?: string; api_key?: string; api_secret?: string };
  if (!c.cloud_name || !c.api_key || !c.api_secret) {
    throw new Error(
      "Cloudinary configuration is invalid after apply (missing cloud_name, api_key, or api_secret). Check env format.",
    );
  }
  return applied;
}

/**
 * Cloudinary uploads — configured via `CLOUDINARY_URL` or
 * `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`.
 */
export class CloudinaryService {
  constructor() {
    /** No-op when unset; throws on malformed URL or incomplete split vars. */
    applyCloudinarySdkFromEnv();
  }

  isConfigured(): boolean {
    return Boolean(
      process.env["CLOUDINARY_URL"]?.trim() ||
        (process.env["CLOUDINARY_CLOUD_NAME"]?.trim() &&
          process.env["CLOUDINARY_API_KEY"]?.trim() &&
          process.env["CLOUDINARY_API_SECRET"]?.trim()),
    );
  }

  async uploadImageBuffer(opts: {
    buffer: Buffer;
    mime: string;
    folder?: string;
  }): Promise<UploadedAssetMeta> {
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

  async destroy(publicId: string): Promise<void> {
    const id = publicId.trim();
    if (!id || !this.isConfigured()) return;
    try {
      await cloudinary.uploader.destroy(id);
    } catch {
      /* best-effort cleanup */
    }
  }

  /** Stream upload for large files without base64 overhead. */
  async uploadImageStream(opts: {
    stream: Readable;
    mime: string;
    folder?: string;
    timeoutMs?: number;
  }): Promise<UploadedAssetMeta> {
    const folder = opts.folder ?? "factorypeer/catalog";
    const timeoutMs = opts.timeoutMs ?? 60_000; // 60 second default for large uploads

    const result = await new Promise<UploadedAssetMeta>((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | null = null;
      let uploadStreamDestroyed = false;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (!uploadStreamDestroyed) {
          uploadStream.destroy();
          uploadStreamDestroyed = true;
        }
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image", overwrite: false, invalidate: true },
        (err, res) => {
          cleanup();
          if (err || !res) {
            return reject(err ?? new Error("Cloudinary upload failed"));
          }
          resolve({
            url: res.secure_url,
            publicId: res.public_id,
            width: res.width,
            height: res.height,
            format: res.format,
            bytes: res.bytes,
          });
        },
      );

      // Set timeout for upload
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`Cloudinary upload timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      // Handle stream errors
      opts.stream.on("error", (err) => {
        cleanup();
        reject(new Error(`Stream error during Cloudinary upload: ${err.message}`));
      });

      uploadStream.on("error", (err) => {
        cleanup();
        reject(new Error(`Cloudinary upload stream error: ${err.message}`));
      });

      opts.stream.pipe(uploadStream);
    });

    return result;
  }
}
