import { clearState, expect, expectNoCrash, test } from "./fixtures";

const productTitles = (page: import("@playwright/test").Page) =>
  page.locator("main h3 a").allInnerTexts();

test.describe("Qidiruv: Shop sahifasi", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("URL'dagi q bo'yicha natija filtrlaydi", async ({ page, goto }) => {
    await goto("/shop?q=xbox");

    const titles = await productTitles(page);
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.every((t) => t.toLowerCase().includes("xbox"))).toBe(true);
  });

  test("sarlavha izlanayotgan so'zni ko'rsatadi", async ({ page, goto }) => {
    await goto("/shop?q=xbox");

    await expect(page.locator("main h2").first()).toContainText("xbox");
  });

  test("filtr panelidan qidirish URL'ni yangilaydi", async ({ page, goto }) => {
    await goto("/shop");

    await page.getByLabel("Katalogdan qidirish", { exact: true }).fill("playstation");
    await page.getByLabel("Katalogdan qidirish: qidirish").click();

    await expect.poll(() => page.url()).toContain("q=playstation");
    await expect
      .poll(async () => (await productTitles(page)).length)
      .toBeGreaterThan(0);
  });

  test("brend bo'yicha ham topadi", async ({ page, goto }) => {
    // API sarlavha va brend bo'yicha qidiradi
    await goto("/shop?q=sony");

    const titles = await productTitles(page);
    expect(titles.length).toBeGreaterThan(0);
  });

  test("natija topilmasa tushunarli xabar chiqadi", async ({ page, goto }) => {
    await goto("/shop?q=zzzzqwertyyoq");

    await expect(page.locator("main")).toContainText("hech narsa topilmadi");
    await expect(page.locator("main")).toContainText("zzzzqwertyyoq");
    await expectNoCrash(page);
  });

  test("tozalash tugmasi qidiruvni bekor qiladi", async ({ page, goto }) => {
    await goto("/shop?q=xbox");
    const filtered = (await productTitles(page)).length;

    await page.getByLabel("Katalogdan qidirish: tozalash").click();

    await expect.poll(() => page.url()).not.toContain("q=");
    await expect
      .poll(async () => (await productTitles(page)).length)
      .toBeGreaterThan(filtered);
  });

  // Eng oson yo'qoladigan narsa: filtr o'zgarganda qidiruv so'zi tushib qolishi
  test("kategoriya tanlanganda qidiruv saqlanadi", async ({ page, goto }) => {
    await goto("/shop?q=watch");

    await page.locator("input[type=radio]").nth(1).click();

    await expect.poll(() => page.url()).toContain("q=watch");
    await expect.poll(() => page.url()).toContain("category=");
  });

  test("'Clear all filters' qidiruvni ham tozalaydi", async ({ page, goto }) => {
    await goto("/shop?q=zzzzqwertyyoq");

    await page.getByRole("button", { name: "Clear all filters" }).first().click();

    await expect.poll(() => page.url()).not.toContain("q=");
  });

  test("maxsus belgilar sahifani buzmaydi", async ({ page, goto }) => {
    const jsErrors: string[] = [];
    page.on("pageerror", (e) => jsErrors.push(e.message));

    await goto("/shop?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E");

    await expectNoCrash(page);
    expect(jsErrors).toHaveLength(0);
    // Matn sifatida ko'rsatiladi, kod sifatida bajarilmaydi
    await expect(page.locator("main")).toContainText("script");
  });

  test("bo'sh qidiruv barcha mahsulotlarni qaytaradi", async ({ page, goto }) => {
    await goto("/shop?q=");

    await expect
      .poll(async () => (await productTitles(page)).length)
      .toBeGreaterThan(1);
  });
});

test.describe("Qidiruv: header", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("lupa qidiruv maydonini ochadi va Escape yopadi", async ({
    page,
    goto,
  }) => {
    await goto("/");

    await page.getByRole("button", { name: "Qidiruv", exact: true }).click();
    await expect(
      page.getByLabel("Mahsulot qidirish", { exact: true }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(
      page.getByLabel("Mahsulot qidirish", { exact: true }),
    ).toHaveCount(0);
  });

  test("bosh sahifadan qidirish Shop'ga olib boradi", async ({ page, goto }) => {
    await goto("/");

    await page.getByRole("button", { name: "Qidiruv", exact: true }).click();
    await page.getByLabel("Mahsulot qidirish", { exact: true }).fill("xbox");
    await page.keyboard.press("Enter");

    await page.waitForURL("**/shop?q=xbox");
    await expect
      .poll(async () => (await productTitles(page)).length)
      .toBeGreaterThan(0);
  });

  test("bo'sh qidiruv shunchaki Shop'ni ochadi", async ({ page, goto }) => {
    await goto("/");

    await page.getByRole("button", { name: "Qidiruv", exact: true }).click();
    await page.getByLabel("Mahsulot qidirish", { exact: true }).fill("   ");
    await page.keyboard.press("Enter");

    await page.waitForURL("**/shop");
    expect(page.url()).not.toContain("q=");
  });
});
