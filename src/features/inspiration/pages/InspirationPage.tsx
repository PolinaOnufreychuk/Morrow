import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Icon } from "@/design-system/icons/Icon";
import { useBoards } from "../hooks/useInspiration";
import { InspirationCard } from "../components/InspirationCard";
import { InspirationFilterPopover } from "../components/InspirationFilterPopover";
import { BoardCreateModal } from "../components/BoardCreateModal";
import { BoardEditModal } from "../components/BoardEditModal";
import type { InspirationBoard } from "@/types/entities";
import type { InspirationSort } from "../types";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Color", label: "Color" },
  { value: "UI patterns", label: "UI patterns" },
  { value: "Typography", label: "Typography" },
  { value: "Illustration", label: "Illustration" },
  { value: "UX patterns", label: "UX patterns" },
];

const SORT_OPTIONS: { value: InspirationSort; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "created", label: "Recently added" },
  { value: "title", label: "Alphabetical" },
];

export function InspirationPage() {
  const { data: boards = [] } = useBoards();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<InspirationSort>("recent");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<InspirationBoard | null>(null);
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
        titleClassName="text-[42px]"
        className="!items-center"
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
        <InspirationFilterPopover
          categories={CATEGORY_OPTIONS}
          category={category}
          onCategoryChange={setCategory}
          sortOptions={SORT_OPTIONS}
          sort={sort}
          onSortChange={setSort}
          onClear={() => {
            setCategory("all");
            setSort("recent");
          }}
        />
      </div>

      {boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          description="Create a board to start collecting visual references."
          action={<Button onClick={() => setCreateOpen(true)}>New Collection</Button>}
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
    </PageShell>
  );
}
