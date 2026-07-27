import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import type { NoteType } from "@/types/entities";
import { NoteTypeGrid } from "./NoteTypeGrid";
import bgNewNote from "@/assets/bg-new-note.png";

export interface NoteTypePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: NoteType) => void;
}

/**
 * Visual type picker (docs/DESIGN.md: type selection at creation time is
 * visual — never a plain text list). Mirrors the "New project" hero treatment:
 * a banner whose artwork already carries the "New note" wordmark, then a
 * vertical list of note types. A single click on a row is already an
 * unambiguous choice, so it fires `onSelectType` immediately rather than
 * requiring a separate "Continue" confirmation step.
 */
export function NoteTypePickerModal({ open, onOpenChange, onSelectType }: NoteTypePickerModalProps) {
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="New note"
      heroImage={bgNewNote}
      heroTitleOverlay
      heroTitleInImage
      footerAlign="stretch"
      footer={
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => onOpenChange(false)}
          className="h-[54px] rounded-[16px] border-sage-300/70 text-[16px] text-text-primary"
        >
          Cancel
        </Button>
      }
    >
      <NoteTypeGrid onSelect={onSelectType} />
    </ModalShell>
  );
}
