import { expect, test } from "./fixtures";

/**
 * Interfeysdagi har bir tugma biror ish qilishi kerak. Bu yerdagi to'rttasi
 * ilgari `onClick` ham, havola ham bo'lmagan holda turgan edi: foydalanuvchi
 * bosardi va hech narsa bo'lmasdi.
 */
test.describe("Ish qilmaydigan tugmalar bo'lmasligi", () => {
  test("bosh sahifadagi aksiya banneri do'konga olib boradi", async ({
    page,
    goto,
  }) => {
    await goto("/");

    await page
      .locator("section")
      .filter({ hasText: "35% GACHA CHEGIRMA" })
      .getByRole("link", { name: "Ko'proq" })
      .click();

    await page.waitForURL("**/shop");
  });

  test("bog'lanish sahifasidagi tugma 'Biz haqimizda'ga olib boradi", async ({
    page,
    goto,
  }) => {
    await goto("/contact");

    await page.getByRole("link", { name: "Ko'proq" }).first().click();

    await page.waitForURL("**/about");
    await expect(
      page.getByRole("heading", { name: "Biz haqimizda", level: 1 }),
    ).toBeVisible();
  });

  test("blog ro'yxatidagi 'Batafsil' maqolani ochadi", async ({
    page,
    goto,
  }) => {
    await goto("/blog");

    await page.getByRole("link", { name: "Batafsil" }).first().click();

    await page.waitForURL("**/blog/1");
    await expect(
      page.getByRole("heading", { name: "Uyni bezashning 7 usuli", level: 1 }),
    ).toBeVisible();
  });

  test("bosh sahifadagi 'Batafsil' ham maqolani ochadi", async ({
    page,
    goto,
  }) => {
    await goto("/");

    await page.getByRole("link", { name: "Batafsil" }).first().click();

    await page.waitForURL(/\/blog\/\d+$/);
    await expect(page.locator("article p").first()).toBeVisible();
  });
});

test.describe("Maqola sahifasi", () => {
  test("to'liq matn va boshqa maqolalar ko'rinadi", async ({ page, goto }) => {
    await goto("/blog/2");

    await expect(
      page.getByRole("heading", { name: "Oshxonani tartibga solish" }),
    ).toBeVisible();

    // Ro'yxatdagi qisqacha matndan ko'ra ancha ko'proq bo'lishi kerak —
    // aks holda "Batafsil" tugmasi hech narsa qo'shmagan bo'lardi
    const paragraphs = page.locator("article > div > p");
    expect(await paragraphs.count()).toBeGreaterThan(3);

    await expect(
      page.getByRole("heading", { name: "Boshqa maqolalar" }),
    ).toBeVisible();
    // O'zi ro'yxatda takrorlanmaydi
    await expect(
      page.getByRole("link", { name: "Oshxonani tartibga solish" }),
    ).toHaveCount(0);
  });

  test("noma'lum maqolada xato ekrani chiqadi", async ({ page, goto }) => {
    await goto("/blog/yoq-bunday-maqola");

    await expect(
      page.getByRole("heading", { name: "Maqola topilmadi" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Barcha maqolalar" }),
    ).toBeVisible();
  });

  test("til almashganda matn ham almashadi", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("language", "ru"));
    await page.goto("/blog/1");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "7 способов украсить дом" }),
    ).toBeVisible();
    await expect(page.locator("article")).toContainText("Начните со света");
  });
});
