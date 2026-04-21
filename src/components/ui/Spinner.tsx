import { cn } from "@/utils/cn";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerColor = "gray" | "dark" | "white" | "blue" | "green" | "red";

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  className?: string;
}

const ringSizes: Record<SpinnerSize, string> = {
  xs: "size-3.5 border-2",
  sm: "size-[18px] border-2",
  md: "size-6 border-[3px]",
  lg: "size-8 border-[3px]",
  xl: "size-11 border-4",
};

const ringColors: Record<SpinnerColor, string> = {
  gray: "border-gray-200  border-t-gray-500",
  dark: "border-gray-200  border-t-gray-900",
  white: "border-white/25  border-t-white",
  blue: "border-blue-100  border-t-blue-500",
  green: "border-green-100 border-t-green-500",
  red: "border-red-100   border-t-red-500",
};

export default function Spinner({
  size = "md",
  color = "gray",
  label = "Yukanmoqda",
  className,
}: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <div
        className={cn(
          "rounded-full animate-spin",
          ringSizes[size],
          ringColors[color],
          className,
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
