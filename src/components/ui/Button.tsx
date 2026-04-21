import Spinner from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "bordered";
type Size = "sm" | "md" | "lg" | "xl";
type Border = "rounded" | "default";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  border?: Border;
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[#141718] text-white hover:bg-[#1a1d1f] focus-visible:ring-[#141718]",
  secondary:
    "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-400",
  bordered: "",
};

const sizes: Record<Size, string> = {
  sm: "h-9  px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-base",
};

const borders: Record<Border, string> = {
  rounded: "rounded-full",
  default: "rounded-lg",
};

export const Button = ({
  variant = "primary",
  size = "md",
  border = "default",
  isLoading = false,
  children,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "font-medium transition-all duration-150",
        "active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        borders[border],
        className,
      )}
    >
      {isLoading && (
        <Spinner size="sm" color={variant === "primary" ? "white" : "dark"} />
      )}
      {children}
    </button>
  );
};
