import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import type { NoteType } from "@/types/entities";
import { NoteTypeGrid } from "./NoteTypeGrid";

export interface NoteTypePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: NoteType) => void;
}

/**
 * Visual, icon-driven type picker (docs/DESIGN.md: type selection at creation
 * time is visual — never a plain text list). A single click on a tile is
 * already an unambiguous choice, so it fires `onSelectType` immediately
 * rather than requiring a separate "Continue" confirmation step.
 */
export function NoteTypePickerModal({ open, onOpenChange, onSelectType }: NoteTypePickerModalProps) {
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="New note"
      className="max-w-2xl"
      footer={
        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
      }
    >
      <NoteTypeGrid onSelect={onSelectType} />
    </ModalShell>
  );
}
