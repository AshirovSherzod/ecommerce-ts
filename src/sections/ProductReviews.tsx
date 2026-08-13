import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import RatingInput from "@/components/ui/RatingInput";
import { Select } from "@/components/ui/Select";
import { useProductReviews } from "@/hooks/useProductReviews";
import { useReviewsStore } from "@/store";
import type { Review } from "@/types/review.types";
import { cn } from "@/utils/cn";

const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "highest", label: "Highest rating" },
  { id: "lowest", label: "Lowest rating" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

const PAGE_SIZE = 5;
const QUICK_EMOJIS = ["❤️", "🙌", "👍", "😊", "😍", "🔥"];

const DAY = 24 * 60 * 60 * 1000;

const formatDate = (iso: string) => {
  const time = new Date(iso).getTime();

  if (Number.isNaN(time)) return "";

  const days = Math.floor((Date.now() - time) / DAY);

  if (days <= 0) return "bugun";
  if (days === 1) return "kecha";
  if (days < 7) return `${days} kun oldin`;
  if (days < 30) return `${Math.floor(days / 7)} hafta oldin`;
  if (days < 365) return `${Math.floor(days / 30)} oy oldin`;

  return `${Math.floor(days / 365)} yil oldin`;
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

// ─── Bitta sharh ────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const savedName = useReviewsStore((state) => state.authorName);
  const [replyName, setReplyName] = useState(savedName);

  const toggleLike = useReviewsStore((state) => state.toggleLike);
  const addReply = useReviewsStore((state) => state.addReply);
  const liked = useReviewsStore((state) => state.likedIds.includes(review.id));

  const likeCount = review.likes + (liked ? 1 : 0);

  const handleReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = replyName.trim();
    const text = replyText.trim();

    if (!name || !text) {
      toast.error("Ism va javob matnini to'ldiring");
      return;
    }

    addReply(review.id, name, text);
    setReplyText("");
    setReplyOpen(false);
  };

  return (
    <article className="flex gap-4 py-6 border-b border-[#E8ECEF] last:border-b-0">
      <span
        aria-hidden="true"
        className="w-12 h-12 shrink-0 rounded-full bg-[#F3F5F7] text-[#6C7275] flex items-center justify-center font-medium"
      >
        {getInitials(review.author)}
      </span>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="font-semibold">{review.author}</h4>
          <span className="text-[12px] text-[#6C7275]">
            {formatDate(review.createdAt)}
          </span>
        </div>

        <Rating rating={review.rating} showValue={false} size="sm" />

        <p className="text-[14px]/[22px] text-[#6C7275]">{review.text}</p>

        <div className="flex items-center gap-5 text-[14px]">
          <button
            type="button"
            onClick={() => toggleLike(review.id)}
            aria-pressed={liked}
            className={cn(
              "transition-colors hover:text-[#141718]",
              liked ? "text-[#141718] font-medium" : "text-[#6C7275]",
            )}
          >
            Like{likeCount > 0 && ` (${likeCount})`}
          </button>
          <button
            type="button"
            onClick={() => setReplyOpen((prev) => !prev)}
            className="text-[#6C7275] transition-colors hover:text-[#141718]"
          >
            Reply
          </button>
        </div>

        {replyOpen && (
          <form onSubmit={handleReply} className="flex flex-col gap-2 pt-2">
            <input
              className="h-10 px-3 border border-[#E8ECEF] rounded-md outline-none text-[14px] focus:border-[#141718]"
              placeholder="Ismingiz"
              aria-label="Ismingiz"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
            />
            <textarea
              className="h-20 p-3 border border-[#E8ECEF] rounded-md outline-none resize-none text-[14px] focus:border-[#141718]"
              placeholder="Javobingiz"
              aria-label="Javobingiz"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="submit" className="h-9 px-4 text-[14px]">
                Send
              </Button>
              <Button
                variant="secondary"
                onClick={() => setReplyOpen(false)}
                className="h-9 px-4 text-[14px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {review.replies.length > 0 && (
          <ul className="flex flex-col gap-3 pt-2 pl-4 border-l-2 border-[#E8ECEF]">
            {review.replies.map((reply) => (
              <li key={reply.id} className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-3">
                  <span className="font-semibold text-[14px]">
                    {reply.author}
                  </span>
                  <span className="text-[12px] text-[#6C7275]">
                    {formatDate(reply.createdAt)}
                  </span>
                </div>
                <p className="text-[14px]/[22px] text-[#6C7275]">
                  {reply.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

// ─── Bo'lim ────────────────────────────────────
interface ProductReviewsProps {
  productId: string;
  productTitle: string;
}

export default function ProductReviews({
  productId,
  productTitle,
}: ProductReviewsProps) {
  const { list, count, average } = useProductReviews(productId);
  const addReview = useReviewsStore((state) => state.addReview);
  const savedName = useReviewsStore((state) => state.authorName);

  const [sort, setSort] = useState<SortId>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [name, setName] = useState(savedName);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const sorted = useMemo(() => {
    const copy = [...list];

    switch (sort) {
      case "oldest":
        return copy.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "highest":
        return copy.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return copy.sort((a, b) => a.rating - b.rating);
      default:
        return copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
  }, [list, sort]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const author = name.trim();
    const body = text.trim();

    if (!author) {
      toast.error("Ismingizni kiriting");
      return;
    }

    if (!body) {
      toast.error("Sharh matnini yozing");
      return;
    }

    addReview({ productId, author, rating, text: body });
    setText("");
    setRating(5);
    toast.success("Sharhingiz uchun rahmat!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-2xl sm:text-[28px]">
          Customer Reviews
        </h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Rating rating={average} showValue={false} size="sm" />
          <span className="text-[14px] text-[#6C7275]">
            {count} {count === 1 ? "Review" : "Reviews"}
          </span>
          <span className="text-[14px] text-[#141718]">{productTitle}</span>
        </div>
      </div>

      {/* ─── Sharh yozish ─── */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-4 border border-[#E8ECEF] rounded-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            className="h-10 sm:w-60 px-3 border border-[#E8ECEF] rounded-md outline-none text-[14px] focus:border-[#141718]"
            placeholder="Ismingiz"
            aria-label="Ismingiz"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <RatingInput value={rating} onChange={setRating} />
        </div>

        <textarea
          className="h-24 p-3 border border-[#E8ECEF] rounded-md outline-none resize-none text-[14px] focus:border-[#141718]"
          placeholder="Mahsulot haqidagi fikringiz"
          aria-label="Sharh matni"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                aria-label={`${emoji} qo'shish`}
                onClick={() => setText((prev) => prev + emoji)}
                className="w-8 h-8 rounded-full text-lg leading-none transition-colors hover:bg-[#F3F5F7]"
              >
                {emoji}
              </button>
            ))}
          </div>

          <Button type="submit" className="h-10 px-5">
            Write Review
          </Button>
        </div>
      </form>

      {/* ─── Ro'yxat ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium text-xl">
          {count} {count === 1 ? "Review" : "Reviews"}
        </h3>
        {count > 1 && (
          <Select
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
            ariaLabel="Sharhlarni saralash"
            className="w-45"
          />
        )}
      </div>

      {count === 0 ? (
        <p className="py-10 text-center text-[#6C7275]">
          Hozircha sharh yo'q — birinchi bo'lib fikringizni yozing
        </p>
      ) : (
        <>
          <div className="flex flex-col">
            {sorted.slice(0, visible).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {visible < count && (
            <div className="flex justify-center pt-2">
              <Button
                variant="secondary"
                border="rounded"
                onClick={() => setVisible((prev) => prev + PAGE_SIZE)}
                className="px-8"
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
