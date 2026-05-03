import { Schema } from "mongoose";
/**
 * Reference to a CDN-hosted image — binaries live in Cloudinary (or legacy absolute URLs).
 * Mongo stores metadata only.
 */
export const catalogMediaAssetSchema = new Schema({
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    alt: { type: String, trim: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String, trim: true },
}, { _id: false });
