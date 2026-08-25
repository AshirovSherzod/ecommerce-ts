import { beforeEach, describe, expect, it } from "vitest";
import { useOrderHistoryStore } from "@/store/order.store";
import type { Order } from "@/types/order.types";

const makeOrder = (id: string, overrides: Partial<Order> = {}): Order => ({
  id,
  createdAt: new Date().toISOString(),
  customer: {
    name: "Sinov Foydalanuvchi",
    phone: "+998901234567",
    address: "Toshkent, Chilonzor",
  },
  items: [{ title: "Stul", brand: "3legant", price: 100, quantity: 1 }],
  currency: "USD",
  subtotal: 100,
  shipping: { label: "Free shipping", price: 0, applies: true },
  total: 100,
  ...overrides,
});

beforeEach(() => {
  useOrderHistoryStore.setState({ orders: [] });
});

describe("buyurtmalar tarixi", () => {
  it("yangi buyurtma boshiga qo'shiladi", () => {
    const { addOrder } = useOrderHistoryStore.getState();

    addOrder(makeOrder("A-1"));
    addOrder(makeOrder("A-2"));

    expect(useOrderHistoryStore.getState().orders.map((o) => o.id)).toEqual([
      "A-2",
      "A-1",
    ]);
  });

  it("bir xil raqamli buyurtma ikki marta tushmaydi", () => {
    const { addOrder } = useOrderHistoryStore.getState();

    // Yuborish uzilib qayta urinilganda buyurtma raqami o'zgarmaydi
    addOrder(makeOrder("A-1", { total: 100 }));
    addOrder(makeOrder("A-1", { total: 250 }));

    const { orders } = useOrderHistoryStore.getState();

    expect(orders).toHaveLength(1);
    // Oxirgi holat saqlanadi
    expect(orders[0].total).toBe(250);
  });

  it("takrorlangan buyurtma boshiga ko'chadi", () => {
    const { addOrder } = useOrderHistoryStore.getState();

    addOrder(makeOrder("A-1"));
    addOrder(makeOrder("A-2"));
    addOrder(makeOrder("A-1"));

    expect(useOrderHistoryStore.getState().orders.map((o) => o.id)).toEqual([
      "A-1",
      "A-2",
    ]);
  });

  it("ro'yxat 50 tadan oshmaydi", () => {
    const { addOrder } = useOrderHistoryStore.getState();

    for (let i = 0; i < 60; i++) addOrder(makeOrder(`A-${i}`));

    const { orders } = useOrderHistoryStore.getState();

    expect(orders).toHaveLength(50);
    // Eng yangisi qoladi, eng eskisi tushib qoladi
    expect(orders[0].id).toBe("A-59");
    expect(orders.at(-1)?.id).toBe("A-10");
  });

  it("tozalash butun ro'yxatni o'chiradi", () => {
    const { addOrder, clearOrders } = useOrderHistoryStore.getState();

    addOrder(makeOrder("A-1"));
    clearOrders();

    expect(useOrderHistoryStore.getState().orders).toEqual([]);
  });
});
