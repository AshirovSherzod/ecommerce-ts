import { z } from "zod";

const MIN_PASSWORD = 8;

// Backend formati: +998901234567
const PHONE_REGEX = /^\+998\d{9}$/;

// `.trim()` faqat tekshirmaydi, qiymatni ham tozalaydi — shuning uchun
// forma natijasi to'g'ridan-to'g'ri API'ga yuborilishi mumkin
const requiredText = (message: string) => z.string().trim().min(1, message);

const password = z
  .string()
  .min(MIN_PASSWORD, `Parol kamida ${MIN_PASSWORD} belgidan iborat bo'lishi kerak`);

export const signInSchema = z.object({
  // Bitta maydon: backend email va username'ni ham qabul qiladi
  identifier: requiredText("Email yoki foydalanuvchi nomini kiriting"),
  password,
  remember: z.boolean(),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: requiredText("To'liq ismni kiriting"),
  firstname: requiredText("Ismni kiriting"),
  username: requiredText("Foydalanuvchi nomini kiriting").pipe(
    z.string().min(3, "Kamida 3 belgi bo'lishi kerak"),
  ),
  email: requiredText("Email manzilini kiriting").pipe(
    z.email("Email manzili noto'g'ri"),
  ),
  phone: requiredText("Telefon raqamini kiriting").pipe(
    z.string().regex(PHONE_REGEX, "Format: +998901234567"),
  ),
  password,
});

export type SignUpValues = z.infer<typeof signUpSchema>;
