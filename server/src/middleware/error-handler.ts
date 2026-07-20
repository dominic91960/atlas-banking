import { type ErrorRequestHandler } from "express";
import {
  BaseError,
  ValidationError,
  DatabaseError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from "sequelize";

const errorHandler: ErrorRequestHandler = (err, _rew, res, _next) => {
  let status = 500;
  let message = "An unknown error occurred";

  if (err instanceof Error) message = err.message;

  if (err instanceof BaseError) {
    if (err instanceof ValidationError) {
      status = 400;
      message = err.errors.map((e) => e.message).join(", ");
    } else if (err instanceof UniqueConstraintError) {
      status = 409;
      message = "Duplicate value violates a unique constraint.";
    } else if (err instanceof ForeignKeyConstraintError) {
      status = 400;
      message = "Invalid foreign key reference.";
    } else if (err instanceof DatabaseError) {
      status = 500;
      message = `Database error: ${err.message}`;
    }
  }

  res.status(status).json({ message });
};

export default errorHandler;
