import { z } from "zod";
import { emailField, requiredText } from "@/schemas/common";

const MIN_PASSWORD = 8;

// Backend formati: +998901234567
const PHONE_REGEX = /^\+998\d{9}$/;

const password = z
  .string()
  .min(MIN_PASSWORD, "validation:passwordMin");

export const signInSchema = z.object({
  // Bitta maydon: backend email va username'ni ham qabul qiladi
  identifier: requiredText("validation:identifierRequired"),
  password,
  remember: z.boolean(),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: requiredText("validation:fullNameRequired"),
  firstname: requiredText("validation:firstNameRequired"),
  username: requiredText("validation:usernameRequired").pipe(
    z.string().min(3, "validation:usernameMin"),
  ),
  email: emailField(),
  phone: requiredText("validation:phoneRequired").pipe(
    z.string().regex(PHONE_REGEX, "validation:phoneFormat"),
  ),
  password,
});

export type SignUpValues = z.infer<typeof signUpSchema>;
