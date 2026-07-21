import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortSelect } from "@/components/shared/SortSelect";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Icon } from "@/design-system/icons/Icon";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectStatusTabs } from "../components/ProjectStatusTabs";
import { ProjectCreateModal } from "../components/ProjectCreateModal";
import { ProjectBulkEditBar } from "../components/ProjectBulkEditBar";
import type { Project, ProjectSort, ProjectStatusFilter } from "../types";

const SORT_OPTIONS: { value: ProjectSort; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "deadline", label: "Deadline" },
  { value: "title", label: "Title" },
];

export function ProjectsPage() {
  const { data: projects = [] } = useProjects();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [sort, setSort] = useState<ProjectSort>("recent");
  const [createOpen, setCreateOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

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

    return [...matches].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [projects, query, statusFilter, sort]);

  const toggleEditMode = () => {
    setEditMode((mode) => !mode);
    setSelected([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={toggleEditMode}>
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
        <ProjectStatusTabs value={statusFilter} onValueChange={setStatusFilter} />
        <div className="flex items-center gap-2">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects…"
            className="w-full max-w-xs"
          />
          <SortSelect options={SORT_OPTIONS} value={sort} onValueChange={setSort} className="h-11 w-[168px]" />
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organizing your work."
          action={<Button onClick={() => setCreateOpen(true)}>New project</Button>}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query || statusFilter} />
      ) : (
        <div className="masonry3">
          {filtered.map((project) => (
            <div key={project.id} className="masonry-item relative">
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
                onDelete={editMode ? undefined : setPendingDelete}
              />
            </div>
          ))}
        </div>
      )}

      <ProjectBulkEditBar
        selectedCount={selected.length}
        onArchiveSelected={() => setSelected([])}
        onClearSelection={() => setSelected([])}
      />

      <ProjectCreateModal open={createOpen} onOpenChange={setCreateOpen} />

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
        destructive
        onConfirm={() => {
          // TODO: wire to useDeleteProject()
        }}
      />
    </div>
  );
}
