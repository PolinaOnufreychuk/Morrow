import { useRef, useState } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { formatBytes } from "@/lib/format";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { FileValidationError } from "@/lib/supabase/storage";
import type { Attachment, AttachmentParentType } from "@/types/entities";
import { useAttachments, useDeleteAttachment, useUploadAttachment } from "../hooks/useAttachments";
import { attachmentFilename } from "../types";
import { getAttachmentUrl } from "../api/attachments.service";

export interface AttachmentsSectionProps {
  parentType: AttachmentParentType;
  parentId: string;
  editMode: boolean;
}

/** Real, persisted attachments (Supabase Storage + the `attachments` table)
 * — shared by Project and Inspiration board detail pages, since the table
 * is genuinely polymorphic across both (docs/DATABASE.md). Self-fetching
 * and self-mutating: uploads/deletes happen immediately, independent of the
 * surrounding page's own edit/save/cancel lifecycle. */
export function AttachmentsSection({ parentType, parentId, editMode }: AttachmentsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: attachments = [] } = useAttachments(parentType, parentId);
  const uploadAttachment = useUploadAttachment(parentType, parentId);
  const deleteAttachment = useDeleteAttachment(parentType, parentId);
  const [pendingDelete, setPendingDelete] = useState<Attachment | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    uploadAttachment.mutate(file, {
      onError: (error) => {
        notify.error(
          error instanceof FileValidationError ? error.message : "Couldn't upload that file.",
        );
      },
    });
  };

  return (
    <ProjectSection
      eyebrow="Attachments"
      tone="solid"
      headerAction={
        editMode && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAttachment.isPending}
            >
              <Icon name="plus" size={15} />
              {uploadAttachment.isPending ? "Uploading…" : "Add attachment"}
            </Button>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
          </>
        )
      }
    >
      <div className="flex flex-col gap-2">
        {attachments.length === 0 ? (
          <p className="text-[13px] text-text-tertiary">No attachments yet.</p>
        ) : (
          attachments.map((attachment) => (
            <a
              key={attachment.id}
              href={getAttachmentUrl(attachment)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-chip border border-border-subtle bg-surface-card/60 px-3 py-2.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip bg-blush-100 text-blush-600">
                <Icon name="file-text" size={16} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[14px] text-text-primary">
                  {attachmentFilename(attachment)}
                </span>
                <span className="text-[12px] text-text-tertiary">
                  {formatBytes(attachment.fileSize)}
                </span>
              </div>
              {editMode && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setPendingDelete(attachment);
                  }}
                  aria-label="Remove attachment"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip text-text-tertiary transition-colors duration-fast ease-out hover:bg-cream-100 hover:text-blush-600"
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </a>
          ))
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remove attachment?"
        description={
          pendingDelete
            ? `"${attachmentFilename(pendingDelete)}" will be permanently removed.`
            : undefined
        }
        confirmLabel="Remove"
        pendingLabel="Removing…"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return;
          const target = pendingDelete;
          deleteAttachment.mutate(target, {
            onError: () => notify.error("Couldn't remove that attachment."),
          });
          setPendingDelete(null);
        }}
      />
    </ProjectSection>
  );
}
