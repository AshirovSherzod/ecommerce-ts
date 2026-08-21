import { z } from "zod";
import { emailField, requiredText } from "@/schemas/common";

export const contactSchema = z.object({
  name: requiredText("validation:nameRequired"),
  email: emailField(),
  message: requiredText("validation:messageRequired"),
});

export type ContactValues = z.infer<typeof contactSchema>;
