import { Types } from "mongoose";

export function toObjectId(id: string): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  return new Types.ObjectId(id);
}

export function tenantMatch(tenantId: Types.ObjectId | null | undefined) {
  return tenantId ? { tenantId } : { tenantId: null };
}

/** Prefix match for subtree paths (escape regex specials). */
export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
