import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BsFilter, BsGrid3X2Gap, BsGrid3X3Gap, BsList } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import Seo from "@/components/layout/Seo";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { Select } from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import ShopFilters, { type ShopFilterValues } from "@/sections/ShopFilters";
import ShopHero from "@/sections/ShopHero";
import { useGetCategories } from "@/hooks/useCategories";
import { useGetInfiniteProducts, useGetProducts } from "@/hooks/useProducts";
import type { ProductQueryParams } from "@/types/products.types";

const PAGE_SIZE = 9;
// Brend ro'yxatini yig'ish uchun alohida so'rov — brend filtri yoqilganda
// ham to'liq ro'yxat ko'rinib tursin
const BRAND_SOURCE_LIMIT = 100;

const VIEW_MODES = [
  {
    id: "grid-3",
    key: "view.grid3",
    icon: BsGrid3X2Gap,
    className: "grid grid-cols-2 md:grid-cols-3 gap-6",
  },
  {
    id: "grid-4",
    key: "view.grid4",
    icon: BsGrid3X3Gap,
    className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6",
  },
  {
    id: "list",
    key: "view.list",
    icon: BsList,
    className: "flex flex-col",
  },
] as const;

type ViewId = (typeof VIEW_MODES)[number]["id"];

const SORT_OPTIONS = [
  { id: "newest", key: "sort.newest" },
  { id: "price-asc", key: "sort.priceAsc" },
  { id: "price-desc", key: "sort.priceDesc" },
  { id: "name-asc", key: "sort.nameAsc" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

// URL'dagi qiymatni qo'lda o'zgartirish mumkin — `?minPrice=abc` bo'lsa
// `Number()` NaN qaytaradi va so'rovga `minPrice=NaN` bo'lib ketardi
const toPrice = (raw: string) => {
  if (!raw.trim()) return undefined;

  const value = Number(raw);

  return Number.isFinite(value) && value >= 0 ? value : undefined;
};

export default function Shop() {
  const { t } = useTranslation("shop");
  const { t: tCommon } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortId>("newest");
  const [view, setView] = useState<ViewId>("grid-3");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const values: ShopFilterValues = {
    search: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "",
    brand: searchParams.get("brand") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
  };

  const handleFilterChange = (patch: Partial<ShopFilterValues>) => {
    const next = { ...values, ...patch };
    const params = new URLSearchParams();

    // Qidiruv ham saqlanadi: kategoriya tanlaganda qidiruv so'zi
    // yo'qolib ketsa foydalanuvchi natijani qaytadan izlashi kerak bo'lardi
    if (next.search) params.set("q", next.search);
    if (next.category) params.set("category", next.category);
    if (next.brand) params.set("brand", next.brand);
    if (next.minPrice) params.set("minPrice", next.minPrice);
    if (next.maxPrice) params.set("maxPrice", next.maxPrice);

    setSearchParams(params);
  };

  const queryParams = useMemo(() => {
    const params: Omit<ProductQueryParams, "page"> = { limit: PAGE_SIZE };

    if (values.search) params.search = values.search;
    if (values.category) params.categoryId = values.category;
    if (values.brand) params.brand = values.brand;

    const minPrice = toPrice(values.minPrice);
    const maxPrice = toPrice(values.maxPrice);

    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    return params;
  }, [
    values.search,
    values.category,
    values.brand,
    values.minPrice,
    values.maxPrice,
  ]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteProducts(queryParams);

  const { data: categoryData } = useGetCategories();
  const { data: brandSource } = useGetProducts({ limit: BRAND_SOURCE_LIMIT });

  const categories = categoryData?.data?.categories ?? [];

  const brands = useMemo(() => {
    const list = brandSource?.data?.products ?? [];
    return [...new Set(list.map((item) => item.brand).filter(Boolean))].sort();
  }, [brandSource]);

  const products = useMemo(
    () => data?.pages.flatMap((page) => page?.data?.products ?? []) ?? [],
    [data],
  );

  // API'da sort parametri yo'q — yuklangan mahsulotlar ustidan saralaymiz
  const sortedProducts = useMemo(() => {
    const list = [...products];

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
  }, [products, sort]);

  const total = data?.pages[0]?.data?.pagination?.total ?? 0;
  const activeCategory = categories.find(
    (category) => category.id === values.category,
  );
  const heading = values.search
    ? t("heading.searchResults", { term: values.search })
    : (activeCategory?.title ?? t("heading.allRooms"));
  const viewConfig =
    VIEW_MODES.find((mode) => mode.id === view) ?? VIEW_MODES[0];

  const filters = (
    <ShopFilters
      values={values}
      categories={categories}
      brands={brands}
      onChange={handleFilterChange}
      onClear={() => setSearchParams(new URLSearchParams())}
    />
  );

  return (
    <>
      {/* Kategoriya tanlanganda sarlavha ham shunga moslashadi */}
      <Seo
        title={activeCategory ? activeCategory.title : t("hero.breadcrumb")}
        description={
          activeCategory
            ? t("seoCategory", { category: activeCategory.title })
            : t("seoDescription")
        }
      />
      <ShopHero />

      <section className="max-w-310 mx-auto px-5 my-10 flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-65 shrink-0">{filters}</aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
            <div className="flex items-baseline gap-2">
              <h2 className="font-medium text-2xl sm:text-[28px]">{heading}</h2>
              {total > 0 && (
                <span className="text-[14px] text-[#6C7275]">({total})</span>
              )}
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() => setFiltersOpen((prev) => !prev)}
                className="lg:hidden flex items-center gap-2 h-9 px-3 border border-[#E8ECEF] rounded-md text-[14px]"
              >
                <BsFilter className="text-lg" />
                {t("filters.title")}
              </button>

              <Select
                value={sort}
                options={SORT_OPTIONS.map((option) => ({
                  id: option.id,
                  label: t(option.key),
                }))}
                onChange={setSort}
                label={t("sort.label")}
                ariaLabel={tCommon("a11y.sort")}
                className="w-45"
              />

              <div className="hidden sm:flex items-center gap-1">
                {VIEW_MODES.map((mode) => {
                  const Icon = mode.icon;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      aria-label={t(mode.key)}
                      aria-pressed={view === mode.id}
                      onClick={() => setView(mode.id)}
                      className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
                        view === mode.id
                          ? "bg-[#F3F5F7] text-[#141718]"
                          : "text-[#6C7275] hover:text-[#141718]"
                      }`}
                    >
                      <Icon className="text-lg" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {filtersOpen && (
            <div className="lg:hidden mb-6 p-4 border border-[#E8ECEF] rounded-md">
              {filters}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="xl" color="dark" />
            </div>
          ) : isError ? (
            <p className="py-20 text-center text-[#6C7275]">
              {error instanceof Error
                ? error.message
                : tCommon("errors.productsFailed")}
            </p>
          ) : sortedProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <p className="text-[#6C7275]">
                {values.search
                  ? t("empty.noSearchMatch", { term: values.search })
                  : t("empty.noMatch")}
              </p>
              <Button
                variant="secondary"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                {t("filters.clearAll")}
              </Button>
            </div>
          ) : (
            <div className={viewConfig.className}>
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  data={product}
                  variant={view === "list" ? "list" : "grid"}
                />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center pt-10">
              <Button
                variant="secondary"
                border="rounded"
                size="lg"
                isLoading={isFetchingNextPage}
                onClick={() => {
                  void fetchNextPage();
                }}
              >
                {tCommon("actions.showMore")}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
