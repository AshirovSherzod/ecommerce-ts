import { clearState, expect, expectNoCrash, test } from "./fixtures";

// 8 rasmli mahsulot — galereya testlari uchun
const MULTI_IMAGE_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";

test.describe("Mahsulot sahifasi", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("kartani bosganda mahsulot sahifasi ochiladi", async ({ page, goto }) => {
    await goto("/shop");
    const title = await page.locator("main h3 a").first().innerText();

    await page.locator("main h3 a").first().click();
    await page.waitForURL(/\/shop\/[0-9a-f-]+/);

    await expect(page.locator("main h1")).toHaveText(title);
  });

  test("breadcrumb va sarlavha ko'rinadi", async ({ page, goto }) => {
    await goto(`/shop/${MULTI_IMAGE_ID}`);

    await expect(page.locator("main p").first()).toContainText("Bosh sahifa");
    await expect(page.locator("main h1")).not.toBeEmpty();
  });

  test("thumbnail bosilganda asosiy rasm almashadi", async ({ page, goto }) => {
    await goto(`/shop/${MULTI_IMAGE_ID}`);

    const mainImage = page.locator('main img:not([alt=""])').first();
    const before = await mainImage.getAttribute("src");

    await page.locator("main [aria-current]").nth(1).click();

    await expect.poll(() => mainImage.getAttribute("src")).not.toBe(before);
  });

  test("thumbnail'lar bitta vertikal ustunda turadi", async ({ page, goto }) => {
    await goto(`/shop/${MULTI_IMAGE_ID}`);

    const lefts = await page
      .locator("main [aria-current]")
      .evaluateAll((els) =>
        els.map((el) => Math.round(el.getBoundingClientRect().left)),
      );

    expect(new Set(lefts).size).toBe(1);
  });

  test("noma'lum mahsulotda server xabari ko'rsatiladi", async ({ page, goto }) => {
    // Haqiqiy xato: foydalanuvchi "Request failed with status code 404" ko'rardi
    await goto("/shop/00000000-0000-0000-0000-000000000000");

    await expectNoCrash(page);
    await expect(page.locator("main")).toContainText("Mahsulot topilmadi");
  });
});

test.describe("Savat va wishlist", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("tanlangan miqdor bilan savatga qo'shiladi", async ({ page, goto }) => {
    await goto(`/shop/${MULTI_IMAGE_ID}`);
    const title = await page.locator("main h1").innerText();

    await page.getByLabel("Ko'paytirish").click();
    await page.getByRole("button", { name: "Savatga qo'shish" }).click();

    await expect(page.locator("header")).toContainText("2");

    await goto("/cart");
    await expect(page.locator("main")).toContainText(title);
    await expect(page.locator("main")).toContainText("Mahsulotlar");
  });

  test("yetkazib berish narxi o'z valyutasida ko'rsatiladi", async ({ page, goto }) => {
    // Haqiqiy xato: 15 dollarlik yetkazish savat valyutasida formatlanardi
    await goto(`/shop/${MULTI_IMAGE_ID}`);
    await page.getByRole("button", { name: "Savatga qo'shish" }).click();

    await goto("/cart");

    await expect(page.locator("main")).toContainText("$15.00");
  });

  test("wishlist'ga qo'shiladi", async ({ page, goto }) => {
    await goto(`/shop/${MULTI_IMAGE_ID}`);
    const title = await page.locator("main h1").innerText();

    await page.getByRole("button", { name: "Sevimlilar" }).click();
    await goto("/wishlist");

    await expect(page.locator("main")).toContainText(title);
  });
});
