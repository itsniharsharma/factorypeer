import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import type { ExecOpts } from "./exec-opts.js";
export type VariantBindingInput = {
    productVariantId: Types.ObjectId;
    role: "primary" | "alternate";
    sortOrder: number;
};
export declare class SpecRowRepository {
    private readonly models;
    private readonly tenantId;
    constructor(models: CatalogModels, tenantId: Types.ObjectId | null);
    private tq;
    findById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecRowDocument, {}, {}> & {
        values: Map<string, string>;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        specSchemaId: Types.ObjectId;
        variantBindings: Types.DocumentArray<{
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }> & {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        externalKey?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /** Published rows (for a schema) that include this variant in variantBindings — PDP / linkage repair. */
    listPublishedContainingVariant(specSchemaId: Types.ObjectId, variantId: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecRowDocument, {}, {}> & {
        values: Map<string, string>;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        specSchemaId: Types.ObjectId;
        variantBindings: Types.DocumentArray<{
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }> & {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        externalKey?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    listBySpecSchema(specSchemaId: Types.ObjectId, opts?: ExecOpts & {
        status?: string;
        skip?: number;
        limit?: number;
    }): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecRowDocument, {}, {}> & {
        values: Map<string, string>;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        specSchemaId: Types.ObjectId;
        variantBindings: Types.DocumentArray<{
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }> & {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        externalKey?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    countBySpecSchema(specSchemaId: Types.ObjectId, opts?: ExecOpts & {
        status?: string;
    }): Promise<number>;
    create(data: {
        specSchemaId: Types.ObjectId;
        taxonomyNodeId: Types.ObjectId;
        values: Record<string, string>;
        variantBindings: VariantBindingInput[];
        externalKey?: string;
        status?: string;
        sortOrder?: number;
    }, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecRowDocument, {}, {}> & {
        values: Map<string, string>;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        specSchemaId: Types.ObjectId;
        variantBindings: Types.DocumentArray<{
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }> & {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        externalKey?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateById(id: Types.ObjectId, patch: Partial<{
        values: Record<string, string>;
        variantBindings: VariantBindingInput[];
        externalKey: string | null;
        status: string;
        sortOrder: number;
    }>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecRowDocument, {}, {}> & {
        values: Map<string, string>;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        specSchemaId: Types.ObjectId;
        variantBindings: Types.DocumentArray<{
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }> & {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        externalKey?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecRowDocument, {}, {}> & {
        values: Map<string, string>;
        status: "draft" | "published" | "archived";
        sortOrder: number;
        documentVersion: number;
        taxonomyNodeId: Types.ObjectId;
        specSchemaId: Types.ObjectId;
        variantBindings: Types.DocumentArray<{
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }, Types.Subdocument<import("bson").ObjectId, any, {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }> & {
            sortOrder: number;
            productVariantId: Types.ObjectId;
            role: "primary" | "alternate";
        }>;
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        externalKey?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteBySpecSchema(specSchemaId: Types.ObjectId, opts?: ExecOpts): Promise<void>;
    setSortOrders(pairs: Array<{
        id: Types.ObjectId;
        sortOrder: number;
    }>, opts?: ExecOpts): Promise<void>;
}
//# sourceMappingURL=spec-row.repository.d.ts.map