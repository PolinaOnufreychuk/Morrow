import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/shared/TagInput";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
import { FormField } from "@/components/shared/FormField";
import { ModalSection } from "@/components/shared/ModalSection";
import { cn } from "@/lib/utils";
import statusIcon from "@/assets/icon-project-status.svg";
import { STATUS_META } from "@/components/shared/StatusPill";
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
/** Per-status gradient for the v2 badge tag — each status has its own hue
 * (rose / olive / deep-green), white text + white four-circle icon. */
const STATUS_TAG_TONE: Record<ProjectStatus, string> = {
  "in-progress": "bg-gradient-to-r from-[#B27F7E] to-[#D9B9B2] text-white",
  review: "bg-gradient-to-r from-[#89A380] to-[#C5CC9C] text-white",
  done: "bg-gradient-to-r from-[#618063] to-[#95B28C] text-white",
};
/** Adds STATUS_META's label + per-status gradient + the designer's white
 * four-circle icon for the "New project" badge-style Status dropdown. */
const STATUS_BADGE_OPTIONS = PROJECT_STATUSES.map((value) => ({
  value,
  label: STATUS_META[value].label,
  tone: STATUS_TAG_TONE[value],
  icon: <img src={statusIcon} alt="" className="h-4 w-4" />,
}));
const CATEGORY_OPTIONS = PROJECT_CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

export interface ProjectFormProps {
  formId: string;
  defaultValues?: Partial<Project>;
  onSubmit: (values: ProjectFormValues) => void;
  /** Server/mutation-level error not tied to a specific field. */
  submitError?: string | null;
  /** Reports react-hook-form's `isDirty` up to the modal so it can guard
   * against closing with unsaved changes (see `useConfirmDiscard`). */
  onDirtyChange?: (dirty: boolean) => void;
  /** Reports whether the required data is present (Title non-empty) so the
   * modal can keep its submit CTA disabled until then. */
  onCanSubmitChange?: (canSubmit: boolean) => void;
  /** "create" hides Tags/Deadline/External links/Notes — those get
   * configured on the project's own page afterward, not at creation. */
  mode?: "create" | "edit";
  /** "legacy" (default) is the current field styling used everywhere.
   * "v2" is the "New project" mockup's styling (prominent labels, softer
   * radius, badge-style Status) — only wired in for `mode="create"` so
   * ProjectEditModal is unaffected until that's approved separately. */
  visualStyle?: "legacy" | "v2";
}

export function ProjectForm({
  formId,
  defaultValues,
  onSubmit,
  submitError,
  onDirtyChange,
  onCanSubmitChange,
  mode = "edit",
  visualStyle = "legacy",
}: ProjectFormProps) {
  const labelTone = visualStyle === "v2" ? "prominent" : "subtle";
  const rounded = visualStyle === "v2" ? "soft" : "default";
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

  const title = watch("title") ?? "";
  const status = watch("status");
  const deadline = watch("deadline");
  const category = watch("category");
  const tags = watch("tags");
  const externalLinks = watch("externalLinks");
  const description = watch("description") ?? "";

  useEffect(() => {
    onDirtyChange?.(formState.isDirty);
  }, [formState.isDirty, onDirtyChange]);

  useEffect(() => {
    onCanSubmitChange?.(title.trim().length > 0);
  }, [title, onCanSubmitChange]);

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col", visualStyle === "v2" ? "gap-5" : "gap-6")}
    >
      {submitError && (
        <p role="alert" className="rounded-chip bg-blush-100 px-3 py-2 text-[13px] text-blush-600">
          {submitError}
        </p>
      )}

      <ModalSection tone="primary" className={cn(visualStyle === "v2" && "gap-4")}>
        <FormField
          htmlFor={`${formId}-title`}
          label="Title"
          labelTone={labelTone}
          error={formState.errors.title?.message}
        >
          <Input
            id={`${formId}-title`}
            placeholder="e.g. Studio portfolio site v2"
            rounded={rounded}
            autoFocus
            aria-invalid={Boolean(formState.errors.title)}
            aria-describedby={formState.errors.title ? `${formId}-title-error` : undefined}
            {...register("title")}
          />
        </FormField>

        <FormField
          htmlFor={`${formId}-description`}
          label="Description"
          labelTone={labelTone}
          optional
          counter={{ current: description.length, max: 2000 }}
        >
          <Textarea
            id={`${formId}-description`}
            placeholder="e.g. Studio portfolio site v2"
            rounded={rounded}
            {...register("description")}
          />
        </FormField>
      </ModalSection>

      <ModalSection tone="secondary" className={cn(visualStyle === "v2" && "gap-6")}>
        <div className={cn("grid grid-cols-2", visualStyle === "v2" ? "gap-4" : "gap-4")}>
          <PropertyDropdown
            label="Status"
            labelTone={labelTone}
            rounded={rounded}
            variant={visualStyle === "v2" ? "badge" : "plain"}
            options={visualStyle === "v2" ? STATUS_BADGE_OPTIONS : STATUS_OPTIONS}
            value={status}
            onValueChange={(value) => setValue("status", value, { shouldDirty: true })}
          />
          <PropertyDropdown
            label="Category"
            labelTone={labelTone}
            rounded={rounded}
            triggerClassName={visualStyle === "v2" ? "text-[#807F7D]" : undefined}
            optional
            options={CATEGORY_OPTIONS}
            value={category ?? CATEGORY_OPTIONS[0].value}
            onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
          />
        </div>

        {mode === "edit" && (
          <FormField htmlFor={`${formId}-tags`} label="Tags" optional>
            <TagInput
              id={`${formId}-tags`}
              value={tags}
              onChange={(value) => setValue("tags", value, { shouldDirty: true })}
            />
          </FormField>
        )}

        <FormField
          label={visualStyle === "v2" ? "" : "Cover image"}
          optional
          error={formState.errors.coverImageUrl?.message}
        >
          <ImageDropzone
            value={watch("coverImageUrl") || null}
            onChange={(url) => setValue("coverImageUrl", url ?? "", { shouldDirty: true })}
            onUpload={(file) => uploadCoverImage("project", file)}
            size={visualStyle === "v2" ? "large" : "default"}
            label={visualStyle === "v2" ? "Drop cover image, or click to upload" : undefined}
            helperText={visualStyle === "v2" ? "Maximum 10 MB file size" : undefined}
          />
        </FormField>
      </ModalSection>

      {mode === "edit" && (
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
      )}
    </form>
  );
}
