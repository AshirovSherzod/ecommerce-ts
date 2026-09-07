import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { sendTelegramMessage } from "@/services/telegramService";

/**
 * Do'konga xabar yuboradigan formalar uchun: contact va newsletter obunasi.
 * Natijani foydalanuvchiga o'zi bildiradi.
 *
 * Buyurtma yuborish boshqacha: u yerda xato bo'lsa savat tozalanmasligi
 * kerak, shuning uchun Checkout `telegramService` ni to'g'ridan-to'g'ri
 * ishlatadi va xatoni o'zi boshqaradi.
 */
export const useTelegramMessage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Yuborish natijasini qaytaradi, chunki state chaqirilgan joyda darhol
   * yangilanmaydi. `successMessage` — formaga xos xabar kerak bo'lganda
   * (obuna uchun "rahmat" umumiy "yuborildi" dan aniqroq).
   */
  const sendMessage = async (
    text: string,
    successMessage?: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await sendTelegramMessage(text);

      toast.success(successMessage ?? t("toast.sent"));

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("errors.unexpected");

      setError(message);
      toast.error(t("toast.failed", { reason: message }));

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
};
