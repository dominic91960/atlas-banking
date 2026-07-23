import { z } from "zod";

export const resetPwdFormSchema = z
  .object({
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

export const resetPwdTokenSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{64}$/i, {
    message: "Invalid token",
  });

export type TResetPwdForm = z.infer<typeof resetPwdFormSchema>;
