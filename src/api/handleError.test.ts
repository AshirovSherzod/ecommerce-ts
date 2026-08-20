import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { ApiError, handleError } from "@/api/handleError";

const axiosErrorWith = (data: unknown, status = 400) => {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed with status code " + status, "ERR_BAD_REQUEST", config, {}, {
    data,
    status,
    statusText: "",
    headers: {},
    config,
  });
};

describe("handleError", () => {
  // Haqiqiy xato: backend xabarni `data.error.message` ichida qaytaradi,
  // kod esa `data.message` ni o'qib, har doim axios'ning umumiy matnini
  // ko'rsatardi ("Request failed with status code 404")
  it("xabarni data.error.message dan oladi", () => {
    const error = axiosErrorWith(
      { error: { code: "NOT_FOUND", message: "Product not found" }, success: false },
      404,
    );

    expect(() => handleError(error)).toThrow("Product not found");
  });

  it("status va kodni saqlaydi", () => {
    const error = axiosErrorWith(
      { error: { code: "NOT_FOUND", message: "Product not found" } },
      404,
    );

    try {
      handleError(error);
      expect.unreachable("handleError xato tashlashi kerak edi");
    } catch (thrown) {
      expect(thrown).toBeInstanceOf(ApiError);
      expect((thrown as ApiError).status).toBe(404);
      expect((thrown as ApiError).code).toBe("NOT_FOUND");
    }
  });

  it("xabar yuqori darajada bo'lsa ham topadi", () => {
    const error = axiosErrorWith({ message: "Yuqori darajadagi xabar" }, 400);

    expect(() => handleError(error)).toThrow("Yuqori darajadagi xabar");
  });

  it("javob umuman kelmasa tushunarli xabar beradi", () => {
    const config = { headers: new AxiosHeaders() };
    const networkError = new AxiosError("Network Error", "ERR_NETWORK", config);

    // "Network Error" foydalanuvchiga hech narsa demaydi
    expect(() => handleError(networkError)).toThrow(/Serverga ulanib bo'lmadi/);
  });

  it("oddiy Error'ni o'zgartirmasdan uzatadi", () => {
    const original = new Error("Boshqa xato");

    expect(() => handleError(original)).toThrow(original);
  });
});
