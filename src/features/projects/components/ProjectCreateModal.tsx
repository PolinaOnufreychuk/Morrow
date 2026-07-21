import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { ProjectForm, type ProjectFormValues } from "./ProjectForm";

export interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "project-create-form";

export function ProjectCreateModal({ open, onOpenChange }: ProjectCreateModalProps) {
  // Scaffolding: no real mutation wired. Logs shape, then closes.
  const handleSubmit = (values: ProjectFormValues) => {
    void values; // TODO: wire to useCreateProject()
    onOpenChange(false);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="New project"
      description="Create a new project workspace."
      footer={
        <Button type="submit" form={FORM_ID}>
          Create project
        </Button>
      }
    >
      <ProjectForm formId={FORM_ID} onSubmit={handleSubmit} />
    </ModalShell>
  );
}
