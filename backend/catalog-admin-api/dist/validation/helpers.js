import { AppError } from "../errors/app-error.js";
export function parseBody(schema, body) {
    const r = schema.safeParse(body);
    if (!r.success) {
        const msg = r.error.flatten().fieldErrors
            ? JSON.stringify(r.error.flatten().fieldErrors)
            : r.error.message;
        throw new AppError(msg, 422, "VALIDATION_ERROR");
    }
    return r.data;
}
export function parseParams(schema, params) {
    const r = schema.safeParse(params);
    if (!r.success) {
        throw new AppError(r.error.message, 422, "VALIDATION_ERROR");
    }
    return r.data;
}
export function parseQuery(schema, query) {
    const r = schema.safeParse(query);
    if (!r.success) {
        const msg = r.error.flatten().fieldErrors
            ? JSON.stringify(r.error.flatten().fieldErrors)
            : r.error.message;
        throw new AppError(msg, 422, "VALIDATION_ERROR");
    }
    return r.data;
}
