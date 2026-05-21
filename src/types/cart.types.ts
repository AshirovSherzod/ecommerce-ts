import type { Product } from "@/types/products.types";

export interface CartItem extends Product {
  quantity: number;
  addedAt: number;
}

export interface CartState {
  items: CartItem[];

  addItem: (product: Product, quantity?: number) => void;

  removeItem: (productId: number | string) => void;

  increaseQuantity: (productId: number | string) => void;

  decreaseQuantity: (productId: number | string) => void;

  updateQuantity: (productId: number | string, quantity: number) => void;

  isInCart: (productId: number | string) => boolean;

  getItem: (productId: number | string) => CartItem | undefined;

  getTotalItems: () => number;

  getTotalPrice: () => number;

  clearCart: () => void;
}
