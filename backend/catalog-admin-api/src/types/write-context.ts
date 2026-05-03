import type { Types } from "mongoose";

/** Optional actor passed from HTTP layer into services (audit fields). */
export type WriteContext = {
  actorUserId?: Types.ObjectId | null;
};

export function actorIdFromContext(ctx?: WriteContext): Types.ObjectId | null | undefined {
  return ctx?.actorUserId;
}
