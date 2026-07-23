import { z } from "zod";

export const signInFormSchema = z.object({
  username: z.string().trim().min(1, "Please fill this field"),
  password: z.string().trim().min(1, "Please fill this field"),
});

export type TSignInForm = z.infer<typeof signInFormSchema>;
