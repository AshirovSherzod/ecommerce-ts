import { expect, test } from "./fixtures";

/**
 * API'da `sort` yo'q — saralash yuklangan sahifalar ustidan bajariladi.
 * Buni aytmaslik jimgina noto'g'ri javob berish bilan barobar.
 */
test.describe("Saralash cheklovi ochiq aytiladi", () => {
  test("saralash tanlanganda ogohlantirish chiqadi", async ({ page, goto }) => {
    await goto("/shop");

    // Standart tartibda ogohlantirish kerak emas
    await expect(page.getByText(/Saralash hozircha/)).toHaveCount(0);

    await page.getByLabel("Saralash").click();
    await page.getByRole("option", { name: "Narx: arzondan qimmatga" }).click();

    await expect(page.getByText(/Saralash hozircha/)).toBeVisible();
  });

  test("standart tartibga qaytilsa ogohlantirish yo'qoladi", async ({
    page,
    goto,
  }) => {
    await goto("/shop");

    await page.getByLabel("Saralash").click();
    await page.getByRole("option", { name: "Narx: qimmatdan arzonga" }).click();
    await expect(page.getByText(/Saralash hozircha/)).toBeVisible();

    await page.getByLabel("Saralash").click();
    await page.getByRole("option", { name: "Eng yangi" }).click();
    await expect(page.getByText(/Saralash hozircha/)).toHaveCount(0);
  });
});
