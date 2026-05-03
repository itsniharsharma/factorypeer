export function auditCreateFields(actorId) {
    if (!actorId)
        return {};
    return { createdBy: actorId, updatedBy: actorId };
}
/**
 * Standard partial update: merge patch, stamp updatedBy, increment documentVersion.
 */
export function buildAuditedUpdate(patch, actorId) {
    const cleaned = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    return {
        $set: {
            ...cleaned,
            ...(actorId ? { updatedBy: actorId } : {}),
        },
        $inc: { documentVersion: 1 },
    };
}
