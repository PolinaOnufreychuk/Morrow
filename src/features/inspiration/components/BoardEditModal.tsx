import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { BoardForm, type BoardFormValues } from "./BoardForm";
import type { InspirationBoard } from "@/types/entities";

export interface BoardEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  board: InspirationBoard;
}

const FORM_ID = "board-edit-form";

export function BoardEditModal({ open, onOpenChange, board }: BoardEditModalProps) {
  const handleSubmit = (values: BoardFormValues) => {
    void values; // TODO: wire to useUpdateBoard()
    onOpenChange(false);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit board"
      footer={
        <Button type="submit" form={FORM_ID}>
          Save changes
        </Button>
      }
    >
      <BoardForm formId={FORM_ID} defaultValues={board} onSubmit={handleSubmit} />
    </ModalShell>
  );
}
