import { body } from "express-validator";

export const startTransactionValidation = [
  body("receiverAccountNumber")
    .trim()
    .notEmpty()
    .withMessage("Receiver account number is required")
    .bail()
    .isLength({ min: 12, max: 12 })
    .withMessage("Receiver account number must be exactly 12 characters")
    .bail()
    .isNumeric()
    .withMessage("Receiver account number must only contain numbers"),
  body("amount")
    .trim()
    .notEmpty()
    .withMessage("Transfer amount is required")
    .bail()
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage("Invalid transfer amount (e.g. 1000 or 1000.50)")
    .bail()
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error("Transfer amount be greater than zero");
      }
      return true;
    }),
  body("reference")
    .trim()
    .notEmpty()
    .withMessage("Reference is required")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Reference cannot exceed 100 characters"),
];

export const verifyTransactionOTPValidation = [
  body("transferRequestId")
    .trim()
    .notEmpty()
    .withMessage("Transfer request ID is required")
    .isUUID()
    .withMessage("Transfer request ID is invalid"),
  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters")
    .bail()
    .isNumeric()
    .withMessage("OTP must only contain numbers"),
];
