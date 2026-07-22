import type { InspirationBoard, InspirationReference } from "@/types/entities";

export type { InspirationBoard, InspirationReference };

export type InspirationSort = "recent" | "created" | "title";

/** Real category vocabulary used by board fixtures/filters — distinct from the generic `lib/categories.ts` list used by Projects/Resources. */
export const INSPIRATION_CATEGORY_OPTIONS = [
  "Color",
  "UI patterns",
  "Typography",
  "Illustration",
  "UX patterns",
] as const;

export type CreateBoardInput = Omit<
  InspirationBoard,
  "id" | "isArchived" | "createdAt" | "updatedAt"
>;

export type UpdateBoardInput = Partial<CreateBoardInput> & { id: string };
