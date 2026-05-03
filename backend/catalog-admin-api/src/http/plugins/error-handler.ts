import { MongoServerError } from "mongodb";
import type { FastifyInstance } from "fastify";
import { AppError } from "../../errors/app-error.js";
import { CatalogErrorCodes } from "../../errors/domain.js";

export async function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err, req, reply) => {
    const requestId = req.id;

    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({
        error: err.code,
        message: err.message,
        ...(requestId ? { requestId } : {}),
      });
    }

    if (err instanceof MongoServerError) {
      if (err.code === 11000) {
        return reply.status(409).send({
          error: CatalogErrorCodes.DUPLICATE_KEY,
          message:
            "A unique index rejected this write (duplicate key). Another record already uses that value.",
          ...(requestId ? { requestId } : {}),
        });
      }
      app.log.error({ err, reqId: requestId }, "MongoServerError");
      return reply.status(500).send({
        error: "DATABASE_ERROR",
        message: "A database error occurred.",
        ...(requestId ? { requestId } : {}),
      });
    }

    app.log.error({ err, reqId: requestId }, "Unhandled error");
    return reply.status(500).send({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
      ...(requestId ? { requestId } : {}),
    });
  });
}
