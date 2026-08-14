import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import authImage from "@/assets/images/sale-img.webp";

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Sign In va Sign Up uchun umumiy qobiq: chapda logo va rasm, o'ngda forma.
 * Header va footer yo'q — maketda auth sahifalari ekranni to'liq egallaydi.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Chap ustun faqat kattaroq ekranlarda */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F3F5F7] flex-col">
        <div className="py-8 flex justify-center shrink-0">
          <Link to="/" className="font-medium text-2xl">
            3legant<span className="text-[#6C7275]">.</span>
          </Link>
        </div>
        <div className="flex-1 min-h-0">
          <img
            className="w-full h-full object-cover object-center"
            src={authImage}
            alt=""
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-100 flex flex-col gap-8">
          {/* Chap ustun yashiringanda logo shu yerda ko'rinadi */}
          <Link to="/" className="lg:hidden font-medium text-2xl">
            3legant<span className="text-[#6C7275]">.</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
