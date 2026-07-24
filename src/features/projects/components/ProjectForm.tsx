import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/shared/TagInput";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
import { FormField } from "@/components/shared/FormField";
import { ModalSection } from "@/components/shared/ModalSection";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { ProjectDeadlineField } from "./ProjectDeadlineField";
import { ExternalLinksField } from "./ExternalLinksField";
import { PROJECT_CATEGORY_OPTIONS, PROJECT_STATUSES, projectInputSchema, type ProjectInput } from "../schema";
import type { Project, ProjectStatus } from "@/types/entities";

export type ProjectFormValues = ProjectInput;

const STATUS_LABELS: Record<ProjectStatus, string> = {
  "in-progress": "In progress",
  review: "Review",
  done: "Completed",
};

const STATUS_OPTIONS = PROJECT_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));
const CATEGORY_OPTIONS = PROJECT_CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

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
      category: (defaultValues?.category ?? null) as ProjectFormValues["category"],
      tags: defaultValues?.tags ?? [],
      externalLinks: defaultValues?.externalLinks ?? [],
      notes: defaultValues?.notes ?? "",
    },
  });

  const status = watch("status");
  const deadline = watch("deadline");
  const category = watch("category");
  const tags = watch("tags");
  const externalLinks = watch("externalLinks");
  const description = watch("description") ?? "";

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
            placeholder="Project title"
            autoFocus
            aria-invalid={Boolean(formState.errors.title)}
            aria-describedby={formState.errors.title ? `${formId}-title-error` : undefined}
            {...register("title")}
          />
        </FormField>

        <FormField
          htmlFor={`${formId}-description`}
          label="Description"
          optional
          counter={{ current: description.length, max: 2000 }}
        >
          <Textarea
            id={`${formId}-description`}
            placeholder="What's this project about?"
            {...register("description")}
          />
        </FormField>
      </ModalSection>

      <ModalSection tone="secondary">
        <div className="grid grid-cols-2 gap-4">
          <PropertyDropdown
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onValueChange={(value) => setValue("status", value, { shouldDirty: true })}
          />
          <PropertyDropdown
            label="Category"
            optional
            options={CATEGORY_OPTIONS}
            value={category ?? CATEGORY_OPTIONS[0].value}
            onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
          />
        </div>

        <FormField htmlFor={`${formId}-tags`} label="Tags" optional>
          <TagInput
            id={`${formId}-tags`}
            value={tags}
            onChange={(value) => setValue("tags", value, { shouldDirty: true })}
          />
        </FormField>

        <FormField label="Cover image" optional error={formState.errors.coverImageUrl?.message}>
          <ImageDropzone
            value={watch("coverImageUrl") || null}
            onChange={(url) => setValue("coverImageUrl", url ?? "", { shouldDirty: true })}
            onUpload={(file) => uploadCoverImage("project", file)}
          />
        </FormField>
      </ModalSection>

      <ModalSection tone="optional">
        <ProjectDeadlineField
          value={deadline}
          onChange={(value) => setValue("deadline", value, { shouldDirty: true })}
        />

        <FormField label="External links" optional>
          <ExternalLinksField
            value={externalLinks}
            onChange={(value) => setValue("externalLinks", value, { shouldDirty: true })}
          />
        </FormField>

        <FormField htmlFor={`${formId}-notes`} label="Notes" optional>
          <Textarea
            id={`${formId}-notes`}
            placeholder="Anything worth remembering about this project…"
            {...register("notes")}
          />
        </FormField>
      </ModalSection>
    </form>
  );
}
