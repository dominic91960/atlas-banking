import { type RequestHandler } from "express";
import { validationResult } from "express-validator";

const validateRequest: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.type === "field" ? error.path : undefined,
        message: error.msg,
      })),
    });
  }

  next();
};

export default validateRequest;