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

        // Savat bitta valyutada bo'lishi shart. Kurs oladigan manba yo'q,
        // ya'ni 100 USD va 100 EUR ni qo'shib bo'lmaydi — jimgina noto'g'ri
        // jami ko'rsatishdan ko'ra qo'shishni rad etgan xavfsizroq.
        const cartCurrency = items[0]?.currency;

        if (cartCurrency && cartCurrency !== product.currency) {
          return false;
        }

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

        return true;
      },

      getCurrency: () => get().items[0]?.currency ?? null,

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
      // Savat bitta valyutada ekani `addItem` da kafolatlangani uchun
      // shunchaki qo'shib chiqish to'g'ri natija beradi
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
