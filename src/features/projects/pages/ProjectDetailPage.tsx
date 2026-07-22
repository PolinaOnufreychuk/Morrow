import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@/design-system/icons/Icon";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useArchiveProject, useDeleteProject, useProject } from "../hooks/useProjects";
import { useProjectEditState } from "../hooks/useProjectEditState";
import { useBoards } from "@/features/inspiration/hooks/useInspiration";
import { useNotes } from "@/features/notes/hooks/useNotes";
import { useResources } from "@/features/resources/hooks/useResources";
import { ProjectHero } from "../components/ProjectHero";
import { ProjectInfoSidebar } from "../components/ProjectInfoSidebar";
import { ProjectEmbeddedContent } from "../components/ProjectEmbeddedContent";
import { ProjectExternalLinksSection } from "../components/ProjectExternalLinksSection";
import { ProjectAttachmentsSection } from "../components/ProjectAttachmentsSection";
import { ProjectNotesTextSection } from "../components/ProjectNotesTextSection";

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error, refetch } = useProject(projectId);
  const { data: boards = [] } = useBoards();
  const { data: notes = [] } = useNotes();
  const { data: resources = [] } = useResources();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const archiveProject = useArchiveProject();
  const deleteProject = useDeleteProject();
  // Hooks must run unconditionally — `project` may still be undefined here.
  const editState = useProjectEditState(
    project ?? {
      id: "",
      title: "",
      coverImageUrl: null,
      description: null,
      status: "in-progress",
      deadline: null,
      tags: [],
      externalLinks: [],
      attachments: [],
      notes: null,
      isArchived: false,
      createdAt: "",
      updatedAt: "",
    },
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading project">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-9 w-2/3" />
        <div className="grid grid-cols-1 gap-8 board:grid-cols-[1fr_300px]">
          <div className="order-2 flex flex-col gap-4 board:order-1">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="order-1 h-72 w-full board:order-2" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load this project"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been deleted or archived."
        action={
          <Link to="/projects" className="text-sage-700 underline underline-offset-2">
            Back to projects
          </Link>
        }
      />
    );
  }

  const scopedBoards = boards.filter((board) => board.projectId === project.id);
  const scopedNotes = notes.filter((note) => note.projectId === project.id);
  const scopedResources = resources.filter((resource) => resource.projectId === project.id);

  const handleArchive = () => {
    archiveProject.mutate(project.id, {
      onSuccess: () => {
        notify.success(`"${project.title}" archived`);
        navigate("/projects");
      },
      onError: () => notify.error("Couldn't archive this project."),
    });
  };

  const handleSave = async () => {
    try {
      await editState.save();
      notify.success("Project updated");
    } catch {
      notify.error("Couldn't save changes.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary"
      >
        <Icon name="arrow-left" size={16} />
        Projects
      </Link>

      <ProjectHero
        project={project}
        onEdit={editState.startEditing}
        onArchive={handleArchive}
        onDelete={() => setDeleteOpen(true)}
        editMode={editState.isEditing}
        coverImageUrl={editState.isEditing ? editState.draft.coverImageUrl : undefined}
        onChangeCover={(url) => editState.patch({ coverImageUrl: url || null })}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          {editState.isEditing ? (
            <Input
              value={editState.draft.title}
              onChange={(event) => editState.patch({ title: event.target.value })}
              className="font-display text-[28px] font-light"
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

        {editState.isEditing ? (
          <Textarea
            value={editState.draft.description ?? ""}
            onChange={(event) => editState.patch({ description: event.target.value })}
            placeholder="What is this project about?"
            className="max-w-2xl"
          />
        ) : (
          project.description && (
            <p className="max-w-2xl text-[15px] leading-relaxed text-text-secondary">
              {project.description}
            </p>
          )
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 board:grid-cols-[1fr_300px]">
        <div className="order-2 flex flex-col gap-6 board:order-1">
          <ProjectEmbeddedContent
            projectId={project.id}
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

          <ProjectAttachmentsSection
            attachments={editState.isEditing ? editState.draft.attachments : project.attachments}
            editMode={editState.isEditing}
            onChange={(attachments) => editState.patch({ attachments })}
          />

          <ProjectNotesTextSection
            notes={editState.isEditing ? editState.draft.notes : project.notes}
            editMode={editState.isEditing}
            onChange={(notes) => editState.patch({ notes })}
          />
        </div>
        <div className="order-1 board:order-2">
          <ProjectInfoSidebar
            project={project}
            editMode={editState.isEditing}
            draft={editState.draft}
            onPatch={editState.patch}
          />
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project?"
        description={`"${project.title}" and its links to inspiration, notes, and resources will be permanently removed.`}
        confirmLabel="Delete project"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          await deleteProject.mutateAsync(project.id);
          notify.success(`"${project.title}" deleted`);
          navigate("/projects");
        }}
      />
    </div>
  );
}
