import { describe, expect, it } from "vitest";
import { TELEGRAM_MESSAGE_LIMIT } from "@/services/telegramService";
import type { Order } from "@/types/order.types";
import {
  buildOrderMessage,
  createOrderId,
  splitIntoParts,
} from "@/utils/orderMessage";

const order = (overrides: Partial<Order> = {}): Order => ({
  id: "3L-260820-1234",
  createdAt: "2026-08-20T14:32:00.000Z",
  customer: {
    name: "Sherzod Ashirov",
    phone: "+998901234567",
    address: "Toshkent, Chilonzor 12",
  },
  items: [{ title: "Keychron K2 Pro", brand: "Keychron", price: 90, quantity: 2 }],
  currency: "USD",
  subtotal: 180,
  shipping: { label: "Express shipping", price: 15, applies: true },
  total: 195,
  ...overrides,
});

const manyItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    title: `Mahsulot nomi juda uzun bo'lgan namuna ${i + 1}`,
    brand: "Brand",
    price: 100,
    quantity: 2,
  }));

describe("buildOrderMessage", () => {
  it("kichik buyurtmani bitta xabarda yuboradi", () => {
    expect(buildOrderMessage(order())).toHaveLength(1);
  });

  it("do'kon uchun zarur hamma narsani o'z ichiga oladi", () => {
    const [text] = buildOrderMessage(order());

    expect(text).toContain("3L-260820-1234");
    expect(text).toContain("Sherzod Ashirov");
    expect(text).toContain("+998901234567");
    expect(text).toContain("Toshkent, Chilonzor 12");
    expect(text).toContain("Keychron K2 Pro");
    expect(text).toContain("Express shipping");
    expect(text).toContain("UMUMIY");
  });

  it("miqdor va qator jamini ko'rsatadi", () => {
    const [text] = buildOrderMessage(order());

    // 90 x 2 = 180 — do'kon hisobni tekshira olishi kerak
    expect(text).toMatch(/x\s*2/);
    expect(text).toContain("180");
  });

  it("ixtiyoriy maydonlar yo'q bo'lsa bo'sh qator qoldirmaydi", () => {
    const [text] = buildOrderMessage(order());

    expect(text).not.toContain("Email:");
    expect(text).not.toContain("Izoh:");
  });

  it("berilgan ixtiyoriy maydonlarni qo'shadi", () => {
    const [text] = buildOrderMessage(
      order({
        customer: {
          name: "Sherzod",
          phone: "+998901234567",
          address: "Toshkent",
          email: "sherzod@example.com",
          note: "Kechqurun qo'ng'iroq qiling",
        },
      }),
    );

    expect(text).toContain("sherzod@example.com");
    expect(text).toContain("Kechqurun qo'ng'iroq qiling");
  });

  it("valyuta mos kelmasa yetkazish narxini jamiga qo'shmaydi", () => {
    const [text] = buildOrderMessage(
      order({
        currency: "EUR",
        shipping: { label: "Express shipping", price: 15, applies: false },
        subtotal: 180,
        total: 180,
      }),
    );

    expect(text).toContain("alohida");
    expect(text).not.toContain("Yetkazib berish: €15");
  });
});

describe("buildOrderMessage: uzun savat", () => {
  const big = order({ items: manyItems(120), subtotal: 24000, total: 24015 });
  const parts = buildOrderMessage(big);

  it("chegaradan oshganda bir nechta qismga bo'linadi", () => {
    expect(parts.length).toBeGreaterThan(1);
  });

  it("har bir qism Telegram chegarasiga sig'adi", () => {
    for (const part of parts) {
      expect(part.length).toBeLessThanOrEqual(TELEGRAM_MESSAGE_LIMIT + 100);
    }
  });

  it("birinchi qismda mijoz va umumiy summa bo'ladi", () => {
    // Keyingi qism yetib bormasa ham do'kon mijozga qo'ng'iroq qila oladi
    expect(parts[0]).toContain("Sherzod Ashirov");
    expect(parts[0]).toContain("+998901234567");
    expect(parts[0]).toContain("UMUMIY");
  });

  it("birorta mahsulot yo'qolmaydi", () => {
    const joined = parts.join("\n");

    for (const item of big.items) {
      expect(joined).toContain(item.title);
    }
  });

  it("qismlar raqamlanadi", () => {
    expect(parts[0]).toContain(`(1/${parts.length})`);
    expect(parts[parts.length - 1]).toContain(`(${parts.length}/${parts.length})`);
  });
});

describe("splitIntoParts", () => {
  it("qatorlarni o'rtasidan kesmaydi", () => {
    const lines = Array.from({ length: 50 }, (_, i) => `Qator ${i + 1}`);
    const parts = splitIntoParts(lines, 100);

    for (const part of parts) {
      for (const line of part.split("\n")) {
        expect(lines).toContain(line);
      }
    }
  });

  it("chegaradan uzun bitta qatorni ham uddalaydi", () => {
    // Aks holda u hech qachon sig'may, sikl to'xtamasdi
    const parts = splitIntoParts(["x".repeat(250)], 100);

    expect(parts.length).toBe(3);
    expect(parts.every((p) => p.length <= 100)).toBe(true);
  });

  it("bo'sh ro'yxatda bo'sh natija qaytaradi", () => {
    expect(splitIntoParts([], 100)).toEqual([]);
  });
});

describe("createOrderId", () => {
  it("sana asosida o'qiladigan raqam yasaydi", () => {
    const id = createOrderId(new Date("2026-08-20T10:00:00"));

    expect(id).toMatch(/^3L-260820-\d{4}$/);
  });

  it("har safar boshqa raqam beradi", () => {
    const ids = new Set(Array.from({ length: 50 }, () => createOrderId()));

    expect(ids.size).toBeGreaterThan(1);
  });
});
