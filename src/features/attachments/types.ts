import type { Attachment, AttachmentParentType } from "@/types/entities";

export type { Attachment, AttachmentParentType };

/** The part of a stored path after the last `/` — used for display since the
 * table doesn't store a separate filename column (docs/DATABASE.md). */
export function attachmentFilename(attachment: Attachment): string {
  const segments = attachment.storagePath.split("/");
  return segments[segments.length - 1] ?? attachment.storagePath;
}
