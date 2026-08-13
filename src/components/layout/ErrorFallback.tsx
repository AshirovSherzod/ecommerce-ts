import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

interface ErrorFallbackProps {
  error: Error;
  onRetry: () => void;
  // Butun ilova qulaganda navigatsiya ham ishonchsiz — sahifani qayta
  // yuklash yagona kafolatli chiqish yo'li
  fullPage?: boolean;
}

export default function ErrorFallback({
  error,
  onRetry,
  fullPage = false,
}: ErrorFallbackProps) {
  return (
    <section
      role="alert"
      style={{ minHeight: fullPage ? "100vh" : "calc(100vh - 200px)" }}
      className="px-5 flex flex-col items-center justify-center gap-4 text-center"
    >
      <h1 className="font-medium text-[24px] sm:text-[32px]">
        Nimadir noto'g'ri ketdi
      </h1>
      <p className="text-[#6C7275] max-w-md">
        Sahifani ko'rsatishda kutilmagan xato yuz berdi. Qayta urinib ko'ring —
        muammo takrorlansa, birozdan so'ng qaytib keling.
      </p>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {fullPage ? (
          <Button onClick={() => window.location.reload()}>
            Sahifani yangilash
          </Button>
        ) : (
          <Button onClick={onRetry}>Qayta urinish</Button>
        )}
        <Link to="/">
          <Button variant="secondary">Bosh sahifa</Button>
        </Link>
      </div>

      {/* Stack trace faqat ishlab chiqishda — foydalanuvchiga ichki
          tafsilotlarni ko'rsatish xavfsizlik nuqtai nazaridan noto'g'ri */}
      {import.meta.env.DEV && (
        <details className="mt-4 max-w-2xl w-full text-left">
          <summary className="cursor-pointer text-[14px] text-[#6C7275]">
            Texnik tafsilot (faqat dev)
          </summary>
          <pre className="mt-2 p-3 bg-[#F3F5F7] rounded-md text-[12px] overflow-x-auto whitespace-pre-wrap">
            {error.message}
            {"\n\n"}
            {error.stack}
          </pre>
        </details>
      )}
    </section>
  );
}
