import { Checkbox } from "@/components/ui/checkbox";
import { hostnameOf } from "@/lib/format";
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
}

export function ReferenceGridItem({
  reference,
  index,
  onOpen,
  selectable = false,
  selected = false,
  onToggleSelect,
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
        className="block w-full focus:outline-none"
      >
        {reference.imageUrl ? (
          <img
            src={reference.imageUrl}
            alt=""
            className="h-auto w-full transition-transform duration-slow ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-sage-100 px-2 text-center text-[11px] text-text-tertiary">
            {reference.sourceUrl ? hostnameOf(reference.sourceUrl) : "No preview"}
          </div>
        )}
      </button>

      {selectable && (
        <div className="absolute right-2 top-2 z-10" onClick={(event) => event.stopPropagation()}>
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect?.(reference.id)}
            aria-label="Select reference"
            className="border-white/80 bg-white/40 shadow-resting backdrop-blur-[2px]"
          />
        </div>
      )}
    </div>
  );
}
