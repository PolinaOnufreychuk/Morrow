import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InspirationBoard } from "@/types/entities";

/** Field-shape validation only (no live mutation wired). */
export const boardFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
});

export type BoardFormValues = z.infer<typeof boardFormSchema>;

export interface BoardFormProps {
  formId: string;
  defaultValues?: Partial<InspirationBoard>;
  onSubmit: (values: BoardFormValues) => void;
}

export function BoardForm({ formId, defaultValues, onSubmit }: BoardFormProps) {
  const { register, handleSubmit, formState } = useForm<BoardFormValues>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-title`} className="eyebrow text-text-tertiary">
          Title
        </label>
        <Input id={`${formId}-title`} placeholder="Board title" {...register("title")} />
        {formState.errors.title && (
          <p className="text-[12px] text-blush-600">{formState.errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-notes`} className="eyebrow text-text-tertiary">
          Notes
        </label>
        <Textarea id={`${formId}-notes`} placeholder="What is this board for?" {...register("notes")} />
      </div>
    </form>
  );
}
