import type { NoteType } from "@/types/entities";
import type { NoteTypeMeta } from "./types";

/** Single source of truth for note-type labels/descriptions (picker + cards). */
export const NOTE_TYPE_META: Record<NoteType, NoteTypeMeta> = {
  text: { type: "text", label: "Text", description: "A free-form written note." },
  checklist: { type: "checklist", label: "Checklist", description: "A list of checkable items." },
  bookmark: { type: "bookmark", label: "Bookmark", description: "Save a link with a preview." },
  image: { type: "image", label: "Image", description: "A single cover image." },
  moodboard: { type: "moodboard", label: "Moodboard", description: "A 2×2 grid of four images." },
  code: { type: "code", label: "Snippet", description: "A syntax-highlighted snippet." },
  quote: { type: "quote", label: "Quote", description: "A quote with an author." },
  recipe: { type: "recipe", label: "Recipe", description: "A bulleted ingredient list." },
  pdf: { type: "pdf", label: "PDF", description: "A document with a page count." },
  meeting: { type: "meeting", label: "Meeting notes", description: "Attendees and an agenda." },
};

export const NOTE_TYPE_ORDER: NoteType[] = [
  "text",
  "checklist",
  "bookmark",
  "image",
  "moodboard",
  "code",
  "quote",
  "recipe",
  "pdf",
  "meeting",
];
