import type { WishlistItem, WishlistState } from "@/types/wishlist.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;

        const exists = items.find((item) => item.id === product.id);

        if (exists) {
          return;
        }

        const newItem: WishlistItem = {
          ...product,
          addedAt: Date.now(),
        };

        set({ items: [...items, newItem] });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      getCount: () => {
        return get().items.length;
      },

      clearAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
