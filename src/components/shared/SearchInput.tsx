import { forwardRef, type InputHTMLAttributes } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional ⌘K hint rendered on the right of the field. */
  showShortcutHint?: boolean;
  /** "glass" (default, every existing screen) or "flat" — a borderless warm-gray fill for screens whose reference calls for it (e.g. Projects). */
  variant?: "glass" | "flat";
}

/**
 * Search control — radius-search (16px), never a base Input.
 * Every module list uses this (docs/CLAUDE.md: every list supports search).
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, showShortcutHint = false, variant = "glass", placeholder = "Search…", ...props }, ref) => (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-search px-3",
        variant === "glass" ? "glass-control h-10" : "h-11 bg-surface-muted px-4",
        className,
      )}
    >
      <Icon name="search" size={16} className="shrink-0 text-text-tertiary" />
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
