import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TypeChip } from "@/components/shared/TypeChip";
import { formatRelativeUpdated } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useUpdateNote } from "../hooks/useNotes";
import type { ChecklistItem, ChecklistNote } from "@/types/entities";

export interface NotePreviewModalProps {
  note: ChecklistNote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Lightweight popup opened by clicking the Dashboard's Note card — not a create/edit form, so it skips ModalShell's wider chrome for a tighter popup. Checkable (not just read-only): toggling an item here saves through the same update path as the full editor. Renders from local state so a click flips the box immediately rather than waiting on the round-trip to persist. */
export function NotePreviewModal({ note, open, onOpenChange }: NotePreviewModalProps) {
  const navigate = useNavigate();
  const updateNote = useUpdateNote();
  const [items, setItems] = useState<ChecklistItem[]>(note?.items ?? []);

  useEffect(() => {
    setItems(note?.items ?? []);
  }, [note?.id, note?.items]);

  if (!note) return null;

  const done = items.filter((item) => item.done).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const toggleItem = (index: number, checked: boolean) => {
    const nextItems = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, done: checked } : item,
    );
    setItems(nextItems);
    updateNote.mutate({ id: note.id, type: "checklist", items: nextItems });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <div className="flex items-center gap-2 pr-8">
          <TypeChip label="Note" bg="#FEFFFEE6" />
          <span className="text-[12px] text-text-tertiary">{formatRelativeUpdated(note.updatedAt)}</span>
        </div>

        <h2 className="mt-3 font-display text-[24px] font-light italic leading-[1.1] text-text-primary">
          {note.title}
        </h2>

        <div className="mt-3 flex items-center gap-2.5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-100">
            <div
              className="h-full rounded-full bg-sage-600 transition-[width] duration-fast ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-[12px] text-text-tertiary">
            {done} of {total} done
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-1 rounded-card bg-cream-100 p-2">
          {items.map((item, index) => (
            <li key={index}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-chip px-2 py-1.5 text-[13px] text-text-primary transition-colors duration-fast ease-out hover:bg-cream-200">
                <Checkbox checked={item.done} onCheckedChange={(checked) => toggleItem(index, checked === true)} />
                <span className={cn(item.done && "text-text-tertiary line-through")}>{item.text}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={() => navigate("/notes")}>
            View in Notes →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
