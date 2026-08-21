import { describe, expect, it } from "vitest";
import { signInSchema, signUpSchema } from "@/schemas/auth.schema";

const validSignUp = {
  name: "Sherzod Ashirov",
  firstname: "Sherzod",
  username: "sherzod",
  email: "sherzod@example.com",
  phone: "+998901234567",
  password: "password123",
};

describe("signUpSchema", () => {
  it("to'g'ri ma'lumotni qabul qiladi", () => {
    expect(signUpSchema.safeParse(validSignUp).success).toBe(true);
  });

  it("bo'sh maydonlarni rad etadi", () => {
    const result = signUpSchema.safeParse({ ...validSignUp, name: "   " });

    expect(result.success).toBe(false);
  });

  it("bo'shliqlarni o'zi tozalaydi", () => {
    const result = signUpSchema.safeParse({
      ...validSignUp,
      name: "  Sherzod Ashirov  ",
      email: "  sherzod@example.com  ",
    });

    // Qiymatlar tozalangan holda kelgani uchun qo'lda trim kerak emas
    expect(result.success && result.data.name).toBe("Sherzod Ashirov");
    expect(result.success && result.data.email).toBe("sherzod@example.com");
  });

  it.each([
    ["901234567", "kod yo'q"],
    ["+99890123456", "raqam kam"],
    ["+9989012345678", "raqam ko'p"],
    ["+7901234567", "boshqa davlat kodi"],
  ])("telefon formatini rad etadi: %s (%s)", (phone) => {
    expect(signUpSchema.safeParse({ ...validSignUp, phone }).success).toBe(false);
  });

  it("to'g'ri telefonni qabul qiladi", () => {
    expect(
      signUpSchema.safeParse({ ...validSignUp, phone: "+998901234567" }).success,
    ).toBe(true);
  });

  it.each(["notanemail", "a@", "@b.com", "a b@c.com"])(
    "noto'g'ri emailni rad etadi: %s",
    (email) => {
      expect(signUpSchema.safeParse({ ...validSignUp, email }).success).toBe(false);
    },
  );

  it("qisqa parolni rad etadi", () => {
    expect(
      signUpSchema.safeParse({ ...validSignUp, password: "1234567" }).success,
    ).toBe(false);
  });

  it("qisqa username'ni rad etadi", () => {
    expect(
      signUpSchema.safeParse({ ...validSignUp, username: "ab" }).success,
    ).toBe(false);
  });

  it("bo'sh telefon uchun format emas, 'kiriting' kalitini beradi", () => {
    // Bo'sh maydonga "Format: +998901234567" ko'rsatish chalg'itardi.
    // Sxema tarjima kalitini saqlaydi, matnni komponent `t()` bilan chiqaradi.
    const result = signUpSchema.safeParse({ ...validSignUp, phone: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("validation:phoneRequired");
  });
});

describe("signInSchema", () => {
  it("email yoki username'ni qabul qiladi", () => {
    const base = { password: "password123", remember: false };

    expect(signInSchema.safeParse({ ...base, identifier: "a@b.com" }).success).toBe(true);
    expect(signInSchema.safeParse({ ...base, identifier: "sherzod" }).success).toBe(true);
  });

  it("bo'sh identifikatorni rad etadi", () => {
    const result = signInSchema.safeParse({
      identifier: "  ",
      password: "password123",
      remember: false,
    });

    expect(result.success).toBe(false);
  });

  it("qisqa parolni rad etadi", () => {
    const result = signInSchema.safeParse({
      identifier: "a@b.com",
      password: "123",
      remember: false,
    });

    expect(result.success).toBe(false);
  });
});
