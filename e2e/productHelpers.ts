import type { Locator, Page } from "@playwright/test";

/**
 * Mahsulot sahifasidagi asosiy "Savatga qo'shish" tugmasi.
 *
 * Sahifa oxirida "O'xshash mahsulotlar" bo'limi bor va undagi har bir
 * kartochkada xuddi shu nomli tugma turadi — nomi bo'yicha qidirish bir
 * nechta elementga tushadi. Asosiy tugma `<h1>` bo'lgan bo'limda.
 */
export const mainAddToCart = (page: Page): Locator =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { level: 1 }) })
    .getByRole("button", { name: "Savatga qo'shish" });

/**
 * Mahsulot sahifasidagi asosiy "Sevimlilar" tugmasi — tavsiya
 * kartochkalaridagi yurakcha tugmalar bilan aralashmasligi uchun.
 */
export const mainWishlist = (page: Page): Locator =>
  page
    .locator("section")
    .filter({ has: page.getByRole("heading", { level: 1 }) })
    .getByRole("button", { name: "Sevimlilar" });
