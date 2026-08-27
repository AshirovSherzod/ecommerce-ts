import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Seo from "@/components/layout/Seo";
import ArticlesSect from "@/sections/ArticlesSect";
import CategorySect from "@/sections/CategorySect";
import Hero from "@/sections/Hero";
import ServiceSect from "@/sections/ServiceSect";
import SliderSect from "@/sections/SliderSect";
import { Button } from "@/components/ui/Button";
import Banner from "@/components/ui/Banner";
import ProductWrapper from "@/components/ui/ProductWrapper";
import { useGetProducts } from "@/hooks/useProducts";
import { ARTICLES } from "@/data/articles";

export default function Home() {
  const { t } = useTranslation("pages");
  const { t: tCommon } = useTranslation();
  const { data, isLoading, isError, error } = useGetProducts({});

  return (
    <>
      <Seo title="3legant" description={t("home.description")} />
      <SliderSect />
      <Hero />
      <CategorySect />
      <ProductWrapper
        data={data?.data?.products ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <ServiceSect variant="pr" />
      <Banner variant="none">
        <p className="font-bold text-[#377DFF] text-[16px]">
          {t("home.sale.badge")}
        </p>
        <h3 className="font-medium text-[28px]/[34px] sm:text-[40px] max-w-sm">
          {t("home.sale.title")}
        </h3>
        <p className="text-base sm:text-xl">{t("home.sale.text")}</p>
        <Link to="/shop">
          <Button className="w-35" variant="linked">
            {tCommon("actions.showMore")}
          </Button>
        </Link>
      </Banner>
      <ArticlesSect data={ARTICLES} />
    </>
  );
}
