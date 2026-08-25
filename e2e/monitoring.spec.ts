import type { Page } from "@playwright/test";
import { clearState, expect, test } from "./fixtures";

const PRODUCT_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";
const TOKEN_TAIL = "AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw";

/**
 * Monitoring build paytidagi `VITE_SENTRY_DSN` ga bog'liq, shuning uchun bu
 * bo'lim odatdagi yugurishda o'tkazib yuboriladi. Qo'lda ishga tushirish:
 *
 *   VITE_SENTRY_DSN="https://k@o4507.ingest.sentry.io/4507" \
 *   VITE_BOT_TOKEN="7123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw" \
 *   VITE_CHAT_ID=1 npx playwright test e2e/monitoring.spec.ts
 *
 * `e2e/fixtures.ts` Sentry'ga chiqishni to'sadi — hech narsa haqiqiy
 * loyihaga yuborilmaydi, biz faqat yuborilayotgan yukni o'qiymiz.
 */
test.describe("Monitoring", () => {
  test.skip(
    !process.env.VITE_SENTRY_DSN,
    "VITE_SENTRY_DSN berilmagan — monitoring o'chiq",
  );

  const placeOrder = async (page: Page) => {
    await page.goto(`/shop/${PRODUCT_ID}`);
    await page.getByRole("button", { name: "Savatga qo'shish" }).click();
    await page.goto("/checkout");
    await page.locator("#co-name").fill("Sinov Foydalanuvchi");
    await page.locator("#co-phone").fill("+998901234567");
    await page
      .locator("#co-address")
      .fill("Toshkent, Chilonzor, 12-uy, 45-xonadon");
    await page.getByRole("button", { name: "Buyurtma berish" }).click();
    await expect(page.getByRole("heading", { name: "Tayyor!" })).toBeVisible();
  };

  const throwInPage = (page: Page) =>
    page.evaluate(() => {
      setTimeout(() => {
        throw new Error("monitoring probe");
      }, 0);
    });

  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("ushlanmagan xato hisobot sifatida yuboriladi", async ({
    page,
    blocked,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await throwInPage(page);

    await expect
      .poll(() => blocked.sentry, { timeout: 10_000 })
      .toBeGreaterThan(0);
  });

  test("Telegram bot tokeni hisobotga tushmaydi", async ({ page }) => {
    const payloads: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("ingest.sentry.io")) {
        payloads.push(request.postData() ?? "");
      }
    });

    // Buyurtma yuborilganda Telegram so'rovi breadcrumb sifatida yoziladi —
    // tokenning hisobotga tushish yo'li aynan shu
    await placeOrder(page);
    await throwInPage(page);

    await expect
      .poll(() => payloads.length, { timeout: 10_000 })
      .toBeGreaterThan(0);

    const sent = payloads.join("\n");

    // Breadcrumb haqiqatan yozilganini tasdiqlaymiz: aks holda quyidagi
    // tekshiruv "token yo'q" deb o'tib ketardi — sinamagani uchun
    expect(sent, "Telegram breadcrumb'i yozilmagan").toContain(
      "api.telegram.org",
    );
    expect(sent, "token hisobotga tushib ketdi").not.toContain(TOKEN_TAIL);
    expect(sent).toContain("bot[redacted]");
  });
});
