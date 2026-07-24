import { supabase } from "./client";

/**
 * The only module that calls `supabase.storage.*` directly — mirrors how
 * Postgres access is confined to feature `api/*.ts` files. One public bucket
 * (see supabase/storage.sql), no per-bucket env var since this is a
 * single-bucket app.
 */
export const ATTACHMENTS_BUCKET = "attachments";

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
] as const;

export class FileValidationError extends Error {}

export function validateFile(file: File): void {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new FileValidationError("File is too large — the limit is 10MB.");
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new FileValidationError("That file type isn't supported (PNG, JPG, WEBP, SVG, or PDF only).");
  }
}

export function sanitizeFilename(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9._-]+/g, "-");
}

export async function uploadFile(
  path: string,
  file: File,
): Promise<{ path: string; publicUrl: string }> {
  const { error } = await supabase.storage.from(ATTACHMENTS_BUCKET).upload(path, file);
  if (error) throw error;
  return { path, publicUrl: getPublicUrl(path) };
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(ATTACHMENTS_BUCKET).remove([path]);
  if (error) throw error;
}

export function getPublicUrl(path: string): string {
  return supabase.storage.from(ATTACHMENTS_BUCKET).getPublicUrl(path).data.publicUrl;
}

export type CoverImageSurface =
  | "project"
  | "inspiration-board"
  | "inspiration-reference"
  | "resource"
  | "note";

/** Uploads a "loose" cover/reference image not tracked in the `attachments`
 * table — just used to fill a plain URL column. See docs/DATABASE.md's
 * Storage section for the disclosed tradeoff: these are never cleaned up on
 * replace/delete (not a file storage service, personal low-volume tool). */
export async function uploadCoverImage(surface: CoverImageSurface, file: File): Promise<string> {
  validateFile(file);
  const path = `covers/${surface}/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;
  const { publicUrl } = await uploadFile(path, file);
  return publicUrl;
}
