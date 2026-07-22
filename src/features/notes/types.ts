import type { Note, NoteType } from "@/types/entities";

export type { Note, NoteType };

export type NoteSort = "recent" | "created" | "title";

/** Plain `Omit` collapses a discriminated union to its shared keys — this
 * distributes over each member so type-specific fields (body/items/etc.)
 * survive. */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export type CreateNoteInput = DistributiveOmit<
  Note,
  "id" | "isArchived" | "createdAt" | "updatedAt"
>;

export type UpdateNoteInput = Partial<Note> & { id: string };

/** Metadata for the visual type picker — one entry per note type. */
export interface NoteTypeMeta {
  type: NoteType;
  label: string;
  description: string;
}
