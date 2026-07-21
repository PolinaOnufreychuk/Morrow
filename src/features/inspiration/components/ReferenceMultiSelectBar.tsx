import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ReferenceMultiSelectBarProps {
  selectedCount: number;
  onRemoveSelected: () => void;
  onClearSelection: () => void;
  className?: string;
}

/** Bulk-action bar for multi-selected references during board editing. */
export function ReferenceMultiSelectBar({
  selectedCount,
  onRemoveSelected,
  onClearSelection,
  className,
}: ReferenceMultiSelectBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div
      className={cn(
        "glass-control fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-card px-4 py-2.5",
        className,
      )}
    >
      <span className="text-[13px] font-medium text-text-primary">{selectedCount} selected</span>
      <div className="h-4 w-px bg-border-subtle" />
      <Button variant="ghost" size="sm" onClick={onRemoveSelected}>
        Remove
      </Button>
      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        Clear
      </Button>
    </div>
  );
}
