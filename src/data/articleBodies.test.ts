import { describe, expect, it } from "vitest";
import { ARTICLE_BODIES } from "@/data/articleBodies";
import { ARTICLES } from "@/data/articles";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/i18n/config";

/**
 * Matnlar tarjima fayllarida emas, shuning uchun `resources.test.ts` dagi
 * kalit tekshiruvi ularni qamramaydi. Til qo'shilganda yoki maqola
 * yozilganda yetishmagan matn shu yerda ushlanadi — aks holda o'quvchi
 * bo'sh sahifa ko'rardi.
 */
describe("maqola matnlari", () => {
  const base = ARTICLE_BODIES[DEFAULT_LANGUAGE];

  it("har bir maqola uchun matn bor", () => {
    for (const { code } of LANGUAGES) {
      for (const article of ARTICLES) {
        expect(
          ARTICLE_BODIES[code][article.id],
          `${code}: ${article.id}-maqola matni yo'q`,
        ).toBeTruthy();
      }
    }
  });

  it("barcha tillarda bir xil maqolalar bor", () => {
    for (const { code } of LANGUAGES) {
      expect(Object.keys(ARTICLE_BODIES[code]).sort()).toEqual(
        Object.keys(base).sort(),
      );
    }
  });

  it("paragraflar soni tillar bo'ylab bir xil", () => {
    for (const { code } of LANGUAGES) {
      for (const [id, paragraphs] of Object.entries(ARTICLE_BODIES[code])) {
        expect(paragraphs.length, `${code}: ${id}`).toBe(base[id].length);
      }
    }
  });

  it("bo'sh paragraf yo'q", () => {
    for (const { code } of LANGUAGES) {
      for (const [id, paragraphs] of Object.entries(ARTICLE_BODIES[code])) {
        paragraphs.forEach((paragraph, index) => {
          expect(paragraph.trim(), `${code}: ${id}[${index}]`).not.toBe("");
        });
      }
    }
  });

  it("matn boshqa tildan nusxa ko'chirilmagan", () => {
    // Tarjima o'rniga asl matn qoldirilsa sezilmasdan qolib ketardi
    for (const { code } of LANGUAGES) {
      if (code === DEFAULT_LANGUAGE) continue;

      for (const [id, paragraphs] of Object.entries(ARTICLE_BODIES[code])) {
        expect(paragraphs, `${code}: ${id} tarjima qilinmagan`).not.toEqual(
          base[id],
        );
      }
    }
  });
});
