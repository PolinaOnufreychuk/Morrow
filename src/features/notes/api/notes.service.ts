import type { ZodError } from "zod";
import type { Note } from "@/types/entities";
import { createNoteSchema, updateNoteSchema } from "../schema";
import { NoteValidationError } from "../types";
import type { UpdateNoteInput } from "../types";
import { notesRepository } from "./notes.repository";

/**
 * Business layer: the ONLY thing hooks import. Mirrors
 * `projects.service.ts`'s pattern.
 */

function toValidationError(error: ZodError): NoteValidationError {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return new NoteValidationError("Please fix the highlighted fields.", fieldErrors);
}

export async function listNotes(): Promise<Note[]> {
  return notesRepository.list();
}

export async function listArchivedNotes(): Promise<Note[]> {
  return notesRepository.listArchived();
}

export async function getNote(id: string): Promise<Note | null> {
  return notesRepository.getById(id);
}

export async function createNote(input: unknown): Promise<Note> {
  const parsed = createNoteSchema.safeParse(input);
  if (!parsed.success) throw toValidationError(parsed.error);
  return notesRepository.create(parsed.data);
}

export async function updateNote(input: unknown): Promise<Note> {
  const parsed = updateNoteSchema.safeParse(input);
  if (!parsed.success) throw toValidationError(parsed.error);
  const { id, ...patch } = parsed.data as UpdateNoteInput;
  return notesRepository.update(id, patch);
}

export async function linkNoteToProject(noteId: string, projectId: string): Promise<void> {
  return notesRepository.linkToProject(noteId, projectId);
}

export async function unlinkNoteFromProject(noteId: string, projectId: string): Promise<void> {
  return notesRepository.unlinkFromProject(noteId, projectId);
}

export async function archiveNote(id: string): Promise<Note> {
  return notesRepository.archive(id);
}

export async function unarchiveNote(id: string): Promise<Note> {
  return notesRepository.unarchive(id);
}

export async function deleteNote(id: string): Promise<void> {
  return notesRepository.remove(id);
}
