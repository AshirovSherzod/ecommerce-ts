import { cn } from "@/utils/cn";

/**
 * Yuklanish paytidagi kulrang shakl.
 *
 * Spinner "nimadir bo'lyapti" deydi, skeleton esa "mana shu keladi" —
 * sahifa tayyor bo'lganda ko'z allaqachon to'g'ri joyda bo'ladi va
 * kontent sakramaydi.
 *
 * `prefers-reduced-motion` yoqilganda jimirlash o'chadi.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-[#F3F5F7] rounded-md motion-safe:animate-pulse",
        className,
      )}
    />
  );
}

/** ProductCard o'lchamini takrorlaydi — almashganda joylashuv siljimasin */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-square" />
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-4 w-full max-w-45" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

interface GridProps {
  count?: number;
  className?: string;
}

/**
 * Mahsulot to'ri uchun. `role="status"` — ekran o'quvchi yuklanayotganini
 * aytadi, aks holda u uchun sahifa shunchaki bo'sh bo'lardi.
 */
const DEFAULT_GRID =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6";

export function ProductGridSkeleton({ count = 10, className }: GridProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      // `className` berilsa standart to'r butunlay almashadi: ikkalasini
      // qo'shsak, mos kelmagan breakpointlar (masalan `xl:`) qolib ketib
      // skeleton haqiqiy to'rdan boshqacha joylashardi
      className={className ?? DEFAULT_GRID}
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
