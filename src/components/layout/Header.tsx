import Sidebar from "@/components/ui/Sidebar";
import SubHeader from "@/sections/SubHeader";
import { useState } from "react";
import { CiHeart, CiSearch, CiShoppingCart } from "react-icons/ci";
import { LuMenu } from "react-icons/lu";
import { PiUserCircleLight } from "react-icons/pi";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useCartStore, useWishlistStore } from "@/store";
import instagram from "@/assets/icons/instagram-icon.png";
import facebook from "@/assets/icons/facebook-icon.png";
import youtube from "@/assets/icons/youtube-icon.png";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact Us" },
];

export default function Header() {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(true);

  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  const wishlistCount = useWishlistStore((state) => state.items.length);

  const handleSignIn = () => {
    setSidebar(false);
    toast.info("Sign In tez orada qo'shiladi");
  };

  // Qidiruv hali ulanmagan — jim turishdan ko'ra sababini aytgan ma'qul
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.info("Qidiruv tez orada qo'shiladi");
  };

  return (
    <>
      {close && <SubHeader setClose={setClose} />}
      <header className="border-b border-[#F3F5F7]">
        <div className="max-w-310 px-5 mx-auto flex justify-between items-center py-5">
          <div className="flex gap-3 items-center">
            <button
              type="button"
              aria-label="Menyuni ochish"
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
                  <NavLink to={link.to}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* Mobilda faqat savat qoladi, qolgan ikonkalar fly menu ichida */}
          <div className="flex gap-5 items-center">
            <button
              type="button"
              aria-label="Qidiruv"
              onClick={() => toast.info("Qidiruv tez orada qo'shiladi")}
              className="hidden sm:flex w-6 h-6 items-center"
            >
              <CiSearch className="text-2xl" />
            </button>
            <button
              type="button"
              aria-label="Profil"
              onClick={() => toast.info("Profil tez orada qo'shiladi")}
              className="hidden sm:block w-6 h-6"
            >
              <PiUserCircleLight className="text-2xl" />
            </button>
            <Link
              to={"/wishlist"}
              className="hidden sm:block w-6 h-6 relative"
              aria-label="Wishlist"
            >
              <CiHeart className="text-2xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-[#141718] text-white text-[10px] font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to={"/cart"} className="w-6 h-6 relative" aria-label="Savat">
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
            <form
              className="w-full h-11 border border-[#E8ECEF] rounded-md flex items-center shrink-0"
              onSubmit={handleSearch}
            >
              <button
                type="submit"
                aria-label="Qidirish"
                className="h-11 w-11 flex items-center justify-center text-2xl"
              >
                <CiSearch />
              </button>
              <input
                className="flex-1 min-w-0 pr-3 outline-none"
                placeholder="Search"
                type="text"
              />
            </form>

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
                    {link.label}
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
                    Cart
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
                    Wishlist
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

              <Button onClick={handleSignIn} size="lg" className="w-full">
                Sign In
              </Button>

              <div className="flex items-center gap-6">
                <img className="w-5 h-5" src={instagram} alt="instagram-icon" />
                <img className="w-5 h-5" src={facebook} alt="facebook-icon" />
                <img className="w-5 h-5" src={youtube} alt="youtube-icon" />
              </div>
            </div>
          </div>
        </Sidebar>
      </header>
    </>
  );
}
