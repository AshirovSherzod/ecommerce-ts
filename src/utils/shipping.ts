import type { Currency } from "@/types/products.types";
import { STORE_CURRENCY } from "@/utils/constants";

/**
 * `label` do'kon operatoriga ketadigan buyurtma xabarida ishlatiladi va
 * interfeys tilidan qat'i nazar o'zgarmaydi; `key` esa UI tarjimasi uchun.
 * Narxlar STORE_CURRENCY da. Ro'yxat Cart va Checkout uchun bitta joyda —
 * ikki nusxa bo'lsa ular vaqt o'tib bir-biridan farq qilib qolishi va
 * mijoz savatda bir narx, buyurtmada boshqasini ko'rishi mumkin edi.
 */
export const SHIPPING_OPTIONS = [
  { id: "free", key: "shipping.free", label: "Free shipping", price: 0 },
  {
    id: "express",
    key: "shipping.express",
    label: "Express shipping",
    price: 15,
  },
  { id: "pickup", key: "shipping.pickup", label: "Pick Up", price: 21 },
] as const;

export type ShippingId = (typeof SHIPPING_OPTIONS)[number]["id"];

export const findShipping = (id: ShippingId) =>
  SHIPPING_OPTIONS.find((option) => option.id === id) ?? SHIPPING_OPTIONS[0];

/**
 * Yetkazib berish narxini savat jamiga qo'shish mumkinmi.
 * Kurs manbai yo'q, shuning uchun savat boshqa valyutada bo'lsa narx
 * buyurtma qabul qilinganda alohida kelishiladi.
 */
export const shippingAppliesTo = (currency: Currency) =>
  currency === STORE_CURRENCY;
