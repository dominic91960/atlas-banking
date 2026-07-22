import { z } from "zod";

export const forgotPwdFormSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  accountNumber: z.string().min(1, "Please enter your account number"),
  email: z.string().min(1, "Please enter your email"),
});

export type TForgotPwdForm = z.infer<typeof forgotPwdFormSchema>;
