import { expect } from "@playwright/test";
import { test } from "./fixtures";
import { auditPage, LANGS, PATHS, SAMPLE_PRODUCT_ID } from "./i18nAudit";

/**
 * Mobilda joy tor — ruscha va o'zbekcha matnlar inglizchadan uzunroq
 * bo'lgani uchun tugma va sarlavhalar aynan shu kenglikda buziladi.
 */
test.describe("i18n — mobil", () => {
  test("mobil menyuda til tanlash ishlaydi", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", { name: /menyu|меню|menu/i })
      .first()
      .click();

    const group = page.getByRole("group", { name: /til|язык|language/i });
    await expect(group).toBeVisible();

    await group.getByRole("button", { name: "RU" }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
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
