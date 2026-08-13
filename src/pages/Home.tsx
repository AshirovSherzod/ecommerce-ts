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
  const { data, isLoading, isError, error } = useGetProducts({});

  return (
    <>
      <SliderSect />
      <Hero />
      <CategorySect />
      <ProductWrapper
        data={data?.data.products ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <ServiceSect variant="pr" />
      <Banner variant="none">
        <p className="font-bold text-[#377DFF] text-[16px]">
          SALE UP TO 35% OFF
        </p>
        <h3 className="font-medium text-[28px]/[34px] sm:text-[40px] max-w-sm">
          HUNDREDS of New lower prices!
        </h3>
        <p className="text-base sm:text-xl">
          It’s more affordable than ever to give every room in your home a
          stylish makeover
        </p>
        <Button className="w-35" variant="linked">
          Show More
        </Button>
      </Banner>
      <ArticlesSect data={ARTICLES} />
    </>
  );
}
