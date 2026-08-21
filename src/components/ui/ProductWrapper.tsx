import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import Spinner from "@/components/ui/Spinner";
import type { Product } from "@/types/products.types";
import { useNavigate } from "react-router-dom";

interface ProductWrapperProps {
  data: Product[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  // Wishlist kabi sahifalarda sarlavha va "More Products" tugmasi boshqacha
  title?: string;
  showMore?: boolean;
}

export default function ProductWrapper({
  data,
  isLoading,
  isError,
  error,
  title,
  showMore = true,
}: ProductWrapperProps) {
  const { t } = useTranslation("shop");
  const { t: tCommon } = useTranslation();
  const heading = title ?? t("newArrivals");

  const navigate = useNavigate();

  return (
    <section className="max-w-310 mx-auto px-5 flex flex-col gap-6 sm:gap-10 my-10">
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-medium text-[28px] sm:text-[40px]">{heading}</h3>
        {showMore && (
          <Button onClick={() => navigate("/shop")} variant="linked">
            {t("moreProducts")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="xl" color="dark" />
        </div>
      ) : isError ? (
        // Ilgari xato bo'lsa ham bo'sh to'r ko'rinardi — sabab bilinmasdi
        <p className="py-20 text-center text-[#6C7275]">
          {error instanceof Error
            ? error.message
            : tCommon("errors.productsFailed")}
        </p>
      ) : data.length === 0 ? (
        <p className="py-20 text-center text-[#6C7275]">
          {tCommon("empty.noProducts")}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      )}
    </section>
  );
}
