import { body } from "express-validator";
import { Decimal } from "decimal.js";
import { Router } from "express";

import {
  startTransaction,
  verifyTransactionOTP,
  getRecentTransactions,
} from "../controllers/transaction.controller.js";
import {
  transactionStartLimiter,
  transactionVerificationLimiter,
} from "../middleware/rate-limit.js";
import {
  startTransactionValidation,
  verifyTransactionOTPValidation,
} from "../validations/transaction.validation.js";
import authenticate from "../middleware/authenticate.js";
import validateRequest from "../middleware/validate-request.js";

const router = Router();

router.use(authenticate);
router.get("/recent", getRecentTransactions);

router.post(
  "/start",
  transactionStartLimiter,
  startTransactionValidation,
  validateRequest,
  startTransaction,
);

router.post(
  "/verify-otp",
  transactionVerificationLimiter,
  verifyTransactionOTPValidation,
  validateRequest,
  verifyTransactionOTP,
);

export default router;
