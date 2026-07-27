import { useState } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { notify } from "@/components/shared/Toast";
import { ProjectForm, type ProjectFormValues } from "./ProjectForm";
import { useCreateProject } from "../hooks/useProjects";
import { ProjectValidationError } from "../types";
import bgNewProject from "@/assets/bg-new-project.png";

export interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORM_ID = "project-create-form";

export function ProjectCreateModal({ open, onOpenChange }: ProjectCreateModalProps) {
  const createProject = useCreateProject();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);

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
      heroImage={bgNewProject}
      heroTitleOverlay
      footerAlign="split"
      footer={
        <>
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="lg"
              className="h-[50px] basis-[36%] rounded-[16px] text-[16px]"
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="hero"
            size="lg"
            className="h-[50px] flex-1 rounded-[16px] text-[16px]"
            type="submit"
            form={FORM_ID}
            disabled={!canSubmit || createProject.isPending}
            aria-busy={createProject.isPending}
          >
            {createProject.isPending ? "Creating…" : "Create project"}
          </Button>
        </>
      }
    >
      <ProjectForm
        formId={FORM_ID}
        mode="create"
        visualStyle="v2"
        onSubmit={handleSubmit}
        onCanSubmitChange={setCanSubmit}
        submitError={submitError}
      />
    </ModalShell>
  );
}
