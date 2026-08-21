import { useState } from "react";
import ProductReviews from "@/sections/ProductReviews";
import type { Product } from "@/types/products.types";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "info", key: "tabs.info" },
  { id: "questions", key: "tabs.questions" },
  { id: "reviews", key: "tabs.reviews" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface ProductTabsProps {
  product: Product;
  categoryTitle?: string;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-6 py-3 border-b border-[#E8ECEF] last:border-b-0">
      <dt className="w-32 shrink-0 text-[13px] text-[#6C7275]">{label}</dt>
      <dd className="text-[14px]">{value}</dd>
    </div>
  );
}

export default function ProductTabs({
  product,
  categoryTitle,
}: ProductTabsProps) {
  const { t } = useTranslation("shop");
  const { t: tCommon } = useTranslation();

  // Rasmda ochiq turgani "Reviews" — asosiy mazmun shu yerda
  const [tab, setTab] = useState<TabId>("reviews");

  return (
    <section className="max-w-310 mx-auto px-5 my-10 flex flex-col gap-8">
      <div
        role="tablist"
        aria-label={t("tabs.ariaLabel")}
        className="flex gap-6 sm:gap-10 border-b border-[#E8ECEF] overflow-x-auto no-scrollbar"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={cn(
              "shrink-0 pb-3 -mb-px border-b-2 transition-colors",
              tab === item.id
                ? "border-[#141718] text-[#141718] font-medium"
                : "border-transparent text-[#6C7275] hover:text-[#141718]",
            )}
          >
            {t(item.key)}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="max-w-4xl"
      >
        {tab === "info" && (
          <div className="flex flex-col gap-4">
            <p className="text-[14px]/[24px] text-[#6C7275]">
              {product.description}
            </p>
            <dl className="flex flex-col">
              <SpecRow label={tCommon("labels.brand")} value={product.brand || "—"} />
              <SpecRow
                label={tCommon("labels.sku")}
                value={product.sku ?? product.id.slice(0, 8).toUpperCase()}
              />
              <SpecRow label={tCommon("labels.category")} value={categoryTitle ?? "—"} />
              {product.measurements && (
                <SpecRow label={t("product.measurements")} value={product.measurements} />
              )}
            </dl>
          </div>
        )}

        {tab === "questions" && (
          <p className="py-10 text-center text-[#6C7275]">
            {t("tabs.noQuestions")}
          </p>
        )}

        {tab === "reviews" && (
          <ProductReviews
            productId={product.id}
            productTitle={product.title}
          />
        )}
      </div>
    </section>
  );
}
