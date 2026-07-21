import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortSelect } from "@/components/shared/SortSelect";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Icon } from "@/design-system/icons/Icon";
import { useBoards } from "../hooks/useInspiration";
import { InspirationCard } from "../components/InspirationCard";
import { BoardCreateModal } from "../components/BoardCreateModal";
import { BoardEditModal } from "../components/BoardEditModal";
import type { InspirationBoard } from "@/types/entities";
import type { InspirationSort } from "../types";

const SORT_OPTIONS: { value: InspirationSort; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "title", label: "Title" },
];

export function InspirationPage() {
  const { data: boards = [] } = useBoards();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<InspirationSort>("recent");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<InspirationBoard | null>(null);
  const [pendingDelete, setPendingDelete] = useState<InspirationBoard | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = boards.filter(
      (board) =>
        normalized === "" ||
        board.title.toLowerCase().includes(normalized) ||
        board.notes?.toLowerCase().includes(normalized) ||
        board.tags.some((tag) => tag.toLowerCase().includes(normalized)),
    );
    return [...matches].sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : b.updatedAt.localeCompare(a.updatedAt),
    );
  }, [boards, query, sort]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Visual library"
        title="Inspiration"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Icon name="plus" size={17} />
            New board
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search boards…"
          className="w-full max-w-xs"
        />
        <SortSelect options={SORT_OPTIONS} value={sort} onValueChange={setSort} className="h-11 w-[168px]" />
      </div>

      {boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          description="Create a board to start collecting visual references."
          action={<Button onClick={() => setCreateOpen(true)}>New board</Button>}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query} />
      ) : (
        <div className="masonry3">
          {filtered.map((board) => (
            <div key={board.id} className="masonry-item">
              <InspirationCard
                board={board}
                variant="full"
                onEdit={setEditing}
                onDelete={setPendingDelete}
              />
            </div>
          ))}
        </div>
      )}

      <BoardCreateModal open={createOpen} onOpenChange={setCreateOpen} />
      {editing && (
        <BoardEditModal
          open={editing !== null}
          onOpenChange={(open) => !open && setEditing(null)}
          board={editing}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete board?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" and all its references will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete board"
        destructive
        onConfirm={() => {
          // TODO: wire to a delete-board mutation (not yet in useInspiration.ts)
        }}
      />
    </div>
  );
}
