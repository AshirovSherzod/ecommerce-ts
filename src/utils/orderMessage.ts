import { TELEGRAM_MESSAGE_LIMIT } from "@/services/telegramService";
import type { Order } from "@/types/order.types";
import { formatPrice } from "@/utils/formatPrice";

const formatDate = (iso: string) => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  const pad = (value: number) => String(value).padStart(2, "0");

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

/** Buyurtma raqami: mijoz va do'kon bir xil qatorni ko'radi */
export const createOrderId = (now = new Date()) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  const date = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(
    now.getDate(),
  )}`;
  const random = Math.floor(1000 + Math.random() * 9000);

  return `3L-${date}-${random}`;
};

/**
 * Uzun matnni Telegram chegarasiga sig'adigan qismlarga bo'ladi.
 * Qatorlar buzilmaydi — buyurtma o'rtasidan kesilgan satr o'qib
 * bo'lmaydigan xabar beradi.
 */
export const splitIntoParts = (
  lines: string[],
  limit = TELEGRAM_MESSAGE_LIMIT,
): string[] => {
  const parts: string[] = [];
  let current: string[] = [];

  const flush = () => {
    if (current.length > 0) {
      parts.push(current.join("\n"));
      current = [];
    }
  };

  for (const line of lines) {
    // Bitta qatorning o'zi chegaradan uzun bo'lsa — majburan kesamiz,
    // aks holda u hech qachon sig'maydi va sikl to'xtamaydi
    if (line.length > limit) {
      flush();

      for (let i = 0; i < line.length; i += limit) {
        parts.push(line.slice(i, i + limit));
      }

      continue;
    }

    const candidate = [...current, line].join("\n");

    if (candidate.length > limit) {
      flush();
    }

    current.push(line);
  }

  flush();

  return parts;
};

/**
 * Buyurtmani do'kon o'qiy oladigan matnga aylantiradi.
 *
 * Savat uzun bo'lsa xabar bir nechta qismga bo'linadi. Mijoz ma'lumoti va
 * umumiy summa ataylab birinchi qismda: agar keyingi qism yetib bormasa
 * ham do'konda buyurtmani bajarish uchun yetarli ma'lumot qoladi.
 */
export const buildOrderMessage = (order: Order): string[] => {
  const { customer, currency } = order;
  const money = (value: number) => formatPrice(value, currency);

  const head = [
    `YANGI BUYURTMA  #${order.id}`,
    `Sana: ${formatDate(order.createdAt)}`,
    "",
    "MIJOZ",
    `Ism: ${customer.name}`,
    `Telefon: ${customer.phone}`,
    ...(customer.email ? [`Email: ${customer.email}`] : []),
    `Manzil: ${customer.address}`,
    ...(customer.note ? [`Izoh: ${customer.note}`] : []),
    "",
    "YETKAZIB BERISH",
    order.shipping.applies
      ? `${order.shipping.label} — ${money(order.shipping.price)}`
      : `${order.shipping.label} — narx alohida kelishiladi (savat ${currency} da)`,
    "",
    "HISOB",
    `Mahsulotlar (${order.items.length} ta): ${money(order.subtotal)}`,
    order.shipping.applies
      ? `Yetkazib berish: ${money(order.shipping.price)}`
      : "Yetkazib berish: alohida",
    `UMUMIY: ${money(order.total)}`,
  ];

  const itemLines = order.items.flatMap((item, index) => [
    `${index + 1}. ${item.title}${item.brand ? ` (${item.brand})` : ""}`,
    `   ${money(item.price)} x ${item.quantity} = ${money(item.price * item.quantity)}`,
  ]);

  const all = [...head, "", "MAHSULOTLAR", ...itemLines];
  const single = all.join("\n");

  if (single.length <= TELEGRAM_MESSAGE_LIMIT) return [single];

  // Sig'masa: birinchi qism — mijoz va hisob, keyingilari — mahsulotlar
  const parts = [
    head.join("\n"),
    ...splitIntoParts(["MAHSULOTLAR", ...itemLines]),
  ];

  return parts.map((part, index) =>
    `#${order.id} (${index + 1}/${parts.length})\n${part}`,
  );
};
