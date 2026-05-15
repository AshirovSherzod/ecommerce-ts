import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useTelegramMessage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_CHAT_ID;

  const sendMessage = async (text: string) => {
    try {
      setIsLoading(true);
      setSuccess(false);
      setError(null);

      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text,
      });

      setSuccess(true);

      toast.success("🦄 Xabar muvaffaqiyatli yuborildi!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } catch (err) {
      setSuccess(false);
      const errorMessage =
        err instanceof Error ? err.message : "Xato yuz berdi";
      setError(errorMessage);

      toast.error(`❌ Xato: ${errorMessage}`, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
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
