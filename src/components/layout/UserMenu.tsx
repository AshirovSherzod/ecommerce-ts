import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiUserCircleLight } from "react-icons/pi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store";

/** Ismni ko'rsatish uchun: to'liq ism -> ism -> username */
const displayNameOf = (user: {
  firstname?: string;
  name?: string;
  username?: string;
}) => user.firstname || user.name || user.username || "";

export default function UserMenu() {
  const { t } = useTranslation("layout");
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Menyu tashqarisiga bosilganda va Escape bosilganda yopiladi
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

  if (!isAuthenticated) {
    return (
      <Link
        to="/signin"
        aria-label={t("header.signIn")}
        className="hidden sm:block w-6 h-6"
      >
        <PiUserCircleLight className="text-2xl" />
      </Link>
    );
  }

  const handleSignOut = () => {
    setOpen(false);
    signOut();
    toast.success(t("header.signedOut"));
    navigate("/");
  };

  return (
    <div ref={containerRef} className="hidden sm:block relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("header.profileMenu")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-6 h-6 block"
      >
        <PiUserCircleLight className="text-2xl" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-52 bg-white border border-[#E8ECEF] rounded-md shadow-[0px_8px_24px_-4px_rgba(15,15,15,0.12)] overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-[#E8ECEF]">
            <p className="font-medium text-[14px] truncate">
              {(user && displayNameOf(user)) || t("header.account")}
            </p>
            {user?.email && (
              <p className="text-[12px] text-[#6C7275] truncate">
                {user.email}
              </p>
            )}
          </div>

          <Link
            to="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-[14px] hover:bg-[#F3F5F7] transition-colors"
          >
            {t("header.myAccount")}
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="w-full px-4 py-3 text-left text-[14px] hover:bg-[#F3F5F7] transition-colors"
          >
            {t("header.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
