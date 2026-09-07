import { expect, test } from "./fixtures";

/**
 * Obuna emaili do'konga yetib borishi kerak. Ilgari forma faqat "rahmat"
 * deb tozalanardi va manzil hech qayerga yozilmasdi — mijoz obuna
 * bo'lganiga ishonardi, do'kon esa uni hech qachon ko'rmasdi.
 */
test.describe("Newsletter obunasi", () => {
  test("to'g'ri email do'konga yuboriladi", async ({ page, goto, blocked }) => {
    await goto("/");

    const field = page.getByLabel("Email manzilingiz");
    await field.fill("obuna@example.com");
    await page.getByRole("button", { name: "Obuna" }).click();

    await expect(
      page
        .locator(".Toastify__toast")
        .filter({ hasText: "Obuna uchun rahmat" }),
    ).toBeVisible();

    // Eng muhimi: so'rov haqiqatan chiqdi
    expect(blocked.telegram).toBe(1);
    await expect(field).toHaveValue("");
  });

  test("noto'g'ri email yuborilmaydi", async ({ page, goto, blocked }) => {
    await goto("/");

    await page.getByLabel("Email manzilingiz").fill("bad@");
    await page.getByRole("button", { name: "Obuna" }).click();

    await expect(page.getByText("Email manzili noto'g'ri")).toBeVisible();
    expect(blocked.telegram).toBe(0);
  });

  test("yuborish uzilsa forma tozalanmaydi", async ({ page, goto }) => {
    await goto("/");

    // Telegram javob bermaydi — mijoz emailni qaytadan yozmasligi kerak
    await page.route("**/api.telegram.org/**", (route) => route.abort());

    const field = page.getByLabel("Email manzilingiz");
    await field.fill("obuna@example.com");
    await page.getByRole("button", { name: "Obuna" }).click();

    await expect(
      page.locator(".Toastify__toast").filter({ hasText: "Yuborilmadi" }),
    ).toBeVisible();
    await expect(field).toHaveValue("obuna@example.com");
  });
});
