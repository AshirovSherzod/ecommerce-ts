import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_NAMESPACE,
  isLanguageCode,
  LANGUAGE_STORAGE_KEY,
  NAMESPACES,
  type LanguageCode,
} from "@/i18n/config";
import { resources } from "@/i18n/resources";
import { setMonitoringLanguage } from "@/monitoring";

/**
 * Saqlangan tilni o'qiydi. Brauzer tilini avtomatik aniqlamaymiz:
 * do'kon O'zbekistonda va mijozlarning brauzeri ko'pincha ru yoki en
 * da sozlangan bo'ladi — bu noto'g'ri taassurot berardi.
 */
const readStoredLanguage = (): LanguageCode => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguageCode(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    // Maxfiylik rejimida storage bloklangan bo'lishi mumkin
    return DEFAULT_LANGUAGE;
  }
};

void i18n.use(initReactI18next).init({
  resources,
  lng: readStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  ns: [...NAMESPACES],
  defaultNS: DEFAULT_NAMESPACE,
  interpolation: {
    // React allaqachon qochiradi — ikki marta qochirish `&#39;` kabi
    // belgilarni ekranda ko'rsatib qo'yardi
    escapeValue: false,
  },
  returnNull: false,
});

/** Tilni almashtiradi va tanlovni saqlaydi */
export const changeLanguage = async (language: LanguageCode) => {
  await i18n.changeLanguage(language);

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Saqlanmasa ham joriy sessiyada til o'zgaradi
  }

  document.documentElement.lang = language;
  setMonitoringLanguage(language);
};

// Sahifa ochilganda ham `<html lang>` to'g'ri bo'lsin — ekran o'quvchi
// va qidiruv tizimlari shunga qaraydi
document.documentElement.lang = i18n.language;
setMonitoringLanguage(i18n.language);

export default i18n;
