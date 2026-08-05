import arrow from "@/assets/icons/arrow-right.png";
import ticket from "@/assets/icons/ticket-icon.png";
import close from "@/assets/icons/close-icon.png";
import { Link } from "react-router-dom";

type Props = {
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SubHeader({ setClose }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 bg-[#F3F5F7] px-4">
      {/* Yopish tugmasini muvozanatlash uchun — matn haqiqiy markazda tursin */}
      <div className="hidden sm:block sm:w-4 sm:shrink-0" />
      <div className="flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-[13px] sm:text-base">
        <p className="flex items-center gap-2 sm:gap-3">
          <span className="shrink-0">
            <img src={ticket} alt="ticket-img" />
          </span>{" "}
          30% off storewide — Limited time!
        </p>
        <p className="hidden sm:flex items-center gap-1 text-[#377DFF] border-b">
          <Link to={"/shop"}>Shop Now</Link>
          <span className="shrink-0">
            <img src={arrow} alt="arrow-img" />
          </span>
        </p>
      </div>
      <button
        type="button"
        aria-label="E'lonni yopish"
        className="shrink-0"
        onClick={() => setClose(false)}
      >
        <img src={close} alt="" />
      </button>
    </div>
  );
}
