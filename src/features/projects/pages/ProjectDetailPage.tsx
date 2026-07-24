import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageShell } from "@/components/shared/PageShell";
import { BackLink } from "@/components/shared/BackLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { useBackContext } from "@/lib/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useArchiveProject, useProject } from "../hooks/useProjects";
import { useProjectEditState } from "../hooks/useProjectEditState";
import { ProjectValidationError } from "../types";
import { useBoards } from "@/features/inspiration/hooks/useInspiration";
import { useNotes } from "@/features/notes/hooks/useNotes";
import { useResources } from "@/features/resources/hooks/useResources";
import { ProjectHero } from "../components/ProjectHero";
import { ProjectInfoSidebar } from "../components/ProjectInfoSidebar";
import { ProjectSection } from "../components/ProjectSection";
import { ProjectEmbeddedContent } from "../components/ProjectEmbeddedContent";
import { ProjectExternalLinksSection } from "../components/ProjectExternalLinksSection";
import { AttachmentsSection } from "@/features/attachments/components/AttachmentsSection";
import { ProjectNotesTextSection } from "../components/ProjectNotesTextSection";

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const back = useBackContext({ path: "/projects", label: "Projects" });
  const { data: project, isLoading, isError, error, refetch } = useProject(projectId);
  const { data: boards = [] } = useBoards();
  const { data: notes = [] } = useNotes();
  const { data: resources = [] } = useResources();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // "Delete" moves the project to Archive (soft-delete); the Archive
  // screen's own "Delete permanently" is the only real hard-delete path.
  const archiveProject = useArchiveProject();
  // Hooks must run unconditionally — `project` may still be undefined here.
  const editState = useProjectEditState(
    project ?? {
      id: "",
      title: "",
      coverImageUrl: null,
      description: null,
      status: "in-progress",
      deadline: null,
      category: null,
      tags: [],
      externalLinks: [],
      notes: null,
      isArchived: false,
      archivedAt: null,
      createdAt: "",
      updatedAt: "",
    },
  );

  if (isLoading) {
    return (
      <PageShell>
        <div aria-busy="true" aria-label="Loading project" className="flex flex-col gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-9 w-2/3" />
          <div className="grid grid-cols-1 gap-8 board:grid-cols-[1fr_300px]">
            <div className="order-2 flex flex-col gap-4 board:order-1">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="order-1 h-72 w-full board:order-2" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell>
        <ErrorState
          title="Couldn't load this project"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </PageShell>
    );
  }

  if (!project) {
    return (
      <PageShell>
        <EmptyState
          title="Project not found"
          description="This project may have been deleted or archived."
          action={
            <BackLink to={back.path} label={back.label} />
          }
        />
      </PageShell>
    );
  }

  const scopedBoards = boards.filter((board) => board.projectIds.includes(project.id));
  const scopedNotes = notes.filter((note) => note.projectIds.includes(project.id));
  const scopedResources = resources.filter((resource) => resource.projectIds.includes(project.id));

  const handleSave = async () => {
    try {
      await editState.save();
      notify.success("Project updated");
    } catch (error) {
      if (error instanceof ProjectValidationError) {
        notify.error(Object.values(error.fieldErrors).flat().join(" "));
      } else {
        notify.error(error instanceof Error ? error.message : "Couldn't save changes.");
      }
    }
  };

  return (
    <PageShell>
      <BackLink to={back.path} label={back.label} />

      <div className="mb-2">
        <ProjectHero
          project={project}
          onEdit={editState.startEditing}
          onDelete={() => setDeleteOpen(true)}
          editMode={editState.isEditing}
          coverImageUrl={editState.isEditing ? editState.draft.coverImageUrl : undefined}
          onChangeCover={(url) => editState.patch({ coverImageUrl: url || null })}
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        {editState.isEditing ? (
          <Input
            value={editState.draft.title}
            onChange={(event) => editState.patch({ title: event.target.value })}
            className="font-display text-[34px] font-light"
            aria-label="Project title"
          />
        ) : (
          <h1 className="font-display text-[34px] font-light leading-tight text-text-primary [text-wrap:balance]">
            {project.title}
          </h1>
        )}

        {editState.isEditing && (
          <div className="flex shrink-0 gap-2">
            <Button type="button" variant="secondary" onClick={editState.cancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={editState.isSaving}>
              Save changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 board:grid-cols-[1fr_300px]">
        <div className="order-2 flex flex-col gap-4 board:order-1">
          {(editState.isEditing || project.description) && (
            <ProjectSection eyebrow="Description" tone="solid">
              {editState.isEditing ? (
                <Textarea
                  value={editState.draft.description ?? ""}
                  onChange={(event) => editState.patch({ description: event.target.value })}
                  placeholder="What is this project about?"
                />
              ) : (
                <p className="text-[15px] leading-relaxed text-text-secondary">{project.description}</p>
              )}
            </ProjectSection>
          )}

          <ProjectEmbeddedContent
            projectId={project.id}
            projectTitle={project.title}
            boards={scopedBoards}
            notes={scopedNotes}
            resources={scopedResources}
            allBoards={boards}
            allNotes={notes}
            allResources={resources}
            editMode={editState.isEditing}
          />

          <ProjectExternalLinksSection
            links={editState.isEditing ? editState.draft.externalLinks : project.externalLinks}
            editMode={editState.isEditing}
            onChange={(externalLinks) => editState.patch({ externalLinks })}
          />

          <AttachmentsSection
            parentType="project"
            parentId={project.id}
            editMode={editState.isEditing}
          />

          <ProjectNotesTextSection
            notes={editState.isEditing ? editState.draft.notes : project.notes}
            editMode={editState.isEditing}
            onChange={(notes) => editState.patch({ notes })}
          />
        </div>
        <div className="order-1 board:order-2">
          <ProjectInfoSidebar project={project} />
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project?"
        description={`"${project.title}" will be moved to Archive and permanently deleted in 7 days.`}
        confirmLabel="Delete project"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          await archiveProject.mutateAsync(project.id);
          notify.success(`"${project.title}" moved to Archive`);
          navigate("/projects");
        }}
      />
    </PageShell>
  );
}
