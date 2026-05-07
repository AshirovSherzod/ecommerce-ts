import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { useGetProducts } from "@/hooks/useProducts";
import type { ProductQueryParams } from "@/types/products.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductWrapper() {
  const [params, setParams] = useState<ProductQueryParams>({});
  const navigate = useNavigate();
  const { data, isLoading } = useGetProducts(params);

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
        {data?.data.products.map((product) => (
          <ProductCard data={product} />
        ))}
      </div>
    </section>
  );
}
