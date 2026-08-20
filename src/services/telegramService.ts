import axios, { AxiosError } from "axios";

/**
 * Telegram bitta xabarda 4096 belgidan ko'pini qabul qilmaydi. Chegaraga
 * yaqin turmaslik uchun biroz pastroq olamiz — emoji va kirill harflari
 * bir necha bayt egallaydi va hisob-kitobda chetga chiqib ketish oson.
 */
export const TELEGRAM_MESSAGE_LIMIT = 3800;

const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;

export const isTelegramConfigured = () => Boolean(BOT_TOKEN && CHAT_ID);

/**
 * Matnni Telegram'ga yuboradi. Muvaffaqiyatsiz bo'lsa xato tashlaydi —
 * chaqiruvchi joy buni ko'rmasdan o'tib keta olmasin.
 *
 * `parse_mode` ataylab berilmagan: Markdown yoqilsa mijoz kiritgan
 * matndagi `_` yoki `*` belgilari xabarni buzadi yoki Telegram uni
 * umuman rad etadi.
 */
export const sendTelegramMessage = async (text: string): Promise<void> => {
  if (!isTelegramConfigured()) {
    throw new Error("Telegram sozlamalari topilmadi");
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      { chat_id: CHAT_ID, text },
      { timeout: 15_000 },
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      const description = error.response?.data?.description;
      throw new Error(description ?? error.message);
    }

    throw error;
  }
};

/**
 * Bir nechta qismni ketma-ket yuboradi.
 *
 * Ataylab ketma-ket (parallel emas): Telegram tartibni kafolatlamaydi va
 * buyurtma bo'laklari aralashib ketsa o'qib bo'lmaydi. Biror qism
 * yuborilmasa xato tashlanadi — chaqiruvchi joy savatni tozalamaydi.
 */
export const sendTelegramMessages = async (parts: string[]): Promise<void> => {
  for (const part of parts) {
    await sendTelegramMessage(part);
  }
};
