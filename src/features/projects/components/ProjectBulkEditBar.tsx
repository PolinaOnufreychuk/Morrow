import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProjectBulkEditBarProps {
  selectedCount: number;
  onArchiveSelected: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  isBusy?: boolean;
  className?: string;
}

/**
 * Floating action bar shown when one or more projects are multi-selected.
 * Glass control surface; appears above the grid. `aria-live` so screen
 * reader users hear the selection count change without moving focus.
 */
export function ProjectBulkEditBar({
  selectedCount,
  onArchiveSelected,
  onDeleteSelected,
  onClearSelection,
  isBusy = false,
  className,
}: ProjectBulkEditBarProps) {
  if (selectedCount === 0) return null;
  return (
    <div
      role="toolbar"
      aria-label="Bulk project actions"
      className={cn(
        "glass-control fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-card px-4 py-2.5",
        className,
      )}
    >
      <span className="text-[13px] font-medium text-text-primary" aria-live="polite">
        {selectedCount} selected
      </span>
      <div className="h-4 w-px bg-border-subtle" />
      <Button variant="ghost" size="sm" onClick={onArchiveSelected} disabled={isBusy}>
        Archive
      </Button>
      <Button variant="ghost" size="sm" onClick={onDeleteSelected} disabled={isBusy}>
        Delete
      </Button>
      <Button variant="ghost" size="sm" onClick={onClearSelection} disabled={isBusy}>
        Clear
      </Button>
    </div>
  );
}
