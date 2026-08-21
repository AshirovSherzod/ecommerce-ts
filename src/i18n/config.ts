/**
 * Qo'llab-quvvatlanadigan tillar.
 *
 * `uz` birinchi va standart: do'kon O'zbekistonda. Brauzer tilini
 * avtomatik aniqlamaymiz — mijozning ko'pchiligi o'zbek tilini kutadi,
 * brauzer esa ko'pincha ru yoki en da sozlangan bo'ladi.
 */
export const LANGUAGES = [
  { code: "uz", label: "O'zbekcha", short: "UZ" },
  { code: "ru", label: "Русский", short: "RU" },
  { code: "en", label: "English", short: "EN" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "uz";

export const LANGUAGE_STORAGE_KEY = "language";

/**
 * Bo'shliqlar (namespace) — barcha matn bitta faylga to'planib ketmasin.
 * Yangi bo'lim qo'shilganda shu ro'yxatga ham qo'shiladi.
 */
export const NAMESPACES = [
  "common",
  "layout",
  "shop",
  "cart",
  "auth",
  "pages",
  "validation",
] as const;

export const DEFAULT_NAMESPACE = "common";

export const isLanguageCode = (value: unknown): value is LanguageCode =>
  typeof value === "string" &&
  LANGUAGES.some((language) => language.code === value);
