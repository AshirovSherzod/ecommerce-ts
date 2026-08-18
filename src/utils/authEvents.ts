/**
 * Sessiya tugaganini bildiruvchi hodisa.
 *
 * `axiosInstance` auth store'ni to'g'ridan-to'g'ri import qila olmaydi:
 * store servislarni, servislar esa axiosInstance'ni import qiladi —
 * aylanma bog'liqlik hosil bo'lardi. Shuning uchun 401 kelganda hodisa
 * yuboriladi, store esa unga obuna bo'ladi.
 */
export const AUTH_UNAUTHORIZED = "auth:unauthorized";

export const notifyUnauthorized = () => {
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED));
};
