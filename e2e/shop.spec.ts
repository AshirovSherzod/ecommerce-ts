import { clearState, expect, expectNoCrash, test } from "./fixtures";

test.describe("Katalog", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("mahsulotlar ro'yxati yuklanadi", async ({ page, goto }) => {
    await goto("/shop");

    await expect(page.locator("main h3 a").first()).toBeVisible();
  });

  test("narx bo'yicha o'sish tartibida saralaydi", async ({ page, goto }) => {
    await goto("/shop");

    await page.getByLabel("Saralash").click();
    await page.getByRole("option", { name: "Narx: arzondan qimmatga" }).click();

    await expect
      .poll(async () => {
        const texts = await page
          .locator("main h3 a")
          .locator("xpath=../following-sibling::p[1]/span[1]")
          .allInnerTexts();
        const prices = texts.map((t) => Number(t.replace(/[^0-9.]/g, "")));
        return prices.every((p, i) => i === 0 || prices[i - 1] <= p);
      })
      .toBe(true);
  });

  test("kategoriya filtri URL'ga yoziladi va sarlavhani o'zgartiradi", async ({
    page,
    goto,
  }) => {
    await goto("/shop");
    const headingBefore = await page.locator("main h2").first().innerText();

    // 0 — "All Rooms", 1 — birinchi kategoriya
    await page.locator("input[type=radio]").nth(1).click();

    await expect.poll(() => page.url()).toContain("category=");
    await expect
      .poll(() => page.locator("main h2").first().innerText())
      .not.toBe(headingBefore);
  });

  test("filtrlarni tozalash URL'ni ham tozalaydi", async ({ page, goto }) => {
    await goto("/shop");
    await page.locator("input[type=radio]").nth(1).click();
    await expect.poll(() => page.url()).toContain("category=");

    await page.getByRole("button", { name: "Filtrlarni tozalash" }).first().click();

    await expect.poll(() => page.url()).not.toContain("category=");
  });

  // Haqiqiy xato: `?minPrice=abc` so'rovga `minPrice=NaN` bo'lib ketardi
  test("URL'dagi noto'g'ri narx sahifani buzmaydi", async ({ page, goto }) => {
    const jsErrors: string[] = [];
    page.on("pageerror", (e) => jsErrors.push(e.message));

    await goto("/shop?minPrice=abc&maxPrice=xyz");

    await expectNoCrash(page);
    expect(jsErrors).toHaveLength(0);
  });
});
