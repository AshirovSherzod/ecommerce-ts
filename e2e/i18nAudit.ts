import { expect, type Page } from "@playwright/test";

export const LANGS = ["uz", "ru", "en"] as const;

export const PATHS = [
  ["/", "bosh sahifa"],
  ["/shop", "do'kon"],
  ["/cart", "savat"],
  ["/blog", "blog"],
  ["/wishlist", "sevimlilar"],
  ["/contact", "bog'lanish"],
  ["/signin", "kirish"],
  ["/signup", "ro'yxatdan o'tish"],
  ["/yoq-bunday-sahifa", "404"],
] as const;

export const SAMPLE_PRODUCT_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";

/** Savat va checkout sahifalari uchun namunaviy mahsulot */
const SAMPLE_ITEM = {
  id: SAMPLE_PRODUCT_ID,
  title: "Sample product with a fairly long title",
  brand: "3legant",
  price: 199,
  currency: "USD",
  quantity: 2,
  images: [] as string[],
};

/** Interfeys tilini localStorage orqali o'rnatib, sahifani ochadi */
export const openWith = async (page: Page, lang: string, path: string) => {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    ["language", lang],
  );
  await page.goto(path);
};

/** Til bilan birga savatni ham to'ldiradi — bo'sh savatda checkout ochilmaydi */
export const openWithCart = async (page: Page, lang: string, path: string) => {
  await page.addInitScript(
    ([lng, item]) => {
      window.localStorage.setItem("language", lng as string);
      window.localStorage.setItem(
        "cart-storage",
        JSON.stringify({ state: { items: [item] }, version: 0 }),
      );
    },
    [lang, SAMPLE_ITEM] as const,
  );
  await page.goto(path);
};

/**
 * Gorizontal toshib ketishni topadi. Uzunroq ruscha/o'zbekcha matnlar
 * qattiq `w-*` qiymatlarga sig'masa sahifa yon tomonga siljiydi — bu
 * mobilda ayniqsa yomon ko'rinadi.
 */
export const overflowingElements = (page: Page) =>
  page.evaluate(() => {
    const limit = document.documentElement.clientWidth;
    const found: string[] = [];

    for (const el of Array.from(
      document.querySelectorAll<HTMLElement>("body *"),
    )) {
      // SVG ichki elementlari (path, ellipse) o'z viewBox'i bo'yicha
      // o'lchanadi va tashqariga chiqib turishi mumkin — layout muammosi emas
      if (el.closest("svg")) continue;

      const box = el.getBoundingClientRect();

      if (box.width === 0 || box.height === 0) continue;
      // Faqat o'ng tomon: yopiq mobil menyu ataylab ekrandan chapda turadi
      // va LTR'da chapdagi element gorizontal scroll bermaydi
      if (box.right <= limit + 1) continue;
      // O'z ichida scroll qiladigan bloklar (galereya, jadval) muammo emas
      if (getComputedStyle(el).overflowX !== "visible") continue;

      // Biror ota-element uni kesib turgan bo'lsa ko'rinishga ta'sir qilmaydi
      let clipped = false;
      for (
        let parent = el.parentElement;
        parent && parent !== document.body;
        parent = parent.parentElement
      ) {
        if (getComputedStyle(parent).overflowX !== "visible") {
          clipped = true;
          break;
        }
      }
      if (clipped) continue;

      found.push(
        `${el.tagName.toLowerCase()}.${el.className
          .toString()
          .slice(
            0,
            60,
          )} → ${Math.round(box.left)}..${Math.round(box.right)} (limit ${limit})`,
      );
    }

    return found.slice(0, 10);
  });

/**
 * Bitta sahifani bitta tilda tekshiradi: tarjimasiz kalit qolmaganini va
 * hech narsa ekrandan chiqib ketmaganini.
 */
export const auditPage = async (
  page: Page,
  lang: string,
  path: string,
  { withCart = false } = {},
) => {
  await (withCart ? openWithCart : openWith)(page, lang, path);
  await page.waitForLoadState("networkidle");

  // Tarjima topilmasa i18next kalitning o'zini chiqaradi
  const body = (await page.locator("body").innerText()).replace(/\s+/g, " ");

  expect(body, "tarjima qilinmagan kalit").not.toMatch(
    /\b(validation|common|layout|shop|cart|auth|pages):\w+/,
  );
  expect(body, "nuqtali kalit ko'rinib qolgan").not.toMatch(
    /\b(steps|summary|reviews|filters|checkout)\.[a-z]\w+/i,
  );

  expect(await overflowingElements(page)).toEqual([]);

  // Sahifaning o'zi ham yon tomonga siljimasligi kerak
  const scroll = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    c: document.documentElement.clientWidth,
  }));

  expect(scroll.w, "sahifa gorizontal scroll bo'lgan").toBeLessThanOrEqual(
    scroll.c + 1,
  );
};
