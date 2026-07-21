import { ModalShell } from "@/components/shared/ModalShell";
import { cn } from "@/lib/utils";
import type { NoteType } from "@/types/entities";
import { NOTE_TYPE_META, NOTE_TYPE_ORDER } from "../noteTypeMeta";
import { NoteTypeIcon } from "./NoteTypeIcon";

export interface NoteTypePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: NoteType) => void;
}

/**
 * Visual, icon-driven type picker (docs/DESIGN.md: type selection at creation
 * time is visual — never a plain text list). One tile per note type.
 */
export function NoteTypePickerModal({ open, onOpenChange, onSelectType }: NoteTypePickerModalProps) {
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="New note"
      description="Choose a note type to get started."
      className="max-w-2xl"
    >
      <div className="grid grid-cols-2 gap-3 board:grid-cols-3">
        {NOTE_TYPE_ORDER.map((type) => {
          const meta = NOTE_TYPE_META[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelectType(type)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-card border border-border-subtle bg-surface-card/60 p-4 text-left transition-all duration-fast ease-out",
                "hover:-translate-y-px hover:border-sage-300 hover:shadow-resting focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-chip bg-sage-100 text-sage-700">
                <NoteTypeIcon type={type} size={19} />
              </span>
              <span className="text-[14px] font-medium text-text-primary">{meta.label}</span>
              <span className="text-[12px] text-text-tertiary">{meta.description}</span>
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}
