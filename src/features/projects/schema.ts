import { z } from "zod";

/**
 * Single source of truth for Project validation. Consumed by:
 *  - ProjectForm (react-hook-form's zodResolver) for client-side field errors
 *  - projectsService (data layer) for a defense-in-depth check before any
 *    create/update reaches the repository — forms are not the only possible
 *    caller once a real API exists, so validation must not live in the UI.
 *
 * Keeping exactly one schema means the form and the service can never drift.
 */

export const PROJECT_STATUSES = [
  "planning",
  "in-progress",
  "review",
  "done",
  "on-hold",
] as const;

export const projectStatusSchema = z.enum(PROJECT_STATUSES);

export const externalLinkSchema = z.object({
  label: z.string().trim().min(1, "Link label is required"),
  url: z.string().trim().url("Enter a valid URL"),
});

/** ISO date (YYYY-MM-DD) — the deadline field is date-only, no calendar UI. */
const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date")
  .nullable();

export const projectTagSchema = z
  .string()
  .trim()
  .min(1)
  .max(32, "Tags must be 32 characters or fewer");

/** Shape shared by create and update — update layers `.partial()` on top. */
export const projectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
  coverImageUrl: z.string().trim().url("Enter a valid image URL").nullable(),
  description: z.string().trim().max(2000, "Description is too long").nullable(),
  status: projectStatusSchema,
  deadline: isoDateSchema,
  tags: z.array(projectTagSchema).max(20, "Too many tags"),
  externalLinks: z.array(externalLinkSchema).max(20, "Too many links"),
  notes: z.string().trim().max(4000, "Notes are too long").nullable(),
});

export const createProjectSchema = projectInputSchema;
export const updateProjectSchema = projectInputSchema.partial().extend({
  id: z.string().min(1),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
