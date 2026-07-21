import { z } from "zod";

export const signInFormSchema = z.object({
  username: z.string().min(1, "Please enter your username"),
  password: z.string().min(1, "Please enter your password"),
});

export type TSignInForm = z.infer<typeof signInFormSchema>;
