import { body } from "express-validator";

const NID_OLD_FORMAT = /^\d{9}[VX]$/i;
const NID_NEW_FORMAT = /^\d{12}$/;
const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9._]{3,29}$/;
const CONSECUTIVE_PUNCTUATION_REGEX = /[._]{2,}/;

export const registrationStartValidation = [
  body("nic")
    .trim()
    .notEmpty()
    .withMessage("NIC number is required")
    .bail()
    .custom((value) => {
      if (!NID_OLD_FORMAT.test(value) && !NID_NEW_FORMAT.test(value)) {
        throw new Error(
          "Invalid NIC number (e.g. 911042754V or a 12-digit number)",
        );
      }
      return true;
    }),
  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required")
    .bail()
    .isLength({ min: 12, max: 12 })
    .withMessage("Account number must be exactly 12 characters")
    .bail()
    .isNumeric()
    .withMessage("Account number must only contain numbers"),
];

export const otpVerificationValidation = [
  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required")
    .bail()
    .isLength({ min: 12, max: 12 })
    .withMessage("Account number must be exactly 12 characters")
    .bail()
    .isNumeric()
    .withMessage("Account number must only contain numbers"),
  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 characters")
    .bail()
    .isNumeric()
    .withMessage("OTP must only contain numbers"),
];

export const completeRegistrationValidation = [
  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required")
    .bail()
    .isLength({ min: 12, max: 12 })
    .withMessage("Account number must be exactly 12 characters")
    .bail()
    .isNumeric()
    .withMessage("Account number must only contain numbers"),
  body("username")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Username cannot be below 8 characters")
    .bail()
    .isLength({ max: 30 })
    .withMessage("Username cannot exceed 30 characters")
    .bail()
    .matches(/^[A-Za-z]/)
    .withMessage("Username must start with a letter")
    .bail()
    .matches(USERNAME_REGEX)
    .withMessage(
      "Username can only contain letters, numbers, periods, and underscores",
    )
    .bail()
    .custom((value) => {
      if (CONSECUTIVE_PUNCTUATION_REGEX.test(value)) {
        throw new Error(
          "Username cannot contain consecutive periods or underscores",
        );
      }
      return true;
    })
    .bail()
    .custom((value) => {
      if (/[._]$/.test(value)) {
        throw new Error("Username cannot end with a period or underscore");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password cannot be below 8 characters")
    .bail()
    .isLength({ max: 30 })
    .withMessage("Password cannot exceed 30 characters")
    .bail()
    .custom((value) => {
      if (value !== value.trim()) {
        throw new Error("Password cannot start or end with spaces");
      }
      return true;
    })
    .bail()
    .matches(/[A-Z]/)
    .withMessage("Password require at least one uppercase letter")
    .bail()
    .matches(/[a-z]/)
    .withMessage("Password require at least one lowercase letter")
    .bail()
    .matches(/\d/)
    .withMessage("Password require at least one number")
    .bail()
    .matches(/[^\w\s]/)
    .withMessage("Password require at least one special character"),
];

export const loginValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

export const requestPasswordResetValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account Number is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
];

export const resetPasswordValidation = [
  body("token")
    .trim()
    .notEmpty()
    .withMessage("Password reset token is required")
    .isLength({ min: 64, max: 64 })
    .withMessage("The password reset token is invalid")
    .matches(/^[a-fA-F0-9]{64}$/)
    .withMessage("The password reset token is invalid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password cannot be below 8 characters")
    .bail()
    .isLength({ max: 30 })
    .withMessage("Password cannot exceed 30 characters")
    .bail()
    .custom((value) => {
      if (value !== value.trim()) {
        throw new Error("Password cannot start or end with spaces");
      }
      return true;
    })
    .bail()
    .matches(/[A-Z]/)
    .withMessage("Password require at least one uppercase letter")
    .bail()
    .matches(/[a-z]/)
    .withMessage("Password require at least one lowercase letter")
    .bail()
    .matches(/\d/)
    .withMessage("Password require at least one number")
    .bail()
    .matches(/[^\w\s]/)
    .withMessage("Password require at least one special character"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
