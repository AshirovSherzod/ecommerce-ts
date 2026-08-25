import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import { checkoutSchema, type CheckoutValues } from "@/schemas/checkout.schema";
import {
  isTelegramConfigured,
  sendTelegramMessages,
} from "@/services/telegramService";
import { useCartStore, useOrderHistoryStore, useOrderStore } from "@/store";
import type { Order } from "@/types/order.types";
import { STORE_CURRENCY } from "@/utils/constants";
import { formatPrice } from "@/utils/formatPrice";
import { buildOrderMessage, createOrderId } from "@/utils/orderMessage";
import {
  findShipping,
  shippingAppliesTo,
  SHIPPING_OPTIONS,
  type ShippingId,
} from "@/utils/shipping";

const STEP_KEYS = ["steps.cart", "steps.details", "steps.complete"];

function Steps({ current }: { current: number }) {
  const { t } = useTranslation("cart");

  return (
    <ol className="flex flex-wrap justify-center gap-4 sm:gap-10">
      {STEP_KEYS.map((step, index) => (
        <li
          key={step}
          className={`flex items-center gap-2 text-[14px] sm:text-base ${
            index === current ? "text-[#141718] font-medium" : "text-[#6C7275]"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${
              index === current
                ? "bg-[#141718] text-white"
                : "bg-[#F3F5F7] text-[#6C7275]"
            }`}
          >
            {index + 1}
          </span>
          {t(step)}
        </li>
      ))}
    </ol>
  );
}

// ─── Buyurtma qabul qilindi ────────────────────────────────────
function OrderComplete({ order }: { order: Order }) {
  const { t } = useTranslation("cart");
  const { t: tCommon } = useTranslation();
  const money = (value: number) => formatPrice(value, order.currency);

  return (
    <section className="max-w-310 mx-auto px-5 my-10 flex flex-col gap-10">
      <Seo title={t("complete.title")} noIndex />

      <div className="flex flex-col items-center gap-6">
        <h1 className="font-medium text-[28px] sm:text-[40px]">
          {t("complete.title")}
        </h1>
        <Steps current={2} />
      </div>

      <div className="max-w-125 w-full mx-auto flex flex-col gap-6 border border-[#E8ECEF] rounded-lg p-6">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-[#6C7275]">{t("complete.received")}</p>
          <p className="font-medium text-2xl">#{order.id}</p>
          <p className="text-[14px] text-[#6C7275]">
            {t("complete.callback", { phone: order.customer.phone })}
          </p>
        </div>

        <dl className="flex flex-col gap-2 pt-4 border-t border-[#E8ECEF] text-[14px]">
          <div className="flex justify-between">
            <dt className="text-[#6C7275]">{t("summary.subtotal")}</dt>
            <dd>{money(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#6C7275]">{t("summary.shipping")}</dt>
            <dd>
              {order.shipping.applies
                ? money(order.shipping.price)
                : t("summary.separateAgreed")}
            </dd>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E8ECEF]">
            <dt className="font-medium text-base">{t("summary.total")}</dt>
            <dd className="font-medium text-base">{money(order.total)}</dd>
          </div>
        </dl>

        <Link to="/shop">
          <Button className="w-full h-11">
            {tCommon("actions.continueShopping")}
          </Button>
        </Link>
      </div>
    </section>
  );
}

// ─── Sahifa ────────────────────────────────────
export default function Checkout() {
  const { t } = useTranslation("cart");
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const lastOrder = useOrderStore((state) => state.lastOrder);
  const setLastOrder = useOrderStore((state) => state.setLastOrder);
  const addOrder = useOrderHistoryStore((state) => state.addOrder);

  const initialShipping =
    (location.state as { shippingId?: ShippingId } | null)?.shippingId ??
    "free";
  const [shippingId, setShippingId] = useState<ShippingId>(initialShipping);

  /**
   * Buyurtma raqami bir marta yaratiladi va qayta urinishda ham
   * o'zgarmaydi. Agar birinchi urinish yarim yo'lda uzilib, mijoz qayta
   * yuborsa, do'kon ikkalasi bitta buyurtma ekanini raqamdan biladi.
   */
  const [orderId] = useState(createOrderId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "+998",
      address: "",
      email: "",
      note: "",
    },
  });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const currency = items[0]?.currency ?? STORE_CURRENCY;
  const shipping = findShipping(shippingId);
  const shippingApplies = shippingAppliesTo(currency);
  const total = subtotal + (shippingApplies ? shipping.price : 0);
  const money = (value: number) => formatPrice(value, currency);

  // Buyurtma berilgan bo'lsa tasdiq ekrani — savat bo'sh bo'lsa ham
  if (lastOrder) return <OrderComplete order={lastOrder} />;

  // Bo'sh savat bilan checkout ma'nosiz
  if (items.length === 0) {
    return (
      <section
        style={{ minHeight: "calc(100vh - 200px)" }}
        className="px-5 flex flex-col items-center justify-center gap-4 text-center"
      >
        <Seo title={t("checkout.title")} noIndex />
        <h1 className="font-medium text-2xl">{t("checkout.emptyTitle")}</h1>
        <p className="text-[#6C7275]">{t("checkout.emptyDesc")}</p>
        <Link to="/shop">
          <Button>{tCommon("actions.goToShop")}</Button>
        </Link>
      </section>
    );
  }

  const onSubmit = async (values: CheckoutValues) => {
    // Summalar yuborish paytidagi savatdan qayta hisoblanadi: mijoz
    // boshqa tabda savatni o'zgartirgan bo'lishi mumkin
    const currentItems = useCartStore.getState().items;

    if (currentItems.length === 0) {
      toast.error(t("checkout.cartEmptied"));
      navigate("/cart");
      return;
    }

    if (!isTelegramConfigured()) {
      toast.error(t("checkout.notConfigured"));
      return;
    }

    const freshCurrency = currentItems[0].currency;
    const freshSubtotal = currentItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const applies = shippingAppliesTo(freshCurrency);

    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: values.name,
        phone: values.phone,
        address: values.address,
        ...(values.email ? { email: values.email } : {}),
        ...(values.note ? { note: values.note } : {}),
      },
      items: currentItems.map((item) => ({
        title: item.title,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
      })),
      currency: freshCurrency,
      subtotal: freshSubtotal,
      shipping: {
        id: shipping.id,
        label: shipping.label,
        price: shipping.price,
        applies,
      },
      total: freshSubtotal + (applies ? shipping.price : 0),
    };

    try {
      await sendTelegramMessages(buildOrderMessage(order));
    } catch (error) {
      // Eng muhim qoida: yuborilmagan buyurtmada savat tozalanmaydi va
      // forma to'ldirilgan holicha qoladi — mijoz qayta urina oladi
      toast.error(
        error instanceof Error
          ? t("checkout.sendFailed", { reason: error.message })
          : t("checkout.sendFailedGeneric"),
      );
      return;
    }

    setLastOrder(order);
    // Tasdiq ekrani sessiyaga, tarix esa qurilmaga yoziladi
    addOrder(order);
    clearCart();
  };

  const fieldClass = (hasError: boolean) =>
    `w-full h-11 px-3 border rounded-md outline-none text-[14px] transition-colors ${
      hasError ? "border-[#FF5630]" : "border-[#E8ECEF] focus:border-[#141718]"
    }`;

  return (
    <section className="max-w-310 mx-auto px-5 my-10 flex flex-col gap-10">
      <Seo title={t("checkout.title")} noIndex />

      <div className="flex flex-col items-center gap-6">
        <p className="text-[14px] text-[#6C7275]">
          <Link className="hover:text-[#141718]" to="/cart">
            {t("title")}
          </Link>{" "}
          &gt;{" "}
          <span className="text-[#141718]">{t("checkout.breadcrumb")}</span>
        </p>
        <h1 className="font-medium text-[28px] sm:text-[40px]">
          {t("checkout.breadcrumb")}
        </h1>
        <Steps current={1} />
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* ─── Mijoz ma'lumotlari ─── */}
        <form
          id="checkout-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full lg:w-[60%] flex flex-col gap-5"
        >
          <h2 className="font-medium text-xl">{t("checkout.customerTitle")}</h2>

          <div className="flex flex-col gap-1">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="co-name"
            >
              {t("checkout.name")}
            </label>
            <input
              id="co-name"
              className={fieldClass(!!errors.name)}
              placeholder={t("checkout.namePlaceholder")}
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[12px] text-[#FF5630]">
                {tCommon(errors.name.message ?? "")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="co-phone"
            >
              {t("checkout.phone")}
            </label>
            <input
              id="co-phone"
              className={fieldClass(!!errors.phone)}
              placeholder="+998901234567"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-[12px] text-[#FF5630]">
                {tCommon(errors.phone.message ?? "")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="co-email"
            >
              {t("checkout.email")}
            </label>
            <input
              id="co-email"
              className={fieldClass(!!errors.email)}
              placeholder="sherzod@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-[12px] text-[#FF5630]">
                {tCommon(errors.email.message ?? "")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="co-address"
            >
              {t("checkout.address")}
            </label>
            <textarea
              id="co-address"
              className={`h-20 p-3 border rounded-md outline-none resize-none text-[14px] transition-colors ${
                errors.address
                  ? "border-[#FF5630]"
                  : "border-[#E8ECEF] focus:border-[#141718]"
              }`}
              placeholder={t("checkout.addressPlaceholder")}
              aria-invalid={!!errors.address}
              {...register("address")}
            />
            {errors.address && (
              <span className="text-[12px] text-[#FF5630]">
                {tCommon(errors.address.message ?? "")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="co-note"
            >
              {t("checkout.note")}
            </label>
            <textarea
              id="co-note"
              className={`h-20 p-3 border rounded-md outline-none resize-none text-[14px] transition-colors ${
                errors.note
                  ? "border-[#FF5630]"
                  : "border-[#E8ECEF] focus:border-[#141718]"
              }`}
              placeholder={t("checkout.notePlaceholder")}
              {...register("note")}
            />
            {errors.note && (
              <span className="text-[12px] text-[#FF5630]">
                {tCommon(errors.note.message ?? "")}
              </span>
            )}
          </div>

          {shippingApplies && (
            <div className="flex flex-col gap-3">
              <h2 className="font-medium text-xl">
                {t("checkout.shippingTitle")}
              </h2>
              {SHIPPING_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-md cursor-pointer border ${
                    shippingId === option.id
                      ? "border-[#141718] bg-[#F3F5F7]"
                      : "border-[#E8ECEF]"
                  }`}
                >
                  <span className="flex items-center gap-3 text-[14px]">
                    <input
                      className="accent-[#141718]"
                      type="radio"
                      name="checkout-shipping"
                      value={option.id}
                      checked={shippingId === option.id}
                      onChange={() => setShippingId(option.id)}
                    />
                    {t(option.key)}
                  </span>
                  <span className="text-[14px] font-medium">
                    {formatPrice(option.price, STORE_CURRENCY)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </form>

        {/* ─── Buyurtma xulosasi ─── */}
        <aside className="w-full lg:w-[40%] border border-[#6C7275] rounded-md p-6 flex flex-col gap-6">
          <h2 className="font-medium text-xl">{t("checkout.orderTitle")}</h2>

          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-4 text-[14px]"
              >
                <span className="min-w-0">
                  <span className="block truncate">{item.title}</span>
                  <span className="text-[#6C7275]">
                    {money(item.price)} x {item.quantity}
                  </span>
                </span>
                <span className="font-medium shrink-0">
                  {money(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 pt-4 border-t border-[#E8ECEF] text-[14px]">
            <div className="flex justify-between">
              <span className="text-[#6C7275]">{t("summary.subtotal")}</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6C7275]">{t("summary.shipping")}</span>
              <span>
                {shippingApplies
                  ? formatPrice(shipping.price, STORE_CURRENCY)
                  : t("summary.separate")}
              </span>
            </div>
            {!shippingApplies && (
              <p className="text-[12px] text-[#6C7275]">
                {t("summary.separateNote", {
                  store: STORE_CURRENCY,
                  cart: currency,
                })}
              </p>
            )}
            <div className="flex justify-between pt-2 border-t border-[#E8ECEF]">
              <span className="font-medium text-base">
                {t("summary.total")}
              </span>
              <span className="font-medium text-base">{money(total)}</span>
            </div>
          </div>

          <Button
            type="submit"
            form="checkout-form"
            isLoading={isSubmitting}
            className="w-full h-11"
          >
            {t("checkout.submit")}
          </Button>

          <p className="text-[12px] text-[#6C7275] text-center">
            {t("checkout.disclaimer")}
          </p>
        </aside>
      </div>
    </section>
  );
}
