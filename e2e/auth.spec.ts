import type { Page } from "@playwright/test";
import { clearState, expect, test } from "./fixtures";
import { API_URL } from "./env";

const USER = {
  id: "u1",
  email: "sinov@example.com",
  username: "sinov",
  firstname: "Sinov",
  name: "Sinov Foydalanuvchi",
};

// Yorliqlar interfeys tilida — standart til o'zbekcha
const VALID_SIGNUP = {
  "To'liq ism": "Sinov Foydalanuvchi",
  Ism: "Sinov",
  "Foydalanuvchi nomi": "sinovuser",
  "Email manzil": "sinov@example.com",
  "Telefon raqam": "+998901234567",
  Parol: "password123",
};

const fillSignUp = async (page: Page, overrides: Record<string, string> = {}) => {
  const values = { ...VALID_SIGNUP, ...overrides };

  for (const [label, value] of Object.entries(values)) {
    // `exact` shart: "Ism" — "To'liq ism" ichida, "Parol" esa
    // "Parolni ko'rsatish" tugmasining yorlig'i ichida uchraydi
    await page.getByLabel(label, { exact: true }).fill(value);
  }
};

/** Haqiqiy kirishsiz sessiyani simulyatsiya qiladi */
const seedSession = async (page: Page) => {
  await page.route(`${API_URL}/users/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: USER, message: "ok", success: true }),
    }),
  );

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate((user) => {
    localStorage.setItem("accessToken", "sinov-tokeni");
    localStorage.setItem(
      "auth-storage",
      JSON.stringify({ state: { user }, version: 0 }),
    );
  }, USER);
  await page.reload({ waitUntil: "domcontentloaded" });
};

test.describe("Sign In", () => {
  test.beforeEach(async ({ page, goto }) => {
    await clearState(page);
    await goto("/signin");
  });

  test("auth sahifasida header va footer yo'q", async ({ page }) => {
    await expect(page.locator("header")).toHaveCount(0);
    await expect(page.locator("footer")).toHaveCount(0);
  });

  test("bo'sh forma maydon ostida xato ko'rsatadi", async ({ page }) => {
    await page.getByRole("button", { name: "Kirish", exact: true }).click();

    await expect(
      page.getByText("Email yoki foydalanuvchi nomini kiriting"),
    ).toBeVisible();
  });

  test("qisqa parolni rad etadi", async ({ page }) => {
    await page.getByLabel("Foydalanuvchi nomi yoki email").fill("test@example.com");
    await page.getByLabel("Parol", { exact: true }).fill("123");
    await page.getByRole("button", { name: "Kirish", exact: true }).click();

    await expect(page.getByText(/kamida 8 belgi/)).toBeVisible();
  });

  test("parolni ko'rsatish tugmasi ishlaydi", async ({ page }) => {
    const password = page.getByLabel("Parol", { exact: true });
    await password.fill("maxfiy123");

    await expect(password).toHaveAttribute("type", "password");
    await page.getByLabel("Parolni ko'rsatish").click();
    await expect(password).toHaveAttribute("type", "text");
  });

  // Haqiqiy API: server o'z xabarini ko'rsatishi kerak, axios'ning
  // umumiy "Request failed with status code 401" matnini emas
  test("noto'g'ri parolda server xabari chiqadi", async ({ page }) => {
    await page.getByLabel("Foydalanuvchi nomi yoki email").fill("yoq@example.com");
    await page.getByLabel("Parol", { exact: true }).fill("notogriparol123");
    await page.getByRole("button", { name: "Kirish", exact: true }).click();

    await expect(
      page
        .locator(".Toastify__toast")
        .filter({ hasText: "Invalid credentials" }),
    ).toBeVisible();

    const token = await page.evaluate(
      () =>
        localStorage.getItem("accessToken") ??
        sessionStorage.getItem("accessToken"),
    );
    expect(token).toBeNull();
  });
});

test.describe("Sign Up", () => {
  test.beforeEach(async ({ page, goto }) => {
    await clearState(page);
    await goto("/signup");
  });

  test("oltita maydon bor va telefon +998 bilan boshlanadi", async ({
    page,
  }) => {
    await expect(page.locator("form input")).toHaveCount(6);
    await expect(page.getByLabel("Telefon raqam", { exact: true })).toHaveValue("+998");
  });

  test("har maydon uchun alohida xato ko'rsatadi", async ({ page, blocked }) => {
    await page.getByLabel("Telefon raqam", { exact: true }).fill("");
    await page.getByRole("button", { name: "Ro'yxatdan o'tish", exact: true }).click();

    await expect(page.getByText("To'liq ismni kiriting")).toBeVisible();
    await expect(page.getByText("Foydalanuvchi nomini kiriting")).toBeVisible();
    await expect(page.getByText("Email manzilini kiriting")).toBeVisible();
    await expect(page.getByText("Telefon raqamini kiriting")).toBeVisible();

    // Validatsiya to'xtatgani uchun serverga so'rov ketmasligi kerak
    expect(blocked.register).toBe(0);
  });

  test("noto'g'ri telefon formatini rad etadi", async ({ page, blocked }) => {
    await fillSignUp(page, { "Telefon raqam": "901234567" });
    await page.getByRole("button", { name: "Ro'yxatdan o'tish", exact: true }).click();

    await expect(page.getByText("Format: +998901234567")).toBeVisible();
    expect(blocked.register).toBe(0);
  });

  test("server xatosi foydalanuvchiga ko'rsatiladi", async ({
    page,
    blocked,
  }) => {
    await fillSignUp(page);
    await page.getByRole("button", { name: "Ro'yxatdan o'tish", exact: true }).click();

    // So'rov fixture darajasida ushlanadi — backendda akkaunt yaratilmaydi
    await expect(
      page
        .locator(".Toastify__toast")
        .filter({ hasText: "Email already exists" }),
    ).toBeVisible();
    expect(blocked.register).toBe(1);
  });
});

test.describe("Sessiya holati", () => {
  test.beforeEach(async ({ page }) => {
    await clearState(page);
  });

  test("kirmagan holatda profil ikonkasi /signin ga olib boradi", async ({
    page,
    goto,
  }) => {
    await goto("/");

    await expect(page.getByRole("link", { name: "Kirish" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Profil menyusi" }),
    ).toHaveCount(0);
  });

  test("kirgan holatda menyuda ism va Sign Out bo'ladi", async ({ page }) => {
    await seedSession(page);

    await page.getByRole("button", { name: "Profil menyusi" }).click();

    await expect(page.getByRole("menu")).toContainText("Sinov");
    await expect(page.getByRole("menu")).toContainText(USER.email);
    await expect(page.getByRole("menuitem", { name: "Chiqish" })).toBeVisible();
  });

  test("menyu Escape bilan yopiladi", async ({ page }) => {
    await seedSession(page);
    await page.getByRole("button", { name: "Profil menyusi" }).click();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("menu")).toHaveCount(0);
  });

  test("kirgan foydalanuvchi /signin ga kira olmaydi", async ({ page }) => {
    await seedSession(page);

    await page.goto("/signin", { waitUntil: "domcontentloaded" });

    await expect.poll(() => new URL(page.url()).pathname).toBe("/");
  });

  test("Sign Out sessiyani to'liq yopadi", async ({ page }) => {
    await seedSession(page);

    await page.getByRole("button", { name: "Profil menyusi" }).click();
    await page.getByRole("menuitem", { name: "Chiqish" }).click();

    await expect(page.getByRole("link", { name: "Kirish" })).toBeVisible();
    const token = await page.evaluate(() =>
      localStorage.getItem("accessToken"),
    );
    expect(token).toBeNull();
  });

  // Haqiqiy xato: 401 dan keyin token o'chardi, lekin header foydalanuvchini
  // kirgan holatda ko'rsatib turardi va har bir amali xato bilan tugardi
  test("401 javobda sessiya yopiladi", async ({ page }) => {
    await seedSession(page);
    await expect(
      page.getByRole("button", { name: "Profil menyusi" }),
    ).toBeVisible();

    await page.route(`${API_URL}/products**`, (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          error: { code: "UNAUTHORIZED", message: "Unauthorized" },
          success: false,
        }),
      }),
    );
    await page.goto("/shop", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: "Kirish" })).toBeVisible();
  });

  test("profil keshi bor, lekin token yo'q bo'lsa — mehmon", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate((user) => {
      localStorage.clear();
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({ state: { user }, version: 0 }),
      );
    }, USER);
    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: "Kirish" })).toBeVisible();
  });
});
