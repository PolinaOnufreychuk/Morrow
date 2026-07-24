import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { Icon } from "@/design-system/icons/Icon";
import { hostnameOf } from "@/lib/format";
import { cn } from "@/lib/utils";
import { notify } from "@/components/shared/Toast";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { useFileDrop } from "@/lib/hooks/useFileDrop";
import type { AddReferenceInput } from "../api/inspiration.service";

export interface AddReferenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (inputs: AddReferenceInput[]) => void;
}

interface PendingReference {
  id: string;
  /** Local blob-URL preview only — never persisted; see `file`. */
  imageUrl: string | null;
  sourceUrl: string | null;
  /** Retained so `handleAdd` can upload it to Storage before committing. */
  file: File | null;
}

function generatePendingId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Add one or more references to a board: paste a URL (previewed by
 * hostname — no real link-unfurling service exists yet) or drag & drop /
 * upload images. Items collect in a "ready to add" row before committing.
 */
export function AddReferenceModal({ open, onOpenChange, onAdd }: AddReferenceModalProps) {
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState<PendingReference[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setPending((current) => [
      ...current,
      { id: generatePendingId(), imageUrl: null, sourceUrl: trimmed, file: null },
    ]);
    setUrl("");
  };

  const addFiles = (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    setPending((current) => [
      ...current,
      ...images.map((file) => ({
        id: generatePendingId(),
        imageUrl: URL.createObjectURL(file),
        sourceUrl: null,
        file,
      })),
    ]);
  };

  const { dragging, dropzoneProps, inputProps } = useFileDrop({
    onFiles: addFiles,
    accept: "image/*",
    multiple: true,
  });

  const removePending = (id: string) => {
    setPending((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed?.imageUrl) URL.revokeObjectURL(removed.imageUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  const handleAdd = async () => {
    setIsSubmitting(true);
    try {
      const inputs: AddReferenceInput[] = await Promise.all(
        pending.map(async (item) => ({
          imageUrl: item.file
            ? await uploadCoverImage("inspiration-reference", item.file)
            : (item.imageUrl ?? ""),
          sourceUrl: item.sourceUrl,
        })),
      );
      onAdd(inputs);
      pending.forEach((item) => {
        if (item.imageUrl) URL.revokeObjectURL(item.imageUrl);
      });
      setPending([]);
      setUrl("");
      onOpenChange(false);
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "Couldn't upload one or more images. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      // Discarded without adding — release any pending upload previews.
      pending.forEach((item) => {
        if (item.imageUrl) URL.revokeObjectURL(item.imageUrl);
      });
      setPending([]);
      setUrl("");
    }
    onOpenChange(next);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={handleOpenChange}
      title="Add references"
      titleClassName="text-[28px]"
      footerAlign="stretch"
      footer={
        <Button size="lg" fullWidth onClick={handleAdd} disabled={pending.length === 0 || isSubmitting}>
          {isSubmitting
            ? "Adding…"
            : `Add ${pending.length} reference${pending.length === 1 ? "" : "s"}`}
        </Button>
      }
    >
      <FormField htmlFor="add-reference-url" label="Paste a URL" optional>
        <Input
          id="add-reference-url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUrl();
            }
          }}
          placeholder="https://… — we'll fetch a preview automatically"
        />
      </FormField>

      <div
        {...dropzoneProps}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-card border border-dashed px-6 py-10 text-center transition-colors duration-fast ease-out",
          dragging
            ? "border-brand-primary bg-sage-100/50 shadow-resting"
            : "border-border-default bg-cream-50 hover:border-text-tertiary hover:bg-cream-100",
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-chip bg-sage-100 text-sage-700">
          <Icon name="upload" size={18} />
        </span>
        <span className="text-[13.5px] font-medium text-text-secondary">
          Drag &amp; drop images here, or click to upload
        </span>
        <span className="text-[12px] text-text-tertiary">
          PNG, JPG, WEBP, or SVG — up to 10MB · paste with ⌘/Ctrl + V
        </span>
        <input {...inputProps} />
      </div>

      {pending.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[12.5px] font-medium normal-case tracking-normal text-text-tertiary">
            Ready to add ({pending.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {pending.map((item) => (
              <div key={item.id} className="relative h-20 w-20">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-card-image border border-border-subtle bg-surface-card">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-1.5 text-center text-[11px] text-text-tertiary">
                      {hostnameOf(item.sourceUrl ?? "")}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removePending(item.id)}
                  aria-label="Remove"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-chip border border-border-default bg-surface-card text-text-secondary shadow-resting transition-colors duration-fast ease-out hover:text-blush-600"
                >
                  <Icon name="close" size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ModalShell>
  );
}
