import { IoClose } from "react-icons/io5";

interface SidebarProps {
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function Sidebar({
  sidebar,
  setSidebar,
  children,
}: SidebarProps) {
  return (
    <>
      {/* Fon: yopiq holatda ham DOM'da turadi (animatsiya uchun), shuning
          uchun sahifa bosishlarini to'smasligi kerak */}
      <div
        onClick={() => setSidebar(false)}
        className={`sm:hidden fixed inset-0 z-999 bg-gray-400/20 backdrop-blur-sm transition-opacity duration-300 ${
          sidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`sm:hidden fixed top-0 left-0 z-1000 h-dvh w-[85%] max-w-90 bg-white p-6 flex flex-col transition-transform duration-300 ease-out ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-xl">
            3legant<span className="text-[#6C7275]">.</span>
          </h4>
          <button
            type="button"
            aria-label="Menyuni yopish"
            onClick={() => setSidebar(false)}
            className="text-2xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto py-6">{children}</div>
      </aside>
    </>
  );
}
