import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { FormField } from "@/components/shared/FormField";
import { ModalSection } from "@/components/shared/ModalSection";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { CREATABLE_RESOURCE_KINDS } from "../resourceKindMeta";
import { detectResourceKind } from "../lib/detectKind";
import {
  fetchGithubRepoMetadata,
  fetchSiteMetadata,
  fetchVimeoMetadata,
  fetchYoutubeMetadata,
} from "../lib/fetchMetadata";
import type { Resource } from "@/types/entities";

const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

/**
 * Field-shape validation for the create form. Title is optional here — it's
 * auto-populated from metadata (and, failing that, filled from the URL in
 * `toCreateInput`) — while the strict `createResourceSchema` still guarantees a
 * non-empty title on the way to the server. `kind` is set automatically from
 * the URL (see `detectKind.ts`), never picked by the user; the metadata-only
 * fields below are filled by the auto-fetch, not shown as their own inputs.
 */
export const resourceFormSchema = z.object({
  kind: z.enum(CREATABLE_RESOURCE_KINDS),
  title: z.string().optional(),
  url: z.string().url("Enter a valid URL"),
  description: z.string().optional(),
  category: z.enum(CATEGORY_OPTIONS),
  previewImageUrl: z.string().optional(),
  coverImageUrl: z.string().optional(),
  isFigma: z.boolean().optional(),
  language: z.string().nullable().optional(),
  stars: z.number().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;

function isProbablyValidUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export interface ResourceFormProps {
  formId: string;
  defaultValues?: Partial<Resource>;
  onSubmit: (values: ResourceFormValues) => void;
  /** Reports react-hook-form's `isDirty` up to the modal so it can guard
   * against closing with unsaved changes (see `useConfirmDiscard`). */
  onDirtyChange?: (dirty: boolean) => void;
  /** Reports whether the required data is present (a valid URL) so the modal
   * can keep its submit CTA disabled until then. */
  onCanSubmitChange?: (canSubmit: boolean) => void;
}

export function ResourceForm({
  formId,
  defaultValues,
  onSubmit,
  onDirtyChange,
  onCanSubmitChange,
}: ResourceFormProps) {
  const { register, handleSubmit, setValue, watch, formState } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      kind: "link",
      title: defaultValues?.title ?? "",
      url: defaultValues?.url ?? "",
      description: defaultValues?.description ?? "",
      category: (defaultValues?.tags?.[0] as (typeof CATEGORY_OPTIONS)[number]) ?? CATEGORY_OPTIONS[0],
      previewImageUrl: "",
      coverImageUrl: "",
      isFigma: false,
      language: null,
      stars: null,
      thumbnailUrl: null,
    },
  });

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const url = watch("url") ?? "";
  const category = watch("category");

  useEffect(() => {
    onDirtyChange?.(formState.isDirty);
  }, [formState.isDirty, onDirtyChange]);

  useEffect(() => {
    onCanSubmitChange?.(isProbablyValidUrl(url.trim()));
  }, [url, onCanSubmitChange]);

  /** On blur: detect the kind from the URL and auto-fill whatever metadata is
   * reachable, never clobbering anything the user already typed. */
  const handleUrlBlur = async () => {
    const value = url.trim();
    if (!isProbablyValidUrl(value)) return;

    const kind = detectResourceKind(value);
    setValue("kind", kind);

    setIsFetchingMetadata(true);
    try {
      if (kind === "repo") {
        const metadata = await fetchGithubRepoMetadata(value);
        if (metadata) {
          if (!watch("description")) setValue("description", metadata.description ?? "");
          setValue("language", metadata.language);
          setValue("stars", metadata.stars);
        }
      } else if (kind === "video") {
        const metadata = (await fetchYoutubeMetadata(value)) ?? (await fetchVimeoMetadata(value));
        if (metadata) {
          if (!watch("title")) setValue("title", metadata.title, { shouldDirty: true });
          setValue("thumbnailUrl", metadata.thumbnailUrl);
        }
      } else {
        // Website or Figma preview — unfurled server-side via the proxy.
        const metadata = await fetchSiteMetadata(value);
        if (metadata) {
          if (!watch("title") && metadata.title) setValue("title", metadata.title, { shouldDirty: true });
          if (!watch("description") && metadata.description) setValue("description", metadata.description);
          if (kind === "preview" && !watch("previewImageUrl") && metadata.image) {
            setValue("previewImageUrl", metadata.image);
          }
        }
      }
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <ModalSection tone="primary" className="gap-4">
        <FormField
          htmlFor={`${formId}-url`}
          label="URL"
          labelTone="prominent"
          error={formState.errors.url?.message}
          helperText={
            !formState.errors.url && isFetchingMetadata ? "Fetching details…" : undefined
          }
        >
          <Input
            id={`${formId}-url`}
            placeholder="https://"
            rounded="soft"
            autoFocus
            {...register("url")}
            onBlur={handleUrlBlur}
          />
        </FormField>

        <FormField htmlFor={`${formId}-title`} label="Title" labelTone="prominent" optional>
          <Input
            id={`${formId}-title`}
            placeholder="Auto-filled from the link — edit if you like"
            rounded="soft"
            {...register("title")}
          />
        </FormField>
      </ModalSection>

      <ModalSection tone="secondary" className="gap-6">
        <PropertyDropdown
          label="Category"
          labelTone="prominent"
          rounded="soft"
          triggerClassName="text-[#807F7D]"
          options={CATEGORY_SELECT_OPTIONS}
          value={category}
          onValueChange={(value) => setValue("category", value, { shouldDirty: true })}
        />

        <FormField htmlFor={`${formId}-description`} label="Description" labelTone="prominent" optional>
          <Textarea
            id={`${formId}-description`}
            placeholder="e.g. Studio portfolio site v2"
            rounded="soft"
            {...register("description")}
          />
        </FormField>
      </ModalSection>
    </form>
  );
}
