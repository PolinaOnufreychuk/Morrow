import type { InspirationBoard, InspirationReference } from "@/types/entities";
import type { CreateBoardInput, UpdateBoardInput } from "../types";
import { boardFixtures, referenceFixtures } from "../inspiration.fixtures";

/**
 * In-memory data access — a module-level store seeded from fixtures, mirroring
 * `projects.repository.ts`'s pattern so swapping in real Supabase calls later
 * only touches this file.
 */

const LATENCY_MS = 350;
const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function generateId(): string {
  return `board-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

let store: InspirationBoard[] = boardFixtures.map((board) => ({ ...board }));

export async function fetchBoards(): Promise<InspirationBoard[]> {
  await delay();
  return store.map((board) => ({ ...board }));
}

export async function fetchBoardById(id: string): Promise<InspirationBoard | null> {
  await delay();
  const found = store.find((board) => board.id === id);
  return found ? { ...found } : null;
}

export async function fetchBoardReferences(boardId: string): Promise<InspirationReference[]> {
  // TODO: implement — supabase.from("inspiration_references").select().eq("board_id", boardId)
  return referenceFixtures.filter((reference) => reference.boardId === boardId);
}

export async function createBoard(input: CreateBoardInput): Promise<InspirationBoard> {
  await delay();
  const board: InspirationBoard = {
    ...input,
    id: generateId(),
    isArchived: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store = [board, ...store];
  return { ...board };
}

async function patchBoard(id: string, patch: Partial<InspirationBoard>): Promise<InspirationBoard> {
  await delay();
  const index = store.findIndex((board) => board.id === id);
  if (index === -1) throw new Error(`Board not found: ${id}`);
  const updated: InspirationBoard = { ...store[index], ...patch, id, updatedAt: nowIso() };
  store = [...store.slice(0, index), updated, ...store.slice(index + 1)];
  return { ...updated };
}

export async function updateBoard(input: UpdateBoardInput): Promise<InspirationBoard> {
  const { id, ...patch } = input;
  return patchBoard(id, patch);
}

export async function archiveBoard(id: string): Promise<void> {
  await patchBoard(id, { isArchived: true });
}
