import { z } from "zod";

/**
 * Formalar bo'ylab takrorlanadigan qoidalar. `.trim()` faqat tekshirmaydi,
 * qiymatni ham tozalaydi — shuning uchun forma natijasi to'g'ridan-to'g'ri
 * yuborilishi mumkin, qo'lda `trim()` chaqirish shart emas.
 */
export const requiredText = (message: string) =>
  z.string().trim().min(1, message);

export const emailField = (
  requiredMessage = "Email manzilini kiriting",
  invalidMessage = "Email manzili noto'g'ri",
) => requiredText(requiredMessage).pipe(z.email(invalidMessage));
