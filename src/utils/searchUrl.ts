/**
 * Qidiruv so'zini `/shop` sahifasining manziliga aylantiradi.
 * Bo'sh so'z bilan `?q=` yozilmaydi — toza manzil qoladi.
 */
export const searchUrl = (term: string) =>
  term ? `/shop?q=${encodeURIComponent(term)}` : "/shop";
