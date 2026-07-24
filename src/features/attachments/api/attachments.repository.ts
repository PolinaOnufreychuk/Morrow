import type { Attachment, AttachmentParentType } from "@/types/entities";
import { supabase } from "@/lib/supabase/client";
import { toSupabaseError } from "@/lib/supabase/errors";

export interface CreateAttachmentInput {
  parentType: AttachmentParentType;
  parentId: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
}

/** Pure data-access contract for the `attachments` table — mirrors
 * `projects.repository.ts`'s shape. No `update`: an attachment is immutable
 * once uploaded (replace = delete + re-upload). */
export interface AttachmentsRepository {
  listForParent(parentType: AttachmentParentType, parentId: string): Promise<Attachment[]>;
  create(input: CreateAttachmentInput): Promise<Attachment>;
  remove(id: string): Promise<void>;
}

interface AttachmentRow {
  id: string;
  parent_type: AttachmentParentType;
  parent_id: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

function rowToAttachment(row: AttachmentRow): Attachment {
  return {
    id: row.id,
    parentType: row.parent_type,
    parentId: row.parent_id,
    storagePath: row.storage_path,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    createdAt: row.created_at,
  };
}

class SupabaseAttachmentsRepository implements AttachmentsRepository {
  async listForParent(parentType: AttachmentParentType, parentId: string): Promise<Attachment[]> {
    const { data, error } = await supabase
      .from("attachments")
      .select("*")
      .eq("parent_type", parentType)
      .eq("parent_id", parentId)
      .order("created_at", { ascending: false });
    if (error) throw toSupabaseError(error);
    return (data as AttachmentRow[]).map(rowToAttachment);
  }

  async create(input: CreateAttachmentInput): Promise<Attachment> {
    const { data, error } = await supabase
      .from("attachments")
      .insert({
        parent_type: input.parentType,
        parent_id: input.parentId,
        storage_path: input.storagePath,
        file_size: input.fileSize,
        mime_type: input.mimeType,
      })
      .select()
      .single();
    if (error) throw toSupabaseError(error);
    return rowToAttachment(data as AttachmentRow);
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("attachments").delete().eq("id", id);
    if (error) throw toSupabaseError(error);
  }
}

export const attachmentsRepository: AttachmentsRepository = new SupabaseAttachmentsRepository();
