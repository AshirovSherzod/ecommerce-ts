import { clearState, expect, test } from "./fixtures";

// 8 rasmli mahsulot
const MULTI_IMAGE_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";

// Bu fayl playwright.config.ts dagi "mobile" loyihasida ishlaydi (Pixel 7)
test.describe("Mobil ko'rinish", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("mahsulot sahifasida thumbnail ustuni yashirin", async ({
    page,
    goto,
  }) => {
    await goto(`/shop/${MULTI_IMAGE_ID}`);

    // Tor ekranda asosiy rasm to'liq kenglikni oladi
    await expect(page.locator("main [aria-current]").first()).toBeHidden();
    await expect(page.getByLabel("Keyingi rasm")).toBeVisible();
  });

  test("strelka bilan rasm almashadi", async ({ page, goto }) => {
    await goto(`/shop/${MULTI_IMAGE_ID}`);

    const mainImage = page.locator('main img:not([alt=""])').first();
    const before = await mainImage.getAttribute("src");

    await page.getByLabel("Keyingi rasm").click();

    await expect.poll(() => mainImage.getAttribute("src")).not.toBe(before);
  });

  test("menyu ochilganda orqadagi sahifa qotadi va Escape yopadi", async ({
    page,
    goto,
  }) => {
    await goto("/");

    await page.getByLabel("Menyuni ochish").click();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden");

    await page.keyboard.press("Escape");

    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .not.toBe("hidden");
  });
});
