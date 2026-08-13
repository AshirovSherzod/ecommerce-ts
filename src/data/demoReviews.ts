import type { Review } from "@/types/review.types";

// ⚠️ DEMO — bu sharhlarni haqiqiy mijozlar yozmagan. API'da reviews
// endpoint bo'lmagani uchun sahifa bo'sh ko'rinmasin deb qo'yilgan.
// `USE_DEMO_REVIEWS` konstantasi orqali o'chiriladi.

const DAY = 24 * 60 * 60 * 1000;

const daysAgo = (days: number) =>
  new Date(Date.now() - days * DAY).toISOString();

const TEMPLATES = [
  {
    author: "Sofia Harvetz",
    rating: 5,
    text: "Sifati kutganimdan ham yaxshi chiqdi. Yetkazib berish tez bo'ldi, qadoqlash puxta. Tavsiya qilaman.",
    likes: 12,
  },
  {
    author: "Nicolas Jensen",
    rating: 5,
    text: "Bir necha hafta ishlatdim — hech qanday muammo yo'q. Narxiga nisbatan juda arziydi.",
    likes: 8,
  },
  {
    author: "Malika Rasulova",
    rating: 4,
    text: "Umuman olganda yaxshi, faqat rangi rasmdagidan bir oz to'qroq ekan. Qolgani joyida.",
    likes: 5,
  },
  {
    author: "Aziz Karimov",
    rating: 5,
    text: "Ikkinchi marta shu yerdan olyapman. Sifat barqaror, qo'llab-quvvatlash ham tez javob beradi.",
    likes: 3,
  },
  {
    author: "Emma Lindqvist",
    rating: 4,
    text: "Ko'rinishi zo'r va ishlatish qulay. Kichik kamchiligi — qo'llanma faqat ingliz tilida.",
    likes: 2,
  },
  {
    author: "Bekzod Tursunov",
    rating: 5,
    text: "Aynan tavsifdagidek. Buyurtmadan keyin ikki kunda yetib keldi, hammasi joyida.",
    likes: 1,
  },
];

// Har bir mahsulot uchun bir xil ro'yxat, lekin id'lar mahsulotga bog'langan
export const getDemoReviews = (productId: string): Review[] =>
  TEMPLATES.map((template, index) => ({
    id: `demo-${productId}-${index}`,
    productId,
    author: template.author,
    rating: template.rating,
    text: template.text,
    createdAt: daysAgo((index + 1) * 4),
    likes: template.likes,
    replies: [],
  }));
