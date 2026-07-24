import { cn } from "@/lib/utils";
import type { NoteType } from "@/types/entities";
import { NOTE_TYPE_META, NOTE_TYPE_ORDER } from "../noteTypeMeta";
import { NoteTypeIcon } from "./NoteTypeIcon";

export interface NoteTypeGridProps {
  onSelect: (type: NoteType) => void;
}

/**
 * Visual, icon-driven type picker (docs/DESIGN.md: type selection at creation
 * time is visual — never a plain text list). A single click on a tile is
 * already an unambiguous choice, so it fires `onSelect` immediately rather
 * than requiring a separate "Continue" confirmation step.
 */
export function NoteTypeGrid({ onSelect }: NoteTypeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {NOTE_TYPE_ORDER.map((type) => {
        const meta = NOTE_TYPE_META[type];
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={cn(
              "flex items-center gap-3 rounded-card border border-border-subtle bg-surface-card/60 p-4 text-left transition-all duration-fast ease-out",
              "hover:-translate-y-px hover:border-sage-300 hover:shadow-resting focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-chip bg-sage-100 text-sage-700">
              <NoteTypeIcon type={type} size={19} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[14px] font-medium text-text-primary">{meta.label}</span>
              <span className="truncate text-[12px] text-text-tertiary">{meta.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
