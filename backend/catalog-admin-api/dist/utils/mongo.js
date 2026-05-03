import { Types } from "mongoose";
export function toObjectId(id) {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new Types.ObjectId(id);
}
export function tenantMatch(tenantId) {
    return tenantId ? { tenantId } : { tenantId: null };
}
/** Prefix match for subtree paths (escape regex specials). */
export function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
