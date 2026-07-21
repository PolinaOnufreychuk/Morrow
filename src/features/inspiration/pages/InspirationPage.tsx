import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { Icon } from "@/design-system/icons/Icon";
import { useBoards } from "../hooks/useInspiration";
import { InspirationCard } from "../components/InspirationCard";
import { BoardCreateModal } from "../components/BoardCreateModal";

export function InspirationPage() {
  const { data: boards = [] } = useBoards();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized === "") return boards;
    return boards.filter(
      (board) =>
        board.title.toLowerCase().includes(normalized) ||
        board.notes?.toLowerCase().includes(normalized) ||
        board.tags.some((tag) => tag.toLowerCase().includes(normalized)),
    );
  }, [boards, query]);

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

      <SearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search boards…"
        className="w-full max-w-xs"
      />

      {boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          description="Create a board to start collecting visual references."
          action={<Button onClick={() => setCreateOpen(true)}>New board</Button>}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query} />
      ) : (
        <div className="grid grid-cols-1 gap-5 board:grid-cols-2 [@media(min-width:1400px)]:grid-cols-3">
          {filtered.map((board) => (
            <InspirationCard key={board.id} board={board} />
          ))}
        </div>
      )}

      <BoardCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
