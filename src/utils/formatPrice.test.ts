import { describe, expect, it } from "vitest";
import { formatPrice } from "@/utils/formatPrice";

describe("formatPrice", () => {
  it("USD ni standart valyuta sifatida ishlatadi", () => {
    expect(formatPrice(300)).toContain("300");
    expect(formatPrice(300)).toContain("$");
  });

  it("valyutaga qarab formatlaydi", () => {
    expect(formatPrice(500, "EUR")).toContain("€");
  });

  it("UZS uchun tiyinlarni ko'rsatmaydi", () => {
    // 50 000 so'mda ".00" ko'rsatish ma'nosiz
    expect(formatPrice(50000, "UZS")).not.toContain(",00");
    expect(formatPrice(50000, "UZS")).not.toContain(".00");
  });

  it("nol qiymatni ham formatlaydi", () => {
    // Bepul yetkazib berish narxi 0 — bo'sh satr chiqmasligi kerak
    expect(formatPrice(0)).toContain("0");
  });

  it("noma'lum valyutada ham qulamaydi", () => {
    // Intl noto'g'ri valyuta kodida xato tashlaydi — sahifa yiqilmasin
    expect(() =>
      formatPrice(100, "XYZ" as unknown as "USD"),
    ).not.toThrow();
  });
});
