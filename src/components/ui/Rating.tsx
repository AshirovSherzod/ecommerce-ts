import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { cn } from "@/utils/cn";

type RatingSize = "sm" | "md";

interface RatingProps {
  rating: number;
  // Sharh kartochkalarida faqat yulduzchalar kerak, raqamsiz
  showValue?: boolean;
  size?: RatingSize;
  className?: string;
}

const sizes: Record<RatingSize, string> = {
  sm: "text-[12px]",
  md: "text-base",
};

function Rating({
  rating,
  showValue = true,
  size = "md",
  className,
}: RatingProps) {
  const normalizedRating = Math.max(0, Math.min(5, rating));

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (normalizedRating >= i) {
      stars.push(<FaStar key={i} className="text-[#343839]" />);
    } else if (normalizedRating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-[#343839]" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-[#343839]" />);
    }
  }

  return (
    <div className={cn("flex items-center gap-1", sizes[size], className)}>
      {stars}
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          ({normalizedRating.toFixed(1)})
        </span>
      )}
    </div>
  );
}

export default Rating;
