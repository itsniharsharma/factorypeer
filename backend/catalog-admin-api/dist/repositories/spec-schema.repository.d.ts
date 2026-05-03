import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import type { ExecOpts } from "./exec-opts.js";
export declare class SpecSchemaRepository {
    private readonly models;
    private readonly tenantId;
    constructor(models: CatalogModels, tenantId: Types.ObjectId | null);
    private tq;
    findById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findActiveOrLatestForCategory(categoryId: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    listForCategory(categoryId: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(data: {
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        status?: string;
    }, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateById(id: Types.ObjectId, patch: Partial<{
        familySummary: string;
        status: string;
        version: number;
        publishedAt: Date | null;
    }>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecSchemaDocument, {}, {}> & {
        version: number;
        status: "draft" | "published" | "archived";
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        familySummary: string;
        tenantId?: Types.ObjectId | null | undefined;
        publishedAt?: NativeDate | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=spec-schema.repository.d.ts.map