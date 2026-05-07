import { Button } from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import type { Product } from "@/types/products.types";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface ProductProps {
  data: Product;
}

export default function ProductCard({ data }: ProductProps) {
  const [isLiked, setIsLiked] = useState(false);

  const discountPercentage = data.oldPrice
    ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100)
    : null;
  const imageUrl = data.images?.[0] || "/placeholder-product.jpg";

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="">
      <div className="relative w-full h-62.5 group overflow-hidden">
        <img
          className="w-full h-full object-contain object-center"
          src={imageUrl}
          alt={data.title}
          loading="lazy"
        />
        <button
          onClick={handleLikeClick}
          className="absolute w-8 h-8 top-3 flex items-center justify-center bg-white rounded-full -right-full opacity-0 group-hover:right-3 group-hover:opacity-100 duration-500 shadow-[0px_8px_24px_-4px_rgba(15,15,15,0.25)]"
        >
          {isLiked ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-700 text-xl" />
          )}
        </button>
        {discountPercentage && (
          <div className="absolute top-3 left-3 bg-[#38CB89] text-white px-4 py-1 rounded-sm text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}
        <Button className="absolute -bottom-full group-hover:bottom-1 w-full h-8.5 duration-500">
          Wishlist
        </Button>
      </div>
      <div className="">
        <Rating rating={4.5} />
        <h3 className="font-semibold">{data.title}</h3>
        <p className="flex gap-3">
          <span className="font-semibold">${data.price}</span>
          {data.oldPrice && (
            <span className="line-through text-[#6C7275]">
              ${data.oldPrice}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
