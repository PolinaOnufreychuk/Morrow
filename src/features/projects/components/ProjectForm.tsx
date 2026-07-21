import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { ProjectDeadlineField } from "./ProjectDeadlineField";
import type { Project, ProjectStatus } from "@/types/entities";

/**
 * Field-shape validation only (per the brief — no submit handler wired to a
 * real mutation). The parent modal decides what to do with `values`.
 */
export const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["planning", "in-progress", "review", "done", "on-hold"]),
  deadline: z.string().nullable(),
  tags: z.array(z.string()),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "in-progress", label: "In progress" },
  { value: "review", label: "In review" },
  { value: "done", label: "Done" },
  { value: "on-hold", label: "On hold" },
];

export interface ProjectFormProps {
  formId: string;
  defaultValues?: Partial<Project>;
  onSubmit: (values: ProjectFormValues) => void;
}

export function ProjectForm({ formId, defaultValues, onSubmit }: ProjectFormProps) {
  const { register, handleSubmit, setValue, watch, formState } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      status: defaultValues?.status ?? "planning",
      deadline: defaultValues?.deadline ?? null,
      tags: defaultValues?.tags ?? [],
    },
  });

  const status = watch("status");
  const deadline = watch("deadline");

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-title`} className="eyebrow text-text-tertiary">
          Title
        </label>
        <Input id={`${formId}-title`} placeholder="Project title" {...register("title")} />
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
          placeholder="What is this project about?"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PropertyDropdown
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={(value) => setValue("status", value)}
        />
        <ProjectDeadlineField value={deadline} onChange={(value) => setValue("deadline", value)} />
      </div>
    </form>
  );
}
