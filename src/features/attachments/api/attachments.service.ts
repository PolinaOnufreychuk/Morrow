import type { Attachment, AttachmentParentType } from "@/types/entities";
import { deleteFile, getPublicUrl, sanitizeFilename, uploadFile, validateFile } from "@/lib/supabase/storage";
import { attachmentsRepository } from "./attachments.repository";

/** Business layer: the only thing hooks import. */

export async function listAttachments(
  parentType: AttachmentParentType,
  parentId: string,
): Promise<Attachment[]> {
  return attachmentsRepository.listForParent(parentType, parentId);
}

export async function uploadAttachment(
  parentType: AttachmentParentType,
  parentId: string,
  file: File,
): Promise<Attachment> {
  validateFile(file);
  const path = `${parentType}/${parentId}/${Date.now()}-${sanitizeFilename(file.name)}`;
  await uploadFile(path, file);
  return attachmentsRepository.create({
    parentType,
    parentId,
    storagePath: path,
    fileSize: file.size,
    mimeType: file.type,
  });
}

/** Deletes the Storage object first — if that fails, the row stays as a
 * retry-able attachment rather than an orphaned object with no path back to it. */
export async function deleteAttachment(attachment: Attachment): Promise<void> {
  await deleteFile(attachment.storagePath);
  await attachmentsRepository.remove(attachment.id);
}

/** Used before deleting a project/board, since the polymorphic `attachments`
 * table has no DB-level cascade tied to either parent table. */
export async function deleteAllForParent(
  parentType: AttachmentParentType,
  parentId: string,
): Promise<void> {
  const attachments = await attachmentsRepository.listForParent(parentType, parentId);
  await Promise.all(attachments.map((attachment) => deleteAttachment(attachment)));
}

export function getAttachmentUrl(attachment: Attachment): string {
  return getPublicUrl(attachment.storagePath);
}
