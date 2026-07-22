import { useState } from "react";
import { useUpdateBoard } from "./useInspiration";
import type { InspirationBoard } from "@/types/entities";

export interface BoardDraft {
  title: string;
  notes: string | null;
  tags: string[];
}

function toDraft(board: InspirationBoard): BoardDraft {
  return {
    title: board.title,
    notes: board.notes,
    tags: board.tags,
  };
}

/**
 * Inline edit-mode state for the Board Detail page — mirrors
 * useProjectEditState.ts. Cover image is deliberately never part of the
 * draft: it's always derived automatically from the board's references
 * (see InspirationCard's image logic), never user-edited here.
 */
export function useBoardEditState(board: InspirationBoard) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<BoardDraft>(() => toDraft(board));
  const updateBoard = useUpdateBoard();

  function startEditing() {
    setDraft(toDraft(board));
    setIsEditing(true);
  }

  function cancel() {
    setDraft(toDraft(board));
    setIsEditing(false);
  }

  function patch(next: Partial<BoardDraft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  async function save() {
    await updateBoard.mutateAsync({
      id: board.id,
      title: draft.title,
      notes: draft.notes,
      tags: draft.tags,
    });
    setIsEditing(false);
  }

  return { isEditing, draft, patch, startEditing, cancel, save, isSaving: updateBoard.isPending };
}
