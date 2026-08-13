import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

const STARS = [1, 2, 3, 4, 5];

export default function RatingInput({ value, onChange }: RatingInputProps) {
  // Sichqoncha ustida turganda oldindan ko'rsatish
  const [hovered, setHovered] = useState(0);

  const shown = hovered || value;

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(0)}
      role="radiogroup"
      aria-label="Baho"
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} yulduz`}
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
