import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { useAuthStore, useOrderHistoryStore } from "@/store";
import type { Order } from "@/types/order.types";
import { formatPrice } from "@/utils/formatPrice";
import { STORE_CURRENCY } from "@/utils/constants";
import { findShipping } from "@/utils/shipping";

const CARD = "border border-[#E8ECEF] rounded-lg p-5 flex flex-col gap-4";

/** Sana foydalanuvchi tilida — oy nomi bilan, chunki "03.09" chalkashtiradi */
const formatDate = (iso: string, locale: string) => {
  const time = new Date(iso).getTime();

  if (Number.isNaN(time)) return "";

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(time);
};

// ─── Bitta buyurtma ────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const { t, i18n } = useTranslation("pages");
  const { t: tCart } = useTranslation("cart");

  const money = (value: number) => formatPrice(value, order.currency);
  const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Eski buyurtmalarda `id` yo'q — ular saqlangan nom bilan chiziladi
  const shippingName = order.shipping.id
    ? tCart(findShipping(order.shipping.id).key)
    : order.shipping.label;

  return (
    <details className={CARD}>
      {/* `details` — ochish/yopish uchun JS kerak emas va klaviatura bilan
          ham ishlaydi. Marker olib tashlanadi, o'rniga o'z belgimiz. */}
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="flex flex-col gap-0.5 min-w-0">
          <span className="font-semibold">
            {t("account.orderNumber")} #{order.id}
          </span>
          <span className="text-[14px] text-[#6C7275]">
            {formatDate(order.createdAt, i18n.language)}
          </span>
        </span>

        <span className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="font-semibold">{money(order.total)}</span>
          <span className="text-[14px] text-[#6C7275]">
            {t("account.itemCount", { count })}
          </span>
        </span>
      </summary>

      <ul className="flex flex-col gap-2 pt-4 border-t border-[#E8ECEF] text-[14px]">
        {order.items.map((item, index) => (
          <li
            key={`${order.id}-${index}`}
            className="flex justify-between gap-4"
          >
            <span className="min-w-0">
              <span className="block truncate">{item.title}</span>
              <span className="text-[#6C7275]">
                {money(item.price)} &times; {item.quantity}
              </span>
            </span>
            <span className="font-medium shrink-0">
              {money(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="flex flex-col gap-2 pt-3 border-t border-[#E8ECEF] text-[14px]">
        <div className="flex justify-between">
          <dt className="text-[#6C7275]">{shippingName}</dt>
          <dd>
            {order.shipping.applies
              ? formatPrice(order.shipping.price, STORE_CURRENCY)
              : t("account.shippingSeparate")}
          </dd>
        </div>
        {/* Mobilda manzil telefon bilan bitta qatorga sig'maydi */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
          <dt className="text-[#6C7275] shrink-0">{order.customer.phone}</dt>
          <dd className="text-[#6C7275] sm:text-right">
            {order.customer.address}
          </dd>
        </div>
      </dl>
    </details>
  );
}

// ─── Sahifa ────────────────────────────────────
export default function Account() {
  const { t } = useTranslation("pages");
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signOut = useAuthStore((state) => state.signOut);

  const orders = useOrderHistoryStore((state) => state.orders);
  const clearOrders = useOrderHistoryStore((state) => state.clearOrders);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const handleClear = () => {
    // Tarixni tiklab bo'lmaydi — tasdiqsiz o'chirish qo'pol bo'lardi
    if (!window.confirm(t("account.clearConfirm"))) return;

    clearOrders();
    toast.success(t("account.cleared"));
  };

  return (
    <section
      style={{ minHeight: "calc(100vh - 200px)" }}
      className="max-w-250 mx-auto px-5 my-10 flex flex-col gap-8"
    >
      {/* Shaxsiy sahifa — qidiruv indeksiga tushmasligi kerak */}
      <Seo
        title={t("account.title")}
        description={t("account.description")}
        noIndex
      />

      <h1 className="font-medium text-[28px] sm:text-[40px]">
        {t("account.title")}
      </h1>

      {/* ─── Profil ─── */}
      {isAuthenticated && user ? (
        <div className={CARD}>
          <h2 className="font-medium text-xl">{t("account.profile")}</h2>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[14px]">
            <div className="flex flex-col gap-0.5 min-w-0">
              <dt className="text-[#6C7275]">{t("account.username")}</dt>
              <dd className="font-medium truncate">{user.username}</dd>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <dt className="text-[#6C7275]">{t("account.email")}</dt>
              <dd className="font-medium truncate">{user.email}</dd>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <dt className="text-[#6C7275]">{t("account.phone")}</dt>
              <dd className="font-medium truncate">
                {user.phone || (
                  <span className="font-normal text-[#6C7275]">
                    {t("account.phoneEmpty")}
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <Button
            variant="secondary"
            onClick={handleSignOut}
            className="w-full sm:w-40"
          >
            {t("account.signOut")}
          </Button>
        </div>
      ) : (
        // Buyurtma berish uchun kirish shart emas, shuning uchun mehmon ham
        // shu sahifaga tushadi — uni quvib yubormaymiz, taklif qilamiz
        <div className={CARD}>
          <h2 className="font-medium text-xl">{t("account.guestTitle")}</h2>
          <p className="text-[14px] text-[#6C7275]">{t("account.guestDesc")}</p>
          <Link to="/signin" className="w-full sm:w-40">
            <Button className="w-full">{t("account.signIn")}</Button>
          </Link>
        </div>
      )}

      {/* ─── Buyurtmalar ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium text-xl">{t("account.orders")}</h2>
          {orders.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[14px] text-[#6C7275] hover:text-[#141718] border-b transition-colors"
            >
              {t("account.clear")}
            </button>
          )}
        </div>

        {/* Tarix qurilmaga bog'langan — buni yashirish mijozni chalg'itadi */}
        <p className="text-[13px] text-[#6C7275] max-w-2xl">
          {t("account.ordersDeviceNote")}
        </p>

        {orders.length === 0 ? (
          <div className={CARD}>
            <h3 className="font-medium">{t("account.ordersEmptyTitle")}</h3>
            <p className="text-[14px] text-[#6C7275]">
              {t("account.ordersEmptyDesc")}
            </p>
            <Link to="/shop" className="w-full sm:w-40">
              <Button className="w-full">{tCommon("actions.goToShop")}</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
