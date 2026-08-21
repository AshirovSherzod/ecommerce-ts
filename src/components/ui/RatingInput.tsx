import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

const STARS = [1, 2, 3, 4, 5];

export default function RatingInput({ value, onChange }: RatingInputProps) {
  // Sichqoncha ustida turganda oldindan ko'rsatish
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(0);

  const shown = hovered || value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(0)}
      role="radiogroup"
      aria-label={t("a11y.rating")}
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={t("a11y.star", { count: star })}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="text-lg text-[#343839] transition-transform hover:scale-110"
        >
          {shown >= star ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  );
}
