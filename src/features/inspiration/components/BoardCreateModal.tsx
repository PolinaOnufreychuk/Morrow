import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { notify } from "@/components/shared/Toast";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { queryKeys } from "@/lib/api/queryKeys";
import { BoardForm, type BoardFormValues } from "./BoardForm";
import { useCreateBoard } from "../hooks/useInspiration";
import { addReferences } from "../api/inspiration.service";
import { InspirationValidationError } from "../types";
import bgNewCollection from "@/assets/bg-new-collection.png";

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
  const [canSubmit, setCanSubmit] = useState(false);

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
      heroImage={bgNewCollection}
      heroTitleOverlay
      heroImageClassName="h-auto aspect-[595/127]"
      className="max-w-[496px]"
      footerAlign="split"
      footer={
        <>
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="lg"
              className="h-[48px] basis-[36%] rounded-[15px] text-[16px]"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="hero"
            size="lg"
            className="h-[48px] flex-1 rounded-[15px] text-[16px]"
            type="submit"
            form={FORM_ID}
            disabled={!canSubmit || isSaving}
            aria-busy={isSaving}
          >
            {isSaving ? "Creating…" : "Create collection"}
          </Button>
        </>
      }
    >
      <BoardForm
        formId={FORM_ID}
        onSubmit={handleSubmit}
        onCanSubmitChange={setCanSubmit}
        submitError={submitError}
        showPhotoUpload
      />
    </ModalShell>
  );
}
