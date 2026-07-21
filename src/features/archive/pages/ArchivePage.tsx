import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { ArchiveEntry } from "@/types/entities";
import { useArchive } from "../hooks/useArchive";
import { ArchiveCard } from "../components/ArchiveCard";

export function ArchivePage() {
  const { data: entries = [] } = useArchive();
  const [pendingDelete, setPendingDelete] = useState<ArchiveEntry | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Storage"
        title="Archive"
        description="Restore items or remove them permanently."
      />

      {entries.length === 0 ? (
        <EmptyState
          title="Nothing archived"
          description="Archived projects, boards, notes, and resources will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <ArchiveCard
              key={`${entry.sourceType}-${entry.id}`}
              entry={entry}
              onRestore={() => {
                /* TODO: wire to useRestoreEntry() */
              }}
              onDeletePermanently={setPendingDelete}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete permanently?"
        description="This action cannot be undone."
        confirmLabel="Delete permanently"
        destructive
        onConfirm={() => {
          /* TODO: wire to useDeleteEntryPermanently() */
        }}
      />
    </div>
  );
}
