import { z } from "zod";

/**
 * Zod validation for Notes, consumed by notes.service.ts. `Note` is a
 * 5-variant discriminated union on `type`, so create validates the full
 * shape of whichever variant is being submitted.
 *
 * Update validation stays intentionally loose: forms only ever submit the
 * currently-selected type's fields plus `id`, so re-validating the full
 * variant shape on every partial patch would reject legitimate single-field
 * edits. Only `id` is enforced; the repository's row mapper only ever picks
 * known columns off whatever additional fields are present.
 */

const baseNoteFields = {
  title: z.string().trim().min(1, "Title is required").max(160, "Title is too long"),
  projectIds: z.array(z.string()),
};

const checklistItemSchema = z.object({
  text: z.string().trim().min(1, "Item text is required"),
  done: z.boolean(),
});

const textNoteSchema = z.object({
  type: z.literal("text"),
  ...baseNoteFields,
  body: z.string().trim().min(1, "Body is required"),
});

const checklistNoteSchema = z.object({
  type: z.literal("checklist"),
  ...baseNoteFields,
  items: z.array(checklistItemSchema).min(1, "Add at least one item"),
});

const imageNoteSchema = z.object({
  type: z.literal("image"),
  ...baseNoteFields,
  coverImageUrl: z.string().trim().url("Enter a valid image URL"),
});

const quoteNoteSchema = z.object({
  type: z.literal("quote"),
  ...baseNoteFields,
  quote: z.string().trim().min(1, "Quote is required"),
  author: z.string().nullable(),
});

const pdfNoteSchema = z.object({
  type: z.literal("pdf"),
  ...baseNoteFields,
  description: z.string().nullable(),
  fileUrl: z.string().trim().url("Upload a PDF file"),
  filename: z.string().trim().min(1, "Filename is required"),
});

export const createNoteSchema = z.discriminatedUnion("type", [
  textNoteSchema,
  checklistNoteSchema,
  imageNoteSchema,
  quoteNoteSchema,
  pdfNoteSchema,
]);

export const updateNoteSchema = z.object({ id: z.string().min(1) }).passthrough();

export type CreateNoteSchemaInput = z.infer<typeof createNoteSchema>;
