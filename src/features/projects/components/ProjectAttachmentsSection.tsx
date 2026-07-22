import { useRef } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/format";
import type { ProjectAttachment } from "@/types/entities";
import { ProjectSection } from "./ProjectSection";

export interface ProjectAttachmentsSectionProps {
  attachments: ProjectAttachment[];
  editMode: boolean;
  onChange: (attachments: ProjectAttachment[]) => void;
}

/**
 * Mock-only attachments UI (name + size, no real upload/storage — the app
 * has no file storage backend wired yet, per CLAUDE.md's file-storage scope
 * boundary and the confirmed "mock-only UI" decision for this feature).
 */
export function ProjectAttachmentsSection({
  attachments,
  editMode,
  onChange,
}: ProjectAttachmentsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeAt = (index: number) => onChange(attachments.filter((_, i) => i !== index));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onChange([
      ...attachments,
      { id: `att-${Math.random().toString(36).slice(2, 10)}`, name: file.name, sizeBytes: file.size },
    ]);
  };

  return (
    <ProjectSection
      eyebrow="Attachments"
      headerAction={
        editMode && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="plus" size={15} />
              Add attachment
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )
      }
    >
      <div className="flex flex-col gap-2">
        {attachments.length === 0 ? (
          <p className="text-[13px] text-text-tertiary">No attachments yet.</p>
        ) : (
          attachments.map((attachment, index) => (
            <div
              key={attachment.id}
              className="flex items-center gap-3 rounded-chip border border-border-subtle bg-surface-card/60 px-3 py-2.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip bg-blush-100 text-blush-600">
                <Icon name="file-text" size={16} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[14px] text-text-primary">{attachment.name}</span>
                <span className="text-[12px] text-text-tertiary">{formatBytes(attachment.sizeBytes)}</span>
              </div>
              {editMode && (
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  aria-label="Remove attachment"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip text-text-tertiary transition-colors duration-fast ease-out hover:bg-cream-100 hover:text-blush-600"
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </ProjectSection>
  );
}
