export interface ReviewReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
  likes: number;
  replies: ReviewReply[];
}

// Forma to'ldirganda beriladigan maydonlar — qolganini store to'ldiradi
export type NewReview = Pick<
  Review,
  "productId" | "author" | "rating" | "text"
>;

export interface ReviewsState {
  items: Review[];
  likedIds: string[];
  // Oxirgi ishlatilgan ism: javob yozganda qayta so'ramaslik uchun
  authorName: string;

  addReview: (review: NewReview) => void;
  addReply: (reviewId: string, author: string, text: string) => void;
  toggleLike: (reviewId: string) => void;
  isLiked: (reviewId: string) => boolean;
}
