import { z } from "zod";

/**
 * Zod validation for Resources, consumed by resources.service.ts. `Resource`
 * is a 6-variant discriminated union on `kind` — mirrors notes/schema.ts's
 * approach (strict on create, loose-by-id on update; see that file's header
 * comment for why).
 */

const baseResourceFields = {
  title: z.string().trim().min(1, "Title is required").max(160, "Title is too long"),
  url: z.string().trim().url("Enter a valid URL"),
  description: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().trim().max(2000, "Description is too long").nullable(),
  ),
  tags: z.array(z.string().trim().min(1).max(32)).max(20, "Too many tags"),
  projectIds: z.array(z.string()),
};

const linkResourceSchema = z.object({
  kind: z.literal("link"),
  ...baseResourceFields,
  readingMinutes: z.number().int().positive().nullable(),
});

const repoResourceSchema = z.object({
  kind: z.literal("repo"),
  ...baseResourceFields,
  owner: z.string().trim().min(1, "Owner is required"),
  repoName: z.string().trim().min(1, "Repo name is required"),
  language: z.string().nullable(),
  stars: z.number().int().nonnegative().nullable(),
});

const videoResourceSchema = z.object({
  kind: z.literal("video"),
  ...baseResourceFields,
  thumbnailUrl: z.string().nullable(),
  duration: z.string().nullable(),
});

const pdfResourceSchema = z.object({
  kind: z.literal("pdf"),
  ...baseResourceFields,
  filename: z.string().trim().min(1, "Filename is required"),
  pageCount: z.number().int().positive().nullable(),
});

const previewResourceSchema = z.object({
  kind: z.literal("preview"),
  ...baseResourceFields,
  previewImageUrl: z.string().nullable(),
  isFigma: z.boolean(),
});

const imageResourceSchema = z.object({
  kind: z.literal("image"),
  ...baseResourceFields,
  coverImageUrl: z.string().trim().url("Enter a valid image URL"),
});

export const createResourceSchema = z.discriminatedUnion("kind", [
  linkResourceSchema,
  repoResourceSchema,
  videoResourceSchema,
  pdfResourceSchema,
  previewResourceSchema,
  imageResourceSchema,
]);

export const updateResourceSchema = z.object({ id: z.string().min(1) }).passthrough();

export type CreateResourceSchemaInput = z.infer<typeof createResourceSchema>;
