import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SortSelect, type SortOption } from "./SortSelect";
import { cn } from "@/lib/utils";

export interface FilterCategory {
  value: string;
  label: string;
  count?: number;
}

export interface FilterPopoverProps<S extends string> {
  /** Category list — parametrized per screen, never copy-pasted. */
  categories: FilterCategory[];
  selectedCategories: string[];
  onToggleCategory: (value: string) => void;
  /** Optional sort section. Omit to hide it entirely. */
  sortOptions?: SortOption<S>[];
  sortValue?: S;
  onSortChange?: (value: S) => void;
  triggerLabel?: string;
  className?: string;
}

/**
 * ONE reusable filter popover — a category list plus an optional sort
 * section, driven entirely by props. Every module reuses this rather than
 * hand-rolling its own filter UI.
 */
export function FilterPopover<S extends string>({
  categories,
  selectedCategories,
  onToggleCategory,
  sortOptions,
  sortValue,
  onSortChange,
  triggerLabel = "Filter",
  className,
}: FilterPopoverProps<S>) {
  const activeCount = selectedCategories.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="md" className={className}>
          {triggerLabel}
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-sage-900 px-1.5 text-[11px] text-cream-50">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-2">
            <p className="eyebrow text-text-tertiary">Categories</p>
            <div className="flex flex-col gap-0.5">
              {categories.map((category) => {
                const selected = selectedCategories.includes(category.value);
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => onToggleCategory(category.value)}
                    className={cn(
                      "flex items-center justify-between rounded-chip px-2 py-1.5 text-[13px] transition-colors duration-fast ease-out",
                      selected
                        ? "bg-sage-100 text-sage-900"
                        : "text-text-secondary hover:bg-cream-100",
                    )}
                  >
                    <span>{category.label}</span>
                    {category.count !== undefined && (
                      <span className="text-text-tertiary">{category.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {sortOptions && sortValue !== undefined && onSortChange && (
            <section className="flex flex-col gap-2 border-t border-border-subtle pt-3">
              <p className="eyebrow text-text-tertiary">Sort</p>
              <SortSelect options={sortOptions} value={sortValue} onValueChange={onSortChange} />
            </section>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
