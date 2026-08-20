import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Review, ReviewsState } from "@/types/review.types";

// API'da sharhlar uchun endpoint yo'q — savat va wishlist kabi
// brauzerda saqlaymiz. Backend tayyor bo'lganda shu store o'rniga
// oddiy service + react-query chaqiruvi qo'yiladi.
export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      items: [],
      likedIds: [],
      repliesByReview: {},
      authorName: "",

      addReview: ({ productId, author, rating, text }) => {
        const review: Review = {
          id: crypto.randomUUID(),
          productId,
          author,
          rating,
          text,
          createdAt: new Date().toISOString(),
          likes: 0,
          replies: [],
        };

        set((state) => ({
          items: [review, ...state.items],
          authorName: author,
        }));
      },

      addReply: (reviewId, author, text) => {
        const reply = {
          id: crypto.randomUUID(),
          author,
          text,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          authorName: author,
          repliesByReview: {
            ...state.repliesByReview,
            [reviewId]: [...(state.repliesByReview[reviewId] ?? []), reply],
          },
        }));
      },

      toggleLike: (reviewId) => {
        set((state) => ({
          likedIds: state.likedIds.includes(reviewId)
            ? state.likedIds.filter((id) => id !== reviewId)
            : [...state.likedIds, reviewId],
        }));
      },

      isLiked: (reviewId) => get().likedIds.includes(reviewId),
    }),
    {
      name: "reviews-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
