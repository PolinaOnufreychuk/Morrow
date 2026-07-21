import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import type { ArchiveEntry, ArchiveSourceType } from "@/types/entities";
import { useArchive, useDeleteEntryPermanently, useRestoreEntry } from "../hooks/useArchive";
import { ArchiveCard } from "../components/ArchiveCard";

function entryKey(entry: { sourceType: ArchiveSourceType; id: string }) {
  return `${entry.sourceType}-${entry.id}`;
}

export function ArchivePage() {
  const { data: entries = [], isLoading, isError, error, refetch } = useArchive();
  const [pendingDelete, setPendingDelete] = useState<ArchiveEntry | null>(null);

  const restoreEntry = useRestoreEntry();
  const deleteEntryPermanently = useDeleteEntryPermanently();

  const restoringKey =
    restoreEntry.isPending && restoreEntry.variables ? entryKey(restoreEntry.variables) : null;

  const handleRestore = (entry: ArchiveEntry) => {
    restoreEntry.mutate(
      { sourceType: entry.sourceType, id: entry.id },
      {
        onSuccess: () => notify.success(`"${entry.title}" restored`),
        onError: (mutationError) =>
          notify.error(
            mutationError instanceof Error ? mutationError.message : "Couldn't restore this item.",
          ),
      },
    );
  };

  return (
    <PageShell narrow>
      <PageHeader
        eyebrow="Storage"
        title="Archive"
        description="Restore items or remove them permanently."
      />

      {isError ? (
        <ErrorState
          title="Couldn't load the archive"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading archive">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[72px] w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          title="Nothing archived"
          description="Archived projects, boards, notes, and resources will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <ArchiveCard
              key={entryKey(entry)}
              entry={entry}
              onRestore={handleRestore}
              onDeletePermanently={setPendingDelete}
              isRestoring={restoringKey === entryKey(entry)}
              isDeleting={pendingDelete !== null && entryKey(pendingDelete) === entryKey(entry) && deleteEntryPermanently.isPending}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete permanently?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be permanently deleted. This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete permanently"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteEntryPermanently.mutateAsync({
            sourceType: pendingDelete.sourceType,
            id: pendingDelete.id,
          });
          notify.success(`"${pendingDelete.title}" deleted permanently`);
        }}
      />
    </PageShell>
  );
}
