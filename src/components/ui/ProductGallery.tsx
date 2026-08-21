import { useEffect, useRef, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import { PRODUCT_PLACEHOLDER } from "@/utils/constants";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badges?: React.ReactNode;
}

export default function ProductGallery({
  images,
  alt,
  badges,
}: ProductGalleryProps) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const list = images.length > 0 ? images : [PRODUCT_PLACEHOLDER];
  const hasMany = list.length > 1;

  // Ro'yxat qisqarib qolsa indeks chegaradan chiqib ketmasin
  const current = active < list.length ? active : 0;

  const next = () => setActive((current + 1) % list.length);
  const prev = () => setActive((current - 1 + list.length) % list.length);

  // Rasmlar tashqi manzillardan keladi — biri ochilmasa singan ikonka
  // o'rniga zaxira rasm ko'rsatamiz
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;

    if (img.src.endsWith(PRODUCT_PLACEHOLDER)) return;

    img.src = PRODUCT_PLACEHOLDER;
  };

  // Tanlangan rasm lentaning ko'rinmas qismida qolib ketmasin: uni
  // markazga surib qo'yamiz. Sahifa o'zi siljib ketmasligi uchun
  // `scrollIntoView` emas, faqat lentaning ichki `scrollTo` si ishlatilgan.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[current] as HTMLElement | undefined;

    if (!strip || !thumb) return;

    strip.scrollTo({
      top: thumb.offsetTop - (strip.clientHeight - thumb.clientHeight) / 2,
      behavior: "smooth",
    });
  }, [current]);

  return (
    // Butun galereya qat'iy balandlikda: rasm sahifani cho'zib yubormasin
    // va mahsulot ma'lumotlari bilan birga bitta ekranga sig'sin
    <div className="w-full flex gap-3 sm:gap-4 h-90 sm:h-105">
      {hasMany && (
        // Rasm lentasi chapda, vertikal: sig'maganlari pastga suriladi.
        // Mobilda umuman ko'rsatilmaydi — tor ekranda asosiy rasmning o'zi
        // qoladi, rasmlar orasida strelkalar bilan yuriladi.
        <div
          ref={stripRef}
          className="hidden sm:flex flex-col gap-3 h-full sm:w-20 shrink-0 overflow-y-auto snap-y scroll-smooth no-scrollbar"
        >
          {list.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={t("a11y.showImage", { index: index + 1 })}
              aria-current={index === current}
              onClick={() => setActive(index)}
              className={cn(
                "w-full shrink-0 snap-start aspect-square bg-[#F3F5F7] rounded-md overflow-hidden border transition-colors",
                index === current
                  ? "border-[#141718]"
                  : "border-[#E8ECEF] hover:border-[#6C7275]",
              )}
            >
              {/* Kichik kadrda `contain` rasmni oq yo'llar bilan o'rab
                  qo'yardi — `cover` kadrni to'liq qoplaydi */}
              <img
                className="w-full h-full object-cover object-center"
                src={image}
                alt=""
                loading="lazy"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fon oq: API rasmlari oq fonda kelgani uchun kulrang kadr ichida
          rasm oq to'rtburchak bo'lib ajralib turardi. Rasmlar shaffof yoki
          kulrang fonda kelsa, bu yerni `bg-[#F3F5F7]` ga qaytaring. */}
      <div className="relative flex-1 min-w-0 h-full bg-white border border-[#E8ECEF] rounded-md overflow-hidden">
        <img
          className="w-full h-full object-contain object-center p-3 sm:p-6"
          src={list[current]}
          alt={alt}
          onError={handleImageError}
        />

        {badges}

        {hasMany && (
          <>
            <button
              type="button"
              aria-label={t("a11y.previousImage")}
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white hover:bg-[#F3F5F7] flex items-center justify-center transition-colors shadow-[0px_4px_12px_-2px_rgba(15,15,15,0.15)]"
            >
              <GoArrowLeft />
            </button>
            <button
              type="button"
              aria-label={t("a11y.nextImage")}
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white hover:bg-[#F3F5F7] flex items-center justify-center transition-colors shadow-[0px_4px_12px_-2px_rgba(15,15,15,0.15)]"
            >
              <GoArrowRight />
            </button>
          </>
        )}
      </div>

    </div>
  );
}
