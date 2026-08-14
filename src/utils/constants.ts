// Rasmi yo'q mahsulotlar uchun zaxira rasm (public/ ichida turadi)
export const PRODUCT_PLACEHOLDER = "/placeholder-product.svg";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEV_SALE_WINDOW_DAYS = 30;

/**
 * Namunaviy sharhlar. API'da reviews endpoint yo'q, shuning uchun ishlab
 * chiqish paytida bo'lim bo'sh ko'rinmasligi uchun yoqiladi.
 *
 * Bu sharhlarni haqiqiy mijozlar yozmagan, shuning uchun production
 * build'da avtomatik o'chadi — jonli do'konda soxta sharh ko'rsatish
 * mijozni chalg'itadi.
 *
 * Staging'da ko'rsatish kerak bo'lsa: VITE_DEMO_REVIEWS=true
 * Dev'da ham o'chirish uchun:        VITE_DEMO_REVIEWS=false
 *
 * Ataylab yordamchi funksiyasiz, to'g'ridan-to'g'ri ternary yozilgan:
 * Vite `import.meta.env` ni build paytida qiymatga almashtiradi, shunda
 * bundler butun ifodani `false` ga yig'ib, demo matnlarni production
 * bundle'idan umuman olib tashlaydi. Funksiya chaqiruvi buni to'sardi.
 */
export const USE_DEMO_REVIEWS =
  import.meta.env.VITE_DEMO_REVIEWS === "true"
    ? true
    : import.meta.env.VITE_DEMO_REVIEWS === "false"
      ? false
      : import.meta.env.DEV;

/**
 * Chegirma kampaniyasining tugash sanasi — mahsulot sahifasidagi taymer
 * shundan hisoblanadi va faqat chegirmali mahsulotlarda ko'rinadi.
 *
 * Ustuvorlik tartibi:
 *   1. Mahsulotning o'z `saleEndsAt` maydoni (API yubora boshlaganda)
 *   2. VITE_SALE_ENDS_AT — butun sayt uchun bitta sana
 *   3. Dev rejimida — bugundan 30 kun keyin, shunchaki taymer ko'rinib tursin
 *
 * Production'da o'zgaruvchi berilmasa taymer umuman ko'rsatilmaydi:
 * o'ylab topilgan muddat bilan shoshiltirish mijozni aldash bo'lardi.
 */
const resolveSaleEndsAt = (): string | null => {
  const configured = import.meta.env.VITE_SALE_ENDS_AT?.trim();

  if (configured) return configured;

  if (!import.meta.env.DEV) return null;

  // Qat'iy sana yozib qo'yilsa vaqti kelib eskiradi va taymer dev'da ham
  // jimgina yo'qoladi — shuning uchun har safar joriy vaqtdan hisoblanadi
  return new Date(Date.now() + DEV_SALE_WINDOW_DAYS * DAY_MS).toISOString();
};

export const SALE_ENDS_AT: string | null = resolveSaleEndsAt();
