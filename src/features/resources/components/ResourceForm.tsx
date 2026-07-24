import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
import { FormField } from "@/components/shared/FormField";
import { ModalSection } from "@/components/shared/ModalSection";
import { cn } from "@/lib/utils";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { CREATABLE_RESOURCE_KINDS, RESOURCE_KIND_META } from "../resourceKindMeta";
import { ResourceKindIcon } from "./ResourceKindIcon";
import { fetchGithubRepoMetadata, fetchYoutubeMetadata, isYoutubeUrl } from "../lib/fetchMetadata";
import type { Resource, ResourceKind } from "@/types/entities";

const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

/** Field-shape validation only. `language`/`stars`/`thumbnailUrl` are filled
 * in by the auto-fetch (see `lib/fetchMetadata.ts`), never shown as their
 * own inputs — the user only ever fills in URL/Title/Description/Type. */
export const resourceFormSchema = z.object({
  kind: z.enum(CREATABLE_RESOURCE_KINDS),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Enter a valid URL"),
  description: z.string().optional(),
  category: z.enum(CATEGORY_OPTIONS),
  coverImageUrl: z.string().optional(),
  previewImageUrl: z.string().optional(),
  isFigma: z.boolean().optional(),
  language: z.string().nullable().optional(),
  stars: z.number().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

export interface ResourceFormProps {
  formId: string;
  defaultValues?: Partial<Resource>;
  onSubmit: (values: ResourceFormValues) => void;
  /** Reports react-hook-form's `isDirty` up to the modal so it can guard
   * against closing with unsaved changes (see `useConfirmDiscard`). */
  onDirtyChange?: (dirty: boolean) => void;
}

export function ResourceForm({ formId, defaultValues, onSubmit, onDirtyChange }: ResourceFormProps) {
  const { register, handleSubmit, setValue, watch, formState } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      kind: (defaultValues?.kind as ResourceKind as (typeof CREATABLE_RESOURCE_KINDS)[number]) ?? "link",
      title: defaultValues?.title ?? "",
      url: defaultValues?.url ?? "",
      description: defaultValues?.description ?? "",
      category: (defaultValues?.tags?.[0] as (typeof CATEGORY_OPTIONS)[number]) ?? CATEGORY_OPTIONS[0],
      coverImageUrl: (defaultValues as { coverImageUrl?: string } | undefined)?.coverImageUrl ?? "",
      previewImageUrl:
        (defaultValues as { previewImageUrl?: string | null } | undefined)?.previewImageUrl ?? "",
      isFigma: (defaultValues as { isFigma?: boolean } | undefined)?.isFigma ?? false,
      language: null,
      stars: null,
      thumbnailUrl: null,
    },
  });

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const kind = watch("kind");
  const category = watch("category");

  useEffect(() => {
    onDirtyChange?.(formState.isDirty);
  }, [formState.isDirty, onDirtyChange]);

  const handleUrlBlur = async () => {
    const url = watch("url");
    if (!url) return;
    if (kind === "repo") {
      setIsFetchingMetadata(true);
      const metadata = await fetchGithubRepoMetadata(url);
      if (metadata) {
        if (!watch("description")) setValue("description", metadata.description ?? "");
        setValue("language", metadata.language);
        setValue("stars", metadata.stars);
      }
      setIsFetchingMetadata(false);
    } else if (kind === "video" && isYoutubeUrl(url)) {
      setIsFetchingMetadata(true);
      const metadata = await fetchYoutubeMetadata(url);
      if (metadata) {
        if (!watch("title")) setValue("title", metadata.title, { shouldDirty: true });
        setValue("thumbnailUrl", metadata.thumbnailUrl);
      }
      setIsFetchingMetadata(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <ModalSection tone="primary">
        <FormField label="Type">
          <div className="grid grid-cols-2 gap-2.5">
            {CREATABLE_RESOURCE_KINDS.map((value) => {
              const meta = RESOURCE_KIND_META[value];
              const active = value === kind;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("kind", value, { shouldDirty: true })}
                  className={cn(
                    "flex items-center gap-2.5 rounded-card border border-border-subtle bg-surface-card/60 p-3 text-left transition-all duration-fast ease-out",
                    "hover:-translate-y-px hover:border-sage-300 hover:shadow-resting focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active && "border-sage-300 shadow-resting",
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-chip bg-sage-100 text-sage-700">
                    <ResourceKindIcon kind={value} size={17} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[13px] font-medium text-text-primary">{meta.label}</span>
                    <span className="truncate text-[11px] text-text-tertiary">{meta.description}</span>
                  </span>
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2",
                      active ? "border-sage-600" : "border-border-default",
                    )}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />}
                  </span>
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField
          htmlFor={`${formId}-url`}
          label="URL"
          error={formState.errors.url?.message}
          helperText={
            !formState.errors.url && (kind === "repo" || kind === "video")
              ? isFetchingMetadata
                ? "Fetching details…"
                : kind === "repo"
                  ? "Description, language, and stars fill in automatically."
                  : "Title and thumbnail fill in automatically for YouTube links."
              : undefined
          }
        >
          <Input
            id={`${formId}-url`}
            placeholder="https://…"
            {...register("url")}
            onBlur={handleUrlBlur}
          />
        </FormField>

        <FormField htmlFor={`${formId}-title`} label="Title" error={formState.errors.title?.message}>
          <Input
            id={`${formId}-title`}
            placeholder="e.g. Nielsen Norman — Onboarding UX"
            {...register("title")}
          />
        </FormField>
      </ModalSection>

      <ModalSection tone="secondary">
        <FormField htmlFor={`${formId}-description`} label="Description" optional>
          <Textarea
            id={`${formId}-description`}
            placeholder="Why does this matter?"
            {...register("description")}
          />
        </FormField>

        {kind === "image" && (
          <FormField label="Cover image" optional>
            <ImageDropzone
              value={watch("coverImageUrl") || null}
              onChange={(url) => setValue("coverImageUrl", url ?? "", { shouldDirty: true })}
              onUpload={(file) => uploadCoverImage("resource", file)}
            />
          </FormField>
        )}

        {kind === "preview" && (
          <>
            <FormField label="Preview image" optional>
              <ImageDropzone
                value={watch("previewImageUrl") || null}
                onChange={(url) => setValue("previewImageUrl", url ?? "", { shouldDirty: true })}
                onUpload={(file) => uploadCoverImage("resource", file)}
              />
            </FormField>
            <label className="flex items-center gap-2 text-[13px] text-text-secondary">
              <Checkbox
                checked={watch("isFigma")}
                onCheckedChange={(checked) => setValue("isFigma", checked === true, { shouldDirty: true })}
              />
              This is a Figma file
            </label>
          </>
        )}

        <PropertyDropdown
          label="Category"
          options={CATEGORY_SELECT_OPTIONS}
          value={category}
          onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
        />
      </ModalSection>
    </form>
  );
}
