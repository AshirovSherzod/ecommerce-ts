import { Link } from "react-router-dom";
import shopHero from "@/assets/images/shop-banner.jpg";

export default function ShopHero() {
  return (
    <section className="max-w-310 mx-auto px-5 mt-5 flex flex-col gap-4">
      <p className="text-[14px] text-[#6C7275]">
        <Link className="hover:text-[#141718]" to={"/"}>
          Home
        </Link>{" "}
        &gt; <span className="text-[#141718]">Shop</span>
      </p>

      <div
        className="h-70 sm:h-98 bg-no-repeat bg-cover bg-center px-6 sm:px-10 flex flex-col items-center justify-center gap-2 text-center"
        style={{ backgroundImage: `url(${shopHero})` }}
      >
        <h1 className="font-medium text-[32px]/[38px] sm:text-[44px]/[50px] lg:text-[54px]/[60px]">
          Shop Page
        </h1>
        <p className="text-[14px] sm:text-[16px]">
          Let&apos;s design the place you always imagined.
        </p>
      </div>
    </section>
  );
}
