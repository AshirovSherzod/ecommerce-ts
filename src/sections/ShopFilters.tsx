import { useId, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Button } from "@/components/ui/Button";
import SearchBox from "@/components/ui/SearchBox";
import type { Category } from "@/types/category.types";

export interface ShopFilterValues {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
}

interface ShopFiltersProps {
  values: ShopFilterValues;
  categories: Category[];
  brands: string[];
  onChange: (patch: Partial<ShopFilterValues>) => void;
  onClear: () => void;
}

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// Akkordeon: sarlavhaga bosilganda guruh yig'iladi/ochiladi
function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="flex flex-col py-4 border-b border-[#E8ECEF] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex items-center justify-between gap-3 text-[12px] font-bold tracking-wide text-[#141718]"
      >
        {title}
        <BsChevronDown
          className={`text-[#6C7275] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div id={contentId} className="flex flex-col gap-3 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface RadioRowProps {
  name: string;
  label: string;
  count?: number;
  checked: boolean;
  onSelect: () => void;
}

function RadioRow({ name, label, count, checked, onSelect }: RadioRowProps) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer text-[14px]">
      <span className="flex items-center gap-3 min-w-0">
        <input
          className="accent-[#141718] shrink-0"
          type="radio"
          name={name}
          checked={checked}
          onChange={onSelect}
        />
        <span className={`truncate ${checked ? "text-[#141718] font-medium" : "text-[#6C7275]"}`}>
          {label}
        </span>
      </span>
      {count !== undefined && (
        <span className="text-[12px] text-[#6C7275] shrink-0">{count}</span>
      )}
    </label>
  );
}

interface PriceFilterProps {
  min: string;
  max: string;
  onApply: (min: string, max: string) => void;
}

// Har bosilganda so'rov ketmasligi uchun qiymatlar shu yerda saqlanadi va
// faqat "Apply" bosilganda yuqoriga uzatiladi. Tashqaridan (masalan "Clear
// all") o'zgarganda ota-komponent `key` orqali qayta mount qiladi.
function PriceFilter({ min, max, onApply }: PriceFilterProps) {
  const [minDraft, setMinDraft] = useState(min);
  const [maxDraft, setMaxDraft] = useState(max);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onApply(minDraft.trim(), maxDraft.trim());
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <input
          className="w-full min-w-0 h-9 px-3 border border-[#E8ECEF] rounded-md outline-none text-[14px]"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="Min"
          aria-label="Eng past narx"
          value={minDraft}
          onChange={(e) => setMinDraft(e.target.value)}
        />
        <span className="text-[#6C7275]">—</span>
        <input
          className="w-full min-w-0 h-9 px-3 border border-[#E8ECEF] rounded-md outline-none text-[14px]"
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="Max"
          aria-label="Eng yuqori narx"
          value={maxDraft}
          onChange={(e) => setMaxDraft(e.target.value)}
        />
      </div>
      <Button type="submit" variant="secondary" size="sm" className="w-full">
        Apply
      </Button>
    </form>
  );
}

export default function ShopFilters({
  values,
  categories,
  brands,
  onChange,
  onClear,
}: ShopFiltersProps) {
  const hasActiveFilter =
    !!values.search ||
    !!values.category ||
    !!values.brand ||
    !!values.minPrice ||
    !!values.maxPrice;

  return (
    <div className="flex flex-col">
      {/* `key` — qidiruv tashqaridan o'zgarsa (masalan header orqali)
          maydon yangi qiymat bilan qayta chiziladi */}
      <div className="pb-4 border-b border-[#E8ECEF]">
        <SearchBox
          key={values.search}
          label="Katalogdan qidirish"
          defaultValue={values.search}
          onSubmit={(term) => onChange({ search: term })}
        />
      </div>

      <FilterGroup title="CATEGORIES">
        <RadioRow
          name="category"
          label="All Rooms"
          checked={!values.category}
          onSelect={() => onChange({ category: "" })}
        />
        {categories.map((category) => (
          <RadioRow
            key={category.id}
            name="category"
            label={category.title}
            count={category.productsCount}
            checked={values.category === category.id}
            onSelect={() => onChange({ category: category.id })}
          />
        ))}
        {categories.length === 0 && (
          <p className="text-[13px] text-[#6C7275]">Kategoriyalar topilmadi</p>
        )}
      </FilterGroup>

      <FilterGroup title="PRICE">
        <PriceFilter
          key={`${values.minPrice}-${values.maxPrice}`}
          min={values.minPrice}
          max={values.maxPrice}
          onApply={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
        />
      </FilterGroup>

      <FilterGroup title="BRAND">
        <RadioRow
          name="brand"
          label="All Brands"
          checked={!values.brand}
          onSelect={() => onChange({ brand: "" })}
        />
        {brands.map((brand) => (
          <RadioRow
            key={brand}
            name="brand"
            label={brand}
            checked={values.brand === brand}
            onSelect={() => onChange({ brand })}
          />
        ))}
        {brands.length === 0 && (
          <p className="text-[13px] text-[#6C7275]">Brendlar topilmadi</p>
        )}
      </FilterGroup>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 text-[14px] text-[#6C7275] hover:text-[#141718] border-b w-fit"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
