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
import uploadIcon from "@/assets/upload-icon.svg";

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
  /** Reports whether the required data is present (Title non-empty) so the
   * modal can keep its submit CTA disabled until then. */
  onCanSubmitChange?: (canSubmit: boolean) => void;
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
  onCanSubmitChange,
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

  const title = watch("title") ?? "";
  const category = watch("category");
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);

  useEffect(() => {
    onDirtyChange?.(formState.isDirty || photos.length > 0);
  }, [formState.isDirty, photos.length, onDirtyChange]);

  useEffect(() => {
    onCanSubmitChange?.(title.trim().length > 0);
  }, [title, onCanSubmitChange]);

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

  const { dragging, openPicker, dropzoneProps, inputProps } = useFileDrop({
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
      className="flex flex-col gap-5"
    >
      {submitError && (
        <p role="alert" className="rounded-chip bg-blush-100 px-3 py-2 text-[13px] text-blush-600">
          {submitError}
        </p>
      )}

      <ModalSection tone="primary" className="gap-4">
        <FormField
          htmlFor={`${formId}-title`}
          label="Title"
          labelTone="prominent"
          error={formState.errors.title?.message}
        >
          <Input
            id={`${formId}-title`}
            placeholder="e.g. Color studies"
            rounded="soft"
            autoFocus
            {...register("title")}
          />
        </FormField>

        <FormField htmlFor={`${formId}-notes`} label="Description" labelTone="prominent" optional>
          <Textarea
            id={`${formId}-notes`}
            placeholder="What's this collection about?"
            rounded="soft"
            {...register("notes")}
          />
        </FormField>
      </ModalSection>

      <ModalSection tone="secondary" className="gap-6">
        <PropertyDropdown
          label="Category"
          labelTone="prominent"
          rounded="soft"
          triggerClassName="text-[#807F7D]"
          options={CATEGORY_SELECT_OPTIONS}
          value={category}
          onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
        />

        {showPhotoUpload && (
          <FormField label="Photo" labelTone="prominent" optional>
            {photos.length === 0 ? (
              <div
                {...dropzoneProps}
                className={cn(
                  "cursor-pointer rounded-[20px] bg-[#F9F9F8] p-2",
                  dragging && "opacity-90",
                )}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 rounded-[12px] border border-dashed px-6 py-9 text-center transition-colors duration-fast ease-out",
                    dragging ? "border-brand-primary bg-sage-100/50" : "border-[#D9D8D5] bg-white",
                  )}
                >
                  <span className="flex items-center gap-2.5 text-[15px] font-medium text-[#525150]">
                    <img src={uploadIcon} alt="" className="h-4 w-4" />
                    Drop photos here, or click to upload
                  </span>
                  <span className="text-[13px] text-text-tertiary">
                    PNG, JPG, WEBP, or SVG — the first three become this collection's cover
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative h-[104px] w-[104px]">
                    <div className="h-full w-full overflow-hidden rounded-[16px] border border-border-subtle bg-surface-card">
                      <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Remove"
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-[10px] border border-border-subtle bg-white/95 text-text-secondary shadow-resting transition-colors duration-fast ease-out hover:text-blush-600"
                    >
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={openPicker}
                  aria-label="Add photos"
                  className="flex h-[104px] w-[104px] items-center justify-center rounded-[16px] border border-dashed border-[#D9D8D5] bg-[#F9F9F8] text-text-tertiary transition-colors duration-fast ease-out hover:border-text-tertiary hover:text-text-secondary"
                >
                  <Icon name="plus" size={22} />
                </button>
              </div>
            )}
            <input {...inputProps} />
          </FormField>
        )}
      </ModalSection>
    </form>
  );
}
