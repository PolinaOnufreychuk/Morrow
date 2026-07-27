import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { Icon } from "@/design-system/icons/Icon";
import { PinnableItem } from "@/components/shared/PinnableItem";
import { usePinned } from "@/context/PinnedContext";
import { useArchiveBoard, useBoards } from "../hooks/useInspiration";
import { InspirationCard } from "../components/InspirationCard";
import { EntityFilterPopover, type EntityFilterOption } from "@/components/shared/EntityFilterPopover";
import { BoardCreateModal } from "../components/BoardCreateModal";
import type { InspirationBoard } from "@/types/entities";
import type { InspirationSort } from "../types";

const CATEGORY_OPTIONS: EntityFilterOption[] = [
  { value: "all", label: "All" },
  { value: "Color", label: "Color" },
  { value: "UI patterns", label: "UI patterns" },
  { value: "Typography", label: "Typography" },
  { value: "Illustration", label: "Illustration" },
  { value: "UX patterns", label: "UX patterns" },
];

const SORT_OPTIONS: EntityFilterOption[] = [
  { value: "recent", label: "Recently updated" },
  { value: "created", label: "Recently added" },
  { value: "title", label: "Alphabetical" },
];

export function InspirationPage() {
  const { data: boards = [] } = useBoards();
  // "Delete" moves the board to Archive (soft-delete); the Archive screen's
  // own "Delete permanently" is the only real hard-delete path.
  const archiveBoard = useArchiveBoard();
  const { pin } = usePinned();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<InspirationSort>("recent");
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<InspirationBoard | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = boards.filter(
      (board) =>
        (normalized === "" ||
          board.title.toLowerCase().includes(normalized) ||
          board.notes?.toLowerCase().includes(normalized) ||
          board.tags.some((tag) => tag.toLowerCase().includes(normalized))) &&
        (category === "all" || board.tags.includes(category)),
    );
    return [...matches].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "created") return b.createdAt.localeCompare(a.createdAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [boards, query, category, sort]);

  return (
    <PageShell>
      <PageHeader
        title="Inspiration"
        titleClassName="relative top-2 text-[40px]"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Icon name="plus" size={17} />
            New Collection
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search inspiration…"
          variant="flat"
          className="flex-1"
        />
        <EntityFilterPopover
          isActive={category !== "all" || sort !== "recent"}
          onClear={() => {
            setCategory("all");
            setSort("recent");
          }}
          sections={[
            {
              eyebrow: "Category",
              options: CATEGORY_OPTIONS,
              selected: category,
              onChange: setCategory,
            },
            {
              eyebrow: "Sort by",
              options: SORT_OPTIONS,
              selected: sort,
              onChange: (value) => setSort(value as InspirationSort),
            },
          ]}
        />
      </div>

      {boards.length === 0 ? (
        <EmptyState
          title="How about starting a collection right now?"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Icon name="plus" size={16} />
              New Collection
            </Button>
          }
          illustration={<EmptyStateIllustration variant="inspiration" />}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query} />
      ) : (
        <div className="board-grid">
          {filtered.map((board) => (
            <PinnableItem key={board.id} entityType="collection" id={board.id}>
              <InspirationCard
                board={board}
                variant="full"
                onPin={(target) => pin({ entityType: "collection", id: target.id })}
                onDelete={setPendingDelete}
              />
            </PinnableItem>
          ))}
        </div>
      )}

      <BoardCreateModal open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete board?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be moved to Archive and permanently deleted in 7 days.`
            : undefined
        }
        confirmLabel="Delete board"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return;
          const target = pendingDelete;
          archiveBoard.mutate(target.id, {
            onSuccess: () => notify.success(`"${target.title}" moved to Archive`),
            onError: () => notify.error("Couldn't delete this board."),
          });
          setPendingDelete(null);
        }}
      />
    </PageShell>
  );
}
