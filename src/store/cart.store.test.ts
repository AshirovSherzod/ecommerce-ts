import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/store/cart.store";
import type { Currency, Product } from "@/types/products.types";

const product = (
  id: string,
  price: number,
  currency: Currency = "USD",
): Product => ({
  id,
  title: `Mahsulot ${id}`,
  description: "",
  price,
  oldPrice: null,
  currency,
  categoryId: "c1",
  brand: "Brand",
  images: [],
  createdAt: new Date().toISOString(),
});

beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({ items: [] });
});

describe("savat: qo'shish", () => {
  it("mahsulot qo'shadi va true qaytaradi", () => {
    expect(useCartStore.getState().addItem(product("a", 100))).toBe(true);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("bir xil mahsulot qayta qo'shilsa miqdor oshadi, qator ko'paymaydi", () => {
    useCartStore.getState().addItem(product("a", 100), 2);
    useCartStore.getState().addItem(product("a", 100), 3);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });
});

describe("savat: valyuta", () => {
  // Haqiqiy xato: savat 100 USD va 100 EUR ni qo'shib 200 chiqarardi va
  // natijani birinchi mahsulot valyutasida ko'rsatardi
  it("boshqa valyutadagi mahsulotni qo'shmaydi", () => {
    useCartStore.getState().addItem(product("a", 100, "USD"));

    const added = useCartStore.getState().addItem(product("b", 100, "EUR"));

    expect(added).toBe(false);
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("bir xil valyutada bemalol qo'shiladi", () => {
    useCartStore.getState().addItem(product("a", 100, "EUR"));

    expect(useCartStore.getState().addItem(product("b", 50, "EUR"))).toBe(true);
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("bo'sh savat istalgan valyutani qabul qiladi", () => {
    expect(useCartStore.getState().addItem(product("a", 100, "UZS"))).toBe(true);
    expect(useCartStore.getState().getCurrency()).toBe("UZS");
  });

  it("savat bo'sh bo'lsa valyuta null", () => {
    expect(useCartStore.getState().getCurrency()).toBeNull();
  });
});

describe("savat: hisob-kitob", () => {
  it("jami narxni miqdorga ko'paytirib hisoblaydi", () => {
    useCartStore.getState().addItem(product("a", 100), 2);
    useCartStore.getState().addItem(product("b", 50), 3);

    expect(useCartStore.getState().getTotalPrice()).toBe(350);
  });

  it("jami miqdorni sanaydi", () => {
    useCartStore.getState().addItem(product("a", 100), 2);
    useCartStore.getState().addItem(product("b", 50), 3);

    expect(useCartStore.getState().getTotalItems()).toBe(5);
  });
});

describe("savat: o'zgartirish", () => {
  it("miqdor 0 ga tushsa mahsulot o'chadi", () => {
    useCartStore.getState().addItem(product("a", 100), 1);
    useCartStore.getState().decreaseQuantity("a");

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("mahsulotni o'chiradi", () => {
    useCartStore.getState().addItem(product("a", 100));
    useCartStore.getState().removeItem("a");

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("savatni tozalaydi", () => {
    useCartStore.getState().addItem(product("a", 100));
    useCartStore.getState().addItem(product("b", 50));
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("savatda borligini aniqlaydi", () => {
    useCartStore.getState().addItem(product("a", 100));

    expect(useCartStore.getState().isInCart("a")).toBe(true);
    expect(useCartStore.getState().isInCart("yoq")).toBe(false);
  });
});
