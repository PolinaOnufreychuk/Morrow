import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";
import type { NoteSort } from "../types";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

export interface NotesFilterPopoverProps<C extends string> {
  categories: FilterOption<C>[];
  category: C;
  onCategoryChange: (value: C) => void;
  sortOptions: FilterOption<NoteSort>[];
  sort: NoteSort;
  onSortChange: (value: NoteSort) => void;
  onClear: () => void;
}

/**
 * Filter popover for the Notes list: single-select note-type list +
 * single-select sort list, each row showing a trailing checkmark when
 * selected. Mirrors `InspirationFilterPopover`'s structure/styling.
 */
export function NotesFilterPopover<C extends string>({
  categories,
  category,
  onCategoryChange,
  sortOptions,
  sort,
  onSortChange,
  onClear,
}: NotesFilterPopoverProps<C>) {
  const isActive = category !== "all" || sort !== "recent";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" aria-label="Filters" className="relative">
          <Icon name="sliders" size={17} />
          {isActive && (
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sage-600" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-[15px] font-medium text-text-primary">Filters</span>
          <button
            type="button"
            onClick={onClear}
            className="text-[13px] text-text-tertiary transition-colors duration-fast ease-out hover:text-text-primary"
          >
            Clear all
          </button>
        </div>
        <div className="border-t border-border-subtle" />

        <FilterSection eyebrow="Note type">
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
    <div className="flex flex-col gap-1 px-2 py-3">
      <p className="eyebrow px-2 pb-1 text-text-tertiary">{eyebrow}</p>
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
        "flex items-center justify-between rounded-chip px-2 py-2 text-[14px] transition-colors duration-fast ease-out",
        selected ? "bg-cream-100 font-medium text-text-primary" : "text-text-secondary hover:bg-cream-100",
      )}
    >
      <span>{label}</span>
      {selected && <Icon name="check" size={16} className="text-sage-700" />}
    </button>
  );
}
