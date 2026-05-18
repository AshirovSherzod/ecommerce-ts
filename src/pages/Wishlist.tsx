import Empty from "@/components/ui/Empty";
import ProductWrapper from "@/components/ui/ProductWrapper";
import { useWishlistStore } from "@/store";
import img from "@/assets/icons/empty.webp";

export default function Wishlist() {
  const data = useWishlistStore((state) => state.items);

  return (
    <main style={{ minHeight: "calc(100vh)" }} className="">
      {data.length === 0 ? (
        <Empty
          title="Wishlist is empty"
          desc="You can full this by you like"
          image={img}
        />
      ) : (
        <></>
      )}
      <ProductWrapper data={data || []} />
    </main>
  );
}
