import { z } from "zod";

export const forgotPwdFormSchema = z.object({
  username: z.string().trim().min(1, "Please fill this field"),
  accountNumber: z.string().trim().min(1, "Please fill this field"),
  email: z.string().trim().min(1, "Please fill this field"),
});

export type TForgotPwdForm = z.infer<typeof forgotPwdFormSchema>;
