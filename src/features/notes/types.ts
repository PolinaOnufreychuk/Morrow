import type { Note, NoteType } from "@/types/entities";

export type { Note, NoteType };

export type NoteSort = "recent" | "created" | "title";

/** Plain `Omit` collapses a discriminated union to its shared keys — this
 * distributes over each member so type-specific fields (body/items/etc.)
 * survive. */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export type CreateNoteInput = DistributiveOmit<
  Note,
  "id" | "isArchived" | "archivedAt" | "createdAt" | "updatedAt"
>;

export type UpdateNoteInput = Partial<Note> & { id: string };

/** Metadata for the visual type picker — one entry per note type. */
export interface NoteTypeMeta {
  type: NoteType;
  label: string;
  description: string;
}

/** A domain-level error the service layer can throw — distinct from
 * unexpected/transport failures, so the UI can render a field-aware or
 * user-facing message instead of a generic "something went wrong". */
export class NoteValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string[]>,
  ) {
    super(message);
    this.name = "NoteValidationError";
  }
}

export class NoteNotFoundError extends Error {
  constructor(id: string) {
    super(`Note "${id}" was not found.`);
    this.name = "NoteNotFoundError";
  }
}
