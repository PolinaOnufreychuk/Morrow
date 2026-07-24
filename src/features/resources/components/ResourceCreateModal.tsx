import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/shared/Toast";
import { useConfirmDiscard } from "@/hooks/useConfirmDiscard";
import { useCreateResource } from "../hooks/useResources";
import { ResourceForm, type ResourceFormValues } from "./ResourceForm";
import { toCreateInput } from "../lib/toCreateInput";
import glassLeafSage from "@/assets/grain-gradient-sage-blush.png";

export interface ResourceCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "resource-create-form";

export function ResourceCreateModal({ open, onOpenChange }: ResourceCreateModalProps) {
  const createResource = useCreateResource();
  const [isDirty, setIsDirty] = useState(false);

  const handleSubmit = (values: ResourceFormValues) => {
    createResource.mutate(toCreateInput(values), {
      onSuccess: (resource) => {
        notify.success(`"${resource.title}" saved`);
        onOpenChange(false);
      },
      onError: () => notify.error(`Couldn't save that resource. Check the URL and try again.`),
    });
  };

  const { guardedOnOpenChange, discardDialog } = useConfirmDiscard(isDirty, (next) => {
    if (createResource.isPending) return;
    onOpenChange(next);
  });

  return (
    <>
      <ModalShell
        open={open}
        onOpenChange={guardedOnOpenChange}
        title="New resource"
        heroImage={glassLeafSage}
        footerAlign="stretch"
        footer={
          <Button size="lg" fullWidth type="submit" form={FORM_ID} disabled={createResource.isPending}>
            Save resource
          </Button>
        }
      >
        <ResourceForm formId={FORM_ID} onSubmit={handleSubmit} onDirtyChange={setIsDirty} />
      </ModalShell>
      {discardDialog}
    </>
  );
}
