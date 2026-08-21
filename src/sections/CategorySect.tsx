import livingroom from "@/assets/images/livingroom.png";
import bedroom from "@/assets/images/bedroom.png";
import kitchen from "@/assets/images/kitchen.png";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CategorySect() {
  const { t } = useTranslation("pages");
  const navigate = useNavigate();

  return (
    // Mobilda ustma-ust, md dan boshlab asl 2x2 to'r
    <section className="max-w-310 mx-auto px-5 grid grid-cols-1 gap-6 w-full md:grid-cols-2 md:grid-rows-2 md:h-166">
      <div
        className="min-h-75 md:min-h-0 md:row-span-2 bg-no-repeat bg-cover bg-center p-6 sm:p-8 md:p-12"
        style={{ backgroundImage: `url(${livingroom})` }}
      >
        <h4 className="text-[28px] sm:text-[34px] font-medium">{t("home.categories.living")}</h4>
        <Button
          onClick={() => navigate("/shop")}
          border="none"
          variant="linked"
        >
          {t("home.categories.shopNow")}
        </Button>
      </div>
      <div
        className="min-h-60 md:min-h-0 bg-no-repeat bg-cover bg-center w-full h-full p-6 sm:p-8 md:p-12 flex flex-col justify-end"
        style={{ backgroundImage: `url(${bedroom})` }}
      >
        <h4 className="text-[28px] sm:text-[34px] font-medium">{t("home.categories.bedroom")}</h4>
        <Button
          variant="linked"
          border="none"
          onClick={() => navigate("/shop")}
          className="w-40"
        >
          {t("home.categories.shopNow")}
        </Button>
      </div>
      <div
        className="min-h-60 md:min-h-0 md:col-start-2 bg-no-repeat bg-cover bg-center w-full h-full p-6 sm:p-8 md:p-12 flex flex-col justify-end"
        style={{ backgroundImage: `url(${kitchen})` }}
      >
        <h4 className="text-[28px] sm:text-[34px] font-medium">{t("home.categories.kitchen")}</h4>
        <Button
          onClick={() => navigate("/shop")}
          border="none"
          variant="linked"
          className="w-40"
        >
          {t("home.categories.shopNow")}
        </Button>
      </div>
    </section>
  );
}
