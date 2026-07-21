import type { Note } from "@/types/entities";
import { noteFixtures } from "../notes.fixtures";

/** Stubbed data access — no live supabase calls yet (scaffolding only). */

export async function fetchNotes(): Promise<Note[]> {
  // TODO: implement — supabase.from("notes").select().eq("is_archived", false)
  return noteFixtures;
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  // TODO: implement
  return noteFixtures.find((note) => note.id === id) ?? null;
}

export async function createNote(input: Note): Promise<Note> {
  // TODO: implement — insert with type-specific columns
  void input;
  throw new Error("createNote not implemented");
}

export async function updateNote(input: Note): Promise<Note> {
  // TODO: implement
  void input;
  throw new Error("updateNote not implemented");
}

export async function archiveNote(id: string): Promise<void> {
  // TODO: implement
  void id;
  throw new Error("archiveNote not implemented");
}

export async function deleteNote(id: string): Promise<void> {
  // TODO: implement
  void id;
  throw new Error("deleteNote not implemented");
}
