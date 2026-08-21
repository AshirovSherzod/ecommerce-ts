import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, type LanguageCode } from "@/i18n/config";
import { changeLanguage } from "@/i18n";
import { cn } from "@/utils/cn";

interface LanguageSwitcherProps {
  /** Mobil menyuda ro'yxat ochilmaydi — joy yetarli */
  variant?: "dropdown" | "inline";
}

export default function LanguageSwitcher({
  variant = "dropdown",
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation("layout");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current =
    LANGUAGES.find((language) => language.code === i18n.language) ??
    LANGUAGES[0];

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

  const select = (code: LanguageCode) => {
    setOpen(false);
    void changeLanguage(code);
  };

  if (variant === "inline") {
    return (
      <div
        className="flex items-center gap-2"
        role="group"
        aria-label={t("header.language")}
      >
        {LANGUAGES.map((language) => (
          <button
            key={language.code}
            type="button"
            onClick={() => select(language.code)}
            aria-pressed={language.code === current.code}
            className={cn(
              "h-9 px-3 rounded-md border text-[14px] transition-colors",
              language.code === current.code
                ? "border-[#141718] bg-[#F3F5F7] font-medium"
                : "border-[#E8ECEF] text-[#6C7275]",
            )}
          >
            {language.short}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("header.language")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-8 px-2 flex items-center gap-1 text-[14px] font-medium text-[#141718] hover:text-[#6C7275] transition-colors"
      >
        {current.short}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-36 bg-white border border-[#E8ECEF] rounded-md shadow-[0px_8px_24px_-4px_rgba(15,15,15,0.12)] overflow-hidden z-50"
        >
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              role="menuitemradio"
              aria-checked={language.code === current.code}
              onClick={() => select(language.code)}
              className={cn(
                "w-full px-4 py-2.5 text-left text-[14px] hover:bg-[#F3F5F7] transition-colors",
                language.code === current.code && "font-medium",
              )}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
