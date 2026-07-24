import type { ZodError } from "zod";
import type { InspirationBoard, InspirationReference } from "@/types/entities";
import { createBoardSchema, updateBoardSchema } from "../schema";
import { InspirationValidationError } from "../types";
import { inspirationRepository, type AddReferenceInput } from "./inspiration.repository";
import { deleteAllForParent } from "@/features/attachments/api/attachments.service";

export type { AddReferenceInput };

/**
 * Business layer: the ONLY thing hooks import. Validates input against the
 * schema before it ever reaches the repository. Mirrors
 * `projects.service.ts`'s pattern.
 */

function toValidationError(error: ZodError): InspirationValidationError {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }
  return new InspirationValidationError("Please fix the highlighted fields.", fieldErrors);
}

export async function listBoards(): Promise<InspirationBoard[]> {
  return inspirationRepository.listBoards();
}

export async function listArchivedBoards(): Promise<InspirationBoard[]> {
  return inspirationRepository.listArchivedBoards();
}

export async function getBoard(id: string): Promise<InspirationBoard | null> {
  return inspirationRepository.getBoardById(id);
}

export async function createBoard(input: unknown): Promise<InspirationBoard> {
  const parsed = createBoardSchema.safeParse(input);
  if (!parsed.success) throw toValidationError(parsed.error);
  return inspirationRepository.createBoard(parsed.data);
}

export async function updateBoard(input: unknown): Promise<InspirationBoard> {
  const parsed = updateBoardSchema.safeParse(input);
  if (!parsed.success) throw toValidationError(parsed.error);
  const { id, ...patch } = parsed.data;
  return inspirationRepository.updateBoard(id, patch);
}

export async function archiveBoard(id: string): Promise<InspirationBoard> {
  return inspirationRepository.archiveBoard(id);
}

export async function unarchiveBoard(id: string): Promise<InspirationBoard> {
  return inspirationRepository.unarchiveBoard(id);
}

/** Cleans up the board's attachments first — the polymorphic `attachments`
 * table has no DB-level cascade tied to `inspiration_boards`. */
export async function deleteBoard(id: string): Promise<void> {
  await deleteAllForParent("inspiration_board", id);
  return inspirationRepository.deleteBoard(id);
}

export async function listReferences(boardId: string): Promise<InspirationReference[]> {
  return inspirationRepository.listReferences(boardId);
}

export async function addReferences(
  boardId: string,
  inputs: AddReferenceInput[],
): Promise<InspirationReference[]> {
  return inspirationRepository.addReferences(boardId, inputs);
}

export async function removeReferences(ids: string[]): Promise<void> {
  return inspirationRepository.removeReferences(ids);
}
