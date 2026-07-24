import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/shared/Toast";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { queryKeys } from "@/lib/api/queryKeys";
import { BoardForm, type BoardFormValues } from "./BoardForm";
import { useCreateBoard } from "../hooks/useInspiration";
import { addReferences } from "../api/inspiration.service";
import { InspirationValidationError } from "../types";
import glassFlowerPink from "@/assets/grain-gradient-green.png";

export interface BoardCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "board-create-form";

export function BoardCreateModal({ open, onOpenChange }: BoardCreateModalProps) {
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

      notify.success("Collection created");
      onOpenChange(false);
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
    <ModalShell
      open={open}
      onOpenChange={(next) => {
        if (isSaving) return;
        setSubmitError(null);
        onOpenChange(next);
      }}
      title="New collection"
      heroImage={glassFlowerPink}
      footerAlign="stretch"
      footer={
        <Button
          size="lg"
          fullWidth
          type="submit"
          form={FORM_ID}
          disabled={isSaving}
          aria-busy={isSaving}
        >
          {isSaving ? "Creating…" : "Save collection"}
        </Button>
      }
    >
      <BoardForm formId={FORM_ID} onSubmit={handleSubmit} submitError={submitError} showPhotoUpload />
    </ModalShell>
  );
}
