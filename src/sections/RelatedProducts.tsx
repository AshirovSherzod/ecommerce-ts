import { useTranslation } from "react-i18next";
import ProductWrapper from "@/components/ui/ProductWrapper";
import { useGetProducts } from "@/hooks/useProducts";

interface RelatedProductsProps {
  categoryId: string;
  /** Ochiq turgan mahsulot — o'zini tavsiya qilmaymiz */
  currentId: string;
}

// Bittasi chiqarib tashlanganda ham to'liq qator qolsin
const FETCH_LIMIT = 6;
const SHOW_LIMIT = 5;

export default function RelatedProducts({
  categoryId,
  currentId,
}: RelatedProductsProps) {
  const { t } = useTranslation("shop");

  const { data, isLoading, isError, error } = useGetProducts({
    categoryId,
    limit: FETCH_LIMIT,
  });

  const products = (data?.data?.products ?? [])
    .filter((product) => product.id !== currentId)
    .slice(0, SHOW_LIMIT);

  // Kategoriyada boshqa mahsulot bo'lmasa bo'limni umuman ko'rsatmaymiz —
  // bo'sh sarlavha "hech narsa yo'q" degan taassurot qoldiradi
  if (!isLoading && !isError && products.length === 0) return null;

  return (
    <ProductWrapper
      data={products}
      isLoading={isLoading}
      isError={isError}
      error={error}
      title={t("related")}
    />
  );
}
