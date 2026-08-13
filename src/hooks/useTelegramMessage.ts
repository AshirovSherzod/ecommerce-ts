import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useTelegramMessage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_CHAT_ID;

  // Yuborish natijasini qaytaramiz, chunki `success` state'i
  // chaqirilgan joyda darhol yangilanmaydi
  const sendMessage = async (text: string): Promise<boolean> => {
    if (!BOT_TOKEN || !CHAT_ID) {
      const message = "Telegram sozlamalari topilmadi";
      setSuccess(false);
      setError(message);
      toast.error(`Xato: ${message}`);
      return false;
    }

    try {
      setIsLoading(true);
      setSuccess(false);
      setError(null);

      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        { chat_id: CHAT_ID, text },
        // Timeout'siz so'rov osilib qolsa tugma abadiy "loading"da turadi
        { timeout: 10_000 },
      );

      setSuccess(true);

      toast.success("Xabar muvaffaqiyatli yuborildi!");

      return true;
    } catch (err) {
      setSuccess(false);

      let errorMessage = "Xato yuz berdi";
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.description ?? err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      toast.error(`Xato: ${errorMessage}`);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    success,
    error,
  };
};
