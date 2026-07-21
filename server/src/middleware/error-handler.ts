import { type ErrorRequestHandler } from "express";
import {
  BaseError,
  ValidationError,
  DatabaseError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from "sequelize";

const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  let status = 500;
  let message = "An unexpected server error occurred";

  if (err instanceof BaseError) {
    if (err instanceof UniqueConstraintError) {
      status = 409;
      message = "The provided value is already in use";
    } else if (err instanceof ForeignKeyConstraintError) {
      status = 400;
      message = "The referenced record is invalid";
    } else if (err instanceof ValidationError) {
      status = 400;
      message = err.errors
        .map((error) => error.message)
        .join(", ");
    } else if (err instanceof DatabaseError) {
      status = 500;
      message = "A database operation failed";
    }
  }

  /*
   * Log the full error only on the server.
   */
  console.error(err);

  res.status(status).json({
    message,
  });
};

export default errorHandler;