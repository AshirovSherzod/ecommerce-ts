import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Seo from "@/components/layout/Seo";
import ContactHero from "@/sections/ContactHero";
import Banner from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import ContactForm from "@/sections/ContactForm";
import ContactSect from "@/sections/ContactSect";

export default function Contact() {
  const { t } = useTranslation("pages");
  const { t: tCommon } = useTranslation();

  return (
    <>
      <Seo title={t("contact.title")} description={t("contact.description")} />
      <ContactHero />
      <Banner variant="containered">
        <h3 className="font-medium text-[40px] max-w-sm">
          {t("contact.about.title")}
        </h3>
        <p className="text-xl">{t("contact.about.text")}</p>
        <Link to="/about">
          <Button className="w-35" variant="linked">
            {tCommon("actions.showMore")}
          </Button>
        </Link>
      </Banner>
      <ContactSect />
      <ContactForm />
    </>
  );
}
