import { z } from "zod";

export const transferStepSchema = z.object({
  receiverAccountNumber: z
    .string()
    .min(1, "Receiver account number is required")
    .min(4, "Account number must be at least 4 characters")
    .max(20, "Account number cannot exceed 20 characters")
    .regex(/^[0-9]+$/, "Account number must only contain numbers"),
  amount: z
    .string()
    .min(1, "Transaction amount is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Enter a valid amount (e.g. 1000 or 1000.50)",
    )
    .refine(
      (val) => parseFloat(val) > 0,
      "Amount must be greater than zero",
    ),
  reference: z
    .string()
    .max(100, "Reference cannot exceed 100 characters")
    .optional(),
});

export const transactionOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Please enter the complete 6-digit code")
    .regex(/^[0-9]+$/, "Code must only contain numbers"),
});

export type TTransferStep = z.infer<typeof transferStepSchema>;
export type TTransactionOtp = z.infer<typeof transactionOtpSchema>;
