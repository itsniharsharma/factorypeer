import type { Types } from "mongoose";
export declare function auditCreateFields(actorId?: Types.ObjectId | null): Record<string, unknown>;
/**
 * Standard partial update: merge patch, stamp updatedBy, increment documentVersion.
 */
export declare function buildAuditedUpdate(patch: Record<string, unknown>, actorId?: Types.ObjectId | null): {
    $set: Record<string, unknown>;
    $inc: {
        documentVersion: number;
    };
};
//# sourceMappingURL=audit.d.ts.map