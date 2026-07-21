import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { ProjectForm, type ProjectFormValues } from "./ProjectForm";
import type { Project } from "@/types/entities";

export interface ProjectEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

const FORM_ID = "project-edit-form";

/**
 * Project edit modal — a gap-fix: the wireframe export never built one.
 * Reuses ProjectForm so create/edit stay visually identical.
 */
export function ProjectEditModal({ open, onOpenChange, project }: ProjectEditModalProps) {
  const handleSubmit = (values: ProjectFormValues) => {
    void values; // TODO: wire to useUpdateProject()
    onOpenChange(false);
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Edit project"
      footer={
        <Button type="submit" form={FORM_ID}>
          Save changes
        </Button>
      }
    >
      <ProjectForm formId={FORM_ID} defaultValues={project} onSubmit={handleSubmit} />
    </ModalShell>
  );
}
