import { expect } from "@playwright/test";
import { test } from "./fixtures";
import {
  auditPage,
  LANGS,
  openWith,
  PATHS,
  SAMPLE_PRODUCT_ID,
} from "./i18nAudit";

test.describe("i18n", () => {
  test("standart til — o'zbekcha", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "uz");
    await expect(
      page.getByRole("link", { name: "Do'kon", exact: true }).first(),
    ).toBeVisible();
  });

  test("til almashtirish matnni va <html lang> ni yangilaydi", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("button", { name: /til|язык|language/i })
      .first()
      .click();
    await page.getByRole("menuitemradio", { name: "Русский" }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(
      page.getByRole("link", { name: "Магазин", exact: true }).first(),
    ).toBeVisible();

    // Tanlov saqlanadi — qayta yuklanganda ham ruscha qoladi
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  });

  test("saqlangan noto'g'ri til standartga tushadi", async ({ page }) => {
    await openWith(page, "de", "/");

    await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  });

  for (const lang of LANGS) {
    for (const [path, label] of PATHS) {
      test(`${lang} — ${label}: tarjimasiz kalit va toshib ketish yo'q`, async ({
        page,
      }) => {
        await auditPage(page, lang, path);
      });
    }
  }
  for (const lang of LANGS) {
    test(`${lang} — to'la savat va checkout`, async ({ page }) => {
      await auditPage(page, lang, "/cart", { withCart: true });
      await auditPage(page, lang, "/checkout", { withCart: true });
    });

    test(`${lang} — mahsulot sahifasi`, async ({ page }) => {
      await auditPage(page, lang, `/shop/${SAMPLE_PRODUCT_ID}`);
    });
  }
});
