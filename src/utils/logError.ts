import { captureError } from "@/monitoring";

// Xatolarni bir joydan o'tkazamiz — monitoring xizmati ulanganda
// faqat shu funksiyani o'zgartirish kifoya qiladi.
export const logError = (error: Error, componentStack?: string | null) => {
  // Konsolga production'da ham yozamiz: jimgina yutib yuborilgan xato —
  // umuman ko'rinmaydigan xato. Sentry ham konsol yozuvlarini "breadcrumb"
  // sifatida yig'adi, ya'ni bu qator hisobotni boyitadi.
  console.error("[ErrorBoundary]", error, componentStack);

  // DSN sozlanmagan bo'lsa hech narsa qilmaydi
  captureError(error, componentStack);
};
