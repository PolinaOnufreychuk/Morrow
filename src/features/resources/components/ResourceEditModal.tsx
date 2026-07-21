import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { ResourceForm } from "./ResourceForm";
import type { Resource } from "@/types/entities";

export interface ResourceEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource;
}

const FORM_ID = "resource-edit-form";

export function ResourceEditModal({ open, onOpenChange, resource }: ResourceEditModalProps) {
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit resource"
      footer={
        <Button type="submit" form={FORM_ID}>
          Save changes
        </Button>
      }
    >
      <ResourceForm formId={FORM_ID} defaultValues={resource} onSubmit={() => onOpenChange(false)} />
    </ModalShell>
  );
}
