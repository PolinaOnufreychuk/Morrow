import { type ReactNode } from "react";
import type { ResourceKind } from "@/types/entities";
import { FigmaMark } from "@/design-system/icons/FigmaMark";

/**
 * Local per-kind glyphs for the Resource Type picker — mirrors
 * `notes/components/NoteTypeIcon.tsx`'s pattern/viewBox so both pickers read
 * as one visual system (docs/DESIGN.md consistency).
 */
const GLYPHS: Partial<Record<ResourceKind, ReactNode>> = {
  link: (
    <>
      <circle cx="9.5" cy="9.5" r="6.5" />
      <path d="M3 9.5h13M9.5 3c2 2.2 3 4.4 3 6.5s-1 4.3-3 6.5c-2-2.2-3-4.4-3-6.5S7.5 5.2 9.5 3Z" />
    </>
  ),
  repo: <path d="m7 6-4 3.5L7 13M13 6l4 3.5L13 13" />,
  video: (
    <>
      <rect x="2.5" y="4.5" width="14" height="10" rx="2" />
      <path d="M8 7.5 12 9.5 8 11.5Z" fill="currentColor" stroke="none" />
    </>
  ),
  pdf: (
    <>
      <path d="M6 3h7l3 3v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M13 3v3h3" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="13" height="13" rx="2.5" />
      <circle cx="7" cy="7" r="1.4" />
      <path d="m4 13 3.5-3.5 3 3 2.5-2.5L16 13" />
    </>
  ),
};

export interface ResourceKindIconProps {
  kind: ResourceKind;
  size?: number;
  className?: string;
}

export function ResourceKindIcon({ kind, size = 19, className }: ResourceKindIconProps) {
  if (kind === "preview") {
    // The Figma mark is a full-color glyph, unlike the rest of this set — it
    // reads clearly at small sizes and is already used this way on ResourceCard.
    return <FigmaMark size={size} />;
  }
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
      {GLYPHS[kind]}
    </svg>
  );
}
