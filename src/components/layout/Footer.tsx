import instagram from "../../assets/icons/instagram-icon.png";
import facebook from "../../assets/icons/facebook-icon.png";
import youtube from "../../assets/icons/youtube-icon.png";
import { Link, useLocation } from "react-router-dom";
import SubFooter from "@/sections/SubFooter";
import ServiceSect from "@/sections/ServiceSect";

export default function Footer() {
  const { pathname } = useLocation();
  return (
    <footer className="">
      {pathname.includes("/contact") ? (
        <ServiceSect variant="sc" />
      ) : (
        <SubFooter />
      )}

      <div className="bg-black py-10 md:py-15">
        <div className="max-w-310 mx-auto px-5 text-white flex flex-col gap-8 md:gap-15">
          <div className="flex flex-col md:flex-row items-center gap-6 md:justify-between">
            <div className="flex flex-row items-center gap-3 sm:gap-5">
              <h4 className="text-xl sm:text-2xl">
                3legant<span className="text-[#6C7275]">.</span>
              </h4>
              <div className="w-px h-6 bg-[#6C7275]"></div>
              <p className="text-[14px] sm:text-base">Gift & Decoration Store</p>
            </div>
            <div className="">
              <ul className="flex flex-wrap justify-center gap-5 sm:gap-10 text-[#FEFEFE] text-[14px]">
                <li className="">
                  <Link to={"/"}>Home</Link>
                </li>
                <li className="">
                  <Link to={"/shop"}>Shop</Link>
                </li>
                <li className="">
                  <Link to={"/blog"}>Blog</Link>
                </li>
                <li className="">
                  <Link to={"/contact"}>Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:justify-between border-t pt-4 border-[#6C7275]">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[14px] sm:text-base text-center">
              <p>Copyright © 2023 3legant. All rights reserved</p>
              <p className="font-semibold">Privacy Policy</p>
              <p className="font-semibold">Terms of Use</p>
            </div>
            <div className="flex items-center gap-6">
              <img src={instagram} alt="instagram-icon" />
              <img src={facebook} alt="facebook-icon" />
              <img src={youtube} alt="youtube-icon" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
