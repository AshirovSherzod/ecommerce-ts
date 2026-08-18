import { z } from "zod";
import { emailField } from "@/schemas/common";

export const newsletterSchema = z.object({
  email: emailField(),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
