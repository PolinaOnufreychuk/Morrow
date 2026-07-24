import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/shared/Toast";
import { useCreateResource } from "../hooks/useResources";
import { ResourceForm, type ResourceFormValues } from "./ResourceForm";
import type { CreateResourceInput } from "../types";
import glassLeafSage from "@/assets/grain-gradient-sage-blush.png";

export interface ResourceCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "resource-create-form";

/** Builds the kind-specific fields each Resource variant requires, deriving
 * sensible defaults from the URL/title since the create form only exposes
 * the fields shown in the design (Type/URL/Title/Description/Category). */
function toCreateInput(values: ResourceFormValues): CreateResourceInput {
  const shared = {
    title: values.title,
    url: values.url,
    description: values.description?.trim() || null,
    tags: [values.category],
    projectId: null,
  };

  switch (values.kind) {
    case "repo": {
      const match = values.url.match(/github\.com\/([^/]+)\/([^/]+)/i);
      return {
        ...shared,
        kind: "repo",
        owner: match?.[1] ?? "",
        repoName: match?.[2]?.replace(/\.git$/, "") ?? values.title,
        language: null,
        stars: null,
      };
    }
    case "video":
      return { ...shared, kind: "video", thumbnailUrl: null, duration: null };
    case "pdf":
      return {
        ...shared,
        kind: "pdf",
        filename: values.url.split("/").pop() || `${values.title}.pdf`,
        pageCount: null,
      };
    case "image":
      return { ...shared, kind: "image", coverImageUrl: values.coverImageUrl || values.url };
    case "link":
    default:
      return { ...shared, kind: "link", readingMinutes: null };
  }
}

export function ResourceCreateModal({ open, onOpenChange }: ResourceCreateModalProps) {
  const createResource = useCreateResource();

  const handleSubmit = (values: ResourceFormValues) => {
    createResource.mutate(toCreateInput(values), {
      onSuccess: (resource) => {
        notify.success(`"${resource.title}" saved`);
        onOpenChange(false);
      },
      onError: () => notify.error(`Couldn't save that resource. Check the URL and try again.`),
    });
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="New resource"
      heroImage={glassLeafSage}
      footerAlign="stretch"
      footer={
        <Button size="lg" fullWidth type="submit" form={FORM_ID} disabled={createResource.isPending}>
          Save resource
        </Button>
      }
    >
      <ResourceForm formId={FORM_ID} onSubmit={handleSubmit} />
    </ModalShell>
  );
}
