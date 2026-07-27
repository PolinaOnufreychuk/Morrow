import type { NoteType } from "@/types/entities";
import type { NoteTypeMeta } from "./types";

/** Single source of truth for note-type labels/descriptions (picker + cards). */
export const NOTE_TYPE_META: Record<NoteType, NoteTypeMeta> = {
  text: { type: "text", label: "Text", description: "A free-form written note." },
  checklist: { type: "checklist", label: "Checklist", description: "A list of checkable items." },
  image: { type: "image", label: "Image", description: "A single cover image." },
  quote: { type: "quote", label: "Quote", description: "A quote with an author." },
  pdf: { type: "pdf", label: "PDF", description: "A document with a page count." },
};

export const NOTE_TYPE_ORDER: NoteType[] = ["text", "checklist", "image", "quote", "pdf"];
