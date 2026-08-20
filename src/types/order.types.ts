import type { Currency } from "@/types/products.types";

export interface OrderItem {
  title: string;
  brand: string;
  price: number;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  email?: string;
  note?: string;
}

export interface OrderShipping {
  label: string;
  price: number;
  /**
   * Yetkazib berish narxi STORE_CURRENCY da belgilangan. Savat boshqa
   * valyutada bo'lsa narxni jamiga qo'shib bo'lmaydi — kurs manbai yo'q,
   * va do'kon buni buyurtmani qabul qilganda aniqlaydi.
   */
  applies: boolean;
}

export interface Order {
  /** Mijoz va do'kon bir xil raqamni ko'radi */
  id: string;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  currency: Currency;
  subtotal: number;
  shipping: OrderShipping;
  total: number;
}
