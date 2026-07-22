import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";
import type { InspirationSort } from "../types";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

export interface InspirationFilterPopoverProps<C extends string> {
  categories: FilterOption<C>[];
  category: C;
  onCategoryChange: (value: C) => void;
  sortOptions: FilterOption<InspirationSort>[];
  sort: InspirationSort;
  onSortChange: (value: InspirationSort) => void;
  onClear: () => void;
}

/**
 * Filter popover for the Inspiration list: single-select category list +
 * single-select sort list, each row showing a trailing checkmark when
 * selected. Scoped to Inspiration — its single-select shape differs from
 * the generic multi-select `FilterPopover`.
 */
export function InspirationFilterPopover<C extends string>({
  categories,
  category,
  onCategoryChange,
  sortOptions,
  sort,
  onSortChange,
  onClear,
}: InspirationFilterPopoverProps<C>) {
  const isActive = category !== "all" || sort !== "recent";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Filters"
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-search text-text-tertiary transition-colors duration-fast ease-out",
            "bg-cream-100 hover:bg-cream-200 hover:text-text-primary",
            "data-[state=open]:bg-cream-200 data-[state=open]:text-text-primary",
          )}
        >
          <Icon name="sliders" size={17} />
          {isActive && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sage-600" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-[14px] font-medium text-text-primary">Filters</span>
          <button
            type="button"
            onClick={onClear}
            className="text-[12.5px] text-text-tertiary transition-colors duration-fast ease-out hover:text-text-primary"
          >
            Clear all
          </button>
        </div>
        <div className="border-t border-border-subtle" />

        <FilterSection eyebrow="Category">
          {categories.map((option) => (
            <FilterRow
              key={option.value}
              label={option.label}
              selected={option.value === category}
              onClick={() => onCategoryChange(option.value)}
            />
          ))}
        </FilterSection>

        <div className="border-t border-border-subtle" />

        <FilterSection eyebrow="Sort by">
          {sortOptions.map((option) => (
            <FilterRow
              key={option.value}
              label={option.label}
              selected={option.value === sort}
              onClick={() => onSortChange(option.value)}
            />
          ))}
        </FilterSection>
      </PopoverContent>
    </Popover>
  );
}

function FilterSection({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 px-1.5 py-2">
      <p className="eyebrow px-1.5 pb-1 text-text-tertiary">{eyebrow}</p>
      {children}
    </div>
  );
}

function FilterRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-chip px-1.5 py-1.5 text-[13px] transition-colors duration-fast ease-out",
        selected ? "bg-cream-100 font-medium text-text-primary" : "text-text-secondary hover:bg-cream-100",
      )}
    >
      <span>{label}</span>
      {selected && <Icon name="check" size={14} className="text-sage-700" />}
    </button>
  );
}
