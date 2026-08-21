import Sidebar from "@/components/ui/Sidebar";
import SubHeader from "@/sections/SubHeader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { LuMenu } from "react-icons/lu";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderSearch from "@/components/layout/HeaderSearch";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import UserMenu from "@/components/layout/UserMenu";
import SearchBox from "@/components/ui/SearchBox";
import { useAuthStore, useCartStore, useWishlistStore } from "@/store";
import { searchUrl } from "@/utils/searchUrl";
import instagram from "@/assets/icons/instagram-icon.png";
import facebook from "@/assets/icons/facebook-icon.png";
import youtube from "@/assets/icons/youtube-icon.png";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { to: "/", key: "nav.home" },
  { to: "/shop", key: "nav.shop" },
  { to: "/blog", key: "nav.blog" },
  { to: "/contact", key: "nav.contact" },
] as const;

export default function Header() {
  const { t } = useTranslation("layout");
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(true);

  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  const wishlistCount = useWishlistStore((state) => state.items.length);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = () => {
    setSidebar(false);
    signOut();
    toast.success(t("header.signedOut"));
    navigate("/");
  };

  return (
    <>
      {close && <SubHeader setClose={setClose} />}
      <header className="border-b border-[#F3F5F7]">
        <div className="max-w-310 px-5 mx-auto flex justify-between items-center py-5">
          <div className="flex gap-3 items-center">
            <button
              type="button"
              aria-label={t("header.openMenu")}
              className="sm:hidden text-2xl"
              onClick={() => setSidebar(true)}
            >
              <LuMenu />
            </button>
            <h1 className="font-medium text-2xl">
              <NavLink to={"/"}>
                3legant<span className="text-[#6C7275]">.</span>
              </NavLink>
            </h1>
          </div>
          <div className="">
            <ul className="hidden sm:flex  gap-10 text-[#6C7275] font-medium">
              {NAV_LINKS.map((link) => (
                <li key={link.to} className="hover:text-black">
                  <NavLink to={link.to}>{t(link.key)}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* Mobilda faqat savat qoladi, qolgan ikonkalar fly menu ichida */}
          <div className="flex gap-5 items-center">
            <LanguageSwitcher />
            <HeaderSearch />
            <UserMenu />
            <Link
              to={"/wishlist"}
              className="hidden sm:block w-6 h-6 relative"
              aria-label={t("header.wishlist")}
            >
              <CiHeart className="text-2xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-[#141718] text-white text-[10px] font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to={"/cart"} className="w-6 h-6 relative" aria-label={t("header.cart")}>
              <CiShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-[#141718] text-white text-[10px] font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <Sidebar sidebar={sidebar} setSidebar={setSidebar}>
          <div className="h-full flex flex-col gap-6">
            <SearchBox
              label={t("search.menuLabel")}
              className="h-11 shrink-0"
              onSubmit={(term) => {
                setSidebar(false);
                navigate(searchUrl(term));
              }}
            />

            <ul className="shrink-0">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.to}
                  className="border-b border-[#E8ECEF] py-3 font-medium"
                >
                  <Link
                    className="block"
                    onClick={() => setSidebar(false)}
                    to={link.to}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Pastki blokni oynaning tagiga bosib qo'yadi */}
            <div className="flex-1" />

            <div className="flex flex-col gap-4 shrink-0">
              <ul className="flex flex-col gap-3 text-lg text-[#6C7275]">
                <li>
                  <Link
                    className="flex items-center justify-between"
                    onClick={() => setSidebar(false)}
                    to={"/cart"}
                  >
                    {t("header.cart")}
                    <span className="flex items-center gap-2">
                      <CiShoppingCart className="text-2xl text-[#141718]" />
                      {cartCount > 0 && (
                        <span className="min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-[#141718] text-white text-[11px] font-medium">
                          {cartCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-between"
                    onClick={() => setSidebar(false)}
                    to={"/wishlist"}
                  >
                    {t("header.wishlist")}
                    <span className="flex items-center gap-2">
                      <CiHeart className="text-2xl text-[#141718]" />
                      {wishlistCount > 0 && (
                        <span className="min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-[#141718] text-white text-[11px] font-medium">
                          {wishlistCount}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              </ul>

              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] text-[#6C7275] truncate">
                    {user?.firstname || user?.name || user?.username}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={handleSignOut}
                    size="lg"
                    className="w-full"
                  >
                    {t("header.signOut")}
                  </Button>
                </div>
              ) : (
                <Link to="/signin" onClick={() => setSidebar(false)}>
                  <Button size="lg" className="w-full">
                    {t("header.signIn")}
                  </Button>
                </Link>
              )}

              <LanguageSwitcher variant="inline" />

              <div className="flex items-center gap-6">
                <img className="w-5 h-5" src={instagram} alt="" />
                <img className="w-5 h-5" src={facebook} alt="" />
                <img className="w-5 h-5" src={youtube} alt="" />
              </div>
            </div>
          </div>
        </Sidebar>
      </header>
    </>
  );
}
