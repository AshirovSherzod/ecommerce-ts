import { useMemo } from "react";
import { useReviewsStore } from "@/store";
import { getDemoReviews } from "@/data/demoReviews";
import { USE_DEMO_REVIEWS } from "@/utils/constants";

// Foydalanuvchi yozgan sharhlar (localStorage) + demo sharhlar birga.
// Backend qo'shilganda shu hook ichidagi manba almashtiriladi, uni
// ishlatadigan komponentlarga tegilmaydi.
export const useProductReviews = (productId: string) => {
  const items = useReviewsStore((state) => state.items);

  return useMemo(() => {
    const own = items.filter((review) => review.productId === productId);
    const demo = USE_DEMO_REVIEWS ? getDemoReviews(productId) : [];
    const list = [...own, ...demo];

    const count = list.length;
    const average = count
      ? list.reduce((total, review) => total + review.rating, 0) / count
      : 0;

    return { list, count, average };
  }, [items, productId]);
};
