import type { Types } from "mongoose";
import type { CatalogModels } from "../db/connection.js";
import type { ExecOpts } from "./exec-opts.js";
export declare class SpecColumnRepository {
    private readonly models;
    private readonly tenantId;
    constructor(models: CatalogModels, tenantId: Types.ObjectId | null);
    private tq;
    listBySpecSchema(specSchemaId: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    create(data: {
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType?: string;
        filterable?: boolean;
        sortable?: boolean;
        searchIndex?: boolean;
        enumOptions?: string[];
        unit?: string;
        widthClass?: string;
        sortOrder?: number;
    }, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | undefined>;
    updateById(id: Types.ObjectId, patch: Partial<{
        label: string;
        dataType: string;
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        unit: string | null;
        widthClass: string | null;
        sortOrder: number;
    }>, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteById(id: Types.ObjectId, opts?: ExecOpts): Promise<(import("mongoose").Document<unknown, {}, import("@factorypeer/catalog-models").CatalogSpecColumnDocument, {}, {}> & {
        sortOrder: number;
        documentVersion: number;
        specSchemaId: Types.ObjectId;
        key: string;
        label: string;
        dataType: "string" | "number" | "boolean" | "enum" | "dimension";
        filterable: boolean;
        sortable: boolean;
        searchIndex: boolean;
        enumOptions: string[];
        tenantId?: Types.ObjectId | null | undefined;
        createdBy?: Types.ObjectId | null | undefined;
        updatedBy?: Types.ObjectId | null | undefined;
        unit?: string | null | undefined;
        widthClass?: string | null | undefined;
    } & import("mongoose").DefaultTimestampProps & {
        _id: Types.ObjectId;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    deleteBySpecSchema(specSchemaId: Types.ObjectId, opts?: ExecOpts): Promise<void>;
}
//# sourceMappingURL=spec-column.repository.d.ts.map