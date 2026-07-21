import { type FormEvent } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Note, NoteType } from "@/types/entities";
import { NOTE_TYPE_META } from "../noteTypeMeta";

export interface NoteEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Editing an existing note, or creating a new one of this type. */
  note?: Note;
  type: NoteType;
}

const FORM_ID = "note-editor-form";

/**
 * Routes to the right type-specific editor. Scaffold: renders a title field
 * plus a placeholder for the type-specific fields. Full per-type editors are
 * out of scope for the scaffold (no real mutations wired).
 */
export function NoteEditorModal({ open, onOpenChange, note, type }: NoteEditorModalProps) {
  const meta = NOTE_TYPE_META[type];
  const isEditing = Boolean(note);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: wire to useCreateNote()/useUpdateNote() with type-specific fields
    onOpenChange(false);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? `Edit ${meta.label.toLowerCase()} note` : `New ${meta.label.toLowerCase()} note`}
      footer={
        <Button type="submit" form={FORM_ID}>
          {isEditing ? "Save changes" : "Create note"}
        </Button>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="note-title" className="eyebrow text-text-tertiary">
            Title
          </label>
          <Input id="note-title" defaultValue={note?.title ?? ""} placeholder="Note title" />
        </div>

        {/* Placeholder for the type-specific editor surface. */}
        <div className="flex flex-col gap-1.5">
          <span className="eyebrow text-text-tertiary">{meta.label} content</span>
          <Textarea placeholder={`${meta.description} (editor scaffolded — fields TBD)`} disabled />
        </div>
      </form>
    </ModalShell>
  );
}
