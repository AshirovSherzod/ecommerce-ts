import uzCommon from "@/locales/uz/common.json";
import uzLayout from "@/locales/uz/layout.json";
import uzShop from "@/locales/uz/shop.json";
import uzCart from "@/locales/uz/cart.json";
import uzAuth from "@/locales/uz/auth.json";
import uzPages from "@/locales/uz/pages.json";
import uzValidation from "@/locales/uz/validation.json";

import ruCommon from "@/locales/ru/common.json";
import ruLayout from "@/locales/ru/layout.json";
import ruShop from "@/locales/ru/shop.json";
import ruCart from "@/locales/ru/cart.json";
import ruAuth from "@/locales/ru/auth.json";
import ruPages from "@/locales/ru/pages.json";
import ruValidation from "@/locales/ru/validation.json";

import enCommon from "@/locales/en/common.json";
import enLayout from "@/locales/en/layout.json";
import enShop from "@/locales/en/shop.json";
import enCart from "@/locales/en/cart.json";
import enAuth from "@/locales/en/auth.json";
import enPages from "@/locales/en/pages.json";
import enValidation from "@/locales/en/validation.json";

/**
 * Tarjimalar bundle ichiga kiradi (lazy yuklanmaydi): uchala til birga
 * ~30KB, alohida so'rov qilish til almashganda ko'zga tashlanadigan
 * kechikish beradi va oflayn rejimda ishlamaydi.
 */
export const resources = {
  uz: {
    common: uzCommon,
    layout: uzLayout,
    shop: uzShop,
    cart: uzCart,
    auth: uzAuth,
    pages: uzPages,
    validation: uzValidation,
  },
  ru: {
    common: ruCommon,
    layout: ruLayout,
    shop: ruShop,
    cart: ruCart,
    auth: ruAuth,
    pages: ruPages,
    validation: ruValidation,
  },
  en: {
    common: enCommon,
    layout: enLayout,
    shop: enShop,
    cart: enCart,
    auth: enAuth,
    pages: enPages,
    validation: enValidation,
  },
} as const;
