import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProjectBulkEditBarProps {
  selectedCount: number;
  onArchiveSelected: () => void;
  onClearSelection: () => void;
  className?: string;
}

/**
 * Floating action bar shown when one or more projects are multi-selected.
 * Glass control surface; appears above the grid.
 */
export function ProjectBulkEditBar({
  selectedCount,
  onArchiveSelected,
  onClearSelection,
  className,
}: ProjectBulkEditBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div
      className={cn(
        "glass-control fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-card px-4 py-2.5",
        className,
      )}
    >
      <span className="text-[13px] font-medium text-text-primary">
        {selectedCount} selected
      </span>
      <div className="h-4 w-px bg-border-subtle" />
      <Button variant="ghost" size="sm" onClick={onArchiveSelected}>
        Archive
      </Button>
      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        Clear
      </Button>
    </div>
  );
}
