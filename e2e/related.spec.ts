import { expect, test } from "./fixtures";

const PRODUCT_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";

test.describe("O'xshash mahsulotlar", () => {
  test("mahsulot sahifasida bo'lim chiqadi va o'zini takrorlamaydi", async ({
    page,
    goto,
  }) => {
    await goto(`/shop/${PRODUCT_ID}`);

    const heading = page.getByRole("heading", { name: "O'xshash mahsulotlar" });
    await expect(heading).toBeVisible();

    const section = page.locator("section").filter({ has: heading });
    const links = section.getByRole("link");

    expect(await links.count()).toBeGreaterThan(0);

    // Ochiq turgan mahsulot tavsiyalar orasida bo'lmasligi kerak
    await expect(section.locator(`a[href="/shop/${PRODUCT_ID}"]`)).toHaveCount(
      0,
    );
  });

  test("tavsiyadan boshqa mahsulotga o'tish mumkin", async ({ page, goto }) => {
    await goto(`/shop/${PRODUCT_ID}`);

    const heading = page.getByRole("heading", { name: "O'xshash mahsulotlar" });
    const section = page.locator("section").filter({ has: heading });

    await section.getByRole("link").first().click();

    await page.waitForURL(/\/shop\/[0-9a-f-]{36}$/);
    expect(page.url()).not.toContain(PRODUCT_ID);
  });
});
