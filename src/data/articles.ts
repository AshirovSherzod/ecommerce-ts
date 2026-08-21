import articles1 from "@/assets/images/articles-1.png";
import articles2 from "@/assets/images/articles-2.png";
import articles3 from "@/assets/images/articles-3.png";

export interface Article {
  id: string;
  img: string;
}

/**
 * Home va Blog sahifalari bir manbadan foydalanadi.
 *
 * Sarlavha va qisqacha matn bu yerda emas — ular `pages:articles.<id>`
 * kalitlari orqali tarjimadan olinadi, aks holda til almashganda uch dona
 * kartochka boshqa tilda qolib ketardi.
 */
export const ARTICLES: Article[] = [
  { id: "1", img: articles1 },
  { id: "2", img: articles2 },
  { id: "3", img: articles3 },
];
