import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/shared/Toast";
import { ProjectForm, type ProjectFormValues } from "./ProjectForm";
import { useUpdateProject } from "../hooks/useProjects";
import { ProjectValidationError } from "../types";
import type { Project } from "@/types/entities";
import heroMeadow from "@/assets/grain-gradient-sage-blush.png";

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
  const updateProject = useUpdateProject();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (values: ProjectFormValues) => {
    setSubmitError(null);
    updateProject.mutate(
      { id: project.id, ...values },
      {
        onSuccess: () => {
          notify.success("Project updated");
          onOpenChange(false);
        },
        onError: (error) => {
          setSubmitError(
            error instanceof ProjectValidationError
              ? error.message
              : "Couldn't save your changes. Please try again.",
          );
        },
      },
    );
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={(next) => {
        if (updateProject.isPending) return;
        setSubmitError(null);
        onOpenChange(next);
      }}
      title="Edit project"
      heroImage={heroMeadow}
      footerAlign="stretch"
      footer={
        <Button
          size="lg"
          fullWidth
          type="submit"
          form={FORM_ID}
          disabled={updateProject.isPending}
          aria-busy={updateProject.isPending}
        >
          {updateProject.isPending ? "Saving…" : "Save changes"}
        </Button>
      }
    >
      <ProjectForm
        formId={FORM_ID}
        defaultValues={project}
        onSubmit={handleSubmit}
        submitError={submitError}
      />
    </ModalShell>
  );
}
