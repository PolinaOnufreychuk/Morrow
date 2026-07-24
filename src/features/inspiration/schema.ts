import { z } from "zod";

/**
 * Single source of truth for InspirationBoard validation, consumed by
 * inspiration.service.ts before any create/update reaches the repository.
 * Distinct from BoardForm's own `boardFormSchema` (UI-only field shape for
 * the not-yet-wired create/edit modals) — this validates the real domain
 * fields on `InspirationBoard`.
 */

const emptyToNull = (value: unknown) => (value === "" ? null : value);

export const boardTagSchema = z.string().trim().min(1).max(32, "Tags must be 32 characters or fewer");

export const boardInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
  coverImageUrl: z.preprocess(
    emptyToNull,
    z.string().trim().url("Enter a valid image URL").nullable(),
  ),
  tags: z.array(boardTagSchema).max(20, "Too many tags"),
  notes: z.preprocess(emptyToNull, z.string().trim().max(4000, "Notes are too long").nullable()),
  /** Optional single project to link at creation (e.g. the project's own
   * "+ Add board" quick-create). Further links/unlinks after that go through
   * the dedicated linkBoardToProject/unlinkBoardFromProject calls. */
  projectId: z.string().nullable().optional(),
});

export const createBoardSchema = boardInputSchema;
export const updateBoardSchema = boardInputSchema.partial().extend({
  id: z.string().min(1),
});

export type BoardInput = z.infer<typeof boardInputSchema>;
export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
