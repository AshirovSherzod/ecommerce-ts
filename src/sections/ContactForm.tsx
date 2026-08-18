import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useTelegramMessage } from "@/hooks/useTelegramMessage";
import { contactSchema, type ContactValues } from "@/schemas/contact.schema";

const FIELD_CLASS =
  "w-full h-10 pl-4 border rounded-md outline-none transition-colors";

export default function ContactForm() {
  const { sendMessage, isLoading } = useTelegramMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  // Sxema `.trim()` qilgani uchun qiymatlar tozalangan holda keladi
  const onSubmit = async (values: ContactValues) => {
    const isSent = await sendMessage(
      `Yangi xabar:\nIsm: ${values.name}\nEmail: ${values.email}\nXabar: ${values.message}`,
    );

    if (isSent) reset();
  };

  const borderOf = (hasError: boolean) =>
    hasError ? "border-[#FF5630]" : "border-[#CBCBCB] focus:border-[#141718]";

  return (
    <section className="max-w-310 mx-auto px-5 flex flex-col lg:flex-row gap-7 my-10">
      <div className="w-full lg:w-[50%]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          <div className="w-full">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="contact-name"
            >
              FULL NAME
            </label>
            <input
              className={`${FIELD_CLASS} ${borderOf(!!errors.name)}`}
              type="text"
              id="contact-name"
              placeholder="Your Name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-[12px] text-[#FF5630]">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="contact-email"
            >
              EMAIL ADDRESS
            </label>
            <input
              className={`${FIELD_CLASS} ${borderOf(!!errors.email)}`}
              type="email"
              id="contact-email"
              placeholder="Your Email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-[12px] text-[#FF5630]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="contact-message"
            >
              MESSAGE
            </label>
            <textarea
              className={`w-full h-35 border resize-none p-4 rounded-md outline-none transition-colors ${borderOf(
                !!errors.message,
              )}`}
              placeholder="Your Message"
              id="contact-message"
              aria-invalid={!!errors.message}
              {...register("message")}
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-[12px] text-[#FF5630]">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            isLoading={isLoading}
            type="submit"
            className="w-full sm:w-47"
          >
            Send Message
          </Button>
        </form>
      </div>
      {/* Mobilda ota-element balandligi bo'lmagani uchun xaritaga aniq
          balandlik beriladi, lg dan boshlab forma balandligiga cho'ziladi */}
      <div className="w-full h-75 lg:w-[50%] lg:h-auto">
        <iframe
          title="3legant do'koni joylashuvi"
          className="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3290.2799511993253!2d68.03033196493809!3d40.52112785111432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ad7bf60a0e6dff%3A0xb3a88d3b69714cd0!2s1-maktab!5e0!3m2!1sen!2sus!4v1778663387266!5m2!1sen!2sus"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}
