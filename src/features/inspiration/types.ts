import type { InspirationBoard, InspirationReference } from "@/types/entities";

export type { InspirationBoard, InspirationReference };
export type { CreateBoardInput, UpdateBoardInput, BoardInput } from "./schema";

export type InspirationSort = "recent" | "created" | "title";

/** Real category vocabulary used by board fixtures/filters — distinct from the generic `lib/categories.ts` list used by Projects/Resources. */
export const INSPIRATION_CATEGORY_OPTIONS = [
  "Color",
  "UI patterns",
  "Typography",
  "Illustration",
  "UX patterns",
] as const;

/** A domain-level error the service layer can throw — distinct from
 * unexpected/transport failures, so the UI can render a field-aware or
 * user-facing message instead of a generic "something went wrong". */
export class InspirationValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string[]>,
  ) {
    super(message);
    this.name = "InspirationValidationError";
  }
}

export class BoardNotFoundError extends Error {
  constructor(id: string) {
    super(`Board "${id}" was not found.`);
    this.name = "BoardNotFoundError";
  }
}
