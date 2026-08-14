/// <reference types="vite/client" />

// Muhit o'zgaruvchilarini tiplaymiz — `vite/client` ning standart
// index signature'i hamma narsani `any` qilib qo'yadi, natijada nomdagi
// xato (masalan VITE_API_URI) kompilyatsiyada bilinmay qoladi.
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BOT_TOKEN?: string;
  readonly VITE_CHAT_ID?: string;

  // Ixtiyoriy: demo sharhlarni majburan yoqish/o'chirish ("true" | "false").
  // Berilmasa — dev'da yoqiq, production build'da o'chiq.
  readonly VITE_DEMO_REVIEWS?: string;

  // Ixtiyoriy: chegirma kampaniyasi tugash sanasi (ISO).
  // Berilmasa — production'da taymer ko'rsatilmaydi.
  readonly VITE_SALE_ENDS_AT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
