import articles1 from "@/assets/images/articles-1.png";
import articles2 from "@/assets/images/articles-2.png";
import articles3 from "@/assets/images/articles-3.png";

export interface Article {
  id: string;
  img: string;
  title: string;
  excerpt: string;
}

// Home va Blog sahifalari bir manbadan foydalanadi
export const ARTICLES: Article[] = [
  {
    id: "1",
    img: articles1,
    title: "7 ways to decor your home",
    excerpt:
      "Small changes with a big effect: light, textiles and a few well chosen pieces.",
  },
  {
    id: "2",
    img: articles2,
    title: "Kitchen organization",
    excerpt:
      "Keep the surfaces clear and everything you use daily within arm's reach.",
  },
  {
    id: "3",
    img: articles3,
    title: "Decor your bedroom",
    excerpt:
      "A calm palette, soft lighting and natural fabrics make the room restful.",
  },
];
