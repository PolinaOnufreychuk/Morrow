import { Button } from "@/components/ui/button";
import { notify } from "@/components/shared/Toast";
import { useCreateResource } from "../hooks/useResources";
import { ResourceForm, type ResourceFormValues } from "./ResourceForm";
import { toCreateInput } from "../lib/toCreateInput";

export interface ResourceQuickCreateFormProps {
  projectId: string;
  onCreated: () => void;
}

const FORM_ID = "resource-quick-create-form";

/**
 * Inline "create new resource, pre-linked to this project" form for the
 * project-details Link-or-Create modal. Same fields/logic as the Resources
 * page's ResourceCreateModal — the resource's type is auto-detected from the
 * URL and metadata auto-filled, so there's no manual Type picker.
 */
export function ResourceQuickCreateForm({ projectId, onCreated }: ResourceQuickCreateFormProps) {
  const createResource = useCreateResource();

  const handleSubmit = (values: ResourceFormValues) => {
    createResource.mutate(toCreateInput(values, [projectId]), {
      onSuccess: (resource) => {
        notify.success(`"${resource.title}" saved`);
        onCreated();
      },
      onError: () => notify.error("Couldn't save that resource. Check the URL and try again."),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <ResourceForm formId={FORM_ID} onSubmit={handleSubmit} />
      <Button
        type="submit"
        form={FORM_ID}
        size="lg"
        fullWidth
        disabled={createResource.isPending}
      >
        Save resource
      </Button>
    </div>
  );
}
