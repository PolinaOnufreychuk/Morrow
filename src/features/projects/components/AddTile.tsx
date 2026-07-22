import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

export interface AddTileProps {
  label: string;
  onClick: () => void;
  className?: string;
}

/**
 * Dashed-border "add" affordance dropped at the end of a card grid (Linked
 * Inspiration/Notes/Resources) — matches whatever aspect ratio the grid's
 * other cards use via `className`.
 */
export function AddTile({ label, onClick, className }: AddTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border-default text-text-tertiary transition-colors duration-fast ease-out hover:border-sage-400 hover:text-sage-700",
        className,
      )}
    >
      <Icon name="plus" size={18} />
      <span className="text-[13px] font-medium">{label}</span>
    </button>
  );
}
