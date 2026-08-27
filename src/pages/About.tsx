import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import ServiceSect from "@/sections/ServiceSect";
import aboutImg from "@/assets/images/livingroom.png";

const VALUES = ["1", "2", "3"] as const;

export default function About() {
  const { t } = useTranslation("pages");
  const { t: tLayout } = useTranslation("layout");

  return (
    <section className="flex flex-col gap-12 my-10">
      <Seo
        title={t("about.title")}
        description={t("about.description")}
        image={aboutImg}
      />

      <div className="max-w-3xl mx-auto px-5 flex flex-col gap-4">
        <p className="text-[14px] text-[#6C7275]">
          <Link className="hover:text-[#141718]" to="/">
            {tLayout("nav.home")}
          </Link>{" "}
          &gt; <span className="text-[#141718]">{t("about.breadcrumb")}</span>
        </p>

        <h1 className="font-medium text-[28px]/[36px] sm:text-[40px]/[48px]">
          {t("about.title")}
        </h1>
        <p className="text-lg text-[#6C7275]">{t("about.lead")}</p>
      </div>

      <img
        className="w-full h-60 sm:h-96 object-cover object-center"
        src={aboutImg}
        alt=""
      />

      <div className="max-w-3xl mx-auto px-5 flex flex-col gap-4">
        <h2 className="font-medium text-2xl">{t("about.storyTitle")}</h2>
        <p className="text-[17px]/[30px] text-[#353945]">{t("about.story1")}</p>
        <p className="text-[17px]/[30px] text-[#353945]">{t("about.story2")}</p>
      </div>

      <div className="max-w-3xl mx-auto px-5 w-full flex flex-col gap-6">
        <h2 className="font-medium text-2xl">{t("about.valuesTitle")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VALUES.map((key) => (
            <div
              key={key}
              className="flex flex-col gap-2 border-t-2 border-[#141718] pt-4"
            >
              <h3 className="font-semibold">{t(`about.value${key}Title`)}</h3>
              <p className="text-[14px] text-[#6C7275]">
                {t(`about.value${key}Text`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ServiceSect variant="sc" />

      <div className="max-w-3xl mx-auto px-5 w-full flex flex-col items-start gap-3">
        <h2 className="font-medium text-2xl">{t("about.ctaTitle")}</h2>
        <p className="text-[#6C7275]">{t("about.ctaText")}</p>
        <Link to="/shop" className="w-full sm:w-48">
          <Button className="w-full">{t("about.cta")}</Button>
        </Link>
      </div>

      {/* Matn namunaviy ekani ochiq aytiladi */}
      <p className="max-w-3xl mx-auto px-5 w-full text-[13px] text-[#6C7275]">
        {t("about.placeholder")}
      </p>
    </section>
  );
}
