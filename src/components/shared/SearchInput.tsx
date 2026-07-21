import { forwardRef, type InputHTMLAttributes } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional ⌘K hint rendered on the right of the field. */
  showShortcutHint?: boolean;
}

/**
 * Glass search control — radius-search (16px), never a base Input.
 * Every module list uses this (docs/CLAUDE.md: every list supports search).
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, showShortcutHint = false, placeholder = "Search…", ...props }, ref) => (
    <div
      className={cn(
        "glass-control group flex h-11 items-center gap-2 rounded-search px-3",
        className,
      )}
    >
      <Icon name="search" size={17} className="shrink-0 text-text-tertiary" />
      <input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className="h-full w-full bg-transparent text-[14px] font-body text-text-primary placeholder:text-text-tertiary focus:outline-none"
        {...props}
      />
      {showShortcutHint && (
        <kbd className="shrink-0 rounded-chip border border-border-subtle bg-surface-card/60 px-1.5 py-0.5 text-[11px] font-medium text-text-tertiary">
          ⌘K
        </kbd>
      )}
    </div>
  ),
);
SearchInput.displayName = "SearchInput";
