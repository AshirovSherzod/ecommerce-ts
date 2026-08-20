import { useState } from "react";
import { toast } from "react-toastify";
import { sendTelegramMessage } from "@/services/telegramService";

/**
 * Contact formasi uchun: xabar yuboradi va natijani o'zi bildiradi.
 *
 * Buyurtma yuborish boshqacha: u yerda xato bo'lsa savat tozalanmasligi
 * kerak, shuning uchun Checkout `telegramService` ni to'g'ridan-to'g'ri
 * ishlatadi va xatoni o'zi boshqaradi.
 */
export const useTelegramMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Yuborish natijasini qaytaramiz, chunki state chaqirilgan joyda
  // darhol yangilanmaydi
  const sendMessage = async (text: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await sendTelegramMessage(text);

      toast.success("Xabar muvaffaqiyatli yuborildi!");

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xato yuz berdi";

      setError(message);
      toast.error(`Xato: ${message}`);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
};
