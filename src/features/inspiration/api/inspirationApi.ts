import type { InspirationBoard, InspirationReference } from "@/types/entities";
import type { CreateBoardInput, UpdateBoardInput } from "../types";
import { boardFixtures, referenceFixtures } from "../inspiration.fixtures";

/** Stubbed data access — no live supabase calls yet (scaffolding only). */

export async function fetchBoards(): Promise<InspirationBoard[]> {
  // TODO: implement — supabase.from("inspiration_boards").select()
  return boardFixtures;
}

export async function fetchBoardById(id: string): Promise<InspirationBoard | null> {
  // TODO: implement
  return boardFixtures.find((board) => board.id === id) ?? null;
}

export async function fetchBoardReferences(boardId: string): Promise<InspirationReference[]> {
  // TODO: implement — supabase.from("inspiration_references").select().eq("board_id", boardId)
  return referenceFixtures.filter((reference) => reference.boardId === boardId);
}

export async function createBoard(input: CreateBoardInput): Promise<InspirationBoard> {
  // TODO: implement
  void input;
  throw new Error("createBoard not implemented");
}

export async function updateBoard(input: UpdateBoardInput): Promise<InspirationBoard> {
  // TODO: implement
  void input;
  throw new Error("updateBoard not implemented");
}

export async function archiveBoard(id: string): Promise<void> {
  // TODO: implement
  void id;
  throw new Error("archiveBoard not implemented");
}
