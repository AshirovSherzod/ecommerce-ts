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
