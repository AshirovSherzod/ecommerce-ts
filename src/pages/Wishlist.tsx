import { useTranslation } from "react-i18next";
import Seo from "@/components/layout/Seo";
import Empty from "@/components/ui/Empty";
import ProductWrapper from "@/components/ui/ProductWrapper";
import { useWishlistStore } from "@/store";
import img from "@/assets/icons/empty.webp";

export default function Wishlist() {
  const { t } = useTranslation("pages");
  const data = useWishlistStore((state) => state.items);

  return (
    <section style={{ minHeight: "calc(100vh - 200px)" }} className="">
      {/* Shaxsiy sahifa — qidiruv indeksiga tushmasligi kerak */}
      <Seo
        title={t("wishlist.title")}
        description={t("wishlist.description")}
        noIndex
      />
      {data.length === 0 ? (
        <Empty
          title={t("wishlist.emptyTitle")}
          desc={t("wishlist.emptyDesc")}
          image={img}
        />
      ) : (
        <ProductWrapper data={data} title={t("wishlist.title")} showMore={false} />
      )}
    </section>
  );
}
