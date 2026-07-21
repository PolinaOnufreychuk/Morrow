import type { InspirationBoard, InspirationReference } from "@/types/entities";

export type { InspirationBoard, InspirationReference };

export type InspirationSort = "recent" | "title";

export type CreateBoardInput = Omit<
  InspirationBoard,
  "id" | "isArchived" | "createdAt" | "updatedAt"
>;

export type UpdateBoardInput = Partial<CreateBoardInput> & { id: string };
