import type { Product } from "@/types/products.types";

export interface WishlistItem extends Product {
  addedAt: number;
}

export interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number | string) => void;
  isInWishlist: (productId: number | string) => boolean;
  getCount: () => number;
  clearAll: () => void;
}
