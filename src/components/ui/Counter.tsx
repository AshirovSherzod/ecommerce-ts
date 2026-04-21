import { cn } from "@/utils/cn";
import type React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

type Variants = "primary" | "secondary";

interface CounterProps {
  variant?: Variants;
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
}

const variants: Record<Variants, string> = {
  primary: "bg-[#F5F5F5]",
  secondary: "bg-white border border-[#6C7275]",
};

export default function Counter({
  variant = "primary",
  counter,
  setCounter,
}: CounterProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center w-[127px] h-[52px] py-[12px] px-[16px] rounded-[8px]",
        variants[variant],
      )}
    >
      <button
        className=""
        disabled={counter === 0}
        onClick={() => setCounter((prev) => prev - 1)}
      >
        <FaMinus />
      </button>
      <p>{counter}</p>
      <button onClick={() => setCounter((prev) => prev + 1)}>
        <FaPlus />
      </button>
    </div>
  );
}
