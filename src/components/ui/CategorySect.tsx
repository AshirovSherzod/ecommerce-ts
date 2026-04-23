import livingroom from "@/assets/images/livingroom.png";
import bedroom from "@/assets/images/bedroom.png";
import kitchen from "@/assets/images/kitchen.png";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function CategorySect() {
	const navigate = useNavigate();

	return (
		<section className="container mx-auto px-5 grid grid-cols-2 grid-rows-2 gap-6 w-full h-166 ">
			<div
				className="row-span-2 bg-no-repeat bg-cover bg-center p-12"
				style={{ backgroundImage: `url(${livingroom})` }}
			>
				<h4 className="text-[34px] font-medium">Living Room</h4>
				<Button
					onClick={() => navigate("/shop")}
					border="none"
					variant="linked"
				>
					Shop Now
				</Button>
			</div>
			<div
				className="bg-no-repeat bg-cover bg-center w-full h-full p-12 flex flex-col justify-end "
				style={{ backgroundImage: `url(${bedroom})` }}
			>
				<h4 className="text-[34px] font-medium">Bed Room</h4>
				<Button
					variant="linked"
					border="none"
					onClick={() => navigate("/shop")}
					className="w-40"
				>
					Shop Now
				</Button>
			</div>
			<div
				className="col-start-2 bg-no-repeat bg-cover bg-center w-full h-full p-12 flex flex-col justify-end"
				style={{ backgroundImage: `url(${kitchen})` }}
			>
				<h4 className="text-[34px] font-medium">Kitchen</h4>
				<Button
					onClick={() => navigate("/shop")}
					border="none"
					variant="linked"
					className="w-40"
				>
					Shop Now
				</Button>
			</div>
		</section>
	);
}
