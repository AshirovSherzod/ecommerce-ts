import { Button } from "@/components/ui/Button";
import { useTelegramMessage } from "@/hooks/useTelegramMessage";
import { useState } from "react";
import { toast } from "react-toastify";

const INITIAL_FORM = {
  name: "",
  email: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const { sendMessage, isLoading } = useTelegramMessage();
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      toast.error("Barcha maydonlarni to'ldiring", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      toast.error("Email manzili noto'g'ri", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    const isSent = await sendMessage(
      `Yangi xabar:\nIsm: ${name}\nEmail: ${email}\nXabar: ${message}`,
    );

    if (isSent) {
      setForm(INITIAL_FORM);
    }
  };

  return (
    <section className="max-w-310 mx-auto px-4 flex gap-7 my-10">
      <div className="w-[50%]">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-6">
          <div className="w-full">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="contact-name"
            >
              FULL NAME
            </label>
            <input
              className="w-full h-10 pl-4 border border-[#CBCBCB] rounded-md outline-none"
              type="text"
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
            />
          </div>
          <div className="w-full">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="contact-email"
            >
              EMAIL ADDRESS
            </label>
            <input
              className="w-full h-10 pl-4 border border-[#CBCBCB] rounded-md outline-none"
              type="email"
              id="contact-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Name"
            />
          </div>
          <div className="">
            <label
              className="text-[12px] text-[#6C7275] font-bold"
              htmlFor="contact-message"
            >
              MESSAGE
            </label>
            <textarea
              className="w-full h-35 border resize-none p-4 border-[#CBCBCB] rounded-md outline-none"
              placeholder="Your Message"
              name="message"
              id="contact-message"
              value={form.message}
              onChange={handleChange}
            ></textarea>
          </div>
          <Button isLoading={isLoading} type="submit" className="w-47">
            Send Message
          </Button>
        </form>
      </div>
      <div className="w-[50%]">
        <iframe
          title="3legant do'koni joylashuvi"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3290.2799511993253!2d68.03033196493809!3d40.52112785111432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ad7bf60a0e6dff%3A0xb3a88d3b69714cd0!2s1-maktab!5e0!3m2!1sen!2sus!4v1778663387266!5m2!1sen!2sus"
          width="100%"
          height="100%"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}
