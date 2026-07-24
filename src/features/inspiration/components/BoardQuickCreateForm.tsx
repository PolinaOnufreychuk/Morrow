import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { queryKeys } from "@/lib/api/queryKeys";
import { BoardForm, type BoardFormValues } from "./BoardForm";
import { useCreateBoard } from "../hooks/useInspiration";
import { addReferences } from "../api/inspiration.service";
import { InspirationValidationError } from "../types";

export interface BoardQuickCreateFormProps {
  projectId: string;
  onCreated: () => void;
}

const FORM_ID = "board-quick-create-form";

/**
 * Inline "create new board, pre-linked to this project" form for the
 * project-details Link-or-Create modal. Same fields/logic as the Inspiration
 * page's BoardCreateModal — a board's cover always comes from its first
 * references (dropped photos), never a standalone cover-image field.
 */
export function BoardQuickCreateForm({ projectId, onCreated }: BoardQuickCreateFormProps) {
  const createBoard = useCreateBoard();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (values: BoardFormValues, photos: File[]) => {
    setSubmitError(null);
    setIsSaving(true);
    try {
      const board = await createBoard.mutateAsync({
        title: values.title,
        coverImageUrl: null,
        tags: [values.category],
        notes: values.notes || null,
        projectId,
      });

      if (photos.length > 0) {
        const inputs = await Promise.all(
          photos.map(async (file) => ({
            imageUrl: await uploadCoverImage("inspiration-reference", file),
            sourceUrl: null,
          })),
        );
        await addReferences(board.id, inputs);
        queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.all() });
        queryClient.invalidateQueries({ queryKey: queryKeys.inspirationBoards.references(board.id) });
      }

      onCreated();
    } catch (error) {
      setSubmitError(
        error instanceof InspirationValidationError
          ? error.message
          : "Couldn't create the collection. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <BoardForm formId={FORM_ID} onSubmit={handleSubmit} submitError={submitError} showPhotoUpload />
      <Button
        type="submit"
        form={FORM_ID}
        size="lg"
        fullWidth
        disabled={isSaving}
        aria-busy={isSaving}
      >
        {isSaving ? "Creating…" : "Save collection"}
      </Button>
    </div>
  );
}
