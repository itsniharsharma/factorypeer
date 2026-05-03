import type { Types } from "mongoose";

export function auditCreateFields(actorId?: Types.ObjectId | null): Record<string, unknown> {
  if (!actorId) return {};
  return { createdBy: actorId, updatedBy: actorId };
}

/**
 * Standard partial update: merge patch, stamp updatedBy, increment documentVersion.
 */
export function buildAuditedUpdate(
  patch: Record<string, unknown>,
  actorId?: Types.ObjectId | null,
): { $set: Record<string, unknown>; $inc: { documentVersion: number } } {
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined),
  ) as Record<string, unknown>;
  return {
    $set: {
      ...cleaned,
      ...(actorId ? { updatedBy: actorId } : {}),
    },
    $inc: { documentVersion: 1 },
  };
}
