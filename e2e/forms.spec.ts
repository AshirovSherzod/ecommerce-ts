import { clearState, expect, test } from "./fixtures";

test.describe("Contact formasi", () => {
  test.beforeEach(async ({ page, goto }) => {
    await clearState(page);
    await goto("/contact");
  });

  test("bo'sh formada har maydon ostida xato chiqadi", async ({
    page,
    blocked,
  }) => {
    await page.getByRole("button", { name: "Xabar yuborish" }).click();

    await expect(page.getByText("Ismingizni kiriting")).toBeVisible();
    await expect(page.getByText("Email manzilini kiriting")).toBeVisible();
    await expect(page.getByText("Xabar matnini yozing")).toBeVisible();

    // Validatsiya to'xtatgani uchun Telegram'ga xabar ketmasligi kerak
    expect(blocked.telegram).toBe(0);
  });

  test("noto'g'ri emailni aniqlaydi", async ({ page, blocked }) => {
    await page.locator("#contact-name").fill("Sherzod");
    await page.locator("#contact-email").fill("notanemail");
    await page.locator("#contact-message").fill("Salom");
    await page.getByRole("button", { name: "Xabar yuborish" }).click();

    await expect(page.getByText("Email manzili noto'g'ri")).toBeVisible();
    expect(blocked.telegram).toBe(0);
  });

  test("tuzatilgach xato yozuvi yo'qoladi", async ({ page }) => {
    await page.getByRole("button", { name: "Xabar yuborish" }).click();
    await expect(page.getByText("Email manzilini kiriting")).toBeVisible();

    await page.locator("#contact-email").fill("sherzod@example.com");

    await expect(page.getByText("Email manzilini kiriting")).toHaveCount(0);
  });

  test("email maydonining placeholder'i to'g'ri", async ({ page }) => {
    // Haqiqiy xato: email maydonida ism placeholder'i yozilgan edi
    await expect(page.locator("#contact-email")).toHaveAttribute(
      "placeholder",
      "Email manzilingiz",
    );
  });
});

test.describe("Newsletter", () => {
  test.beforeEach(async ({ page, goto }) => {
    await clearState(page);
    await goto("/");
  });

  test("bo'sh emailni rad etadi", async ({ page }) => {
    await page.getByRole("button", { name: "Obuna" }).click();

    await expect(page.getByText("Email manzilini kiriting")).toBeVisible();
  });

  test("noto'g'ri emailni rad etadi", async ({ page }) => {
    await page.getByLabel("Email manzilingiz").fill("bad@");
    await page.getByRole("button", { name: "Obuna" }).click();

    await expect(page.getByText("Email manzili noto'g'ri")).toBeVisible();
  });

  test("to'g'ri email qabul qilinadi va maydon tozalanadi", async ({ page }) => {
    const field = page.getByLabel("Email manzilingiz");
    await field.fill("ok@example.com");
    await page.getByRole("button", { name: "Obuna" }).click();

    await expect(
      page.locator(".Toastify__toast").filter({ hasText: "Obuna uchun rahmat" }),
    ).toBeVisible();
    await expect(field).toHaveValue("");
  });
});

test.describe("Footer", () => {
  // Haqiqiy xato: `pathname.includes("/contact")` /shop/contact-lens kabi
  // manzillarga ham tushardi
  test("faqat /contact sahifasida ServiceSect ko'rsatiladi", async ({
    page,
    goto,
  }) => {
    await goto("/contact");
    await expect(page.locator("footer")).not.toContainText("Yangiliklarimizga obuna bo'ling");

    await goto("/");
    await expect(page.locator("footer")).toContainText("Yangiliklarimizga obuna bo'ling");
  });
});
