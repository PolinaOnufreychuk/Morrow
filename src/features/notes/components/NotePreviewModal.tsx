import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TypeChip } from "@/components/shared/TypeChip";
import { formatRelativeUpdated } from "@/lib/format";
import type { ChecklistNote } from "@/types/entities";

export interface NotePreviewModalProps {
  note: ChecklistNote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Lightweight read-only preview opened by clicking the Dashboard's Note card — not a create/edit form, so it skips ModalShell's wider chrome for a tighter popup. */
export function NotePreviewModal({ note, open, onOpenChange }: NotePreviewModalProps) {
  const navigate = useNavigate();
  if (!note) return null;

  const done = note.items.filter((item) => item.done).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <div className="mb-4 flex items-center gap-2 pr-8">
          <TypeChip label="Note" bg="#FEFFFEE6" />
          <span className="text-[12px] text-text-tertiary">{formatRelativeUpdated(note.updatedAt)}</span>
        </div>

        <h2 className="font-display text-[24px] font-light italic leading-[1.1] text-text-primary">
          {note.title}
        </h2>
        <p className="mt-2 text-[13px] text-text-secondary">
          {done} of {note.items.length} tasks done.
        </p>

        <ul className="mt-4 flex flex-col gap-2 rounded-card bg-cream-100 p-4">
          {note.items.map((item) => (
            <li key={item.text} className="flex items-start gap-2 text-[13px] text-text-primary">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-text-tertiary" />
              <span className={item.done ? "text-text-tertiary line-through" : undefined}>{item.text}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => navigate("/notes")}
          className="mt-5 text-[13.5px] font-medium text-sage-700 transition-colors duration-fast ease-out hover:text-sage-900"
        >
          View in Notes →
        </button>
      </DialogContent>
    </Dialog>
  );
}
