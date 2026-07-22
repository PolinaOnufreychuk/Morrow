import { useRef, useState, type DragEvent } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";

export interface ImageDropzoneProps {
  /** Local object-URL (or remote URL) preview — no Supabase Storage upload wired yet. */
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  className?: string;
}

/**
 * Drag-and-drop / click-to-upload image picker. Produces a local
 * `URL.createObjectURL` preview only — actual Storage upload is a separate,
 * later task (see docs/DATABASE.md's Supabase Storage plan).
 */
export function ImageDropzone({ value, onChange, label = "Drop cover image, or click to upload", className }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    onChange(URL.createObjectURL(file));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  if (value) {
    return (
      <div className={cn("group relative overflow-hidden rounded-card border border-border-subtle", className)}>
        <img src={value} alt="" className="h-40 w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-900/0 opacity-0 transition-opacity duration-fast group-hover:bg-ink-900/40 group-hover:opacity-100 group-focus-within:bg-ink-900/40 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-button bg-white/90 px-3 py-1.5 text-[13px] font-medium text-text-primary hover:bg-white"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-button bg-white/90 px-3 py-1.5 text-[13px] font-medium text-text-primary hover:bg-white"
          >
            Remove
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed px-6 py-10 text-center transition-colors duration-fast ease-out",
        dragging ? "border-brand-primary bg-sage-100/50" : "border-border-default bg-cream-50 hover:border-text-tertiary",
        className,
      )}
    >
      <Icon name="upload" size={20} className="text-text-tertiary" />
      <span className="text-[13.5px] font-medium text-text-secondary">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
