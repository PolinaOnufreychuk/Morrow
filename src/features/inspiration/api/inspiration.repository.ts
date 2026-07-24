import type { InspirationBoard, InspirationReference } from "@/types/entities";
import type { CreateBoardInput } from "../schema";
import { BoardNotFoundError } from "../types";
import { supabase } from "@/lib/supabase/client";

export interface AddReferenceInput {
  imageUrl: string;
  sourceUrl: string | null;
}

/**
 * Pure data-access contract for boards + their references — mirrors
 * `projects.repository.ts`'s shape so the pattern stays consistent across
 * features. References are always accessed via a board id, so they live in
 * the same repository rather than a separate one.
 */
export interface InspirationRepository {
  listBoards(): Promise<InspirationBoard[]>;
  listArchivedBoards(): Promise<InspirationBoard[]>;
  getBoardById(id: string): Promise<InspirationBoard | null>;
  createBoard(input: CreateBoardInput): Promise<InspirationBoard>;
  updateBoard(id: string, patch: Partial<InspirationBoard>): Promise<InspirationBoard>;
  archiveBoard(id: string): Promise<InspirationBoard>;
  unarchiveBoard(id: string): Promise<InspirationBoard>;
  deleteBoard(id: string): Promise<void>;
  listReferences(boardId: string): Promise<InspirationReference[]>;
  addReferences(boardId: string, inputs: AddReferenceInput[]): Promise<InspirationReference[]>;
  removeReferences(ids: string[]): Promise<void>;
}

interface BoardRow {
  id: string;
  title: string;
  cover_image_url: string | null;
  tags: string[];
  notes: string | null;
  project_id: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

interface ReferenceRow {
  id: string;
  board_id: string;
  image_url: string;
  source_url: string | null;
  position: number;
  created_at: string;
}

function rowToBoard(row: BoardRow): InspirationBoard {
  return {
    id: row.id,
    title: row.title,
    coverImageUrl: row.cover_image_url,
    tags: row.tags,
    notes: row.notes,
    projectId: row.project_id,
    isArchived: row.is_archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function boardToInsertRow(input: CreateBoardInput) {
  return {
    title: input.title,
    cover_image_url: input.coverImageUrl,
    tags: input.tags,
    notes: input.notes,
    project_id: input.projectId,
  };
}

function boardToUpdateRow(patch: Partial<InspirationBoard>) {
  const row: Record<string, unknown> = {};
  if ("title" in patch) row.title = patch.title;
  if ("coverImageUrl" in patch) row.cover_image_url = patch.coverImageUrl;
  if ("tags" in patch) row.tags = patch.tags;
  if ("notes" in patch) row.notes = patch.notes;
  if ("projectId" in patch) row.project_id = patch.projectId;
  if ("isArchived" in patch) row.is_archived = patch.isArchived;
  return row;
}

function rowToReference(row: ReferenceRow): InspirationReference {
  return {
    id: row.id,
    boardId: row.board_id,
    imageUrl: row.image_url,
    sourceUrl: row.source_url,
    position: row.position,
    createdAt: row.created_at,
  };
}

class SupabaseInspirationRepository implements InspirationRepository {
  async listBoards(): Promise<InspirationBoard[]> {
    const { data, error } = await supabase
      .from("inspiration_boards")
      .select("*")
      .eq("is_archived", false)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as BoardRow[]).map(rowToBoard);
  }

  async listArchivedBoards(): Promise<InspirationBoard[]> {
    const { data, error } = await supabase
      .from("inspiration_boards")
      .select("*")
      .eq("is_archived", true)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data as BoardRow[]).map(rowToBoard);
  }

  async getBoardById(id: string): Promise<InspirationBoard | null> {
    const { data, error } = await supabase
      .from("inspiration_boards")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToBoard(data as BoardRow) : null;
  }

  async createBoard(input: CreateBoardInput): Promise<InspirationBoard> {
    const { data, error } = await supabase
      .from("inspiration_boards")
      .insert(boardToInsertRow(input))
      .select()
      .single();
    if (error) throw error;
    return rowToBoard(data as BoardRow);
  }

  async updateBoard(id: string, patch: Partial<InspirationBoard>): Promise<InspirationBoard> {
    const { data, error } = await supabase
      .from("inspiration_boards")
      .update(boardToUpdateRow(patch))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new BoardNotFoundError(id);
    return rowToBoard(data as BoardRow);
  }

  async archiveBoard(id: string): Promise<InspirationBoard> {
    return this.updateBoard(id, { isArchived: true });
  }

  async unarchiveBoard(id: string): Promise<InspirationBoard> {
    return this.updateBoard(id, { isArchived: false });
  }

  async deleteBoard(id: string): Promise<void> {
    // `inspiration_references.board_id` is `on delete cascade` — deleting the
    // board also removes its references, no manual cascade needed here.
    const { error } = await supabase.from("inspiration_boards").delete().eq("id", id);
    if (error) throw error;
  }

  async listReferences(boardId: string): Promise<InspirationReference[]> {
    const { data, error } = await supabase
      .from("inspiration_references")
      .select("*")
      .eq("board_id", boardId)
      .order("position", { ascending: true });
    if (error) throw error;
    return (data as ReferenceRow[]).map(rowToReference);
  }

  async addReferences(
    boardId: string,
    inputs: AddReferenceInput[],
  ): Promise<InspirationReference[]> {
    const { count, error: countError } = await supabase
      .from("inspiration_references")
      .select("*", { count: "exact", head: true })
      .eq("board_id", boardId);
    if (countError) throw countError;
    const existingCount = count ?? 0;

    const rows = inputs.map((input, index) => ({
      board_id: boardId,
      image_url: input.imageUrl,
      source_url: input.sourceUrl,
      position: existingCount + index,
    }));
    const { data, error } = await supabase.from("inspiration_references").insert(rows).select();
    if (error) throw error;
    return (data as ReferenceRow[]).map(rowToReference);
  }

  async removeReferences(ids: string[]): Promise<void> {
    const { error } = await supabase.from("inspiration_references").delete().in("id", ids);
    if (error) throw error;
  }
}

export const inspirationRepository: InspirationRepository = new SupabaseInspirationRepository();
