import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("layout");

  if (variant === "sc") {
    return (
      <section className="bg-[#F3F5F7]">
        <div className="max-w-310 mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 sm:p-8 flex flex-col gap-4">
            <CiDeliveryTruck className="text-5xl" />
            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-[20px]">{t("services.shipping.title")}</h4>
              <p className="text-[#6C7275] text-[14px]">{t("services.shipping.desc")}</p>
            </div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col gap-4">
            <CiMoneyBill className="text-5xl" />
            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-[20px]">{t("services.money.title")}</h4>
              <p className="text-[#6C7275] text-[14px]">{t("services.money.desc")}</p>
            </div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col gap-4">
            <CiLock className="text-5xl" />
            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-[20px]">{t("services.secure.title")}</h4>
              <p className="text-[#6C7275] text-[14px]">{t("services.secure.desc")}</p>
            </div>
          </div>
          <div className="p-6 sm:p-8 flex flex-col gap-4">
            <CiHeadphones className="text-5xl" />
            <div className="flex flex-col gap-2">
              <h4 className="font-medium text-[20px]">{t("services.support.title")}</h4>
              <p className="text-[#6C7275] text-[14px]">
                {t("services.support.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-310 mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
      <div className="bg-[#F3F5F7] p-6 sm:p-8 flex flex-col gap-4">
        <CiDeliveryTruck className="text-5xl" />
        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-[20px]">{t("services.shipping.title")}</h4>
          <p className="text-[#6C7275] text-[14px]">{t("services.shipping.desc")}</p>
        </div>
      </div>
      <div className="bg-[#F3F5F7] p-6 sm:p-8 flex flex-col gap-4">
        <CiMoneyBill className="text-5xl" />
        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-[20px]">{t("services.money.title")}</h4>
          <p className="text-[#6C7275] text-[14px]">{t("services.money.desc")}</p>
        </div>
      </div>
      <div className="bg-[#F3F5F7] p-6 sm:p-8 flex flex-col gap-4">
        <CiLock className="text-5xl" />
        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-[20px]">{t("services.secure.title")}</h4>
          <p className="text-[#6C7275] text-[14px]">{t("services.secure.desc")}</p>
        </div>
      </div>
      <div className="bg-[#F3F5F7] p-6 sm:p-8 flex flex-col gap-4">
        <CiHeadphones className="text-5xl" />
        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-[20px]">{t("services.support.title")}</h4>
          <p className="text-[#6C7275] text-[14px]">{t("services.support.desc")}</p>
        </div>
      </div>
    </section>
  );
}
