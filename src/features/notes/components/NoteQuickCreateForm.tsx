import type { NoteType } from "@/types/entities";
import { NoteTypeGrid } from "./NoteTypeGrid";

export interface NoteQuickCreateFormProps {
  onSelectType: (type: NoteType) => void;
}

/**
 * Inline "pick a note type" step for the project-details Link-or-Create
 * modal — same visual picker as the Notes page's NoteTypePickerModal.
 * Selecting a tile hands off to NoteEditorModal (rendered as a sibling by
 * the caller) for the actual type-specific fields.
 */
export function NoteQuickCreateForm({ onSelectType }: NoteQuickCreateFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-text-secondary">Choose a type to start this note.</p>
      <NoteTypeGrid onSelect={onSelectType} />
    </div>
  );
}
