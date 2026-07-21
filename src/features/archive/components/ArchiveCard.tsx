import { GlassCard } from "@/components/shared/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { ArchiveEntry, ArchiveSourceType } from "@/types/entities";

const SOURCE_LABEL: Record<ArchiveSourceType, string> = {
  project: "Project",
  inspiration_board: "Board",
  note: "Note",
  resource: "Resource",
};

export interface ArchiveCardProps {
  entry: ArchiveEntry;
  onRestore: (entry: ArchiveEntry) => void;
  onDeletePermanently: (entry: ArchiveEntry) => void;
  isRestoring?: boolean;
  isDeleting?: boolean;
}

/**
 * One unified archive card style for every source type. The origin type is
 * shown via a badge, NOT a different layout (docs/DESIGN.md § Archive).
 */
export function ArchiveCard({
  entry,
  onRestore,
  onDeletePermanently,
  isRestoring = false,
  isDeleting = false,
}: ArchiveCardProps) {
  const isBusy = isRestoring || isDeleting;
  return (
    <GlassCard className="flex items-center gap-4 p-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-card-image bg-sage-100">
        {entry.thumbnailUrl && (
          <img src={entry.thumbnailUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <Badge variant="neutral">{SOURCE_LABEL[entry.sourceType]}</Badge>
          <span className="text-[12px] text-text-tertiary">
            Archived {formatDate(entry.archivedAt)}
          </span>
        </div>
        <span className="truncate text-[15px] font-medium text-text-primary">{entry.title}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onRestore(entry)}
          disabled={isBusy}
          aria-busy={isRestoring}
        >
          {isRestoring ? "Restoring…" : "Restore"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeletePermanently(entry)}
          disabled={isBusy}
        >
          Delete
        </Button>
      </div>
    </GlassCard>
  );
}
