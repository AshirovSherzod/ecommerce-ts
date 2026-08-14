import type { Currency, Product } from "@/types/products.types";

export interface CartItem extends Product {
  quantity: number;
  addedAt: number;
}

export interface CartState {
  items: CartItem[];

  // Savatdagi valyuta bilan mos kelmasa `false` qaytaradi — chaqiruvchi
  // joy foydalanuvchiga sababini tushuntirishi kerak
  addItem: (product: Product, quantity?: number) => boolean;

  // Savatdagi mahsulotlar valyutasi (savat bo'sh bo'lsa null)
  getCurrency: () => Currency | null;

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
