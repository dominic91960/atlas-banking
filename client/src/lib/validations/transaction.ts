import { z } from "zod";

export const transferStepSchema = z.object({
  receiverAccountNumber: z
    .string()
    .trim()
    .min(1, "Please fill this field")
    .length(12, "Must be exactly 12 characters")
    .regex(/^[0-9]+$/, "Must only contain numbers"),
  amount: z
    .string()
    .trim()
    .min(1, "Please fill this field")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount (e.g. 1000 or 1000.50)")
    .refine((val) => parseFloat(val) > 0, "Must be greater than zero"),
  reference: z
    .string()
    .trim()
    .min(1, "Please fill this field")
    .max(100, "Cannot exceed 100 characters"),
});

export const transactionOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, "Please fill this field")
    .regex(/^[0-9]+$/, "Must only contain numbers"),
});

export type TTransferStep = z.infer<typeof transferStepSchema>;
export type TTransactionOtp = z.infer<typeof transactionOtpSchema>;
