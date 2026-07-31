import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types/products.types";
import { useNavigate } from "react-router-dom";

interface ProductWrapperProps {
  data: Product[];
  isLoading?: boolean;
}

export default function ProductWrapper({
  data,
  isLoading,
}: ProductWrapperProps) {
  const navigate = useNavigate();

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <section className="max-w-310 mx-auto px-5 flex flex-col gap-10 my-10">
      <div className="flex justify-between">
        <h3 className="font-medium text-[40px]">New Arrivals</h3>
        <Button onClick={() => navigate("/shop")} variant="linked">
          More Products
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 grid-rows-2 gap-6">
        {data?.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  );
}
