// Rasmi yo'q mahsulotlar uchun zaxira rasm (public/ ichida turadi)
export const PRODUCT_PLACEHOLDER = "/placeholder-product.svg";

// ⚠️ DEMO MA'LUMOT. API'da sharhlar (reviews) uchun endpoint yo'q, shuning
// uchun sahifa bo'sh ko'rinmasligi uchun namunaviy sharhlar ko'rsatiladi.
// Bular haqiqiy mijozlar yozgan emas — saytni ishga tushirishdan oldin
// `false` qiling yoki backend tayyor bo'lgach butunlay olib tashlang.
export const USE_DEMO_REVIEWS = true;

// Sayt bo'ylab amal qiladigan chegirma kampaniyasining tugash sanasi.
// Mahsulot sahifasidagi taymer shundan hisoblanadi va faqat chegirmali
// mahsulotlarda ko'rinadi. API mahsulot bo'yicha `saleEndsAt` yubora
// boshlasa, o'sha ustun turadi. Taymerni butunlay yashirish uchun `null`.
export const SALE_ENDS_AT: string | null = "2026-09-30T23:59:59+05:00";
