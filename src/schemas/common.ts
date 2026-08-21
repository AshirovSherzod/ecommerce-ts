import { z } from "zod";

/**
 * Formalar bo'ylab takrorlanadigan qoidalar.
 *
 * Xabar o'rniga tarjima kaliti saqlanadi ("validation:emailRequired").
 * Sxemalar modul darajasida bir marta yaratiladi, ya'ni til almashganda
 * qayta hisoblanmaydi — matnni komponent chizilayotganda `t()` beradi. `.trim()` faqat tekshirmaydi,
 * qiymatni ham tozalaydi — shuning uchun forma natijasi to'g'ridan-to'g'ri
 * yuborilishi mumkin, qo'lda `trim()` chaqirish shart emas.
 */
export const requiredText = (message: string) =>
  z.string().trim().min(1, message);

export const emailField = (
  requiredMessage = "validation:emailRequired",
  invalidMessage = "validation:emailInvalid",
) => requiredText(requiredMessage).pipe(z.email(invalidMessage));
