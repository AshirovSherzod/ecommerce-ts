import type { Page } from "@playwright/test";
import { clearState, expect, test } from "./fixtures";
import { API_URL } from "./env";

const PRODUCT_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";

const USER = {
  id: "u1",
  email: "sherzod@example.com",
  username: "sherzod",
  firstname: "Sherzod",
  name: "Sherzod Ashirov",
  phone: "+998901112233",
};

const ADDRESS = "Toshkent shahri, Chilonzor tumani, 12-uy, 45-xonadon";

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

const addToCart = async (page: Page, goto: (path: string) => Promise<void>) => {
  await goto(`/shop/${PRODUCT_ID}`);
  await page.getByRole("button", { name: "Savatga qo'shish" }).click();
};

const placeOrder = async (
  page: Page,
  goto: (path: string) => Promise<void>,
  note = "",
) => {
  await addToCart(page, goto);
  await goto("/checkout");
  await page.locator("#co-name").fill("Mehmon Xaridor");
  await page.locator("#co-phone").fill("+998907776655");
  await page.locator("#co-address").fill(ADDRESS);
  if (note) await page.locator("#co-note").fill(note);
  await page.getByRole("button", { name: "Buyurtma berish" }).click();
  await expect(page.getByRole("heading", { name: "Tayyor!" })).toBeVisible();
};

test.describe("Ikkinchi buyurtma", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("bir sessiyada ikkinchi buyurtma berish mumkin", async ({
    page,
    goto,
  }) => {
    await placeOrder(page, goto);

    // Savat bo'sh — tasdiq ekrani turishi kerak
    await goto("/checkout");
    await expect(page.getByRole("heading", { name: "Tayyor!" })).toBeVisible();

    // Yangi mahsulot qo'shilgach forma qaytishi kerak: `lastOrder` sessiya
    // oxirigacha turadi va u mijozni eski tasdiqda qamab qo'ymasligi kerak
    await addToCart(page, goto);
    await goto("/checkout");

    await expect(page.locator("#co-name")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tayyor!" })).toHaveCount(0);
  });
});

test.describe("Checkout formasi oldindan to'ldiriladi", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("kirgan foydalanuvchining ismi, telefoni va emaili qo'yiladi", async ({
    page,
    goto,
  }) => {
    await goto("/");
    await seedSession(page);
    await addToCart(page, goto);
    await goto("/checkout");

    await expect(page.locator("#co-name")).toHaveValue("Sherzod Ashirov");
    await expect(page.locator("#co-phone")).toHaveValue("+998901112233");
    await expect(page.locator("#co-email")).toHaveValue("sherzod@example.com");
  });

  test("mehmonda maydonlar bo'sh, telefonda faqat kod turadi", async ({
    page,
    goto,
  }) => {
    await addToCart(page, goto);
    await goto("/checkout");

    await expect(page.locator("#co-name")).toHaveValue("");
    await expect(page.locator("#co-phone")).toHaveValue("+998");
    await expect(page.locator("#co-address")).toHaveValue("");
  });

  test("manzil oxirgi buyurtmadan tiklanadi", async ({ page, goto }) => {
    await placeOrder(page, goto);

    // Ikkinchi buyurtma: manzilni qaytadan yozish shart emas
    await addToCart(page, goto);
    await goto("/checkout");

    await expect(page.locator("#co-address")).toHaveValue(ADDRESS);
    await expect(page.locator("#co-name")).toHaveValue("Mehmon Xaridor");
    await expect(page.locator("#co-phone")).toHaveValue("+998907776655");
  });

  test("izoh keyingi buyurtmaga ko'chmaydi", async ({ page, goto }) => {
    await placeOrder(page, goto, "Eshik oldiga qoldiring");

    await addToCart(page, goto);
    await goto("/checkout");

    // Manzil ko'chadi, izoh esa yo'q — u bitta yetkazishga tegishli
    await expect(page.locator("#co-address")).toHaveValue(ADDRESS);
    await expect(page.locator("#co-note")).toHaveValue("");
  });

  test("kirgan foydalanuvchida profil eski buyurtmadan ustun turadi", async ({
    page,
    goto,
  }) => {
    await placeOrder(page, goto);

    await seedSession(page);
    await addToCart(page, goto);
    await goto("/checkout");

    // Ism va telefon profildan, manzil esa buyurtmadan
    await expect(page.locator("#co-name")).toHaveValue("Sherzod Ashirov");
    await expect(page.locator("#co-phone")).toHaveValue("+998901112233");
    await expect(page.locator("#co-address")).toHaveValue(ADDRESS);
  });

  test("oldindan to'ldirilgan forma darhol yuborilishi mumkin", async ({
    page,
    goto,
    blocked,
  }) => {
    await placeOrder(page, goto);

    await addToCart(page, goto);
    await goto("/checkout");

    // Hech narsa yozmasdan yuboramiz — barcha majburiy maydon to'la
    await page.getByRole("button", { name: "Buyurtma berish" }).click();

    await expect(page.getByRole("heading", { name: "Tayyor!" })).toBeVisible();
    expect(blocked.telegram).toBe(2);
  });
});
