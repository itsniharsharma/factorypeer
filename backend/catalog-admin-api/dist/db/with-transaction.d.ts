import mongoose from "mongoose";
/**
 * Runs `fn` inside `session.withTransaction` (MongoDB multi-document ACID).
 * Commits on success, aborts on throw.
 */
export declare function withTransaction<T>(fn: (session: mongoose.ClientSession) => Promise<T>): Promise<T>;
//# sourceMappingURL=with-transaction.d.ts.map