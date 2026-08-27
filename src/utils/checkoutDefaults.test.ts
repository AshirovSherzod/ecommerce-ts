import { describe, expect, it } from "vitest";
import { checkoutDefaults, DEFAULT_PHONE } from "@/utils/checkoutDefaults";
import type { User } from "@/types/auth.types";
import type { Order } from "@/types/order.types";

const user: User = {
  id: "u1",
  email: "sherzod@example.com",
  username: "sherzod",
  firstname: "Sherzod",
  name: "Sherzod Ashirov",
  phone: "+998901112233",
};

const order = (customer: Partial<Order["customer"]>): Order => ({
  id: "3L-1",
  createdAt: "2026-08-25T10:00:00.000Z",
  customer: {
    name: "Eski Ism",
    phone: "+998907776655",
    address: "Toshkent, Yunusobod, 5-uy",
    ...customer,
  },
  items: [],
  currency: "USD",
  subtotal: 0,
  shipping: { id: "free", label: "Free shipping", price: 0, applies: true },
  total: 0,
});

describe("checkout boshlang'ich qiymatlari", () => {
  it("mehmonda va tarixsiz bo'sh bo'ladi", () => {
    expect(checkoutDefaults(null, null)).toEqual({
      name: "",
      phone: DEFAULT_PHONE,
      email: "",
      address: "",
      note: "",
    });
  });

  it("profildan ism, telefon va emailni oladi", () => {
    const values = checkoutDefaults(user, null);

    expect(values.name).toBe("Sherzod Ashirov");
    expect(values.phone).toBe("+998901112233");
    expect(values.email).toBe("sherzod@example.com");
  });

  it("to'liq ism bo'lmasa firstname ishlatiladi", () => {
    const values = checkoutDefaults({ ...user, name: undefined }, null);

    expect(values.name).toBe("Sherzod");
  });

  it("manzil oxirgi buyurtmadan olinadi", () => {
    const values = checkoutDefaults(user, order({}));

    expect(values.address).toBe("Toshkent, Yunusobod, 5-uy");
  });

  it("profil oxirgi buyurtmadan ustun turadi", () => {
    // Mijoz profilini yangilagan bo'lishi mumkin — eski buyurtmadagi
    // ma'lumot yangisini bosib ketmasligi kerak
    const values = checkoutDefaults(user, order({}));

    expect(values.name).toBe("Sherzod Ashirov");
    expect(values.phone).toBe("+998901112233");
  });

  it("mehmon uchun ism va telefon oxirgi buyurtmadan olinadi", () => {
    const values = checkoutDefaults(null, order({}));

    expect(values.name).toBe("Eski Ism");
    expect(values.phone).toBe("+998907776655");
    expect(values.address).toBe("Toshkent, Yunusobod, 5-uy");
  });

  it("profilda telefon bo'lmasa buyurtmadagisi ishlatiladi", () => {
    const values = checkoutDefaults({ ...user, phone: undefined }, order({}));

    expect(values.phone).toBe("+998907776655");
  });

  it("hech qayerda telefon bo'lmasa mamlakat kodi qoladi", () => {
    const values = checkoutDefaults(
      { ...user, phone: undefined },
      order({ phone: "" }),
    );

    expect(values.phone).toBe(DEFAULT_PHONE);
  });

  it("izoh hech qachon ko'chirilmaydi", () => {
    // "Eshik oldiga qoldiring" keyingi buyurtmaga tegishli emas
    const values = checkoutDefaults(user, order({ note: "Eshik oldiga" }));

    expect(values.note).toBe("");
  });
});
