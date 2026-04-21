import { Button } from "@/components/ui/Button";
import { useTelegramMessage } from "@/hooks/useTelegramMessage";

export default function Contact() {
  const { sendMessage, isLoading } = useTelegramMessage();

  return (
    <div>
      <h1>Contact</h1>
      <Button onClick={() => sendMessage("Salom")} isLoading={isLoading}>
        Send Message
      </Button>
    </div>
  );
}

