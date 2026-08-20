import { useMemo } from "react";
import { useReviewsStore } from "@/store";
import { getDemoReviews } from "@/data/demoReviews";
import { USE_DEMO_REVIEWS } from "@/utils/constants";

// Foydalanuvchi yozgan sharhlar (localStorage) + demo sharhlar birga.
// Backend qo'shilganda shu hook ichidagi manba almashtiriladi, uni
// ishlatadigan komponentlarga tegilmaydi.
export const useProductReviews = (productId: string) => {
  const items = useReviewsStore((state) => state.items);
  const repliesByReview = useReviewsStore((state) => state.repliesByReview);

  return useMemo(() => {
    const own = items.filter((review) => review.productId === productId);
    const demo = USE_DEMO_REVIEWS ? getDemoReviews(productId) : [];

    // Javoblar alohida xaritadan biriktiriladi — shunda demo va API'dan
    // kelgan sharhlarga ham javob yozish mumkin.
    // `review.replies` eski ma'lumot uchun: avval javoblar sharh ichida
    // saqlanardi, ular yo'qolib qolmasin.
    const list = [...own, ...demo].map((review) => ({
      ...review,
      replies: [...(review.replies ?? []), ...(repliesByReview[review.id] ?? [])],
    }));

    const count = list.length;
    const average = count
      ? list.reduce((total, review) => total + review.rating, 0) / count
      : 0;

    return { list, count, average };
  }, [items, repliesByReview, productId]);
};
