import { type ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

export interface EntityFilterOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface EntityFilterSection {
  eyebrow: string;
  options: EntityFilterOption[];
  selected: string;
  onChange: (value: string) => void;
}

export interface EntityFilterPopoverProps {
  sections: EntityFilterSection[];
  isActive: boolean;
  onClear: () => void;
}

/**
 * Single-select filter popover shared by Inspiration/Resources/Notes — each
 * page supplies its own sections (category/type + sort) but gets the same
 * trigger, search-to-narrow input, and row styling.
 */
export function EntityFilterPopover({ sections, isActive, onClear }: EntityFilterPopoverProps) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) setQuery("");
      }}
    >
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
      <PopoverContent align="end" className="w-72 p-0">
        <div className="flex items-center justify-between px-5 py-3.5">
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

        <div className="px-4 pb-1 pt-3">
          <div className="flex h-9 items-center gap-2 rounded-search border border-border-subtle bg-cream-50 px-2.5">
            <Icon name="search" size={14} className="shrink-0 text-text-tertiary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter options…"
              className="h-full w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>
        </div>

        {sections.map((section, index) => {
          const visibleOptions =
            normalized === ""
              ? section.options
              : section.options.filter((option) => option.label.toLowerCase().includes(normalized));
          if (visibleOptions.length === 0) return null;

          return (
            <div key={section.eyebrow}>
              {index > 0 && <div className="border-t border-border-subtle" />}
              <FilterSection eyebrow={section.eyebrow}>
                {visibleOptions.map((option) => (
                  <FilterRow
                    key={option.value}
                    label={option.label}
                    icon={option.icon}
                    selected={option.value === section.selected}
                    onClick={() => section.onChange(option.value)}
                  />
                ))}
              </FilterSection>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

function FilterSection({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2.5">
      <p className="eyebrow px-1.5 pb-1 text-text-tertiary">{eyebrow}</p>
      {children}
    </div>
  );
}

function FilterRow({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-chip px-2 py-2 text-[13px] transition-colors duration-fast ease-out",
        selected ? "bg-cream-100 font-medium text-text-primary" : "text-text-secondary hover:bg-cream-100",
      )}
    >
      {icon && <span className="flex shrink-0 items-center text-text-tertiary">{icon}</span>}
      <span className="flex-1 text-left">{label}</span>
      {selected && <Icon name="check" size={14} className="shrink-0 text-sage-700" />}
    </button>
  );
}
