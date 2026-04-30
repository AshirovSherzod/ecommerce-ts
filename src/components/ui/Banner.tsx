import saleImg from "@/assets/images/sale-img.png";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

type Variant = "containered" | "none";

interface SaleUpProps {
	children: ReactNode;
	variant: Variant;
}

const variants: Record<Variant, string> = {
	containered: "container mx-auto px-5",
	none: "w-full",
};

export default function Banner({ children, variant }: SaleUpProps) {
	return (
		<section className={cn("h-133 flex items-center", variants[variant])}>
			<div className="w-[50%] h-full overflow-hidden">
				<img
					className="w-full h-full object-cover"
					src={saleImg}
					alt="Sale Promotion Banner"
				/>
			</div>
			<div className="w-[50%] h-full px-18.5 bg-[#F3F5F7] flex flex-col justify-center gap-4">
				{children}
			</div>
		</section>
	);
}
