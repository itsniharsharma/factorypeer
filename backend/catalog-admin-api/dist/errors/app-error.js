export class AppError extends Error {
    statusCode;
    code;
    constructor(message, statusCode = 400, code = "BAD_REQUEST") {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
    }
}
export class NotFoundError extends AppError {
    constructor(resource, id) {
        super(id ? `${resource} not found: ${id}` : `${resource} not found`, 404, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}
export class ConflictError extends AppError {
    constructor(message, code = "CONFLICT") {
        super(message, 409, code);
        this.name = "ConflictError";
    }
}
