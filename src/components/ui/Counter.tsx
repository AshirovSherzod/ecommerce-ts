import { cn } from "@/utils/cn";
import type React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

type Variants = "primary" | "secondary";

interface CounterProps {
  variant?: Variants;
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  // Savatda quantity 1 dan pastga tushsa mahsulot o'chib ketadi,
  // shuning uchun eng kichik qiymatni sozlash mumkin
  min?: number;
  // Chaqirilgan joyda o'lchamni moslash uchun (mahsulot sahifasi ixchamroq)
  className?: string;
}

const variants: Record<Variants, string> = {
  primary: "bg-[#F5F5F5]",
  secondary: "bg-white border border-[#6C7275]",
};

export default function Counter({
  variant = "primary",
  counter,
  setCounter,
  min = 0,
  className,
}: CounterProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center w-[127px] h-[52px] py-[12px] px-[16px] rounded-[8px]",
        variants[variant],
        className,
      )}
    >
      <button
        type="button"
        aria-label="Kamaytirish"
        className="disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={counter <= min}
        onClick={() => setCounter((prev) => prev - 1)}
      >
        <FaMinus />
      </button>
      <p>{counter}</p>
      <button
        type="button"
        aria-label="Ko'paytirish"
        onClick={() => setCounter((prev) => prev + 1)}
      >
        <FaPlus />
      </button>
    </div>
  );
}
