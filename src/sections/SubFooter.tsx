import { MdOutlineMail } from "react-icons/md";
import subfooter from "@/assets/images/subfooter.png";

export default function SubFooter() {
	return (
		<section
			className="w-full min-h-80 py-12 px-5 bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center gap-8"
			style={{ backgroundImage: `url(${subfooter})` }}
		>
			<div className="flex flex-col justify-center items-center gap-2 text-center">
				<h4 className="font-medium text-[28px]/[36px] sm:text-[40px] sm:leading-7.5">
					Join Our Newsletter
				</h4>
				<p className="text-[16px]/[24px] sm:text-[18px] sm:leading-7.5">
					Sign up for deals, new products and promotions
				</p>
			</div>
			<form
				className="w-full max-w-122 flex items-center gap-2 border-b py-2"
				onSubmit={(e) => e.preventDefault()}
			>
				<MdOutlineMail className="text-2xl shrink-0" />
				<input
					className="w-full min-w-0 outline-none bg-transparent"
					placeholder="Email address"
					type="email"
				/>
				<button type="submit" className="shrink-0">
					SignUp
				</button>
			</form>
		</section>
	);
}
