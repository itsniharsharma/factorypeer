import mongoose from "mongoose";
/**
 * Runs `fn` inside `session.withTransaction` (MongoDB multi-document ACID).
 * Commits on success, aborts on throw.
 */
export async function withTransaction(fn) {
    const session = await mongoose.startSession();
    try {
        let out;
        await session.withTransaction(async () => {
            out = await fn(session);
        });
        return out;
    }
    finally {
        await session.endSession();
    }
}
