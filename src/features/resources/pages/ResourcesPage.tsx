import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { Icon } from "@/design-system/icons/Icon";
import type { Resource } from "@/types/entities";
import { useResources } from "../hooks/useResources";
import { ResourceCard } from "../components/ResourceCard";
import { ResourceCreateModal } from "../components/ResourceCreateModal";
import { ResourceEditModal } from "../components/ResourceEditModal";

export function ResourcesPage() {
  const { data: resources = [] } = useResources();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized === "") return resources;
    return resources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(normalized) ||
        resource.description?.toLowerCase().includes(normalized) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(normalized)),
    );
  }, [resources, query]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Toolbox"
        title="Resources"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Icon name="plus" size={17} />
            New resource
          </Button>
        }
      />

      <SearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search resources…"
        className="w-full max-w-xs"
      />

      {resources.length === 0 ? (
        <EmptyState
          title="No resources yet"
          description="Save a useful link, repo, video, or file."
          action={<Button onClick={() => setCreateOpen(true)}>New resource</Button>}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query} />
      ) : (
        <div className="columns-1 gap-5 board:columns-2 [@media(min-width:1400px)]:columns-3">
          {filtered.map((resource) => (
            <div key={resource.id} className="mb-5 break-inside-avoid">
              <ResourceCard resource={resource} onEdit={setEditing} />
            </div>
          ))}
        </div>
      )}

      <ResourceCreateModal open={createOpen} onOpenChange={setCreateOpen} />
      {editing && (
        <ResourceEditModal
          open={editing !== null}
          onOpenChange={(open) => !open && setEditing(null)}
          resource={editing}
        />
      )}
    </div>
  );
}
