import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface RatingProps {
  rating: number;
}

function Rating({ rating }: RatingProps) {
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
    <div className="flex items-center gap-1">
      {stars}
      <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
}

export default Rating;
