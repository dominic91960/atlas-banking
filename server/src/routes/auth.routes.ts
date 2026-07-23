import { Router } from "express";
import { body } from "express-validator";

import {
  startRegistration,
  verifyRegistrationOTP,
  completeRegistration,
  login,
  refreshAccessToken,
  requestPasswordReset,
  resetPassword,
  logout,
} from "../controllers/auth.controller.js";
import {
  registrationStartLimiter,
  otpVerificationLimiter,
  loginLimiter,
  passwordResetRequestLimiter,
  passwordResetLimiter,
} from "../middleware/rate-limit.js";
import {
  completeRegistrationValidation,
  loginValidation,
  registrationStartValidation,
  otpVerificationValidation,
  requestPasswordResetValidation,
  resetPasswordValidation,
} from "../validations/auth.validation.js";
import validateRequest from "../middleware/validate-request.js";

const router = Router();

// Route to refresh the access token
router.get("/refresh", refreshAccessToken);

// Sign Up routes
router.post(
  "/register/start",
  registrationStartLimiter,
  registrationStartValidation,
  validateRequest,
  startRegistration,
);
router.post(
  "/register/verify-otp",
  otpVerificationLimiter,
  otpVerificationValidation,
  validateRequest,
  verifyRegistrationOTP,
);
router.post(
  "/register/complete",
  completeRegistrationValidation,
  validateRequest,
  completeRegistration,
);

// Sign In routes
router.post("/login", loginLimiter, loginValidation, validateRequest, login);
router.post("/logout", logout);

// Password reset routes
router.post(
  "/forgot-password",
  passwordResetRequestLimiter,
  requestPasswordResetValidation,
  validateRequest,
  requestPasswordReset,
);
router.post(
  "/reset-password",
  passwordResetLimiter,
  resetPasswordValidation,
  validateRequest,
  resetPassword,
);

export default router;
