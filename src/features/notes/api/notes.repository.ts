import type { ChecklistItem, Note, NoteType } from "@/types/entities";
import type { CreateNoteInput } from "../types";
import { NoteNotFoundError } from "../types";
import { supabase } from "@/lib/supabase/client";
import { toSupabaseError } from "@/lib/supabase/errors";

/**
 * Pure data-access contract — mirrors `projects.repository.ts`'s shape.
 */
export interface NotesRepository {
  list(): Promise<Note[]>;
  listArchived(): Promise<Note[]>;
  getById(id: string): Promise<Note | null>;
  create(input: CreateNoteInput): Promise<Note>;
  update(id: string, patch: Partial<Note>): Promise<Note>;
  archive(id: string): Promise<Note>;
  unarchive(id: string): Promise<Note>;
  remove(id: string): Promise<void>;
  linkToProject(noteId: string, projectId: string): Promise<void>;
  unlinkFromProject(noteId: string, projectId: string): Promise<void>;
}

/** Wide-table row: one row per note, only the columns for `type` populated. */
interface NoteRow {
  id: string;
  type: NoteType;
  title: string;
  body: string | null;
  items: ChecklistItem[] | null;
  cover_image_url: string | null;
  quote: string | null;
  author: string | null;
  // `pdf` reuses columns freed when the `bookmark` type was removed: `url`
  // holds the uploaded file's public URL, `snippet` its description.
  url: string | null;
  snippet: string | null;
  filename: string | null;
  is_archived: boolean;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  project_notes: { project_id: string }[] | null;
}

/** Switches on `row.type` to build only that variant's fields — the
 * trickiest mapper in the app since one wide table backs a 5-member
 * discriminated union. */
function rowToNote(row: NoteRow): Note {
  const base = {
    id: row.id,
    title: row.title,
    projectIds: (row.project_notes ?? []).map((link) => link.project_id),
    isArchived: row.is_archived,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  switch (row.type) {
    case "text":
      return { ...base, type: "text", body: row.body ?? "" };
    case "checklist":
      return { ...base, type: "checklist", items: row.items ?? [] };
    case "image":
      return { ...base, type: "image", coverImageUrl: row.cover_image_url ?? "" };
    case "quote":
      return { ...base, type: "quote", quote: row.quote ?? "", author: row.author };
    case "pdf":
      return {
        ...base,
        type: "pdf",
        description: row.snippet,
        fileUrl: row.url ?? "",
        filename: row.filename ?? "",
      };
  }
}

/** Spreads whichever variant's fields are present into the wide row shape —
 * every key omitted here is a column Supabase leaves untouched (insert) or
 * `NULL` (insert default), never clobbered on update. */
function noteToRow(input: Partial<Note>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if ("title" in input) row.title = input.title;
  if ("isArchived" in input) row.is_archived = input.isArchived;
  if ("archivedAt" in input) row.archived_at = input.archivedAt;
  if (!("type" in input) || input.type === undefined) return row;

  row.type = input.type;
  switch (input.type) {
    case "text":
      row.body = input.body;
      break;
    case "checklist":
      row.items = input.items;
      break;
    case "image":
      row.cover_image_url = input.coverImageUrl;
      break;
    case "quote":
      row.quote = input.quote;
      row.author = input.author;
      break;
    case "pdf":
      row.url = input.fileUrl;
      row.snippet = input.description;
      row.filename = input.filename;
      break;
  }
  return row;
}

const NOTE_SELECT = "*, project_notes(project_id)";

/** Note types the app still supports. Legacy rows of removed types (e.g. a
 * note created before the type set was trimmed) are skipped so they never
 * reach the UI as `undefined`. */
const KNOWN_NOTE_TYPES = new Set<NoteType>(["text", "checklist", "image", "quote", "pdf"]);
const isKnownNoteRow = (row: NoteRow) => KNOWN_NOTE_TYPES.has(row.type);

class SupabaseNotesRepository implements NotesRepository {
  async list(): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select(NOTE_SELECT)
      .eq("is_archived", false)
      .order("created_at", { ascending: false });
    if (error) throw toSupabaseError(error);
    return (data as NoteRow[]).filter(isKnownNoteRow).map(rowToNote);
  }

  async listArchived(): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select(NOTE_SELECT)
      .eq("is_archived", true)
      .order("archived_at", { ascending: false });
    if (error) throw toSupabaseError(error);
    return (data as NoteRow[]).filter(isKnownNoteRow).map(rowToNote);
  }

  async getById(id: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from("notes")
      .select(NOTE_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw toSupabaseError(error);
    if (!data || !isKnownNoteRow(data as NoteRow)) return null;
    return rowToNote(data as NoteRow);
  }

  async create(input: CreateNoteInput): Promise<Note> {
    const { data, error } = await supabase.from("notes").insert(noteToRow(input)).select().single();
    if (error) throw toSupabaseError(error);
    const note = data as NoteRow;
    const projectIds = input.projectIds ?? [];
    if (projectIds.length > 0) {
      await Promise.all(projectIds.map((projectId) => this.linkToProject(note.id, projectId)));
      return { ...rowToNote(note), projectIds };
    }
    return rowToNote(note);
  }

  async update(id: string, patch: Partial<Note>): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .update(noteToRow(patch))
      .eq("id", id)
      .select(NOTE_SELECT)
      .maybeSingle();
    if (error) throw toSupabaseError(error);
    if (!data) throw new NoteNotFoundError(id);
    return rowToNote(data as NoteRow);
  }

  async linkToProject(noteId: string, projectId: string): Promise<void> {
    const { error } = await supabase.from("project_notes").insert({ note_id: noteId, project_id: projectId });
    if (error) throw toSupabaseError(error);
  }

  async unlinkFromProject(noteId: string, projectId: string): Promise<void> {
    const { error } = await supabase
      .from("project_notes")
      .delete()
      .eq("note_id", noteId)
      .eq("project_id", projectId);
    if (error) throw toSupabaseError(error);
  }

  async archive(id: string): Promise<Note> {
    return this.update(id, { isArchived: true, archivedAt: new Date().toISOString() });
  }

  async unarchive(id: string): Promise<Note> {
    return this.update(id, { isArchived: false, archivedAt: null });
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw toSupabaseError(error);
  }
}

export const notesRepository: NotesRepository = new SupabaseNotesRepository();
