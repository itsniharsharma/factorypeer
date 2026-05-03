import { Types } from "mongoose";
export declare function toObjectId(id: string): Types.ObjectId;
export declare function tenantMatch(tenantId: Types.ObjectId | null | undefined): {
    tenantId: Types.ObjectId;
} | {
    tenantId: null;
};
/** Prefix match for subtree paths (escape regex specials). */
export declare function escapeRegex(s: string): string;
//# sourceMappingURL=mongo.d.ts.map