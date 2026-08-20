import { beforeEach, describe, expect, it } from "vitest";
import { clearToken, getToken, setToken } from "@/utils/authStorage";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("authStorage", () => {
  it("'Remember me' belgilansa localStorage'ga yozadi", () => {
    setToken("t1", true);

    expect(localStorage.getItem("accessToken")).toBe("t1");
    expect(sessionStorage.getItem("accessToken")).toBeNull();
  });

  it("belgilanmasa sessionStorage'ga yozadi", () => {
    setToken("t2", false);

    expect(sessionStorage.getItem("accessToken")).toBe("t2");
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("ikkala joydan ham o'qiydi", () => {
    setToken("t3", false);
    expect(getToken()).toBe("t3");

    setToken("t4", true);
    expect(getToken()).toBe("t4");
  });

  it("qayta yozganda eski token boshqa joyda qolib ketmaydi", () => {
    // Aks holda chiqishdan keyin ham eski token ishlatilib qolardi
    setToken("eski", true);
    setToken("yangi", false);

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(getToken()).toBe("yangi");
  });

  it("ikkala joydan ham tozalaydi", () => {
    setToken("t", true);
    clearToken();

    expect(getToken()).toBeNull();
  });

  it("token yo'q bo'lsa null qaytaradi", () => {
    expect(getToken()).toBeNull();
  });
});
