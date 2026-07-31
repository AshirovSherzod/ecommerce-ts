import Sidebar from "@/components/ui/Sidebar";
import SubHeader from "@/sections/SubHeader";
import { useState } from "react";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { LuMenu } from "react-icons/lu";
import { PiUserCircleLight } from "react-icons/pi";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(true);

  return (
    <>
      {close && <SubHeader setClose={setClose} />}
      <header className="border-b border-[#F3F5F7]">
        <div className="max-w-310 px-5 mx-auto flex justify-between items-center py-5">
          <div className="flex gap-1 items-center">
            <button
              type="button"
              aria-label="Menyuni ochish"
              className="sm:hidden text-xl"
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
              <li className="hover:text-black">
                <NavLink to={"/"}>Home</NavLink>
              </li>
              <li className="hover:text-black cursor-pointer">
                <NavLink to={"/shop"}>Shop</NavLink>
              </li>
              <li className="hover:text-black cursor-pointer">
                <NavLink to={"/blog"}>Blog</NavLink>
              </li>
              <li className="hover:text-black">
                <Link to={"/contact"}>Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="flex gap-5 items-center">
            <button className="w-6 h-6 flex items-center">
              <CiSearch className="text-2xl" />
            </button>
            <button className="w-6 h-6">
              <PiUserCircleLight className="text-2xl" />
            </button>
            <Link to={"/wishlist"} className="w-6 h-6">
              <FaHeart className="text-2xl" />
            </Link>
          </div>
        </div>
        {sidebar && (
          <Sidebar sidebar={sidebar} setSidebar={setSidebar}>
            <div className="h-full flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <form
                  className="w-full h-11 border flex rounded-md"
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                    e.preventDefault()
                  }
                >
                  <button
                    type="submit"
                    className="h-11 w-11 flex items-center justify-center text-2xl"
                  >
                    <CiSearch />
                  </button>
                  <input
                    className="outline-none"
                    style={{ width: "calc(100% - 44px)" }}
                    placeholder="Search"
                    type="text"
                  />
                </form>
                <ul className="">
                  <li className="border-b border-[#E8ECEF] py-2">
                    <Link onClick={() => setSidebar(false)} to={"/"}>
                      Home
                    </Link>
                  </li>
                  <li className="border-b border-[#E8ECEF] py-2">
                    <Link onClick={() => setSidebar(false)} to={"/shop"}>
                      Shop
                    </Link>
                  </li>
                  <li className="border-b border-[#E8ECEF] py-2">
                    <Link onClick={() => setSidebar(false)} to={"/blog"}>
                      Blog
                    </Link>
                  </li>
                  <li className="border-b border-[#E8ECEF] py-2">
                    <Link onClick={() => setSidebar(false)} to={"/contact"}>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="">
                <ul>
                  <li>
                    <Link onClick={() => setSidebar(false)} to={"/cart"}>
                      Cart
                      <span>
                        <CiShoppingCart />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link onClick={() => setSidebar(false)} to={"/wishlist"}>
                      Wishlist
                      <span>
                        <CiShoppingCart />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </Sidebar>
        )}
      </header>
    </>
  );
}
