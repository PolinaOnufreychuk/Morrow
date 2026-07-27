import { type ReactNode } from "react";
import type { NoteType } from "@/types/entities";

/**
 * Local per-note-type glyphs (simple inline SVGs). Kept in the notes feature
 * because the shared Icon set is intentionally minimal per the scaffolding
 * brief. Used by both NoteCard and the visual type picker.
 */
const GLYPHS: Record<NoteType, ReactNode> = {
  text: (
    <>
      <path d="M4 5h11M4 9.5h11M4 14h7" />
    </>
  ),
  checklist: (
    <>
      <path d="M3 5.5 4.5 7 7 4" />
      <path d="M3 12.5 4.5 14 7 11" />
      <path d="M10 5.5h6M10 12.5h6" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="13" height="13" rx="2.5" />
      <circle cx="7" cy="7" r="1.4" />
      <path d="m4 13 3.5-3.5 3 3 2.5-2.5L16 13" />
    </>
  ),
  quote: (
    <>
      <path d="M4 12c0-3 1.5-4.5 4-5" />
      <path d="M11 12c0-3 1.5-4.5 4-5" />
      <path d="M4 12h3v-2.5M11 12h3v-2.5" />
    </>
  ),
  pdf: (
    <>
      <path d="M6 3h7l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M13 3v3h3" />
    </>
  ),
};

export interface NoteTypeIconProps {
  type: NoteType;
  size?: number;
  className?: string;
}

export function NoteTypeIcon({ type, size = 19, className }: NoteTypeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 19 19"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {GLYPHS[type]}
    </svg>
  );
}
