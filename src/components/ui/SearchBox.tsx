import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { cn } from "@/utils/cn";

interface SearchBoxProps {
  /** Boshlang'ich qiymat — odatda URL'dagi `q` */
  defaultValue?: string;
  onSubmit: (term: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  /**
   * Ko'rinmaydigan yorliq. Sahifada bir nechta qidiruv maydoni bo'lishi
   * mumkin (header va filtr paneli) — bir xil nom bilan ekran o'quvchi
   * ularni ajrata olmaydi.
   */
  label?: string;
}

/**
 * Qidiruv maydoni.
 *
 * Ataylab "submit" bo'yicha ishlaydi, har bosishda emas: har harf uchun
 * so'rov yuborish serverni ortiqcha yuklaydi va debounce bilan URL, input
 * va so'rov holati bir-biridan chiqib ketishi oson. Enter yoki lupa
 * tugmasi — natija aniq va bashorat qilinadigan.
 */
export default function SearchBox({
  defaultValue = "",
  onSubmit,
  placeholder = "Search products",
  autoFocus = false,
  className,
  label = "Mahsulot qidirish",
}: SearchBoxProps) {
  const [term, setTerm] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(term.trim());
  };

  const handleClear = () => {
    setTerm("");
    // Bo'shatish natijani ham darhol tiklaydi — foydalanuvchi yana
    // Enter bosishi shart emas
    onSubmit("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        "flex items-center gap-1 h-10 px-2 border border-[#E8ECEF] rounded-md focus-within:border-[#141718] transition-colors",
        className,
      )}
    >
      <button
        type="submit"
        aria-label={`${label}: qidirish`}
        className="shrink-0 w-7 h-7 flex items-center justify-center text-xl text-[#6C7275] hover:text-[#141718] transition-colors"
      >
        <CiSearch />
      </button>

      <input
        className="flex-1 min-w-0 outline-none bg-transparent text-[14px]"
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={term}
        autoFocus={autoFocus}
        onChange={(e) => setTerm(e.target.value)}
      />

      {term && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={`${label}: tozalash`}
          className="shrink-0 w-7 h-7 flex items-center justify-center text-[#6C7275] hover:text-[#141718] transition-colors"
        >
          <IoClose />
        </button>
      )}
    </form>
  );
}
