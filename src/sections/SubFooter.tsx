import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdOutlineMail } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { toast } from "react-toastify";
import subfooter from "@/assets/images/subfooter.png";
import {
	newsletterSchema,
	type NewsletterValues,
} from "@/schemas/newsletter.schema";

export default function SubFooter() {
	const { t } = useTranslation("layout");

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<NewsletterValues>({
		resolver: zodResolver(newsletterSchema),
		defaultValues: { email: "" },
	});

	// Ilgari tugma bosilganda hech narsa bo'lmasdi — foydalanuvchi
	// obuna bo'ldimi yo'qmi bilmay qolardi
	const onSubmit = () => {
		reset();
		toast.success(t("newsletter.success"));
	};

	return (
		<section
			className="w-full min-h-80 py-12 px-5 bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center gap-8"
			style={{ backgroundImage: `url(${subfooter})` }}
		>
			<div className="flex flex-col justify-center items-center gap-2 text-center">
				<h4 className="font-medium text-[28px]/[36px] sm:text-[40px] sm:leading-7.5">
					{t("newsletter.title")}
				</h4>
				<p className="text-[16px]/[24px] sm:text-[18px] sm:leading-7.5">
					{t("newsletter.subtitle")}
				</p>
			</div>
			<form
				className="w-full max-w-122 flex flex-col gap-1"
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<div
					className={`flex items-center gap-2 border-b py-2 transition-colors ${
						errors.email ? "border-[#FF5630]" : ""
					}`}
				>
					<MdOutlineMail className="text-2xl shrink-0" />
					<input
						className="w-full min-w-0 outline-none bg-transparent"
						placeholder={t("newsletter.placeholder")}
						type="email"
						aria-label={t("newsletter.placeholder")}
						aria-invalid={!!errors.email}
						{...register("email")}
					/>
					<button type="submit" className="shrink-0">
						{t("newsletter.submit")}
					</button>
				</div>

				{errors.email && (
					<p className="text-[12px] text-[#FF5630]">{t(errors.email.message ?? "")}</p>
				)}
			</form>
		</section>
	);
}
