import { useEffect, useId, useRef, useState } from "react";
import { BsCheck2, BsChevronDown } from "react-icons/bs";
import { cn } from "@/utils/cn";

export interface SelectOption<T extends string> {
  id: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  // Tanlangan qiymat oldidan chiqadigan kulrang yozuv, masalan "Sort by"
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  ariaLabel,
  className,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find((option) => option.id === value);

  // Tashqariga bosilganda yopiladi
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const openMenu = () => {
    const currentIndex = options.findIndex((option) => option.id === value);
    setActiveIndex(currentIndex === -1 ? 0 : currentIndex);
    setOpen(true);
  };

  const selectAt = (index: number) => {
    const option = options[index];

    if (option) {
      onChange(option.id);
    }

    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      return;
    }

    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter") {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectAt(activeIndex);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn("relative", className)}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={cn(
          "w-full h-9 pl-3 pr-2 flex items-center justify-between gap-2",
          "border rounded-md bg-white text-[14px] transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141718] focus-visible:ring-offset-1",
          open ? "border-[#141718]" : "border-[#E8ECEF] hover:border-[#6C7275]",
        )}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          {label && <span className="text-[#6C7275] shrink-0">{label}</span>}
          <span className="font-medium text-[#141718] truncate">
            {selected?.label}
          </span>
        </span>
        <BsChevronDown
          className={cn(
            "shrink-0 text-[#6C7275] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel ?? label}
          className="absolute right-0 top-full z-20 mt-2 w-max min-w-full py-1 bg-white border border-[#E8ECEF] rounded-md shadow-[0px_8px_24px_-4px_rgba(15,15,15,0.15)]"
        >
          {options.map((option, index) => {
            const isSelected = option.id === value;

            return (
              <li
                key={option.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectAt(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex items-center justify-between gap-6 px-3 py-2 text-[14px] cursor-pointer",
                  index === activeIndex ? "bg-[#F3F5F7]" : "bg-white",
                  isSelected ? "text-[#141718] font-medium" : "text-[#6C7275]",
                )}
              >
                {option.label}
                {isSelected && <BsCheck2 className="text-base shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
