import { z } from "zod";
import { emailField, requiredText } from "@/schemas/common";

// Backend formati bilan bir xil: +998901234567
const PHONE_REGEX = /^\+998\d{9}$/;

export const checkoutSchema = z.object({
  name: requiredText("validation:checkoutNameRequired"),
  phone: requiredText("validation:phoneRequired").pipe(
    z.string().regex(PHONE_REGEX, "validation:phoneFormat"),
  ),
  address: requiredText("validation:addressRequired").pipe(
    z.string().min(10, "validation:addressMin"),
  ),
  // Ixtiyoriy: bo'sh qoldirilsa tekshirilmaydi
  email: z.union([z.literal(""), emailField()]),
  note: z.string().trim().max(500, "validation:noteMax"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
