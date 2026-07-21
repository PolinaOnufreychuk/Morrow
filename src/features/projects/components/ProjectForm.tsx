import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/shared/TagInput";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { ProjectDeadlineField } from "./ProjectDeadlineField";
import { ExternalLinksField } from "./ExternalLinksField";
import { PROJECT_STATUSES, projectInputSchema, type ProjectInput } from "../schema";
import type { Project, ProjectStatus } from "@/types/entities";

export type ProjectFormValues = ProjectInput;

const STATUS_LABELS: Record<ProjectStatus, string> = {
  "in-progress": "In progress",
  review: "Review",
  done: "Completed",
};

const STATUS_OPTIONS = PROJECT_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));

export interface ProjectFormProps {
  formId: string;
  defaultValues?: Partial<Project>;
  onSubmit: (values: ProjectFormValues) => void;
  /** Server/mutation-level error not tied to a specific field. */
  submitError?: string | null;
}

export function ProjectForm({ formId, defaultValues, onSubmit, submitError }: ProjectFormProps) {
  const { register, handleSubmit, setValue, watch, formState } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectInputSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      coverImageUrl: defaultValues?.coverImageUrl ?? "",
      description: defaultValues?.description ?? "",
      status: defaultValues?.status ?? "in-progress",
      deadline: defaultValues?.deadline ?? null,
      tags: defaultValues?.tags ?? [],
      externalLinks: defaultValues?.externalLinks ?? [],
      notes: defaultValues?.notes ?? "",
    },
  });

  const status = watch("status");
  const deadline = watch("deadline");
  const tags = watch("tags");
  const externalLinks = watch("externalLinks");

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {submitError && (
        <p role="alert" className="rounded-chip bg-blush-100 px-3 py-2 text-[13px] text-blush-600">
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-title`} className="eyebrow text-text-tertiary">
          Title
        </label>
        <Input
          id={`${formId}-title`}
          placeholder="Project title"
          autoFocus
          aria-invalid={Boolean(formState.errors.title)}
          aria-describedby={formState.errors.title ? `${formId}-title-error` : undefined}
          {...register("title")}
        />
        {formState.errors.title && (
          <p id={`${formId}-title-error`} className="text-[12px] text-blush-600">
            {formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-cover`} className="eyebrow text-text-tertiary">
          Cover image URL
        </label>
        <Input
          id={`${formId}-cover`}
          type="url"
          placeholder="https://…"
          aria-invalid={Boolean(formState.errors.coverImageUrl)}
          aria-describedby={formState.errors.coverImageUrl ? `${formId}-cover-error` : undefined}
          {...register("coverImageUrl")}
        />
        {formState.errors.coverImageUrl && (
          <p id={`${formId}-cover-error`} className="text-[12px] text-blush-600">
            {formState.errors.coverImageUrl.message}
          </p>
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
          onValueChange={(value) => setValue("status", value, { shouldDirty: true })}
        />
        <ProjectDeadlineField
          value={deadline}
          onChange={(value) => setValue("deadline", value, { shouldDirty: true })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-tags`} className="eyebrow text-text-tertiary">
          Tags
        </label>
        <TagInput
          id={`${formId}-tags`}
          value={tags}
          onChange={(value) => setValue("tags", value, { shouldDirty: true })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="eyebrow text-text-tertiary">External links</span>
        <ExternalLinksField
          value={externalLinks}
          onChange={(value) => setValue("externalLinks", value, { shouldDirty: true })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-notes`} className="eyebrow text-text-tertiary">
          Notes
        </label>
        <Textarea
          id={`${formId}-notes`}
          placeholder="Anything worth remembering about this project…"
          {...register("notes")}
        />
      </div>
    </form>
  );
}
