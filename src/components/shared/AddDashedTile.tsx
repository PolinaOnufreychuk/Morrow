import { type ButtonHTMLAttributes } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

export interface AddDashedTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

/**
 * Dashed "add new" tile used inside card grids (add reference, add link,
 * new item). Matches the card radius so it sits flush in a masonry grid.
 * Omit `label` for an icon-only tile (e.g. the inline "+" slot in a
 * reference grid, where the top-right button already carries the copy).
 */
export function AddDashedTile({ label, className, ...props }: AddDashedTileProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border-default bg-surface-card/30 text-text-tertiary transition-colors duration-fast ease-out hover:border-sage-600 hover:text-sage-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <Icon name="plus" size={20} />
      {label && <span className="text-[13px] font-medium">{label}</span>}
    </button>
  );
}
