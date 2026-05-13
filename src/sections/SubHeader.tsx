import arrow from "@/assets/icons/arrow-right.png";
import ticket from "@/assets/icons/ticket-icon.png";
import close from "@/assets/icons/close-icon.png";
import { Link } from "react-router-dom";

type Props = {
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SubHeader({ setClose }: Props) {
  return (
    <div className="flex justify-between items-center bg-[#F3F5F7] pr-5">
      <div className=""></div>
      <div className="flex items-center justify-center gap-3 py-2">
        <p className="flex items-center gap-3">
          <span>
            <img src={ticket} alt="ticket-img" />
          </span>{" "}
          30% off storewide — Limited time!
        </p>
        <p className="flex items-center gap-1 text-[#377DFF] border-b">
          <Link to={"/shop"}>Shop Now</Link>
          <span>
            <img src={arrow} alt="arrow-img" />
          </span>
        </p>
      </div>
      <button onClick={() => setClose(false)}>
        <img src={close} alt="" />
      </button>
    </div>
  );
}
