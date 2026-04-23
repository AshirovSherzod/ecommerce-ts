import saleImg from "@/assets/images/sale-img.png";
import type { ReactNode } from "react";

interface SaleUpProps {
	children: ReactNode;
}

export default function SaleUpSect({ children }: SaleUpProps) {
	return (
		<section className="w-full h-133 flex items-center">
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
