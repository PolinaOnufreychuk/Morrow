import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { FormField } from "@/components/shared/FormField";
import { ModalSection } from "@/components/shared/ModalSection";
import { Icon } from "@/design-system/icons/Icon";
import { cn } from "@/lib/utils";
import { useFileDrop } from "@/lib/hooks/useFileDrop";
import { INSPIRATION_CATEGORY_OPTIONS as CATEGORY_OPTIONS } from "../types";
import type { InspirationBoard } from "@/types/entities";

const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

/** Field-shape validation only (no live mutation wired). */
export const boardFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  category: z.enum(CATEGORY_OPTIONS),
});

export type BoardFormValues = z.infer<typeof boardFormSchema>;

interface PendingPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

function generatePendingId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export interface BoardFormProps {
  formId: string;
  defaultValues?: Partial<InspirationBoard>;
  onSubmit: (values: BoardFormValues, photos: File[]) => void;
  /** Server/mutation-level error not tied to a specific field. */
  submitError?: string | null;
  /** Reports react-hook-form's `isDirty` up to the modal so it can guard
   * against closing with unsaved changes (see `useConfirmDiscard`). */
  onDirtyChange?: (dirty: boolean) => void;
  /** Shows the "upload photos" step — only used at creation. Editing manages
   * a board's photos separately (see BoardEditModal's reference grid), since
   * a collection's cover is always the first three references, never a
   * standalone field. */
  showPhotoUpload?: boolean;
}

export function BoardForm({
  formId,
  defaultValues,
  onSubmit,
  submitError,
  onDirtyChange,
  showPhotoUpload = false,
}: BoardFormProps) {
  const { register, handleSubmit, setValue, watch, formState } = useForm<BoardFormValues>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      notes: defaultValues?.notes ?? "",
      category: (defaultValues?.tags?.[0] as (typeof CATEGORY_OPTIONS)[number]) ?? CATEGORY_OPTIONS[0],
    },
  });

  const category = watch("category");
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);

  useEffect(() => {
    onDirtyChange?.(formState.isDirty || photos.length > 0);
  }, [formState.isDirty, photos.length, onDirtyChange]);

  const addFiles = (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    setPhotos((current) => [
      ...current,
      ...images.map((file) => ({ id: generatePendingId(), file, previewUrl: URL.createObjectURL(file) })),
    ]);
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((photo) => photo.id !== id);
    });
  };

  const { dragging, dropzoneProps, inputProps } = useFileDrop({
    onFiles: addFiles,
    accept: "image/*",
    multiple: true,
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit((values) =>
        onSubmit(
          values,
          photos.map((photo) => photo.file),
        ),
      )}
      className="flex flex-col gap-6"
    >
      {submitError && (
        <p role="alert" className="rounded-chip bg-blush-100 px-3 py-2 text-[13px] text-blush-600">
          {submitError}
        </p>
      )}

      <ModalSection tone="primary">
        <FormField
          htmlFor={`${formId}-title`}
          label="Title"
          error={formState.errors.title?.message}
        >
          <Input
            id={`${formId}-title`}
            placeholder="e.g. Morning color studies"
            autoFocus
            {...register("title")}
          />
        </FormField>

        <FormField htmlFor={`${formId}-notes`} label="Description" optional>
          <Textarea id={`${formId}-notes`} placeholder="What's this collection about?" {...register("notes")} />
        </FormField>
      </ModalSection>

      <ModalSection tone="secondary">
        <PropertyDropdown
          label="Category"
          options={CATEGORY_SELECT_OPTIONS}
          value={category}
          onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
        />

        {showPhotoUpload && (
          <FormField label="Photos" optional>
            <div className="flex flex-col gap-2.5">
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
                  Drag &amp; drop photos here, or click to upload
                </span>
                <span className="text-[12px] text-text-tertiary">
                  PNG, JPG, WEBP, or SVG — the first three become this collection's cover
                </span>
                <input {...inputProps} />
              </div>

              {photos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative h-20 w-20">
                      <div className="h-full w-full overflow-hidden rounded-card-image border border-border-subtle bg-surface-card">
                        <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        aria-label="Remove"
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-chip border border-border-default bg-surface-card text-text-secondary shadow-resting transition-colors duration-fast ease-out hover:text-blush-600"
                      >
                        <Icon name="close" size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>
        )}
      </ModalSection>
    </form>
  );
}
