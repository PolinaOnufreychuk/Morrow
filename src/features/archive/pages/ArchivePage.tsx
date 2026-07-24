import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { ErrorState } from "@/components/shared/ErrorState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { Skeleton } from "@/components/shared/Skeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import type { ArchiveEntry, ArchiveSourceType } from "@/types/entities";
import { useArchive, useDeleteEntryPermanently, useRestoreEntry } from "../hooks/useArchive";
import { ArchiveCard } from "../components/ArchiveCard";
import { ArchiveFilterPopover, type FilterOption } from "../components/ArchiveFilterPopover";

function entryKey(entry: { sourceType: ArchiveSourceType; id: string }) {
  return `${entry.sourceType}-${entry.id}`;
}

const TYPE_OPTIONS: FilterOption<ArchiveSourceType | "all">[] = [
  { value: "all", label: "All" },
  { value: "project", label: "Projects" },
  { value: "inspiration_board", label: "Inspiration" },
  { value: "note", label: "Notes" },
  { value: "resource", label: "Resources" },
];

const SORT_OPTIONS: FilterOption<"recent" | "title">[] = [
  { value: "recent", label: "Recently archived" },
  { value: "title", label: "Alphabetical" },
];

export function ArchivePage() {
  const { data: entries = [], isLoading, isError, error, refetch } = useArchive();
  const [pendingDelete, setPendingDelete] = useState<ArchiveEntry | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ArchiveSourceType | "all">("all");
  const [sort, setSort] = useState<"recent" | "title">("recent");

  const restoreEntry = useRestoreEntry();
  const deleteEntryPermanently = useDeleteEntryPermanently();

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = entries.filter((entry) => {
      const matchesType = typeFilter === "all" || entry.sourceType === typeFilter;
      const matchesQuery = normalized === "" || entry.title.toLowerCase().includes(normalized);
      return matchesType && matchesQuery;
    });
    return [...matches].sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : b.archivedAt.localeCompare(a.archivedAt),
    );
  }, [entries, query, typeFilter, sort]);

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
    <PageShell>
      <PageHeader title="Archive" titleClassName="mt-2 text-[44px]" />

      <div className="flex items-center gap-2">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search archive…"
          variant="flat"
          className="flex-1"
        />
        <ArchiveFilterPopover
          types={TYPE_OPTIONS}
          type={typeFilter}
          onTypeChange={setTypeFilter}
          sortOptions={SORT_OPTIONS}
          sort={sort}
          onSortChange={setSort}
          onClear={() => {
            setTypeFilter("all");
            setSort("recent");
          }}
        />
      </div>

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
          title="Nothing to review here just yet."
          illustration={<EmptyStateIllustration variant="archive" />}
        />
      ) : filteredEntries.length === 0 ? (
        <NoSearchResultsState query={query || typeFilter} />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredEntries.map((entry) => (
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
