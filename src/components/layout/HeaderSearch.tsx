import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import SearchBox from "@/components/ui/SearchBox";
import { searchUrl } from "@/utils/searchUrl";

/**
 * Header'dagi lupa. Bosilganda ostida qidiruv maydoni ochiladi —
 * maketda header'da doimiy input yo'q, faqat ikonka.
 */
export default function HeaderSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSubmit = (term: string) => {
    setOpen(false);
    navigate(searchUrl(term));
  };

  return (
    <div ref={containerRef} className="hidden sm:block relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Qidiruv"
        aria-expanded={open}
        className="w-6 h-6 flex items-center"
      >
        <CiSearch className="text-2xl" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-75 bg-white border border-[#E8ECEF] rounded-md shadow-[0px_8px_24px_-4px_rgba(15,15,15,0.12)] p-2 z-50">
          <SearchBox autoFocus onSubmit={handleSubmit} className="border-0" />
        </div>
      )}
    </div>
  );
}
