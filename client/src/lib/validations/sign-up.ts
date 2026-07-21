import { z } from "zod";

const NID_OLD_FORMAT = /^\d{9}[VX]$/i;
const NID_NEW_FORMAT = /^\d{12}$/;
const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9._]{3,29}$/;
const CONSECUTIVE_PUNCTUATION_REGEX = /[._]{2,}/;

export const nicStepSchema = z.object({
  nic: z
    .string()
    .min(1, "National Identity Card number is required")
    .refine(
      (val) => NID_OLD_FORMAT.test(val) || NID_NEW_FORMAT.test(val),
      "Enter a valid NIC number (e.g. 911042754V or a 12-digit number)",
    ),
  bankAccNo: z
    .string()
    .min(1, "Account number is required")
    .length(8, "Account number must be exactly 8 characters")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Account number can only contain letters and numbers",
    ),
});

export const otpStepSchema = z.object({
  otp: z
    .string()
    .length(6, "Please enter the complete 6-digit code")
    .regex(/^[A-Za-z0-9]+$/, "Code must contain digits and letters only"),
});

export const signUpStepSchema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be at least 4 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        USERNAME_REGEX,
        "Username must start with a letter and contain only letters, numbers, periods, and underscores",
      )
      .refine(
        (value) => !CONSECUTIVE_PUNCTUATION_REGEX.test(value),
        "Username cannot contain consecutive periods or underscores",
      )
      .refine(
        (value) => !/[._]$/.test(value),
        "Username cannot end with a period or underscore",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TNicStep = z.infer<typeof nicStepSchema>;
export type TOtpStep = z.infer<typeof otpStepSchema>;
export type TSignUpStep = z.infer<typeof signUpStepSchema>;
