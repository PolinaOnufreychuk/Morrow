import type { ChecklistItem, MeetingAttendee, Note, NoteType } from "@/types/entities";
import type { CreateNoteInput } from "../types";
import { NoteNotFoundError } from "../types";
import { supabase } from "@/lib/supabase/client";

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
}

/** Wide-table row: one row per note, only the columns for `type` populated. */
interface NoteRow {
  id: string;
  type: NoteType;
  title: string;
  body: string | null;
  items: ChecklistItem[] | null;
  url: string | null;
  favicon_url: string | null;
  domain: string | null;
  snippet: string | null;
  cover_image_url: string | null;
  images: string[] | null;
  language: string | null;
  code: string | null;
  quote: string | null;
  author: string | null;
  ingredients: string[] | null;
  filename: string | null;
  page_count: number | null;
  attendees: MeetingAttendee[] | null;
  agenda: string[] | null;
  project_id: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

/** Switches on `row.type` to build only that variant's fields — the
 * trickiest mapper in the app since one wide table backs a 10-member
 * discriminated union. */
function rowToNote(row: NoteRow): Note {
  const base = {
    id: row.id,
    title: row.title,
    projectId: row.project_id,
    isArchived: row.is_archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  switch (row.type) {
    case "text":
      return { ...base, type: "text", body: row.body ?? "" };
    case "checklist":
      return { ...base, type: "checklist", items: row.items ?? [] };
    case "bookmark":
      return {
        ...base,
        type: "bookmark",
        url: row.url ?? "",
        faviconUrl: row.favicon_url,
        domain: row.domain,
        snippet: row.snippet,
      };
    case "image":
      return { ...base, type: "image", coverImageUrl: row.cover_image_url ?? "" };
    case "moodboard":
      return {
        ...base,
        type: "moodboard",
        images: (row.images ?? ["", "", "", ""]).slice(0, 4) as [string, string, string, string],
      };
    case "code":
      return { ...base, type: "code", language: row.language ?? "", code: row.code ?? "" };
    case "quote":
      return { ...base, type: "quote", quote: row.quote ?? "", author: row.author };
    case "recipe":
      return { ...base, type: "recipe", ingredients: row.ingredients ?? [] };
    case "pdf":
      return {
        ...base,
        type: "pdf",
        filename: row.filename ?? "",
        pageCount: row.page_count,
      };
    case "meeting":
      return {
        ...base,
        type: "meeting",
        attendees: row.attendees ?? [],
        agenda: row.agenda ?? [],
      };
  }
}

/** Spreads whichever variant's fields are present into the wide row shape —
 * every key omitted here is a column Supabase leaves untouched (insert) or
 * `NULL` (insert default), never clobbered on update. */
function noteToRow(input: Partial<Note>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if ("title" in input) row.title = input.title;
  if ("projectId" in input) row.project_id = input.projectId;
  if ("isArchived" in input) row.is_archived = input.isArchived;
  if (!("type" in input) || input.type === undefined) return row;

  row.type = input.type;
  switch (input.type) {
    case "text":
      row.body = input.body;
      break;
    case "checklist":
      row.items = input.items;
      break;
    case "bookmark":
      row.url = input.url;
      row.favicon_url = input.faviconUrl;
      row.domain = input.domain;
      row.snippet = input.snippet;
      break;
    case "image":
      row.cover_image_url = input.coverImageUrl;
      break;
    case "moodboard":
      row.images = input.images;
      break;
    case "code":
      row.language = input.language;
      row.code = input.code;
      break;
    case "quote":
      row.quote = input.quote;
      row.author = input.author;
      break;
    case "recipe":
      row.ingredients = input.ingredients;
      break;
    case "pdf":
      row.filename = input.filename;
      row.page_count = input.pageCount;
      break;
    case "meeting":
      row.attendees = input.attendees;
      row.agenda = input.agenda;
      break;
  }
  return row;
}

class SupabaseNotesRepository implements NotesRepository {
  async list(): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as NoteRow[]).map(rowToNote);
  }

  async listArchived(): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("is_archived", true)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as NoteRow[]).map(rowToNote);
  }

  async getById(id: string): Promise<Note | null> {
    const { data, error } = await supabase.from("notes").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToNote(data as NoteRow) : null;
  }

  async create(input: CreateNoteInput): Promise<Note> {
    const { data, error } = await supabase.from("notes").insert(noteToRow(input)).select().single();
    if (error) throw error;
    return rowToNote(data as NoteRow);
  }

  async update(id: string, patch: Partial<Note>): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .update(noteToRow(patch))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new NoteNotFoundError(id);
    return rowToNote(data as NoteRow);
  }

  async archive(id: string): Promise<Note> {
    return this.update(id, { isArchived: true });
  }

  async unarchive(id: string): Promise<Note> {
    return this.update(id, { isArchived: false });
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
  }
}

export const notesRepository: NotesRepository = new SupabaseNotesRepository();
