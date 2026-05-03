/** Attach a transaction session when present (read-your-writes in transactions). */
export function withSession(query, session) {
    return session ? query.session(session) : query;
}
