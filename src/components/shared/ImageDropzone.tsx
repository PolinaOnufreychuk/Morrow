import { useState } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";
import { useFileDrop } from "@/lib/hooks/useFileDrop";
import { FileValidationError, validateFile } from "@/lib/supabase/storage";
import uploadIcon from "@/assets/upload-icon.svg";

export interface ImageDropzoneProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  /** Uploads the file to Supabase Storage and resolves with its real public URL. */
  onUpload: (file: File) => Promise<string>;
  label?: string;
  /** Sub-line under the label. Defaults to the accepted-formats hint. */
  helperText?: string;
  /** "default" is the standard dropzone. "large" is the taller, bolder empty
   * state from the "New project" mockup — opt in per-form. */
  size?: "default" | "large";
  className?: string;
}

/** Drag-and-drop / click-to-upload image picker, backed by real Supabase
 * Storage uploads. Shows an optimistic blob-URL preview locally while the
 * upload is in flight, then hands the real URL to `onChange` once `onUpload`
 * resolves. The blob URL is never passed to `onChange` — only the real
 * Storage URL ever becomes the committed value, so submitting the form
 * before the upload finishes can't persist a dead `blob:` reference. */
export function ImageDropzone({
  value,
  onChange,
  onUpload,
  label = "Drop a cover image, or click to browse",
  helperText = "PNG, JPG, WEBP, or SVG — up to 10MB",
  size = "default",
  className,
}: ImageDropzoneProps) {
  const large = size === "large";
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setError(null);
    try {
      validateFile(file);
    } catch (err) {
      setError(err instanceof FileValidationError ? err.message : "That file couldn't be used.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setIsUploading(true);

    onUpload(file)
      .then((realUrl) => {
        onChange(realUrl);
      })
      .catch(() => {
        setError("Upload failed — please try again.");
      })
      .finally(() => {
        URL.revokeObjectURL(previewUrl);
        setLocalPreview(null);
        setIsUploading(false);
      });
  };

  const displayValue = value ?? localPreview;

  const { dragging, openPicker, dropzoneProps, inputProps } = useFileDrop({
    onFiles: handleFiles,
    accept: "image/*",
    disabled: isUploading,
  });

  if (displayValue) {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <div
          className={cn(
            "group relative overflow-hidden rounded-card border",
            error ? "border-blush-600/40" : "border-border-subtle",
          )}
        >
          <img src={displayValue} alt="" className="h-44 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-900/0 opacity-0 transition-opacity duration-fast group-hover:bg-ink-900/40 group-hover:opacity-100 group-focus-within:bg-ink-900/40 group-focus-within:opacity-100">
            <button
              type="button"
              onClick={openPicker}
              disabled={isUploading}
              className="rounded-button bg-white/90 px-3 py-1.5 text-[13px] font-medium text-text-primary hover:bg-white disabled:opacity-60"
            >
              {isUploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              disabled={isUploading}
              className="rounded-button bg-white/90 px-3 py-1.5 text-[13px] font-medium text-text-primary hover:bg-white disabled:opacity-60"
            >
              Remove
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-sage-100/70">
              <div className="h-full w-1/3 animate-pulse bg-sage-600" />
            </div>
          )}
          <input {...inputProps} />
        </div>
        {error && <p className="text-[12px] text-blush-600">{error}</p>}
      </div>
    );
  }

  if (large) {
    // Two layers: an outer field-fill frame (#F9F9F8, matching the inputs)
    // with a raised white, dashed-border box on top (the drop target).
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <div
          {...dropzoneProps}
          className={cn(
            "cursor-pointer rounded-[20px] bg-[#F9F9F8] p-2",
            isUploading && "cursor-wait opacity-70",
          )}
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
              {isUploading ? "Uploading…" : label}
            </span>
            <span className="text-[13px] text-text-tertiary">{helperText}</span>
          </div>
          <input {...inputProps} />
        </div>
        {error && <p className="text-[12px] text-blush-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div
        {...dropzoneProps}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-card border border-dashed px-6 py-12 text-center transition-colors duration-fast ease-out",
          dragging
            ? "border-brand-primary bg-sage-100/50 shadow-resting"
            : error
              ? "border-blush-600/40 bg-cream-50"
              : "border-border-default bg-cream-50 hover:border-text-tertiary hover:bg-cream-100",
          isUploading && "cursor-wait opacity-70",
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-chip bg-sage-100 text-sage-700">
          <Icon name="upload" size={19} />
        </span>
        <span className="text-[14px] font-medium text-text-secondary">
          {isUploading ? "Uploading…" : label}
        </span>
        <span className="text-[12px] text-text-tertiary">{helperText}</span>
        <input {...inputProps} />
      </div>
      {error && <p className="text-[12px] text-blush-600">{error}</p>}
    </div>
  );
}
