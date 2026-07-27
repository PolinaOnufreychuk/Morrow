import { Icon } from "@/design-system/icons/Icon";
import type { NoteType } from "@/types/entities";
import { NOTE_TYPE_META, NOTE_TYPE_ORDER } from "../noteTypeMeta";

export interface NoteTypeGridProps {
  onSelect: (type: NoteType) => void;
}

/**
 * Visual type picker (docs/DESIGN.md: type selection at creation time is
 * visual — never a plain text list). A vertical list of full-width rows: at
 * rest the label sits centered on a calm cream pill; on hover the row fills
 * with the sage gradient, the label glides to the left, and an arrow chip
 * slides in from the right. A single click fires `onSelect` immediately (no
 * separate "Continue" step). Shared by the New-note modal and the project
 * detail quick-create form so the interaction reads identically everywhere.
 */
export function NoteTypeGrid({ onSelect }: NoteTypeGridProps) {
  return (
    <div className="flex flex-col gap-3">
      {NOTE_TYPE_ORDER.map((type) => {
        const meta = NOTE_TYPE_META[type];
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            aria-label={`Create ${meta.label} note`}
            className="group relative flex h-[64px] w-full items-center justify-center overflow-hidden rounded-[16px] bg-cream-100 text-[16px] font-medium text-text-tertiary transition-colors duration-300 ease-out hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* Gradient fill — fades in on hover behind the label/arrow. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-sage-600 to-sage-400 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            />
            {/* Label — centered at rest, glides to a fixed left inset on hover.
                Animating both `left` and the translate keeps the slide smooth
                and independent of each label's width. */}
            <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out group-hover:left-6 group-hover:translate-x-0">
              {meta.label}
            </span>
            {/* Arrow chip — slides in from the right on hover. */}
            <span
              aria-hidden
              className="absolute right-2.5 top-1/2 z-10 flex h-[46px] w-[46px] -translate-y-1/2 translate-x-2 items-center justify-center rounded-[12px] bg-white/15 text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            >
              <Icon name="arrow-right" size={20} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
