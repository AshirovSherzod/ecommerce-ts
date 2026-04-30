import { MdOutlineMail } from "react-icons/md";
import subfooter from "@/assets/images/subfooter.png";

export default function SubFooter() {
	return (
		<section
			className="w-full h-80 bg-no-repeat bg-cover flex flex-col items-center justify-center gap-8"
			style={{ backgroundImage: `url(${subfooter})` }}
		>
			<div className="flex flex-col justify-center items-center gap-2">
				<h4 className="font-medium text-[40px] leading-7.5">
					Join Our Newsletter
				</h4>
				<p className="text-[18px] leading-7.5">
					Sign up for deals, new products and promotions
				</p>
			</div>
			<form
				className="w-122 flex items-center gap-2 border-b py-2"
				onSubmit={(e) => e.preventDefault()}
			>
				<MdOutlineMail className="text-2xl" />
				<input
					className="w-full outline-none"
					placeholder="Email address"
					type="text"
				/>
				<button>SignUp</button>
			</form>
		</section>
	);
}
