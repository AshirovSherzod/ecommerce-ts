import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";

/**
 * Faqat kirmagan foydalanuvchilar uchun sahifalar (Sign In, Sign Up).
 * Kirgan foydalanuvchi manzilni qo'lda yozib ochsa ham bosh sahifaga
 * qaytariladi — aks holda u kirgan holatda "Sign In" formasini ko'rib,
 * qayta kirishga urinardi.
 */
export default function GuestOnly({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
}
