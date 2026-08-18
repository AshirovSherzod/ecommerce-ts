import { z } from "zod";
import { emailField, requiredText } from "@/schemas/common";

export const contactSchema = z.object({
  name: requiredText("Ismingizni kiriting"),
  email: emailField(),
  message: requiredText("Xabar matnini yozing"),
});

export type ContactValues = z.infer<typeof contactSchema>;
