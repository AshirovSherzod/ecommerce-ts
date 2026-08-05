import { IoMailOutline, IoStorefrontOutline } from "react-icons/io5";
import { HiOutlinePhone } from "react-icons/hi2";

export default function ContactSect() {
  return (
    <section className="max-w-310 mx-auto px-5 py-12 flex flex-col gap-6 sm:gap-10">
      <h4 className="font-medium text-3xl sm:text-4xl text-center">
        Contact Us
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#F3F5F7] p-6 sm:p-8 flex flex-col gap-4 items-center">
          <IoStorefrontOutline className="text-3xl" />
          <div className="flex flex-col gap-2 text-center">
            <h4 className="font-medium text-[20px] text-[#6C7275]">Address</h4>
            <p className="text-[14px]">
              234 Hai Trieu, Ho Chi Minh City, Viet Nam
            </p>
          </div>
        </div>
        <div className="bg-[#F3F5F7] p-6 sm:p-8 flex flex-col gap-4 items-center">
          <HiOutlinePhone className="text-3xl" />
          <div className="flex flex-col gap-2 text-center">
            <h4 className="font-medium text-[20px] text-[#6C7275]">
              Contact Us
            </h4>
            <p className="text-[14px]">+84 234 567 890</p>
          </div>
        </div>
        <div className="bg-[#F3F5F7] p-6 sm:p-8 flex flex-col gap-4 items-center">
          <IoMailOutline className="text-3xl" />
          <div className="flex flex-col gap-2 text-center">
            <h4 className="font-medium text-[20px] text-[#6C7275]">Email</h4>
            <p className="text-[14px]">hello@3legant.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
