import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import type { Resource, ResourceKind } from "@/types/entities";

const CREATABLE_KINDS = ["link", "repo", "video", "pdf", "image"] as const;

const KIND_LABELS: Record<(typeof CREATABLE_KINDS)[number], string> = {
  link: "Website",
  repo: "Repository",
  video: "Video",
  pdf: "PDF",
  image: "Image",
};

const KIND_OPTIONS = CREATABLE_KINDS.map((value) => ({ value, label: KIND_LABELS[value] }));
const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

/** Field-shape validation only. */
export const resourceFormSchema = z.object({
  kind: z.enum(CREATABLE_KINDS),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Enter a valid URL"),
  description: z.string().optional(),
  category: z.enum(CATEGORY_OPTIONS),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export interface ResourceFormProps {
  formId: string;
  defaultValues?: Partial<Resource>;
  onSubmit: (values: ResourceFormValues) => void;
}

export function ResourceForm({ formId, defaultValues, onSubmit }: ResourceFormProps) {
  const { register, handleSubmit, setValue, watch, formState } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      kind: (defaultValues?.kind as ResourceKind as (typeof CREATABLE_KINDS)[number]) ?? "link",
      title: defaultValues?.title ?? "",
      url: defaultValues?.url ?? "",
      description: defaultValues?.description ?? "",
      category: (defaultValues?.tags?.[0] as (typeof CATEGORY_OPTIONS)[number]) ?? CATEGORY_OPTIONS[0],
    },
  });

  const kind = watch("kind");
  const category = watch("category");

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <PropertyDropdown
        label="Type"
        options={KIND_OPTIONS}
        value={kind}
        onValueChange={(value) => setValue("kind", value, { shouldDirty: true })}
        triggerClassName="h-10"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-url`} className="eyebrow text-text-tertiary">
          URL
        </label>
        <Input id={`${formId}-url`} placeholder="https://…" {...register("url")} />
        {formState.errors.url && (
          <p className="text-[12px] text-blush-600">{formState.errors.url.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-title`} className="eyebrow text-text-tertiary">
          Title
        </label>
        <Input
          id={`${formId}-title`}
          placeholder="e.g. Nielsen Norman — Onboarding UX"
          {...register("title")}
        />
        {formState.errors.title && (
          <p className="text-[12px] text-blush-600">{formState.errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-description`} className="eyebrow text-text-tertiary">
          Description
        </label>
        <Textarea
          id={`${formId}-description`}
          placeholder="Why does this matter?"
          {...register("description")}
        />
      </div>

      <PropertyDropdown
        label="Category"
        options={CATEGORY_SELECT_OPTIONS}
        value={category}
        onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
        triggerClassName="h-10"
      />
    </form>
  );
}
