import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
import { FormField } from "@/components/shared/FormField";
import { ModalSection } from "@/components/shared/ModalSection";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { INSPIRATION_CATEGORY_OPTIONS as CATEGORY_OPTIONS } from "../types";
import type { InspirationBoard } from "@/types/entities";

const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

/** Field-shape validation only (no live mutation wired). */
export const boardFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  category: z.enum(CATEGORY_OPTIONS),
  coverImageUrl: z.string().optional(),
});

export type BoardFormValues = z.infer<typeof boardFormSchema>;

export interface BoardFormProps {
  formId: string;
  defaultValues?: Partial<InspirationBoard>;
  onSubmit: (values: BoardFormValues) => void;
  /** Server/mutation-level error not tied to a specific field. */
  submitError?: string | null;
}

export function BoardForm({ formId, defaultValues, onSubmit, submitError }: BoardFormProps) {
  const { register, handleSubmit, setValue, watch, formState } = useForm<BoardFormValues>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      notes: defaultValues?.notes ?? "",
      category: (defaultValues?.tags?.[0] as (typeof CATEGORY_OPTIONS)[number]) ?? CATEGORY_OPTIONS[0],
      coverImageUrl: defaultValues?.coverImageUrl ?? "",
    },
  });

  const category = watch("category");

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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

        <FormField label="Cover image" optional>
          <ImageDropzone
            value={watch("coverImageUrl") || null}
            onChange={(url) => setValue("coverImageUrl", url ?? "", { shouldDirty: true })}
            onUpload={(file) => uploadCoverImage("inspiration-board", file)}
            label="Drop a cover image, or click to browse"
          />
        </FormField>
      </ModalSection>
    </form>
  );
}
