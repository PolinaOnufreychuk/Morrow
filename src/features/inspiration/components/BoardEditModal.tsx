import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/shared/Toast";
import { BoardForm, type BoardFormValues } from "./BoardForm";
import { useUpdateBoard } from "../hooks/useInspiration";
import { InspirationValidationError } from "../types";
import type { InspirationBoard } from "@/types/entities";
import glassFlowerPink from "@/assets/grain-gradient-green.png";

export interface BoardEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  board: InspirationBoard;
}

const FORM_ID = "board-edit-form";

export function BoardEditModal({ open, onOpenChange, board }: BoardEditModalProps) {
  const updateBoard = useUpdateBoard();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (values: BoardFormValues) => {
    setSubmitError(null);
    updateBoard.mutate(
      {
        id: board.id,
        title: values.title,
        coverImageUrl: values.coverImageUrl || null,
        tags: [values.category],
        notes: values.notes || null,
      },
      {
        onSuccess: () => {
          notify.success("Collection updated");
          onOpenChange(false);
        },
        onError: (error) => {
          setSubmitError(
            error instanceof InspirationValidationError
              ? error.message
              : "Couldn't save your changes. Please try again.",
          );
        },
      },
    );
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={(next) => {
        if (updateBoard.isPending) return;
        setSubmitError(null);
        onOpenChange(next);
      }}
      title="Edit board"
      heroImage={glassFlowerPink}
      footerAlign="stretch"
      footer={
        <Button
          size="lg"
          fullWidth
          type="submit"
          form={FORM_ID}
          disabled={updateBoard.isPending}
          aria-busy={updateBoard.isPending}
        >
          {updateBoard.isPending ? "Saving…" : "Save changes"}
        </Button>
      }
    >
      <BoardForm formId={FORM_ID} defaultValues={board} onSubmit={handleSubmit} submitError={submitError} />
    </ModalShell>
  );
}
