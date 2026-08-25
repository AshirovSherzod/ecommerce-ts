import type { ErrorEvent } from "@sentry/browser";

/**
 * Telegram bot tokeni manzilning bir qismi bo'lib keladi:
 *
 *   https://api.telegram.org/bot123456:AAF.../sendMessage
 *
 * Sentry XHR so'rovlarini avtomatik "breadcrumb" sifatida yozadi, ya'ni
 * buyurtma yuborilgan har bir sessiyada token xato hisobotiga tushib
 * ketardi. Token bundle ichida turgani sir emas, lekin uni uchinchi
 * tomon xizmatiga ham uzatish — allaqachon yomon holatni yomonlashtirish.
 */
const TELEGRAM_TOKEN = /bot\d+:[A-Za-z0-9_-]+/g;

const REDACTED = "bot[redacted]";

/** Matndagi maxfiy qismlarni almashtiradi */
export const scrubText = <T>(value: T): T =>
  typeof value === "string"
    ? (value.replace(TELEGRAM_TOKEN, REDACTED) as T)
    : value;

/**
 * Hodisadagi matnli maydonlarni tozalaydi.
 *
 * Butun hodisani JSON qilib almashtirish ham mumkin edi, lekin u aylanma
 * havolada uziladi va uzilganda nima qilish kerakligi noaniq: asl
 * hodisani yuborsak sir ketadi, tashlab yuborsak xato yo'qoladi. Shuning
 * uchun manzil saqlanadigan aniq maydonlar sanab o'tilgan.
 */
export const scrubEvent = (event: ErrorEvent): ErrorEvent => {
  if (event.message) event.message = scrubText(event.message);

  if (event.request?.url) event.request.url = scrubText(event.request.url);

  for (const value of event.exception?.values ?? []) {
    if (value.value) value.value = scrubText(value.value);
  }

  for (const crumb of event.breadcrumbs ?? []) {
    if (crumb.message) crumb.message = scrubText(crumb.message);

    const url = crumb.data?.url;
    if (typeof url === "string") crumb.data!.url = scrubText(url);
  }

  return event;
};
