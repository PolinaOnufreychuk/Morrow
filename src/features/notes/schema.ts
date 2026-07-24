import { z } from "zod";

/**
 * Zod validation for Notes, consumed by notes.service.ts. `Note` is a
 * 10-variant discriminated union on `type`, so create validates the full
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

const meetingAttendeeSchema = z.object({
  name: z.string().trim().min(1, "Attendee name is required"),
  avatarUrl: z.string().nullable(),
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

const bookmarkNoteSchema = z.object({
  type: z.literal("bookmark"),
  ...baseNoteFields,
  url: z.string().trim().url("Enter a valid URL"),
  faviconUrl: z.string().nullable(),
  domain: z.string().nullable(),
  snippet: z.string().nullable(),
});

const imageNoteSchema = z.object({
  type: z.literal("image"),
  ...baseNoteFields,
  coverImageUrl: z.string().trim().url("Enter a valid image URL"),
});

const moodboardNoteSchema = z.object({
  type: z.literal("moodboard"),
  ...baseNoteFields,
  images: z.tuple([
    z.string().trim().url(),
    z.string().trim().url(),
    z.string().trim().url(),
    z.string().trim().url(),
  ]),
});

const codeNoteSchema = z.object({
  type: z.literal("code"),
  ...baseNoteFields,
  language: z.string().trim().min(1, "Language is required"),
  code: z.string().min(1, "Code is required"),
});

const quoteNoteSchema = z.object({
  type: z.literal("quote"),
  ...baseNoteFields,
  quote: z.string().trim().min(1, "Quote is required"),
  author: z.string().nullable(),
});

const recipeNoteSchema = z.object({
  type: z.literal("recipe"),
  ...baseNoteFields,
  ingredients: z.array(z.string().trim().min(1)).min(1, "Add at least one ingredient"),
});

const pdfNoteSchema = z.object({
  type: z.literal("pdf"),
  ...baseNoteFields,
  filename: z.string().trim().min(1, "Filename is required"),
  pageCount: z.number().int().positive().nullable(),
});

const meetingNoteSchema = z.object({
  type: z.literal("meeting"),
  ...baseNoteFields,
  attendees: z.array(meetingAttendeeSchema),
  agenda: z.array(z.string().trim().min(1)),
});

export const createNoteSchema = z.discriminatedUnion("type", [
  textNoteSchema,
  checklistNoteSchema,
  bookmarkNoteSchema,
  imageNoteSchema,
  moodboardNoteSchema,
  codeNoteSchema,
  quoteNoteSchema,
  recipeNoteSchema,
  pdfNoteSchema,
  meetingNoteSchema,
]);

export const updateNoteSchema = z.object({ id: z.string().min(1) }).passthrough();

export type CreateNoteSchemaInput = z.infer<typeof createNoteSchema>;
