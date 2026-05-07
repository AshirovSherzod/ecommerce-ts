import { IoClose } from "react-icons/io5";

interface SidebarProps {
  sidebar: boolean;
  setSidaber: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactElement;
}

export default function Sidebar({
  sidebar,
  setSidaber,
  children,
}: SidebarProps) {
  return (
    <div className="">
      <div
        className={`sm:w-[95%] fixed top-0  w-[90%] h-screen bg-white z-1000 transition-all duration-1000 p-6  ${sidebar ? "left-0" : "-left-full"}`}
      >
        <div className="flex justify-between">
          <h4 className="font-medium text-xl">
            3legant<span className="text-[#6C7275]">.</span>
          </h4>
          <button onClick={() => setSidaber(false)} className="text-xl">
            <IoClose className="text-[#6C7275]" />
          </button>
        </div>
        <div className="py-4">{children}</div>
      </div>
      <div className="w-full h-screen bg-gray-400/20 backdrop-blur-sm fixed top-0 left-0 z-999"></div>
    </div>
  );
}
