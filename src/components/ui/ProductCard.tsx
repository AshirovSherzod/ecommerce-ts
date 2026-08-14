import { Button } from "@/components/ui/Button";
import Rating from "@/components/ui/Rating";
import { useCartStore, useWishlistStore } from "@/store";
import type { Product } from "@/types/products.types";
import {
  currencyMismatchMessage,
  PRODUCT_PLACEHOLDER,
  STORE_CURRENCY,
} from "@/utils/constants";
import { formatPrice } from "@/utils/formatPrice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type Variant = "grid" | "list";

interface ProductProps {
  data: Product;
  variant?: Variant;
}

// So'nggi 30 kun ichida qo'shilgan mahsulotlar "NEW" belgisini oladi
const NEW_PRODUCT_DAYS = 30;

const isNewProduct = (createdAt: string) => {
  const created = new Date(createdAt).getTime();

  if (Number.isNaN(created)) return false;

  return Date.now() - created < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
};

export default function ProductCard({ data, variant = "grid" }: ProductProps) {
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
  const imageUrl = data.images?.[0] || PRODUCT_PLACEHOLDER;
  const isNew = isNewProduct(data.createdAt);

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
    const cartCurrency = useCartStore.getState().getCurrency();

    if (!addToCart(data, 1)) {
      toast.error(currencyMismatchMessage(cartCurrency ?? STORE_CURRENCY));
      return;
    }

    toast.success("Mahsulot savatga qo'shildi");
  };

  const badges = (
    <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
      {isNew && (
        <span className="bg-white text-[#141718] px-3 py-1 rounded-sm text-[12px] font-semibold">
          NEW
        </span>
      )}
      {discountPercentage > 0 && (
        <span className="bg-[#38CB89] text-white px-3 py-1 rounded-sm text-[12px] font-semibold">
          -{discountPercentage}%
        </span>
      )}
    </div>
  );

  const price = (
    <p className="flex gap-3">
      <span className="font-semibold">
        {formatPrice(data.price, data.currency)}
      </span>
      {data.oldPrice !== null && data.oldPrice > data.price && (
        <span className="line-through text-[#6C7275]">
          {formatPrice(data.oldPrice, data.currency)}
        </span>
      )}
    </p>
  );

  const wishlistLabel = inWishlist
    ? "Wishlist'dan olib tashlash"
    : "Wishlist'ga qo'shish";

  const detailUrl = `/shop/${data.id}`;

  if (variant === "list") {
    return (
      <div className="flex gap-4 sm:gap-6 py-6 border-b border-[#E8ECEF]">
        <div className="relative w-30 h-35 sm:w-50 sm:h-55 shrink-0 bg-[#F3F5F7] overflow-hidden">
          <Link to={detailUrl} className="block w-full h-full">
            <img
              className="w-full h-full object-contain object-center"
              src={imageUrl}
              alt={data.title}
              loading="lazy"
            />
          </Link>
          {badges}
        </div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <Rating rating={4.5} />
          <h3 className="font-semibold">
            <Link className="hover:underline" to={detailUrl}>
              {data.title}
            </Link>
          </h3>
          <p className="text-[14px] text-[#6C7275] line-clamp-2">
            {data.description}
          </p>
          {price}
          <div className="flex items-center gap-3 mt-auto pt-2">
            <Button onClick={handleAddToCart} className="w-40 h-9">
              {inCart ? "Add More" : "Add to Cart"}
            </Button>
            <button
              onClick={toggleWishlist}
              type="button"
              aria-label={wishlistLabel}
              className="w-9 h-9 flex items-center justify-center border border-[#E8ECEF] rounded-md"
            >
              {inWishlist ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="relative w-full h-50 sm:h-62.5 group overflow-hidden">
        {/* Havola tugmalarni o'rab olmaydi — aks holda tugma link ichida
            qolib, noto'g'ri HTML va noto'g'ri bosish hosil bo'ladi */}
        <Link to={detailUrl} className="block w-full h-full">
          <img
            className="w-full h-full object-contain object-center"
            src={imageUrl}
            alt={data.title}
            loading="lazy"
          />
        </Link>
        <button
          onClick={toggleWishlist}
          type="button"
          aria-label={wishlistLabel}
          className="absolute w-8 h-8 top-3 right-3 opacity-100 flex items-center justify-center bg-white rounded-full md:-right-full md:opacity-0 md:group-hover:right-3 md:group-hover:opacity-100 duration-500 shadow-[0px_8px_24px_-4px_rgba(15,15,15,0.25)]"
        >
          {inWishlist ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-700 text-xl" />
          )}
        </button>
        {badges}
        <Button
          onClick={handleAddToCart}
          type="button"
          className="absolute bottom-1 md:-bottom-full md:group-hover:bottom-1 w-full h-8.5 duration-500"
        >
          {inCart ? "Add More" : "Add to Cart"}
        </Button>
      </div>
      <div className="">
        <Rating rating={4.5} />
        <h3 className="font-semibold">
          <Link className="hover:underline" to={detailUrl}>
            {data.title}
          </Link>
        </h3>
        {price}
      </div>
    </div>
  );
}
