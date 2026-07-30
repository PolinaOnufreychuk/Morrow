import { Icon } from "@/design-system/icons/Icon";
import type { NoteType } from "@/types/entities";
import { NOTE_TYPE_META, NOTE_TYPE_ORDER } from "../noteTypeMeta";
import bgNoteButton from "@/assets/bg-note-button.png";

export interface NoteTypeGridProps {
  onSelect: (type: NoteType) => void;
}

/**
 * Visual type picker (docs/DESIGN.md: type selection at creation time is
 * visual — never a plain text list). A vertical list of full-width rows: at
 * rest each label sits centered on a calm cream pill. Hovering one row fills
 * it with the floral sage artwork, glides the label to the left in white
 * italic serif, and slides an arrow chip in from the right — while every
 * other row dims to keep the focus on the hovered one. A single click fires
 * `onSelect` immediately (no separate "Continue" step). Shared by the
 * New-note modal and the project detail quick-create form so the interaction
 * reads identically everywhere.
 */
export function NoteTypeGrid({ onSelect }: NoteTypeGridProps) {
  return (
    <div className="group/rows flex flex-col gap-2.5">
      {NOTE_TYPE_ORDER.map((type) => {
        const meta = NOTE_TYPE_META[type];
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            aria-label={`Create ${meta.label} note`}
            className="group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-[16px] border border-[#F5F5F4] bg-[#F9F9F8] text-[15px] font-medium text-text-tertiary transition-[opacity,color] duration-500 ease-out hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/rows:opacity-40 hover:!opacity-100"
          >
            {/* Floral fill — fades in on hover behind the label/arrow. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
              style={{ backgroundImage: `url(${bgNoteButton})` }}
            />
            {/* Label — centered at rest; on hover it glides to a fixed 16px
                left inset while a horizontal white→translucent gradient clips
                into the text. Animating both `left` and the translate keeps the
                slide smooth and width-independent. */}
            <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-white to-white/60 bg-clip-text transition-all duration-500 ease-out group-hover:left-4 group-hover:top-[calc(50%+1px)] group-hover:translate-x-0 group-hover:text-transparent">
              {meta.label}
            </span>
            {/* Arrow chip — dashed outline over a white→translucent gradient
                frame, inset an even 3px from the top/right/bottom, slides in
                from the right on hover. */}
            <span
              aria-hidden
              className="absolute bottom-[3px] right-[3px] top-[3px] z-10 flex aspect-square translate-x-2 items-center justify-center rounded-[14px] border border-dashed border-white/40 bg-gradient-to-r from-white/30 to-white/10 text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100"
            >
              <Icon name="arrow-right" size={18} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
