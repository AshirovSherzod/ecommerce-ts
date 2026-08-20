import { clearState, expect, expectNoCrash, test } from "./fixtures";

const ROUTES = [
  "/",
  "/shop",
  "/blog",
  "/contact",
  "/cart",
  "/wishlist",
  "/signin",
  "/signup",
  "/bunday-sahifa-yoq",
];

test.describe("Smoke: barcha marshrutlar ochiladi", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  for (const path of ROUTES) {
    test(`${path} qulamaydi`, async ({ page, goto }) => {
      const jsErrors: string[] = [];
      page.on("pageerror", (e) => jsErrors.push(e.message));

      await goto(path);

      await expectNoCrash(page);
      expect(jsErrors, `JS xatolari: ${jsErrors.join("; ")}`).toHaveLength(0);
    });
  }

  test("404 sahifasi noto'g'ri manzilda chiqadi", async ({ page, goto }) => {
    await goto("/bunday-sahifa-yoq");

    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Go To Home" })).toBeVisible();
  });

  test("sahifa almashganda skroll tepaga qaytadi", async ({ page, goto }) => {
    await goto("/");
    await page.evaluate(() => window.scrollTo(0, 1500));

    await page.getByRole("link", { name: "Shop", exact: true }).first().click();
    await page.waitForURL("**/shop");

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });
});
