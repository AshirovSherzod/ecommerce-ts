import saleImg from "@/assets/images/sale-img.webp";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

type Variant = "containered" | "none";

interface SaleUpProps {
  children: ReactNode;
  variant: Variant;
}

const variants: Record<Variant, string> = {
  containered: "max-w-310 mx-auto px-5",
  none: "w-full",
};

export default function Banner({ children, variant }: SaleUpProps) {
  return (
    <section
      className={cn(
        "flex flex-col md:flex-row md:items-center md:h-133",
        variants[variant],
      )}
    >
      <div className="w-full h-60 sm:h-80 md:w-[50%] md:h-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={saleImg}
          alt="Sale Promotion Banner"
        />
      </div>
      <div className="w-full md:w-[50%] md:h-full px-6 py-10 sm:px-10 md:px-12 lg:px-18.5 bg-[#F3F5F7] flex flex-col justify-center gap-4">
        {children}
      </div>
    </section>
  );
}
