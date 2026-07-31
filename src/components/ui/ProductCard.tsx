import { Button } from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import { useCartStore, useWishlistStore } from "@/store";
import type { Product } from "@/types/products.types";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface ProductProps {
  data: Product;
}

export default function ProductCard({ data }: ProductProps) {
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const inWishlist = useWishlistStore((state) =>
    state.items.some((item) => item.id === data.id),
  );

  const addToCart = useCartStore((state) => state.addItem);
  const inCart = useCartStore((state) =>
    state.items.some((item) => item.id === data.id),
  );

  const discountPercentage =
    data.oldPrice && data.oldPrice > data.price
      ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100)
      : 0;
  const imageUrl = data.images?.[0] || "/placeholder-product.jpg";

  // Yurakcha ikonkasi — wishlist
  const toggleWishlist = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(data.id);
    } else {
      addToWishlist(data);
    }
  };

  // Pastdagi qora tugma — savatcha
  const handleAddToCart = () => {
    addToCart(data, 1);
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
          onClick={toggleWishlist}
          type="button"
          aria-label={
            inWishlist ? "Wishlist'dan olib tashlash" : "Wishlist'ga qo'shish"
          }
          className="absolute w-8 h-8 top-3 flex items-center justify-center bg-white rounded-full -right-full opacity-0 group-hover:right-3 group-hover:opacity-100 duration-500 shadow-[0px_8px_24px_-4px_rgba(15,15,15,0.25)]"
        >
          {inWishlist ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-700 text-xl" />
          )}
        </button>
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-[#38CB89] text-white px-4 py-1 rounded-sm text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}
        <Button
          onClick={handleAddToCart}
          type="button"
          className="absolute -bottom-full group-hover:bottom-1 w-full h-8.5 duration-500"
        >
          {inCart ? "Add More" : "Add to Cart"}
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
