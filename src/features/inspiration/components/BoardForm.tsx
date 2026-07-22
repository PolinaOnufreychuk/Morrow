import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
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
}

export function BoardForm({ formId, defaultValues, onSubmit }: BoardFormProps) {
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
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-title`} className="eyebrow text-text-tertiary">
          Title
        </label>
        <Input
          id={`${formId}-title`}
          placeholder="e.g. Morning color studies"
          autoFocus
          {...register("title")}
        />
        {formState.errors.title && (
          <p className="text-[12px] text-blush-600">{formState.errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-notes`} className="eyebrow text-text-tertiary">
          Description
        </label>
        <Textarea id={`${formId}-notes`} placeholder="What's this collection about?" {...register("notes")} />
      </div>

      <PropertyDropdown
        label="Category"
        options={CATEGORY_SELECT_OPTIONS}
        value={category}
        onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
        triggerClassName="h-10"
      />

      <div className="flex flex-col gap-1.5">
        <span className="eyebrow text-text-tertiary">Cover image</span>
        <ImageDropzone
          value={watch("coverImageUrl") || null}
          onChange={(url) => setValue("coverImageUrl", url ?? "", { shouldDirty: true })}
          label="Drop images, or click to upload"
        />
      </div>
    </form>
  );
}
