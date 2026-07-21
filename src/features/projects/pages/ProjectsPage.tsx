import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { Icon } from "@/design-system/icons/Icon";
import { sortByRecency } from "@/lib/utils";
import {
  useArchiveProject,
  useBulkArchiveProjects,
  useBulkDeleteProjects,
  useDeleteProject,
  useProjects,
} from "../hooks/useProjects";
import { ProjectCard, ProjectCardSkeleton } from "../components/ProjectCard";
import { ProjectStatusTabs } from "../components/ProjectStatusTabs";
import { ProjectCreateModal } from "../components/ProjectCreateModal";
import { ProjectEditModal } from "../components/ProjectEditModal";
import { ProjectBulkEditBar } from "../components/ProjectBulkEditBar";
import type { Project, ProjectStatusFilter } from "../types";

export function ProjectsPage() {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const archiveProject = useArchiveProject();
  const deleteProject = useDeleteProject();
  const bulkArchive = useBulkArchiveProjects();
  const bulkDelete = useBulkDeleteProjects();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = projects.filter((project) => {
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesQuery =
        normalized === "" ||
        project.title.toLowerCase().includes(normalized) ||
        project.description?.toLowerCase().includes(normalized) ||
        project.notes?.toLowerCase().includes(normalized) ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });

    return sortByRecency(matches);
  }, [projects, query, statusFilter]);

  const toggleEditMode = () => {
    setEditMode((mode) => !mode);
    setSelected([]);
  };

  const isBulkBusy = bulkArchive.isPending || bulkDelete.isPending;

  const handleBulkArchive = () => {
    const count = selected.length;
    bulkArchive.mutate(selected, {
      onSuccess: () => {
        notify.success(`${count} project${count === 1 ? "" : "s"} archived`);
        setSelected([]);
        setEditMode(false);
      },
      onError: () => notify.error("Couldn't archive the selected projects."),
    });
  };

  const handleBulkDelete = async () => {
    const count = selected.length;
    await bulkDelete.mutateAsync(selected);
    notify.success(`${count} project${count === 1 ? "" : "s"} deleted`);
    setSelected([]);
    setEditMode(false);
  };

  return (
    <PageShell>
      <PageHeader
        title="Projects"
        titleClassName="mt-2 text-[44px]"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={toggleEditMode} disabled={projects.length === 0}>
              {editMode ? "Done" : "Edit"}
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Icon name="plus" size={17} />
              New project
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects…"
          variant="flat"
          className="w-full max-w-xs"
        />
        <ProjectStatusTabs value={statusFilter} onValueChange={setStatusFilter} />
      </div>

      {isError ? (
        <ErrorState
          title="Couldn't load projects"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div
          className="grid grid-cols-2 gap-4 board:grid-cols-4"
          aria-busy="true"
          aria-label="Loading projects"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organizing your work."
          action={<Button onClick={() => setCreateOpen(true)}>New project</Button>}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query || statusFilter} />
      ) : (
        <div className="grid grid-cols-2 gap-4 board:grid-cols-4">
          {filtered.map((project) => (
            <div key={project.id} className="relative">
              {editMode && (
                <div
                  className="absolute left-3 top-3 z-20"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Checkbox
                    checked={selected.includes(project.id)}
                    onCheckedChange={() =>
                      setSelected((current) =>
                        current.includes(project.id)
                          ? current.filter((id) => id !== project.id)
                          : [...current, project.id],
                      )
                    }
                    aria-label={`Select ${project.title}`}
                    className="bg-surface-card/90 shadow-resting"
                  />
                </div>
              )}
              <ProjectCard
                project={project}
                variant="full"
                onEdit={editMode ? undefined : setEditing}
                onArchive={
                  editMode
                    ? undefined
                    : (target) =>
                        archiveProject.mutate(target.id, {
                          onSuccess: () => notify.success(`"${target.title}" archived`),
                          onError: () => notify.error("Couldn't archive this project."),
                        })
                }
                onDelete={editMode ? undefined : setPendingDelete}
              />
            </div>
          ))}
        </div>
      )}

      <ProjectBulkEditBar
        selectedCount={selected.length}
        isBusy={isBulkBusy}
        onArchiveSelected={handleBulkArchive}
        onDeleteSelected={() => setBulkDeleteOpen(true)}
        onClearSelection={() => setSelected([])}
      />

      <ProjectCreateModal open={createOpen} onOpenChange={setCreateOpen} />

      {editing && (
        <ProjectEditModal
          open={editing !== null}
          onOpenChange={(open) => !open && setEditing(null)}
          project={editing}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete project?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" and its links to inspiration, notes, and resources will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete project"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteProject.mutateAsync(pendingDelete.id);
          notify.success(`"${pendingDelete.title}" deleted`);
        }}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selected.length} project${selected.length === 1 ? "" : "s"}?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        destructive
        onConfirm={handleBulkDelete}
      />
    </PageShell>
  );
}
