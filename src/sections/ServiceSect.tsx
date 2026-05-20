import { cn } from "@/utils/cn";
import {
  CiDeliveryTruck,
  CiHeadphones,
  CiLock,
  CiMoneyBill,
} from "react-icons/ci";

type Variant = "pr" | "sc";

interface ServiceSectProps {
  variant: Variant;
}

export default function ServiceSect({ variant }: ServiceSectProps) {
  if (variant === "sc") {
    return (
      <section className="bg-[#F3F5F7]">
        <div className="max-w-310 mx-auto px-5 flex">
          <div
            style={{ width: "calc(100% / 4)" }}
            className="p-8 flex flex-col gap-4"
          >
            <CiDeliveryTruck className="text-5xl" />
            <div className="flex flex-col gap2">
              <h4 className="font-medium text-[20px]">Free Shipping</h4>
              <p className="text-[#6C7275] text-[14px]">Order above $200</p>
            </div>
          </div>
          <div
            style={{ width: "calc(100% / 4)" }}
            className="p-8 flex flex-col gap-4"
          >
            <CiMoneyBill className="text-5xl" />
            <div className="flex flex-col gap2">
              <h4 className="font-medium text-[20px]">Money-back</h4>
              <p className="text-[#6C7275] text-[14px]">30 days guarantee</p>
            </div>
          </div>
          <div
            style={{ width: "calc(100% / 4)" }}
            className="p-8 flex flex-col gap-4"
          >
            <CiLock className="text-5xl" />
            <div className="flex flex-col gap2">
              <h4 className="font-medium text-[20px]">Secure Payments</h4>
              <p className="text-[#6C7275] text-[14px]">Secured by Stripe</p>
            </div>
          </div>
          <div
            style={{ width: "calc(100% / 4)" }}
            className="p-8 flex flex-col gap-4"
          >
            <CiHeadphones className="text-5xl" />
            <div className="flex flex-col gap2">
              <h4 className="font-medium text-[20px]">24/7 Support</h4>
              <p className="text-[#6C7275] text-[14px]">
                Phone and Email support
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-310 mx-auto px-5 flex gap-6 py-12">
      <div
        style={{ width: "calc(100% / 4)" }}
        className="bg-[#F3F5F7] p-8 flex flex-col gap-4"
      >
        <CiDeliveryTruck className="text-5xl" />
        <div className="flex flex-col gap2">
          <h4 className="font-medium text-[20px]">Free Shipping</h4>
          <p className="text-[#6C7275] text-[14px]">Order above $200</p>
        </div>
      </div>
      <div
        style={{ width: "calc(100% / 4)" }}
        className="bg-[#F3F5F7] p-8 flex flex-col gap-4"
      >
        <CiMoneyBill className="text-5xl" />
        <div className="flex flex-col gap2">
          <h4 className="font-medium text-[20px]">Money-back</h4>
          <p className="text-[#6C7275] text-[14px]">30 days guarantee</p>
        </div>
      </div>
      <div
        style={{ width: "calc(100% / 4)" }}
        className="bg-[#F3F5F7] p-8 flex flex-col gap-4"
      >
        <CiLock className="text-5xl" />
        <div className="flex flex-col gap2">
          <h4 className="font-medium text-[20px]">Secure Payments</h4>
          <p className="text-[#6C7275] text-[14px]">Secured by Stripe</p>
        </div>
      </div>
      <div
        style={{ width: "calc(100% / 4)" }}
        className="bg-[#F3F5F7] p-8 flex flex-col gap-4"
      >
        <CiHeadphones className="text-5xl" />
        <div className="flex flex-col gap2">
          <h4 className="font-medium text-[20px]">24/7 Support</h4>
          <p className="text-[#6C7275] text-[14px]">Phone and Email support</p>
        </div>
      </div>
    </section>
  );
}
