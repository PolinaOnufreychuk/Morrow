import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/shared/Toast";
import { ProjectForm, type ProjectFormValues } from "./ProjectForm";
import { useCreateProject } from "../hooks/useProjects";
import { ProjectValidationError } from "../types";
import heroMeadow from "@/assets/grain-gradient-sage-blush.png";

export interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "project-create-form";

export function ProjectCreateModal({ open, onOpenChange }: ProjectCreateModalProps) {
  const createProject = useCreateProject();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (values: ProjectFormValues) => {
    setSubmitError(null);
    createProject.mutate(values, {
      onSuccess: () => {
        notify.success("Project created");
        onOpenChange(false);
      },
      onError: (error) => {
        setSubmitError(
          error instanceof ProjectValidationError
            ? error.message
            : "Couldn't create the project. Please try again.",
        );
      },
    });
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={(next) => {
        if (createProject.isPending) return;
        setSubmitError(null);
        onOpenChange(next);
      }}
      title="New project"
      description="Create a new project workspace."
      heroImage={heroMeadow}
      footerAlign="stretch"
      footer={
        <Button
          size="lg"
          fullWidth
          type="submit"
          form={FORM_ID}
          disabled={createProject.isPending}
          aria-busy={createProject.isPending}
        >
          {createProject.isPending ? "Creating…" : "Create project"}
        </Button>
      }
    >
      <ProjectForm formId={FORM_ID} onSubmit={handleSubmit} submitError={submitError} />
    </ModalShell>
  );
}
