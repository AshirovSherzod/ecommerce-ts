import { z } from "zod";
import { emailField, requiredText } from "@/schemas/common";

// Backend formati bilan bir xil: +998901234567
const PHONE_REGEX = /^\+998\d{9}$/;

export const checkoutSchema = z.object({
  name: requiredText("Ism va familiyangizni kiriting"),
  phone: requiredText("Telefon raqamini kiriting").pipe(
    z.string().regex(PHONE_REGEX, "Format: +998901234567"),
  ),
  address: requiredText("Yetkazib berish manzilini kiriting").pipe(
    z.string().min(10, "Manzilni to'liqroq yozing (kamida 10 belgi)"),
  ),
  // Ixtiyoriy: bo'sh qoldirilsa tekshirilmaydi
  email: z.union([z.literal(""), emailField()]),
  note: z.string().trim().max(500, "Izoh 500 belgidan oshmasligi kerak"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
