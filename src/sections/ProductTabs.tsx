import { useState } from "react";
import ProductReviews from "@/sections/ProductReviews";
import type { Product } from "@/types/products.types";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "info", label: "Additional Info" },
  { id: "questions", label: "Questions" },
  { id: "reviews", label: "Reviews" },
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
  // Rasmda ochiq turgani "Reviews" — asosiy mazmun shu yerda
  const [tab, setTab] = useState<TabId>("reviews");

  return (
    <section className="max-w-310 mx-auto px-5 my-10 flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="Mahsulot tafsilotlari"
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
            {item.label}
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
              <SpecRow label="Brand" value={product.brand || "—"} />
              <SpecRow
                label="SKU"
                value={product.sku ?? product.id.slice(0, 8).toUpperCase()}
              />
              <SpecRow label="Category" value={categoryTitle ?? "—"} />
              {product.measurements && (
                <SpecRow label="Measurements" value={product.measurements} />
              )}
            </dl>
          </div>
        )}

        {tab === "questions" && (
          <p className="py-10 text-center text-[#6C7275]">
            Hozircha bu mahsulot bo'yicha savollar yo'q
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
