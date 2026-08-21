import { clearState, expect, test } from "./fixtures";

const PRODUCT_ID = "7a40356a-c78e-4333-8ae1-9b69d89d8f18";

// Sharhlar bo'limidagi "N Reviews" sarlavhasidan umumiy sonni o'qiydi.
// Ro'yxatning o'zi 5 tadan sahifalanadi, shuning uchun kartochkalar sonini
// sanash yangi sharh qo'shilganini ko'rsatmaydi.
const totalReviews = async (page: import("@playwright/test").Page) => {
  const heading = await page.locator('[role="tabpanel"] h3').first().innerText();
  return Number(heading.match(/\d+/)?.[0] ?? 0);
};

test.describe("Sharhlar", () => {
  test.beforeEach(async ({ page, goto }) => {
    await clearState(page);
    await goto(`/shop/${PRODUCT_ID}`);
  });

  test("uchta tab bor va Reviews ochiq turadi", async ({ page }) => {
    await expect(page.getByRole("tab")).toHaveCount(3);
    await expect(page.getByRole("tab", { selected: true })).toHaveText("Sharhlar");
  });

  test("Additional Info'da texnik ma'lumot bor, tepada takrorlanmaydi", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Qo'shimcha ma'lumot" }).click();

    await expect(page.locator('[role="tabpanel"]')).toContainText("SKU");
    await expect(page.locator("main section").first()).not.toContainText("SKU");
  });

  test("bo'sh forma maydon ostida xato ko'rsatadi", async ({ page }) => {
    await page.getByRole("button", { name: "Sharh yozish" }).click();

    await expect(page.getByText("Ismingizni kiriting")).toBeVisible();
    await expect(page.getByText("Sharh matnini yozing")).toBeVisible();
  });

  test("sharh yoziladi, saqlanadi va reload'dan keyin qoladi", async ({
    page,
    goto,
  }) => {
    const before = await totalReviews(page);

    await page.getByLabel("Ismingiz").first().fill("Sinov Foydalanuvchi");
    await page.getByLabel("2 yulduz").click();
    await page.getByLabel("Sharh matni").fill("E2E sinov sharhi");
    await page.getByRole("button", { name: "Sharh yozish" }).click();

    await expect.poll(() => totalReviews(page)).toBe(before + 1);
    await expect(page.locator("article").first()).toContainText("Sinov Foydalanuvchi");

    // Yuborgach ism qoladi, matn tozalanadi
    await expect(page.getByLabel("Ismingiz").first()).toHaveValue("Sinov Foydalanuvchi");
    await expect(page.getByLabel("Sharh matni")).toHaveValue("");

    await goto(`/shop/${PRODUCT_ID}`);
    await expect(page.locator("body")).toContainText("E2E sinov sharhi");
  });

  test("emoji tugmasi matnga qo'shiladi", async ({ page }) => {
    await page.getByLabel("Sharh matni").fill("Zo'r");
    await page.getByLabel("🔥 qo'shish").click();

    await expect(page.getByLabel("Sharh matni")).toHaveValue(/🔥/);
  });

  test("Like bosilganda hisob oshadi", async ({ page }) => {
    const like = page.locator("article").first().getByRole("button", { name: /^Yoqdi/ });
    const before = await like.innerText();

    await like.click();

    await expect.poll(() => like.innerText()).not.toBe(before);
  });

  test("javob yozish ishlaydi va validatsiya qiladi", async ({ page }) => {
    const card = page.locator("article").first();

    await card.getByRole("button", { name: "Javob berish" }).click();
    await card.getByLabel("Ismingiz").fill("");
    await card.getByRole("button", { name: "Yuborish" }).click();

    await expect(page.getByText("Javob matnini yozing")).toBeVisible();

    await card.getByLabel("Ismingiz").fill("Sherzod");
    await card.getByLabel("Javobingiz").fill("Rahmat!");
    await card.getByRole("button", { name: "Yuborish" }).click();

    await expect(card).toContainText("Rahmat!");
  });
});
