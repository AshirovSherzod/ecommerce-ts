import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartState } from "@/types/cart.types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Mahsulot qo'shish
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          const newItem: CartItem = {
            ...product,
            quantity,
            addedAt: Date.now(),
          };
          set({ items: [...items, newItem] });
        }
      },

      // Mahsulot o'chirish
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      // Quantity'ni oshirish
      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }));
      },

      // Quantity'ni kamaytirish
      decreaseQuantity: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0), // 0 bo'lsa o'chiramiz
        }));
      },

      // Quantity'ni o'zgartirish
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      // Cart'da bormi tekshirish
      isInCart: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      // Item'ni olish
      getItem: (productId) => {
        return get().items.find((item) => item.id === productId);
      },

      // Jami mahsulotlar soni (quantity bilan)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Jami narx
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      // Barcha mahsulotlarni o'chirish
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
