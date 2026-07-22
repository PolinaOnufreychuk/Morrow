import { useRef, useState, type DragEvent } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/design-system/icons/Icon";
import { hostnameOf } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AddReferenceInput } from "../api/inspirationApi";

export interface AddReferenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (inputs: AddReferenceInput[]) => void;
}

interface PendingReference {
  id: string;
  imageUrl: string | null;
  sourceUrl: string | null;
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
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setPending((current) => [...current, { id: generatePendingId(), imageUrl: null, sourceUrl: trimmed }]);
    setUrl("");
  };

  const addFiles = (files: FileList | null) => {
    const images = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    setPending((current) => [
      ...current,
      ...images.map((file) => ({
        id: generatePendingId(),
        imageUrl: URL.createObjectURL(file),
        sourceUrl: null,
      })),
    ]);
  };

  const removePending = (id: string) => {
    setPending((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed?.imageUrl) URL.revokeObjectURL(removed.imageUrl);
      return current.filter((item) => item.id !== id);
    });
  };

  const handleAdd = () => {
    const inputs: AddReferenceInput[] = pending.map((item) => ({
      imageUrl: item.imageUrl ?? "",
      sourceUrl: item.sourceUrl,
    }));
    onAdd(inputs);
    setPending([]);
    setUrl("");
    onOpenChange(false);
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
      footer={
        <Button onClick={handleAdd} disabled={pending.length === 0}>
          Add {pending.length} reference{pending.length === 1 ? "" : "s"}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="add-reference-url" className="eyebrow text-text-tertiary">
            Paste a URL
          </label>
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
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
          }}
          onDragOver={(event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setDragging(false);
            addFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border border-dashed px-6 py-10 text-center transition-colors duration-fast ease-out",
            dragging ? "border-brand-primary bg-sage-100/50" : "border-border-default bg-cream-50 hover:border-text-tertiary",
          )}
        >
          <Icon name="upload" size={20} className="text-text-tertiary" />
          <span className="text-[13.5px] font-medium text-text-secondary">
            Drag &amp; drop images here, or click to upload
          </span>
          <span className="text-[12px] text-text-tertiary">You can also paste an image directly with ⌘/Ctrl + V</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => addFiles(event.target.files)}
          />
        </div>

        {pending.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-text-tertiary">Ready to add ({pending.length})</span>
            <div className="flex flex-wrap gap-2">
              {pending.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-card-image border border-border-subtle bg-surface-card"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-1.5 text-center text-[11px] text-text-tertiary">
                      {hostnameOf(item.sourceUrl ?? "")}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removePending(item.id)}
                    aria-label="Remove"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900/60 text-white opacity-0 transition-opacity duration-fast ease-out group-hover:opacity-100"
                  >
                    <Icon name="close" size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
