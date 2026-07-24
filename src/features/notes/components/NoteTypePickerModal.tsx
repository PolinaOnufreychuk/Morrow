import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
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
 * time is visual — never a plain text list). Two-step flow: pick a row, then
 * confirm with Continue — `onSelectType` only fires once, on Continue.
 */
export function NoteTypePickerModal({ open, onOpenChange, onSelectType }: NoteTypePickerModalProps) {
  const [selected, setSelected] = useState<NoteType | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) setSelected(null);
    onOpenChange(next);
  };

  const handleContinue = () => {
    if (!selected) return;
    onSelectType(selected);
    setSelected(null);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={handleOpenChange}
      title="New note"
      className="max-w-2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!selected} onClick={handleContinue}>
            Continue
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {NOTE_TYPE_ORDER.map((type) => {
          const meta = NOTE_TYPE_META[type];
          const active = type === selected;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelected(type)}
              className={cn(
                "flex items-center gap-3 rounded-card border border-border-subtle bg-surface-card/60 p-4 text-left transition-all duration-fast ease-out",
                "hover:-translate-y-px hover:border-sage-300 hover:shadow-resting focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active && "border-sage-300 shadow-resting",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-chip bg-sage-100 text-sage-700">
                <NoteTypeIcon type={type} size={19} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[14px] font-medium text-text-primary">{meta.label}</span>
                <span className="truncate text-[12px] text-text-tertiary">{meta.description}</span>
              </span>
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                  active ? "border-sage-600" : "border-border-default",
                )}
              >
                {active && <span className="h-2 w-2 rounded-full bg-sage-600" />}
              </span>
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}
