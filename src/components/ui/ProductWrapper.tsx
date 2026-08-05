import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import Spinner from "@/components/ui/Spinner";
import type { Product } from "@/types/products.types";
import { useNavigate } from "react-router-dom";

interface ProductWrapperProps {
  data: Product[];
  isLoading?: boolean;
  // Wishlist kabi sahifalarda sarlavha va "More Products" tugmasi boshqacha
  title?: string;
  showMore?: boolean;
}

export default function ProductWrapper({
  data,
  isLoading,
  title = "New Arrivals",
  showMore = true,
}: ProductWrapperProps) {
  const navigate = useNavigate();

  return (
    <section className="max-w-310 mx-auto px-5 flex flex-col gap-6 sm:gap-10 my-10">
      <div className="flex justify-between items-center gap-4">
        <h3 className="font-medium text-[28px] sm:text-[40px]">{title}</h3>
        {showMore && (
          <Button onClick={() => navigate("/shop")} variant="linked">
            More Products
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="xl" color="dark" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {data?.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      )}
    </section>
  );
}
