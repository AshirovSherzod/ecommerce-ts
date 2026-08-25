import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Order } from "@/types/order.types";

interface OrderState {
  /** Oxirgi muvaffaqiyatli buyurtma — tasdiq sahifasi shundan chiziladi */
  lastOrder: Order | null;
  setLastOrder: (order: Order) => void;
  clearLastOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),
      clearLastOrder: () => set({ lastOrder: null }),
    }),
    {
      name: "order-storage",
      // sessionStorage: tasdiq sahifasi sahifa yangilansa ham ochiladi,
      // lekin eski buyurtma keyingi tashrifda chiqib qolmaydi
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

/**
 * Buyurtmalar tarixi uchun chegara. Cheklanmagan ro'yxat localStorage
 * kvotasini yeb qo'yishi mumkin, va u to'lganda `persist` jimgina
 * saqlashni to'xtatadi — ya'ni yangi buyurtmalar bilinmasdan yo'qolardi.
 */
const HISTORY_LIMIT = 50;

interface OrderHistoryState {
  /** Eng yangisi birinchi */
  orders: Order[];
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

/**
 * Buyurtmalar tarixi.
 *
 * `useOrderStore` dan alohida, chunki umri boshqacha: tasdiq ekrani faqat
 * shu tashrif uchun (sessionStorage), tarix esa qurilmada qoladi
 * (localStorage). Bitta `persist` ikki xil omborga yoza olmaydi.
 *
 * API'da buyurtmalar uchun endpoint yo'q, shuning uchun tarix qurilmaga
 * bog'langan — boshqa telefonda ochilsa bo'sh ko'rinadi. Sahifada bu
 * ochiq aytiladi, aks holda mijoz buyurtmasi yo'qolgan deb o'ylaydi.
 */
export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          // Buyurtma raqami qayta urinishda ham o'zgarmaydi, shuning uchun
          // bir xil raqamli yozuv ikki marta tushib qolmasin
          orders: [
            order,
            ...state.orders.filter((item) => item.id !== order.id),
          ].slice(0, HISTORY_LIMIT),
        })),

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "order-history-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
