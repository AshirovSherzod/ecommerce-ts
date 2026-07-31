import type { Currency } from "@/types/products.types";

const LOCALES: Record<Currency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  UZS: "uz-UZ",
};

export function formatPrice(value: number, currency: Currency = "USD") {
  const locale = LOCALES[currency] ?? "en-US";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "UZS" ? 0 : 2,
    }).format(value);
  } catch {
    // Noma'lum valyuta kelib qolsa ham sahifa qulamasin
    return `${value} ${currency}`;
  }
}
