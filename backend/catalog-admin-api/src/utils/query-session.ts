import type { ClientSession } from "mongoose";

/** Attach a transaction session when present (read-your-writes in transactions). */
export function withSession<Q extends { session(s?: ClientSession | null): Q }>(
  query: Q,
  session?: ClientSession,
): Q {
  return session ? query.session(session) : query;
}
