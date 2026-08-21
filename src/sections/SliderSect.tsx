import { useCallback, useEffect, useRef, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useTranslation } from "react-i18next";
import bedroom from "@/assets/images/bedroom.png";
import kitchen from "@/assets/images/kitchen.png";
import livingroom from "@/assets/images/livingroom.png";

const SLIDES = [
  { id: "livingroom", img: livingroom, altKey: "home.categories.living" },
  { id: "bedroom", img: bedroom, altKey: "home.categories.bedroom" },
  { id: "kitchen", img: kitchen, altKey: "home.categories.kitchen" },
] as const;

const AUTOPLAY_MS = 5000;
// Barmoq shu masofadan ko'p surilsagina slayd almashadi
const SWIPE_THRESHOLD = 50;

export default function SliderSect() {
  const { t } = useTranslation("layout");
  const { t: tPages } = useTranslation("pages");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(
    () => setActive((prev) => (prev + 1) % SLIDES.length),
    [],
  );

  const prev = useCallback(
    () => setActive((prev) => (prev - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) next();
    else prev();
  };

  return (
    <section className="max-w-310 mx-auto px-5 mt-5">
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {SLIDES.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.img}
              alt={tPages(slide.altKey)}
              loading={index === 0 ? "eager" : "lazy"}
              className="w-full shrink-0 h-60 sm:h-100 lg:h-134 object-cover object-center"
            />
          ))}
        </div>

        <button
          type="button"
          aria-label={t("slider.prev")}
          onClick={prev}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
        >
          <GoArrowLeft className="text-xl" />
        </button>
        <button
          type="button"
          aria-label={t("slider.next")}
          onClick={next}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
        >
          <GoArrowRight className="text-xl" />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={t("slider.goTo", { index: index + 1 })}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === active ? "w-8 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
