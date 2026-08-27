import type { CheckoutValues } from "@/schemas/checkout.schema";
import type { User } from "@/types/auth.types";
import type { Order } from "@/types/order.types";

/** Bo'sh maydonda ham mamlakat kodi turadi — mijoz uni yozib o'tirmasin */
export const DEFAULT_PHONE = "+998";

/**
 * Checkout formasining boshlang'ich qiymatlari.
 *
 * Ikki manba bor va ular har xil savolga javob beradi:
 *
 *   profil       — mijoz kim (ism, telefon, email)
 *   oxirgi buyurtma — qayerga yetkazish kerak (manzil)
 *
 * Profil ustun turadi: u mijozning o'zi kiritgan va yangilay oladigan
 * ma'lumot. Manzil esa faqat buyurtmalarda bor — API'da bunday maydon
 * yo'q, shuning uchun uni oxirgi buyurtmadan olamiz.
 *
 * `note` ataylab ko'chirilmaydi: u bitta yetkazishga tegishli
 * ("eshik oldiga qoldiring"), keyingi buyurtmaga o'tkazilsa noto'g'ri
 * ko'rsatma bo'lib qolardi.
 */
export const checkoutDefaults = (
  user: User | null,
  lastOrder: Order | null,
): CheckoutValues => {
  const previous = lastOrder?.customer;

  return {
    name: user?.name || user?.firstname || previous?.name || "",
    phone: user?.phone || previous?.phone || DEFAULT_PHONE,
    email: user?.email || previous?.email || "",
    address: previous?.address || "",
    note: "",
  };
};
