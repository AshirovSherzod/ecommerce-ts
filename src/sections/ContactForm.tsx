import { Button } from "@/components/ui/Button";
import { useTelegramMessage } from "@/hooks/useTelegramMessage";

export default function ContactForm() {
  const { sendMessage, isLoading } = useTelegramMessage();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage("Salom");
  };
  return (
    <section className="max-w-310 mx-auto px-4 flex gap-7 my-10">
      <div className="w-[50%]">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-6">
          <div className="w-full">
            <label className="text-[12px] text-[#6C7275] font-bold" htmlFor="">
              FULL NAME
            </label>
            <input
              className="w-full h-10 pl-4 border border-[#CBCBCB] rounded-md outline-none"
              type="text"
              placeholder="Your Name"
            />
          </div>
          <div className="w-full">
            <label className="text-[12px] text-[#6C7275] font-bold" htmlFor="">
              EMAIL ADDRESS
            </label>
            <input
              className="w-full h-10 pl-4 border border-[#CBCBCB] rounded-md outline-none"
              type="text"
              placeholder="Your Name"
            />
          </div>
          <div className="">
            <label className="text-[12px] text-[#6C7275] font-bold" htmlFor="">
              MESSAGE
            </label>
            <textarea
              className="w-full h-35 border resize-none p-4 border-[#CBCBCB] rounded-md outline-none"
              placeholder="Your Message"
              name=""
              id=""
            ></textarea>
          </div>
          <Button isLoading={isLoading} type="submit" className="w-47">
            Send Message
          </Button>
        </form>
      </div>
      <div className="w-[50%]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3290.2799511993253!2d68.03033196493809!3d40.52112785111432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ad7bf60a0e6dff%3A0xb3a88d3b69714cd0!2s1-maktab!5e0!3m2!1sen!2sus!4v1778663387266!5m2!1sen!2sus"
          width="100%"
          height="100%"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
}
