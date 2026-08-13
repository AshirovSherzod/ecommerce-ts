import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// SPA'da sahifa almashganda brauzer skroll holatini saqlab qoladi —
// yangi sahifa o'rtasidan ochilib qolmasligi uchun tepaga qaytaramiz
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
