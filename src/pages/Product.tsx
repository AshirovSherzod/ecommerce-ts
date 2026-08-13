import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import Countdown from "@/components/ui/Countdown";
import ProductGallery from "@/components/ui/ProductGallery";
import Rating from "@/components/ui/Rating";
import Spinner from "@/components/ui/Spinner";
import ProductTabs from "@/sections/ProductTabs";
import { useGetCategory } from "@/hooks/useCategories";
import { useGetProduct } from "@/hooks/useProducts";
import { useProductReviews } from "@/hooks/useProductReviews";
import { useCartStore, useWishlistStore } from "@/store";
import { SALE_ENDS_AT } from "@/utils/constants";
import { formatPrice } from "@/utils/formatPrice";

const NEW_PRODUCT_DAYS = 30;

const isNewProduct = (createdAt: string) => {
  const created = new Date(createdAt).getTime();

  if (Number.isNaN(created)) return false;

  return Date.now() - created < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
};

export default function Product() {
  const { id = "" } = useParams();

  // Boshqa mahsulotga o'tilganda komponent qayta mount bo'ladi — aks holda
  // oldingi mahsulotdan qolgan quantity va rasm indeksi saqlanib qolardi
  return <ProductDetail key={id} id={id} />;
}

function ProductDetail({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError, error } = useGetProduct(id);
  const { data: category } = useGetCategory(product?.categoryId ?? "");

  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const inWishlist = useWishlistStore((state) =>
    state.items.some((item) => item.id === id),
  );

  // Reyting endi o'ylab topilgan emas — sharhlar o'rtachasidan hisoblanadi
  const reviews = useProductReviews(id);

  if (isLoading) {
    return (
      <section
        style={{ minHeight: "calc(100vh - 200px)" }}
        className="flex justify-center items-center"
      >
        <Spinner size="xl" color="dark" />
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section
        style={{ minHeight: "calc(100vh - 200px)" }}
        className="px-5 flex flex-col items-center justify-center gap-4 text-center"
      >
        <h1 className="font-medium text-2xl">Mahsulot topilmadi</h1>
        <p className="text-[#6C7275]">
          {error instanceof Error
            ? error.message
            : "Bu mahsulot o'chirilgan yoki manzil noto'g'ri"}
        </p>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </section>
    );
  }

  const oldPrice = product.oldPrice;
  const hasDiscount = oldPrice != null && oldPrice > product.price;
  const saleEndsAt = product.saleEndsAt ?? SALE_ENDS_AT;

  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - product.price) / oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success("Mahsulot savatga qo'shildi");
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      return;
    }

    addToWishlist(product);
  };

  const badges = (
    <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
      {isNewProduct(product.createdAt) && (
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

  return (
    <>
      <section className="max-w-310 mx-auto px-5 my-5 sm:my-7 flex flex-col gap-5">
        <p className="text-[14px] text-[#6C7275] flex flex-wrap items-center gap-2">
          <Link className="hover:text-[#141718]" to="/">
            Home
          </Link>
          <span>&rsaquo;</span>
          <Link className="hover:text-[#141718]" to="/shop">
            Shop
          </Link>
          {category && (
            <>
              <span>&rsaquo;</span>
              <Link
                className="hover:text-[#141718]"
                to={`/shop?category=${product.categoryId}`}
              >
                {category.title}
              </Link>
            </>
          )}
          <span>&rsaquo;</span>
          <span className="text-[#141718] font-medium">{product.title}</span>
        </p>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-full lg:w-[45%]">
            <ProductGallery
              images={product.images}
              alt={product.title}
              badges={badges}
            />
          </div>

          {/* Kenglik cheklangan: aks holda ajratuvchi chiziqlar kontentdan
            ancha uzun bo'lib, blok bo'sh ko'rinardi */}
          <div className="w-full lg:w-[55%] max-w-125 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Rating rating={reviews.average} showValue={false} size="sm" />
                <span className="text-[13px] text-[#6C7275]">
                  {reviews.count} {reviews.count === 1 ? "Review" : "Reviews"}
                </span>
              </div>
              <h1 className="font-medium text-[22px] sm:text-[26px]/[32px]">
                {product.title}
              </h1>
              <p className="text-[14px]/[22px] text-[#6C7275] max-w-lg">
                {product.description}
              </p>
              <p className="flex items-baseline gap-3">
                <span className="font-medium text-xl sm:text-2xl">
                  {formatPrice(product.price, product.currency)}
                </span>
                {hasDiscount && (
                  <span className="line-through text-base text-[#6C7275]">
                    {formatPrice(oldPrice, product.currency)}
                  </span>
                )}
              </p>
            </div>

            {hasDiscount && saleEndsAt && (
              <div className="pt-5 border-t border-[#E8ECEF]">
                <Countdown deadline={saleEndsAt} />
              </div>
            )}

            {/* SKU, kategoriya, brend va o'lchamlar "Additional Info"
                tabiga ko'chirildi — bu yerda takrorlanmaydi */}

            {/* Ajratuvchi chiziq to'liq ustun kengligida qoladi (boshqalari
              bilan bir xil), kenglik cheklovi faqat tugmalarga tegishli */}
            <div className="pt-5 border-t border-[#E8ECEF]">
              <div className="flex flex-col gap-3 max-w-100">
                <div className="flex gap-3">
                  <Counter
                    variant="secondary"
                    counter={quantity}
                    setCounter={setQuantity}
                    min={1}
                    className="w-28 h-11 px-3 shrink-0"
                  />
                  <button
                    type="button"
                    onClick={toggleWishlist}
                    className="flex-1 h-11 px-4 flex items-center justify-center gap-2 border border-[#141718] rounded-lg text-[14px] font-medium transition-colors hover:bg-[#F3F5F7]"
                  >
                    {inWishlist ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                    Wishlist
                  </button>
                </div>

                <Button onClick={handleAddToCart} className="w-full h-11">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductTabs product={product} categoryTitle={category?.title} />
    </>
  );
}
