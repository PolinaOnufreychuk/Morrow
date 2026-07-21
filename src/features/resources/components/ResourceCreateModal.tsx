import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { ResourceForm } from "./ResourceForm";

export interface ResourceCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "resource-create-form";

export function ResourceCreateModal({ open, onOpenChange }: ResourceCreateModalProps) {
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="New resource"
      description="Save a link, repo, video, or file."
      footer={
        <Button type="submit" form={FORM_ID}>
          Save resource
        </Button>
      }
    >
      <ResourceForm formId={FORM_ID} onSubmit={() => onOpenChange(false)} />
    </ModalShell>
  );
}
