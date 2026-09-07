import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const { t } = useTranslation("pages");
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      style={{ minHeight: "calc(100vh - 200px)" }}
      className="px-5 flex flex-col items-center justify-center gap-4 text-center"
    >
      <Seo
        title={t("notFound.title")}
        description={t("notFound.description")}
        noIndex
      />
      {/* Ilgari #E8ECEF edi — oq fonda 1.19 kontrast, ya'ni deyarli
          ko'rinmasdi. Katta matn uchun 3.0 kerak, bu ohang 3.03 beradi. */}
      <p className="font-medium text-[64px]/[64px] text-[#8A969C]">404</p>
      <h1 className="font-medium text-[28px] sm:text-[40px]">
        {t("notFound.title")}
      </h1>
      <p className="text-[#6C7275] max-w-md">{t("notFound.desc")}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button onClick={() => navigate("/")}>
          {tCommon("actions.goHome")}
        </Button>
        <Button variant="secondary" onClick={() => navigate("/shop")}>
          {tCommon("actions.goToShop")}
        </Button>
      </div>
    </section>
  );
}
