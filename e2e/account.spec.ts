import type { Page } from "@playwright/test";
import { clearState, expect, test } from "./fixtures";
import { API_URL } from "./env";

const PRODUCT_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";

const USER = {
  id: "u1",
  email: "sinov@example.com",
  username: "sinovuser",
  firstname: "Sinov",
  name: "Sinov Foydalanuvchi",
  phone: "+998901112233",
};

/** Haqiqiy kirishsiz sessiyani simulyatsiya qiladi */
const seedSession = async (page: Page) => {
  if (API_URL) {
    await page.route(`${API_URL}/users/me`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: USER, message: "ok", success: true }),
      }),
    );
  }

  await page.evaluate((user) => {
    localStorage.setItem("accessToken", "sinov-tokeni");
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({ state: { user }, version: 0 }),
    );
  }, USER);
};

/** Haqiqiy buyurtma beradi — Telegram fixture darajasida to'silgan */
const placeOrder = async (
  page: Page,
  goto: (path: string) => Promise<void>,
) => {
  await goto(`/shop/${PRODUCT_ID}`);
  await page.getByRole("button", { name: "Savatga qo'shish" }).click();
  await goto("/checkout");
  await page.locator("#co-name").fill("Sinov Foydalanuvchi");
  await page.locator("#co-phone").fill("+998901234567");
  await page
    .locator("#co-address")
    .fill("Toshkent shahri, Chilonzor tumani, 12-uy");
  await page.getByRole("button", { name: "Buyurtma berish" }).click();
  await expect(page.getByRole("heading", { name: "Tayyor!" })).toBeVisible();
};

test.describe("Hisob sahifasi", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("mehmon kirish taklifini va bo'sh tarixni ko'radi", async ({
    page,
    goto,
  }) => {
    await goto("/account");

    await expect(
      page.getByRole("heading", { name: "Siz tizimga kirmagansiz" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Hali buyurtma bermagansiz" }),
    ).toBeVisible();
  });

  test("kirgan foydalanuvchi profilini ko'radi", async ({ page, goto }) => {
    await goto("/");
    await seedSession(page);
    await goto("/account");

    await expect(page.getByText("sinovuser")).toBeVisible();
    await expect(page.getByText("sinov@example.com")).toBeVisible();
    await expect(page.getByText("+998901112233")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Siz tizimga kirmagansiz" }),
    ).toHaveCount(0);
  });

  test("profil menyusidagi havola hisob sahifasiga olib boradi", async ({
    page,
    goto,
  }) => {
    await goto("/");
    await seedSession(page);
    await goto("/");

    await page.getByRole("button", { name: "Profil menyusi" }).click();
    await page.getByRole("menuitem", { name: "Hisobim" }).click();

    await page.waitForURL("**/account");
    await expect(page.getByRole("heading", { name: "Hisobim" })).toBeVisible();
  });

  test("berilgan buyurtma tarixda ko'rinadi", async ({ page, goto }) => {
    await placeOrder(page, goto);

    // Tasdiq ekranidagi raqamni olib, tarixda o'shani qidiramiz
    const confirmed = await page
      .locator("p.font-medium.text-2xl")
      .first()
      .innerText();
    const orderId = confirmed.replace("#", "").trim();

    await goto("/account");

    const card = page.locator("details").first();
    await expect(card).toContainText(orderId);
    await expect(card).toContainText("1 mahsulot");
  });

  test("buyurtma ochilganda tarkibi ko'rinadi", async ({ page, goto }) => {
    await placeOrder(page, goto);
    await goto("/account");

    const card = page.locator("details").first();
    const items = card.locator("ul li");

    // Yopiq turganda tarkib ko'rinmaydi
    await expect(items.first()).toBeHidden();

    await card.locator("summary").click();

    await expect(items.first()).toBeVisible();
    await expect(card).toContainText("+998901234567");

    // Yetkazib berish nomi interfeys tilida bo'lishi kerak. Buyurtmada
    // saqlangan `label` operatorga mo'ljallangan va inglizcha qoladi —
    // uni shu yerda ko'rsatib qo'yish oson xato.
    await expect(card).toContainText("Bepul yetkazib berish");
    await expect(card).not.toContainText("Free shipping");
  });

  test("tarix sahifa yangilangandan keyin ham qoladi", async ({
    page,
    goto,
  }) => {
    await placeOrder(page, goto);
    await goto("/account");
    await expect(page.locator("details")).toHaveCount(1);

    await page.reload();

    // localStorage'da saqlanadi — sessionStorage'dagi tasdiqdan farqli
    await expect(page.locator("details")).toHaveCount(1);
  });

  test("tarixni tozalash mumkin", async ({ page, goto }) => {
    await placeOrder(page, goto);
    await goto("/account");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Tarixni tozalash" }).click();

    await expect(page.locator("details")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Hali buyurtma bermagansiz" }),
    ).toBeVisible();
  });

  test("tasdiqlanmasa tarix o'chmaydi", async ({ page, goto }) => {
    await placeOrder(page, goto);
    await goto("/account");

    page.once("dialog", (dialog) => dialog.dismiss());
    await page.getByRole("button", { name: "Tarixni tozalash" }).click();

    await expect(page.locator("details")).toHaveCount(1);
  });
});
