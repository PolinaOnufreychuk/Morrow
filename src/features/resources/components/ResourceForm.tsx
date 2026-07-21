import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Resource } from "@/types/entities";

/** Field-shape validation only (no live mutation wired). */
export const resourceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Enter a valid URL"),
  description: z.string().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export interface ResourceFormProps {
  formId: string;
  defaultValues?: Partial<Resource>;
  onSubmit: (values: ResourceFormValues) => void;
}

export function ResourceForm({ formId, defaultValues, onSubmit }: ResourceFormProps) {
  const { register, handleSubmit, formState } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      url: defaultValues?.url ?? "",
      description: defaultValues?.description ?? "",
    },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-title`} className="eyebrow text-text-tertiary">
          Title
        </label>
        <Input id={`${formId}-title`} placeholder="Resource title" {...register("title")} />
        {formState.errors.title && (
          <p className="text-[12px] text-blush-600">{formState.errors.title.message}</p>
        )}
      </div>

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
        <label htmlFor={`${formId}-description`} className="eyebrow text-text-tertiary">
          Description
        </label>
        <Textarea
          id={`${formId}-description`}
          placeholder="A short note about this resource"
          {...register("description")}
        />
      </div>
    </form>
  );
}
