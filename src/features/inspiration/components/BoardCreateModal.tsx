import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/shared/Toast";
import { BoardForm, type BoardFormValues } from "./BoardForm";
import { useCreateBoard } from "../hooks/useInspiration";
import { InspirationValidationError } from "../types";
import glassFlowerPink from "@/assets/grain-gradient-green.png";

export interface BoardCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "board-create-form";

export function BoardCreateModal({ open, onOpenChange }: BoardCreateModalProps) {
  const createBoard = useCreateBoard();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (values: BoardFormValues) => {
    setSubmitError(null);
    createBoard.mutate(
      {
        title: values.title,
        coverImageUrl: values.coverImageUrl || null,
        tags: [values.category],
        notes: values.notes || null,
        projectId: null,
      },
      {
        onSuccess: () => {
          notify.success("Collection created");
          onOpenChange(false);
        },
        onError: (error) => {
          setSubmitError(
            error instanceof InspirationValidationError
              ? error.message
              : "Couldn't create the collection. Please try again.",
          );
        },
      },
    );
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={(next) => {
        if (createBoard.isPending) return;
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
          disabled={createBoard.isPending}
          aria-busy={createBoard.isPending}
        >
          {createBoard.isPending ? "Creating…" : "Save collection"}
        </Button>
      }
    >
      <BoardForm formId={FORM_ID} onSubmit={handleSubmit} submitError={submitError} />
    </ModalShell>
  );
}
