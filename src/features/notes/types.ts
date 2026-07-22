import type { Note, NoteType } from "@/types/entities";

export type { Note, NoteType };

export type NoteSort = "recent" | "created" | "title";

/** Metadata for the visual type picker — one entry per note type. */
export interface NoteTypeMeta {
  type: NoteType;
  label: string;
  description: string;
}
