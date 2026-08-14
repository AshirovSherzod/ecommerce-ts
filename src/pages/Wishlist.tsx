import Seo from "@/components/layout/Seo";
import Empty from "@/components/ui/Empty";
import ProductWrapper from "@/components/ui/ProductWrapper";
import { useWishlistStore } from "@/store";
import img from "@/assets/icons/empty.webp";

export default function Wishlist() {
  const data = useWishlistStore((state) => state.items);

  return (
    <section style={{ minHeight: "calc(100vh - 200px)" }} className="">
      {/* Shaxsiy sahifa — qidiruv indeksiga tushmasligi kerak */}
      <Seo title="Wishlist" description="Products you saved for later." noIndex />
      {data.length === 0 ? (
        <Empty
          title="Wishlist is empty"
          desc="Save the products you like and find them here later"
          image={img}
        />
      ) : (
        <ProductWrapper data={data} title="Wishlist" showMore={false} />
      )}
    </section>
  );
}
