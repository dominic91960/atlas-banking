import { Router } from "express";
import { body } from "express-validator";

import {
  startTransaction,
  verifyTransactionOTP,
} from "../controllers/transaction.controller.js";

import authenticate from "../middleware/authenticate.js";
import validateRequest from "../middleware/validate-request.js";

import {
  transactionStartLimiter,
  transactionVerificationLimiter,
} from "../middleware/rate-limit.js";
import { Decimal } from "decimal.js";

const router = Router();

/*
 * Every route in this router requires a valid JWT.
 */
router.use(authenticate);

/*
 * Step 1:
 * Enter receiver and amount, then send OTP.
 */
router.post(
  "/start",
  transactionStartLimiter,

  body("receiverAccountNumber")
    .trim()
    .notEmpty()
    .withMessage(
      "Receiver account number is required"
    )
    .isLength({
      min: 4,
      max: 20,
    })
    .withMessage(
      "Receiver account number must contain 4 to 20 characters"
    ),

  body("amount")
    .notEmpty()
    .withMessage(
      "Transaction amount is required"
    )
    .isDecimal({
      decimal_digits: "0,2",
      force_decimal: false,
    })
    .withMessage(
      "Transaction amount must be a valid monetary amount with no more than two decimal places"
    )
    .custom((value) => {
    try {
        const amount = new Decimal(String(value));

        if (
        !amount.isFinite() ||
        amount.lessThanOrEqualTo(0)
        ) {
        throw new Error();
        }

        return true;
    } catch {
        throw new Error(
        "Transaction amount must be greater than zero"
        );
    }
    }),

  body("reference")
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "Reference cannot exceed 100 characters"
    ),

  validateRequest,
  startTransaction
);

/*
 * Step 2:
 * Verify OTP and transfer funds.
 */
router.post(
  "/verify-otp",
  transactionVerificationLimiter,

  body("transferRequestId")
    .trim()
    .notEmpty()
    .withMessage(
      "Transfer request ID is required"
    )
    .isUUID()
    .withMessage(
      "Transfer request ID is invalid"
    ),

  body("otp")
    .trim()
    .matches(/^\d{6}$/)
    .withMessage(
      "OTP must be a six-digit number"
    ),

  validateRequest,
  verifyTransactionOTP
);

export default router;