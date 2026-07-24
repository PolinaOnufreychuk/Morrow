import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

export interface SearchModuleFilterOption<T extends string> {
  value: T;
  label: string;
}

export interface SearchModuleFilterPopoverProps<T extends string> {
  options: SearchModuleFilterOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  onClear: () => void;
}

/**
 * Module filter for Search Results — same trigger chrome as
 * `EntityFilterPopover`, but a single-select module list only (no sort
 * section), replacing the always-visible tab strip with a tucked-away filter
 * icon to match the rest of the app's list-page pattern.
 */
export function SearchModuleFilterPopover<T extends string>({
  options,
  value,
  onValueChange,
  onClear,
}: SearchModuleFilterPopoverProps<T>) {
  const isActive = value !== options[0]?.value;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Filters"
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-search text-text-tertiary transition-colors duration-fast ease-out",
            "bg-surface-muted hover:bg-cream-200 hover:text-text-primary",
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

        <div className="flex flex-col gap-0.5 px-1.5 py-2">
          <p className="eyebrow px-1.5 pb-1 text-text-tertiary">Module</p>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onValueChange(option.value)}
                className={cn(
                  "flex items-center justify-between rounded-chip px-1.5 py-1.5 text-[13px] transition-colors duration-fast ease-out",
                  selected ? "bg-cream-100 font-medium text-text-primary" : "text-text-secondary hover:bg-cream-100",
                )}
              >
                <span>{option.label}</span>
                {selected && <Icon name="check" size={14} className="text-sage-700" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
