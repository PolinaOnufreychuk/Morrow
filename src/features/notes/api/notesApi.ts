import type { Note } from "@/types/entities";
import type { CreateNoteInput, UpdateNoteInput } from "../types";
import { noteFixtures } from "../notes.fixtures";

/**
 * In-memory data access — a module-level store seeded from fixtures, mirroring
 * `projects.repository.ts`'s pattern so swapping in real Supabase calls later
 * only touches this file.
 */

const LATENCY_MS = 350;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function generateId(): string {
  return `note-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

let store: Note[] = noteFixtures.map((note) => ({ ...note }));

export async function fetchNotes(): Promise<Note[]> {
  await delay();
  return store.map((note) => ({ ...note }));
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  await delay();
  const found = store.find((note) => note.id === id);
  return found ? { ...found } : null;
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  await delay();
  const note = {
    ...input,
    id: generateId(),
    isArchived: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  } as Note;
  store = [note, ...store];
  return { ...note };
}

async function patchNote(id: string, patch: Partial<Note>): Promise<Note> {
  await delay();
  const index = store.findIndex((note) => note.id === id);
  if (index === -1) throw new Error(`Note not found: ${id}`);
  const updated = { ...store[index], ...patch, id, updatedAt: nowIso() } as Note;
  store = [...store.slice(0, index), updated, ...store.slice(index + 1)];
  return { ...updated };
}

export async function updateNote(input: UpdateNoteInput): Promise<Note> {
  const { id, ...patch } = input;
  return patchNote(id, patch);
}

export async function archiveNote(id: string): Promise<void> {
  await patchNote(id, { isArchived: true });
}

export async function deleteNote(id: string): Promise<void> {
  await delay();
  const existed = store.some((note) => note.id === id);
  if (!existed) throw new Error(`Note not found: ${id}`);
  store = store.filter((note) => note.id !== id);
}
