import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@/design-system/icons/Icon";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { useArchiveProject, useDeleteProject, useProject } from "../hooks/useProjects";
import { useBoards } from "@/features/inspiration/hooks/useInspiration";
import { useNotes } from "@/features/notes/hooks/useNotes";
import { useResources } from "@/features/resources/hooks/useResources";
import { ProjectHero } from "../components/ProjectHero";
import { ProjectInfoSidebar } from "../components/ProjectInfoSidebar";
import { ProjectEmbeddedContent } from "../components/ProjectEmbeddedContent";
import { ProjectEditModal } from "../components/ProjectEditModal";

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error, refetch } = useProject(projectId);
  const { data: boards = [] } = useBoards();
  const { data: notes = [] } = useNotes();
  const { data: resources = [] } = useResources();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const archiveProject = useArchiveProject();
  const deleteProject = useDeleteProject();

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
        onEdit={() => setEditOpen(true)}
        onArchive={handleArchive}
        onDelete={() => setDeleteOpen(true)}
      />

      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[34px] font-light leading-tight text-text-primary [text-wrap:balance]">
          {project.title}
        </h1>
        {project.description && (
          <p className="max-w-2xl text-[15px] leading-relaxed text-text-secondary">
            {project.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 board:grid-cols-[1fr_300px]">
        <div className="order-2 board:order-1">
          <ProjectEmbeddedContent
            boards={scopedBoards}
            notes={scopedNotes}
            resources={scopedResources}
          />
        </div>
        <div className="order-1 board:order-2">
          <ProjectInfoSidebar project={project} />
        </div>
      </div>

      <ProjectEditModal open={editOpen} onOpenChange={setEditOpen} project={project} />

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
