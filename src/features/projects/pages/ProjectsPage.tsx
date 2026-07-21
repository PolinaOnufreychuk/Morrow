import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { Icon } from "@/design-system/icons/Icon";
import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectStatusTabs } from "../components/ProjectStatusTabs";
import { ProjectCreateModal } from "../components/ProjectCreateModal";
import type { ProjectStatusFilter } from "../types";

export function ProjectsPage() {
  const { data: projects = [] } = useProjects();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      const matchesQuery =
        normalized === "" ||
        project.title.toLowerCase().includes(normalized) ||
        project.description?.toLowerCase().includes(normalized) ||
        project.notes?.toLowerCase().includes(normalized) ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalized));
      return matchesStatus && matchesQuery;
    });
  }, [projects, query, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Icon name="plus" size={17} />
            New project
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProjectStatusTabs value={statusFilter} onValueChange={setStatusFilter} />
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects…"
          className="w-full max-w-xs"
        />
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
        <div className="grid grid-cols-1 gap-5 board:grid-cols-2 [@media(min-width:1400px)]:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} variant="full" />
          ))}
        </div>
      )}

      <ProjectCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
