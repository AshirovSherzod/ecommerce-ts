import { useTranslation } from "react-i18next";

export default function ContactHero() {
  const { t } = useTranslation("pages");

  return (
    <section className="max-w-310 mx-auto px-5 my-10 sm:my-15 flex flex-col gap-4 sm:gap-6">
      <h1 className="w-full lg:w-[57%] font-medium text-[32px]/[36px] sm:text-[42px]/[46px] lg:text-[54px]/[54px] tracking-[-1px]">
        {t("contact.heroTitle")}
      </h1>
      <p className="w-full lg:w-[65%] text-[14px] sm:text-[16px] text-[#6C7275]">
        {t("contact.heroText")}
      </p>
    </section>
  );
}
