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

export const PROJECT_STATUSES = ["in-progress", "review", "done"] as const;

export const projectStatusSchema = z.enum(PROJECT_STATUSES);

/** Fixed vocabulary for `Project.category` — a single classification value
 * per project, distinct from the free-form `tags` field. */
export const PROJECT_CATEGORY_OPTIONS = [
  "Mobile",
  "Web",
  "Fintech",
  "Branding",
  "Design system",
  "UX Research",
  "Motion",
  "Physical",
] as const;

export const projectCategorySchema = z.enum(PROJECT_CATEGORY_OPTIONS).nullable();

export const externalLinkSchema = z.object({
  label: z.string().trim().min(1, "Link label is required"),
  url: z.string().trim().url("Enter a valid URL"),
});

/** Controlled inputs represent "empty" as `""`; the domain model uses `null`. */
const emptyToNull = (value: unknown) => (value === "" ? null : value);

function isRealCalendarDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** ISO date (YYYY-MM-DD) — the deadline field is date-only, no calendar UI.
 * Validates real calendar dates (e.g. rejects "2026-02-30"), not just shape. */
const isoDateSchema = z.preprocess(
  emptyToNull,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date")
    .refine(isRealCalendarDate, "Use a valid date")
    .nullable(),
);

export const projectTagSchema = z
  .string()
  .trim()
  .min(1)
  .max(32, "Tags must be 32 characters or fewer");

export const projectAttachmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "File name is required"),
  sizeBytes: z.number().int().nonnegative(),
});

/** Shape shared by create and update — update layers `.partial()` on top. */
export const projectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title is too long"),
  coverImageUrl: z.preprocess(
    emptyToNull,
    z.string().trim().url("Enter a valid image URL").nullable(),
  ),
  description: z.preprocess(
    emptyToNull,
    z.string().trim().max(2000, "Description is too long").nullable(),
  ),
  status: projectStatusSchema,
  deadline: isoDateSchema,
  category: projectCategorySchema,
  tags: z.array(projectTagSchema).max(20, "Too many tags"),
  externalLinks: z.array(externalLinkSchema).max(20, "Too many links"),
  attachments: z.array(projectAttachmentSchema).max(20, "Too many attachments"),
  notes: z.preprocess(emptyToNull, z.string().trim().max(4000, "Notes are too long").nullable()),
});

export const createProjectSchema = projectInputSchema;
export const updateProjectSchema = projectInputSchema.partial().extend({
  id: z.string().min(1),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
