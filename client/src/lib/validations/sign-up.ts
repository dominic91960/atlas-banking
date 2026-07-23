import { z } from "zod";

const NID_OLD_FORMAT = /^\d{9}[VX]$/i;
const NID_NEW_FORMAT = /^\d{12}$/;
const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9._]{3,29}$/;
const CONSECUTIVE_PUNCTUATION_REGEX = /[._]{2,}/;

export const nicStepSchema = z.object({
  nic: z
    .string()
    .trim()
    .min(1, "Please fill this field")
    .refine(
      (val) => NID_OLD_FORMAT.test(val) || NID_NEW_FORMAT.test(val),
      "Invalid NIC number (e.g. 911042754V or a 12-digit number)",
    ),
  accountNumber: z
    .string()
    .trim()
    .min(1, "Please fill this field")
    .length(12, "Must be exactly 12 characters")
    .regex(/^[0-9]+$/, "Must only contain numbers"),
});

export const otpStepSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, "Must be exactly 6 characters")
    .regex(/^[0-9]+$/, "Must only contain numbers"),
});

export const signUpStepSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(8, "Cannot be below 8 characters")
      .max(30, "Cannot exceed 30 characters")
      .refine((value) => /^[A-Za-z]/.test(value), "Must start with a letter")
      .regex(
        USERNAME_REGEX,
        "Can only contain letters, numbers, periods, and underscores",
      )
      .refine(
        (value) => !CONSECUTIVE_PUNCTUATION_REGEX.test(value),
        "Cannot contain consecutive periods or underscores",
      )
      .refine(
        (value) => !/[._]$/.test(value),
        "Cannot end with a period or underscore",
      ),
    password: z
      .string()
      .min(8, "Cannot be below 8 characters")
      .max(30, "Cannot exceed 30 characters")
      .refine((v) => v === v.trim(), "Cannot start or end with spaces")
      .regex(/[A-Z]/, "At least one uppercase letter required")
      .regex(/[a-z]/, "At least one lowercase letter required")
      .regex(/\d/, "At least one number required")
      .regex(/[^\w\s]/, "At least one special character required"),
    confirmPassword: z.string().trim().min(1, "Please fill this field"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TNicStep = z.infer<typeof nicStepSchema>;
export type TOtpStep = z.infer<typeof otpStepSchema>;
export type TSignUpStep = z.infer<typeof signUpStepSchema>;
