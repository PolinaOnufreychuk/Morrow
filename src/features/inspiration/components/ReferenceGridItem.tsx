import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { InspirationReference } from "@/types/entities";

export interface ReferenceGridItemProps {
  reference: InspirationReference;
  index: number;
  onOpen: (index: number) => void;
  /** Multi-select (board edit mode) affordances. */
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  /** Static drag-handle affordance only — no functional DnD (per brief). */
  showDragHandle?: boolean;
}

export function ReferenceGridItem({
  reference,
  index,
  onOpen,
  selectable = false,
  selected = false,
  onToggleSelect,
  showDragHandle = false,
}: ReferenceGridItemProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-card-image ring-2 ring-transparent transition-shadow duration-fast ease-out",
        selected && "ring-sage-600",
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="block h-full w-full focus:outline-none"
      >
        <img
          src={reference.imageUrl}
          alt=""
          className="aspect-square w-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]"
        />
      </button>

      {selectable && (
        <div className="absolute left-2 top-2 z-10" onClick={(event) => event.stopPropagation()}>
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect?.(reference.id)}
            aria-label="Select reference"
            className="bg-surface-card/90"
          />
        </div>
      )}

      {showDragHandle && (
        <div className="absolute right-2 top-2 z-10 flex h-7 w-7 cursor-grab items-center justify-center rounded-chip bg-surface-card/80 text-text-secondary backdrop-blur-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <circle cx="4.5" cy="3" r="1.1" />
            <circle cx="9.5" cy="3" r="1.1" />
            <circle cx="4.5" cy="7" r="1.1" />
            <circle cx="9.5" cy="7" r="1.1" />
            <circle cx="4.5" cy="11" r="1.1" />
            <circle cx="9.5" cy="11" r="1.1" />
          </svg>
        </div>
      )}
    </div>
  );
}
