// Xatolarni bir joydan o'tkazamiz — monitoring xizmati ulanganda
// faqat shu funksiyani o'zgartirish kifoya qiladi.
export const logError = (error: Error, componentStack?: string | null) => {
  // Konsolga production'da ham yozamiz. Monitoring hali ulanmagan, va
  // jimgina yutib yuborilgan xato — umuman ko'rinmaydigan xato: foydalanuvchi
  // shikoyat qilganda ham sababni topib bo'lmaydi. Ko'pchilik monitoring
  // vositalari konsol yozuvlarini "breadcrumb" sifatida yig'adi.
  console.error("[ErrorBoundary]", error, componentStack);

  // TODO(monitoring): shu yerga Sentry yoki shunga o'xshash xizmat ulanadi
  // Sentry.captureException(error, { extra: { componentStack } });
};
