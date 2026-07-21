import { Router } from "express";
import { body } from "express-validator";
import {
  startRegistration,
  verifyRegistrationOTP,
  completeRegistration,
  login,
} from "../controllers/auth.controller.js";
import validateRequest from "../middleware/validate-request.js";
import {
  registrationStartLimiter,
  otpVerificationLimiter,
  loginLimiter,
} from "../middleware/rate-limit.js";

const router = Router();

/*
 * Step 1: Verify account number and NIC, then send OTP.
 */
router.post(
  "/register/start",
  registrationStartLimiter,

  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required")
    .isLength({ min: 4, max: 20 })
    .withMessage("Account number must contain 4 to 20 characters"),

  body("nic")
    .trim()
    .notEmpty()
    .withMessage("NIC is required")
    .isLength({ min: 9, max: 20 })
    .withMessage("NIC must contain 9 to 20 characters"),

  validateRequest,
  startRegistration
);

/*
 * Step 2: Verify OTP.
 */
router.post(
  "/register/verify-otp",
  otpVerificationLimiter,

  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required"),

  body("otp")
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("OTP must be a six-digit number"),

  validateRequest,
  verifyRegistrationOTP
);

/*
 * Step 3: Create username and password.
 */
router.post(
  "/register/complete",

  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required"),

  body("username")
    .trim()
    .isLength({ min: 4, max: 50 })
    .withMessage("Username must contain 4 to 50 characters")
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage(
      "Username may only contain letters, numbers, dots, underscores and hyphens"
    ),

  body("password")
    .isLength({ min: 10, max: 128 })
    .withMessage("Password must contain at least 10 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain a special character"),

  validateRequest,
  completeRegistration
);

/*
 * Sign in.
 */
router.post(
  "/login",
  loginLimiter,

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  validateRequest,
  login
);

export default router;