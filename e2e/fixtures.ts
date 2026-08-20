import { test as base, expect, type Page } from "@playwright/test";
import { API_URL } from "./env";

/**
 * Testlar tashqi dunyoga haqiqiy ta'sir qilmasligi kerak. Ikkita yo'l
 * ataylab yopilgan:
 *
 *   Telegram   — contact formasi haqiqiy bot orqali xabar yuboradi
 *   /auth/register — to'liq to'g'ri ma'lumot yuborilsa backendda haqiqiy
 *                    akkaunt yaratiladi va uni o'chirib bo'lmaydi
 *
 * Ular fixture darajasida to'silgan, ya'ni yangi test yozgan odam buni
 * yodda tutishi shart emas — himoya o'zi ishlaydi.
 */
interface Fixtures {
  page: Page;
  /** Sahifaga o'tib, yuklanish tugashini kutadi */
  goto: (path: string) => Promise<void>;
  /** Ushlab qolingan tashqi so'rovlar soni — testda tasdiqlash uchun */
  blocked: { telegram: number; register: number };
}

export const test = base.extend<Fixtures>({
  blocked: async ({}, use) => {
    await use({ telegram: 0, register: 0 });
  },

  page: async ({ page, blocked }, use) => {
    await page.route("**/api.telegram.org/**", (route) => {
      blocked.telegram++;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    if (API_URL) {
      await page.route(`${API_URL}/auth/register`, (route) => {
        blocked.register++;
        return route.fulfill({
          status: 409,
          contentType: "application/json",
          body: JSON.stringify({
            error: { code: "CONFLICT", message: "Email already exists" },
            success: false,
          }),
        });
      });
    }

    await use(page);
  },

  goto: async ({ page }, use) => {
    await use(async (path: string) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // Marshrutlar lazy: chunk yuklanishi + API javobi vaqti o'zgaruvchan,
      // shuning uchun qat'iy kutish emas, spinner yo'qolishini kutamiz
      await page.waitForTimeout(400);
      await page
        .locator('[role="status"]')
        .first()
        .waitFor({ state: "detached", timeout: 25_000 })
        .catch(() => {});
    });
  },
});

export { expect };

/** Error boundary zaxira ekrani chiqmaganini tasdiqlaydi */
export const expectNoCrash = async (page: Page) => {
  await expect(
    page.getByRole("heading", { name: "Nimadir noto'g'ri ketdi" }),
  ).toHaveCount(0);
};

/** Brauzerdagi saqlangan holatni tozalaydi (savat, wishlist, sessiya) */
export const clearState = async (page: Page) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
};
