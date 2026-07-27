import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { Icon } from "@/design-system/icons/Icon";
import { PinnableItem } from "@/components/shared/PinnableItem";
import { usePinned } from "@/context/PinnedContext";
import { sortByRecency } from "@/lib/utils";
import { useArchiveProject, useProjects } from "../hooks/useProjects";
import { ProjectCard, ProjectCardSkeleton } from "../components/ProjectCard";
import { ProjectStatusTabs } from "../components/ProjectStatusTabs";
import { ProjectCreateModal } from "../components/ProjectCreateModal";
import { ProjectEditModal } from "../components/ProjectEditModal";
import type { Project, ProjectStatusFilter } from "../types";

export function ProjectsPage() {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects();
  const { pin } = usePinned();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  // "Delete" moves items to Archive (soft-delete) rather than removing them
  // outright — the Archive screen's own "Delete permanently" is the only
  // real hard-delete path (docs/FEATURES.md Archive section).
  const archiveProject = useArchiveProject();

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

  return (
    <PageShell>
      <PageHeader
        title="Projects"
        titleClassName="relative top-2 text-[40px]"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Icon name="plus" size={17} />
            New project
          </Button>
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
          title="How about creating a project right now?"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Icon name="plus" size={16} />
              New project
            </Button>
          }
          illustration={<EmptyStateIllustration variant="project" />}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query || statusFilter} />
      ) : (
        <div className="grid grid-cols-2 gap-4 board:grid-cols-4">
          {filtered.map((project) => (
            <div key={project.id} className="relative">
              <PinnableItem entityType="project" id={project.id}>
                <ProjectCard
                  project={project}
                  variant="full"
                  onEdit={setEditing}
                  onPin={(target) => pin({ entityType: "project", id: target.id })}
                  onDelete={setPendingDelete}
                />
              </PinnableItem>
            </div>
          ))}
        </div>
      )}

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
            ? `"${pendingDelete.title}" will be moved to Archive and permanently deleted in 7 days.`
            : undefined
        }
        confirmLabel="Delete project"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          if (!pendingDelete) return;
          await archiveProject.mutateAsync(pendingDelete.id);
          notify.success(`"${pendingDelete.title}" moved to Archive`);
        }}
      />
    </PageShell>
  );
}
