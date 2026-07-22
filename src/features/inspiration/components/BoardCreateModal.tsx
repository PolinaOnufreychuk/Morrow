import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { BoardForm, type BoardFormValues } from "./BoardForm";

export interface BoardCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "board-create-form";

export function BoardCreateModal({ open, onOpenChange }: BoardCreateModalProps) {
  const handleSubmit = (values: BoardFormValues) => {
    void values; // TODO: wire to useCreateBoard()
    onOpenChange(false);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="New collection"
      footer={
        <Button type="submit" form={FORM_ID}>
          Save collection
        </Button>
      }
    >
      <BoardForm formId={FORM_ID} onSubmit={handleSubmit} />
    </ModalShell>
  );
}
