import { defineConfig, devices } from "@playwright/test";

const PORT = 5199;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Brauzer tanlash.
 *
 * Sukut bo'yicha tizimdagi Edge ishlatiladi — Windows va macOS'da u
 * o'rnatilgan bo'ladi, ya'ni 150MB brauzer yuklab olish shart emas.
 * CI'da yoki Edge yo'q muhitda: `PW_CHANNEL=bundled` qo'ying va
 * `npx playwright install chromium` bajaring.
 */
const channel =
  process.env.PW_CHANNEL === "bundled"
    ? undefined
    : (process.env.PW_CHANNEL ?? "msedge");

export default defineConfig({
  testDir: "./e2e",
  // Testlar haqiqiy API'ga boradi — javob vaqti o'zgaruvchan
  timeout: 60_000,
  expect: { timeout: 15_000 },

  // Xatoni tasodifiy "yashirib" yubormaslik uchun lokalda qayta urinish yo'q
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: !!process.env.CI,

  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel },
      // Mobil testlar faqat "mobile" loyihasida ishlashi kerak
      testIgnore: /.*\.mobile\.spec\.ts/,
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel },
      testMatch: /.*\.mobile\.spec\.ts/,
    },
  ],

  // Dev serverni Playwright o'zi ko'taradi — qo'lda ishga tushirish shart emas
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
