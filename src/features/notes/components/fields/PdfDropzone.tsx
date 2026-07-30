import { useState } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";
import { useFileDrop } from "@/lib/hooks/useFileDrop";
import { FileValidationError, validateFile } from "@/lib/supabase/storage";
import uploadIcon from "@/assets/upload-icon.svg";

export interface PdfFileValue {
  fileUrl: string;
  filename: string;
  fileSize: number | null;
}

export interface PdfDropzoneProps {
  value: PdfFileValue | null;
  onChange: (value: PdfFileValue | null) => void;
  /** Uploads the file to Supabase Storage and resolves with its real public URL. */
  onUpload: (file: File) => Promise<string>;
}

/**
 * Drag-and-drop / click-to-upload PDF picker — the PDF sibling of
 * `ImageDropzone`. Reuses the shared `useFileDrop` mechanics and the 10MB /
 * MIME `validateFile` guard (which already allows `application/pdf`). The
 * empty state mirrors ImageDropzone's "large" look; the filled state is the
 * attached-file row (icon + name + size + remove) shared with the
 * attachments feature.
 */
export function PdfDropzone({ value, onChange, onUpload }: PdfDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setError(null);
    try {
      validateFile(file);
    } catch (err) {
      setError(err instanceof FileValidationError ? err.message : "That file couldn't be used.");
      return;
    }

    setIsUploading(true);
    onUpload(file)
      .then((fileUrl) => {
        onChange({ fileUrl, filename: file.name, fileSize: file.size });
      })
      .catch(() => {
        setError("Upload failed — please try again.");
      })
      .finally(() => setIsUploading(false));
  };

  const { dragging, dropzoneProps, inputProps } = useFileDrop({
    onFiles: handleFiles,
    accept: "application/pdf",
    disabled: isUploading,
  });

  if (value) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3 rounded-[16px] bg-[#F9F9F8] px-3.5 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-chip bg-blush-100 text-blush-600">
            <Icon name="file-text" size={17} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[14px] font-medium text-text-primary">{value.filename}</span>
            {value.fileSize !== null && (
              <span className="text-[12px] text-text-tertiary">{formatBytes(value.fileSize)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove file"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip text-text-tertiary transition-colors hover:bg-cream-100 hover:text-blush-600"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
        {error && <p className="text-[12px] text-blush-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div
        {...dropzoneProps}
        className={cn("cursor-pointer rounded-[20px] bg-[#F9F9F8] p-2", isUploading && "cursor-wait opacity-70")}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 rounded-[12px] border border-dashed px-6 py-9 text-center transition-colors duration-fast ease-out",
            dragging
              ? "border-brand-primary bg-sage-100/50"
              : error
                ? "border-blush-600/40 bg-white"
                : "border-[#D9D8D5] bg-white",
          )}
        >
          <span className="flex items-center gap-2.5 text-[15px] font-medium text-[#525150]">
            <img src={uploadIcon} alt="" className="h-4 w-4" />
            {isUploading ? "Uploading…" : "Drop pdf file, or click to upload"}
          </span>
          <span className="text-[13px] text-text-tertiary">Maximum 10 MB file size</span>
        </div>
        <input {...inputProps} />
      </div>
      {error && <p className="text-[12px] text-blush-600">{error}</p>}
    </div>
  );
}
