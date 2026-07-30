import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { notify } from "@/components/shared/Toast";
import { useConfirmDiscard } from "@/hooks/useConfirmDiscard";
import { useCreateResource } from "../hooks/useResources";
import { ResourceForm, type ResourceFormValues } from "./ResourceForm";
import { toCreateInput } from "../lib/toCreateInput";
import bgNewResource from "@/assets/bg-new-resource.png";

export interface ResourceCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "resource-create-form";

export function ResourceCreateModal({ open, onOpenChange }: ResourceCreateModalProps) {
  const createResource = useCreateResource();
  const [isDirty, setIsDirty] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

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
        heroImage={bgNewResource}
        heroTitleOverlay
        heroTitleInImage
        heroImageClassName="h-auto aspect-[502/136]"
        className="max-w-[440px]"
        footerAlign="split"
        footer={
          <>
            <DialogClose asChild>
              <Button
                variant="secondary"
                size="lg"
                className="h-[48px] basis-[36%] rounded-[15px] text-[16px]"
                disabled={createResource.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="hero"
              size="lg"
              className="h-[48px] flex-1 rounded-[15px] text-[16px]"
              type="submit"
              form={FORM_ID}
              disabled={!canSubmit || createResource.isPending}
              aria-busy={createResource.isPending}
            >
              {createResource.isPending ? "Saving…" : "Save resource"}
            </Button>
          </>
        }
      >
        <ResourceForm
          formId={FORM_ID}
          onSubmit={handleSubmit}
          onDirtyChange={setIsDirty}
          onCanSubmitChange={setCanSubmit}
        />
      </ModalShell>
      {discardDialog}
    </>
  );
}
