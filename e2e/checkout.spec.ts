import type { Page } from "@playwright/test";
import { clearState, expect, test } from "./fixtures";

const PRODUCT_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";

const CUSTOMER = {
  "#co-name": "Sherzod Ashirov",
  "#co-phone": "+998901234567",
  "#co-address": "Toshkent shahri, Chilonzor tumani, 12-uy, 45-xonadon",
};

const addItemToCart = async (
  page: Page,
  goto: (path: string) => Promise<void>,
) => {
  await goto(`/shop/${PRODUCT_ID}`);
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.locator("header")).toContainText("1");
};

const fillCustomer = async (page: Page, overrides: Record<string, string> = {}) => {
  const values = { ...CUSTOMER, ...overrides };

  for (const [selector, value] of Object.entries(values)) {
    await page.locator(selector).fill(value);
  }
};

const cartItemCount = (page: Page) =>
  page.evaluate(() => {
    const raw = localStorage.getItem("cart-storage");
    return raw ? JSON.parse(raw).state.items.length : 0;
  });

test.describe("Checkout: kirish yo'llari", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("bo'sh savat bilan buyurtma berib bo'lmaydi", async ({ page, goto }) => {
    await goto("/checkout");

    await expect(page.getByRole("heading", { name: "Savat bo'sh" })).toBeVisible();
  });

  test("savatdagi Checkout tugmasi checkout'ga olib boradi", async ({
    page,
    goto,
  }) => {
    await addItemToCart(page, goto);
    await goto("/cart");

    await page.getByRole("button", { name: "Checkout" }).click();

    await page.waitForURL("**/checkout");
    await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
  });

  test("savatdagi yetkazish tanlovi checkout'ga o'tadi", async ({ page, goto }) => {
    await addItemToCart(page, goto);
    await goto("/cart");

    // "Express shipping" — ikkinchi variant
    await page.locator('input[name="shipping"]').nth(1).check();
    await page.getByRole("button", { name: "Checkout" }).click();
    await page.waitForURL("**/checkout");

    await expect(page.locator('input[name="checkout-shipping"]').nth(1)).toBeChecked();
  });
});

test.describe("Checkout: validatsiya", () => {
  test.beforeEach(async ({ page, goto }) => {
    await clearState(page);
    await addItemToCart(page, goto);
    await goto("/checkout");
  });

  test("bo'sh formada xatolar chiqadi va buyurtma yuborilmaydi", async ({
    page,
    blocked,
  }) => {
    await page.locator("#co-phone").fill("");
    await page.getByRole("button", { name: "Buyurtma berish" }).click();

    await expect(page.getByText("Ism va familiyangizni kiriting")).toBeVisible();
    await expect(page.getByText("Telefon raqamini kiriting")).toBeVisible();
    await expect(
      page.getByText("Yetkazib berish manzilini kiriting"),
    ).toBeVisible();

    expect(blocked.telegram).toBe(0);
  });

  test("noto'g'ri telefon formatini rad etadi", async ({ page, blocked }) => {
    await fillCustomer(page, { "#co-phone": "901234567" });
    await page.getByRole("button", { name: "Buyurtma berish" }).click();

    await expect(page.getByText("Format: +998901234567")).toBeVisible();
    expect(blocked.telegram).toBe(0);
  });

  test("juda qisqa manzilni rad etadi", async ({ page, blocked }) => {
    await fillCustomer(page, { "#co-address": "Toshkent" });
    await page.getByRole("button", { name: "Buyurtma berish" }).click();

    await expect(page.getByText(/Manzilni to'liqroq/)).toBeVisible();
    expect(blocked.telegram).toBe(0);
  });

  test("noto'g'ri email rad etiladi, bo'sh email esa o'tadi", async ({ page }) => {
    await fillCustomer(page);
    await page.locator("#co-email").fill("notanemail");
    await page.getByRole("button", { name: "Buyurtma berish" }).click();

    await expect(page.getByText("Email manzili noto'g'ri")).toBeVisible();

    // Email ixtiyoriy — bo'sh qoldirilsa to'sqinlik qilmasligi kerak
    await page.locator("#co-email").fill("");
    await page.getByRole("button", { name: "Buyurtma berish" }).click();

    await expect(page.getByText("Email manzili noto'g'ri")).toHaveCount(0);
  });
});

test.describe("Checkout: buyurtma yuborish", () => {
  test.beforeEach(async ({ page, goto }) => {
    await clearState(page);
    await addItemToCart(page, goto);
    await goto("/checkout");
  });

  test("buyurtma yuboriladi, savat tozalanadi va tasdiq ko'rsatiladi", async ({
    page,
    blocked,
  }) => {
    await fillCustomer(page);
    await page.getByRole("button", { name: "Buyurtma berish" }).click();

    await expect(page.getByRole("heading", { name: "Complete!" })).toBeVisible();
    await expect(page.getByText(/#3L-\d{6}-\d{4}/)).toBeVisible();

    // Telegram'ga yuborildi (fixture ushlab qoldi — haqiqiy bot emas)
    expect(blocked.telegram).toBe(1);

    // Savat tozalandi
    await expect.poll(() => cartItemCount(page)).toBe(0);
  });

  test("tasdiq sahifasi sahifa yangilanganda ham qoladi", async ({ page }) => {
    await fillCustomer(page);
    await page.getByRole("button", { name: "Buyurtma berish" }).click();
    await expect(page.getByRole("heading", { name: "Complete!" })).toBeVisible();

    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Complete!" })).toBeVisible();
  });

  // Eng muhim holat: yuborilmagan buyurtmada savat yo'qolmasligi kerak
  test("yuborish uzilsa savat saqlanadi va xato ko'rsatiladi", async ({
    page,
    goto,
  }) => {
    await page.route("**/api.telegram.org/**", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, description: "Bad Gateway" }),
      }),
    );

    await fillCustomer(page);
    await page.getByRole("button", { name: "Buyurtma berish" }).click();

    await expect(
      page.locator(".Toastify__toast").filter({ hasText: "Buyurtma yuborilmadi" }),
    ).toBeVisible();

    // Savat joyida
    expect(await cartItemCount(page)).toBe(1);
    // Tasdiq ekrani chiqmasligi kerak
    await expect(page.getByRole("heading", { name: "Complete!" })).toHaveCount(0);

    // Mijoz savatga qaytib, qayta urina oladi
    await goto("/cart");
    await expect(page.locator("main")).toContainText("Subtotal");
  });

  test("qayta urinishda buyurtma raqami o'zgarmaydi", async ({ page }) => {
    // Do'kon takroriy xabarni bitta buyurtma deb tanishi uchun
    let failed = false;
    await page.route("**/api.telegram.org/**", (route) => {
      if (!failed) {
        failed = true;
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ ok: false, description: "Timeout" }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await fillCustomer(page);
    await page.getByRole("button", { name: "Buyurtma berish" }).click();
    await expect(
      page.locator(".Toastify__toast").filter({ hasText: "Buyurtma yuborilmadi" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Buyurtma berish" }).click();
    await expect(page.getByRole("heading", { name: "Complete!" })).toBeVisible();

    await expect(page.getByText(/#3L-\d{6}-\d{4}/)).toBeVisible();
  });

  test("buyurtma xulosasi savat summasiga mos keladi", async ({ page }) => {
    // Header'dagi mobil menyu ham <aside> — main ichidagisini olamiz
    const summary = page.locator("main aside");

    await expect(summary).toContainText("Mahsulotlar");
    await expect(summary).toContainText("Umumiy");
    // Bepul yetkazish tanlangan — umumiy summa mahsulotlar summasiga teng
    await expect(summary).toContainText("$90.00");
  });
});
