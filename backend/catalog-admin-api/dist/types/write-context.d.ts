import type { Types } from "mongoose";
/** Optional actor passed from HTTP layer into services (audit fields). */
export type WriteContext = {
    actorUserId?: Types.ObjectId | null;
};
export declare function actorIdFromContext(ctx?: WriteContext): Types.ObjectId | null | undefined;
//# sourceMappingURL=write-context.d.ts.map