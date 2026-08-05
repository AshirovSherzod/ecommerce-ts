import Articles1 from "@/assets/images/articles-1.png";
import Articles2 from "@/assets/images/articles-2.png";
import Articles3 from "@/assets/images/articles-3.png";
import ArticlesSect from "@/sections/ArticlesSect";
import CategorySect from "@/sections/CategorySect";
import Hero from "@/sections/Hero";
import ServiceSect from "@/sections/ServiceSect";
import SliderSect from "@/sections/SliderSect";
import { Button } from "@/components/ui/Button";
import Banner from "@/components/ui/Banner";
import ProductWrapper from "@/components/ui/ProductWrapper";
import { useGetProducts } from "@/hooks/useProducts";

const data1 = [
  {
    id: "1",
    img: Articles1,
    title: "7 ways to decor your home",
  },
  {
    id: "2",
    img: Articles2,
    title: "Kitchen organization",
  },
  {
    id: "3",
    img: Articles3,
    title: "Decor your bedroom",
  },
];

export default function Home() {
  const { data, isLoading } = useGetProducts({});

  return (
    <>
      <SliderSect />
      <Hero />
      <CategorySect />
      <ProductWrapper data={data?.data.products || []} isLoading={isLoading} />
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
      <ArticlesSect data={data1} />
    </>
  );
}
