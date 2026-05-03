import { Schema, type InferSchemaType } from "mongoose";
/**
 * Reference to a CDN-hosted image — binaries live in Cloudinary (or legacy absolute URLs).
 * Mongo stores metadata only.
 */
export declare const catalogMediaAssetSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    url: string;
    publicId?: string | null | undefined;
    alt?: string | null | undefined;
    width?: number | null | undefined;
    height?: number | null | undefined;
    format?: string | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    url: string;
    publicId?: string | null | undefined;
    alt?: string | null | undefined;
    width?: number | null | undefined;
    height?: number | null | undefined;
    format?: string | null | undefined;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    url: string;
    publicId?: string | null | undefined;
    alt?: string | null | undefined;
    width?: number | null | undefined;
    height?: number | null | undefined;
    format?: string | null | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type CatalogMediaAssetSubdoc = InferSchemaType<typeof catalogMediaAssetSchema>;
//# sourceMappingURL=catalog-media-asset.schema.d.ts.map