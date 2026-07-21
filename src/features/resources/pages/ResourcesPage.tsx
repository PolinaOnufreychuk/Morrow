import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortSelect } from "@/components/shared/SortSelect";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Icon } from "@/design-system/icons/Icon";
import { notify } from "@/components/shared/Toast";
import type { Resource } from "@/types/entities";
import { useResources } from "../hooks/useResources";
import { ResourceCard } from "../components/ResourceCard";
import { ResourceCreateModal } from "../components/ResourceCreateModal";
import { ResourceEditModal } from "../components/ResourceEditModal";
import type { ResourceSort } from "../types";

const SORT_OPTIONS: { value: ResourceSort; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "title", label: "Title" },
];

export function ResourcesPage() {
  const { data: resources = [] } = useResources();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ResourceSort>("recent");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Resource | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = resources.filter(
      (resource) =>
        normalized === "" ||
        resource.title.toLowerCase().includes(normalized) ||
        resource.description?.toLowerCase().includes(normalized) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(normalized)),
    );
    return [...matches].sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : b.updatedAt.localeCompare(a.updatedAt),
    );
  }, [resources, query, sort]);

  const confirmDelete = () => {
    // TODO: wire to useDeleteResource() — undo would re-insert via cache restore.
    notify.info(`"${pendingDelete?.title}" deleted`, "Undo isn't wired yet in this static build.");
  };

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

      <div className="flex items-center gap-2">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search resources…"
          className="w-full max-w-xs"
        />
        <SortSelect options={SORT_OPTIONS} value={sort} onValueChange={setSort} className="h-11 w-[168px]" />
      </div>

      {resources.length === 0 ? (
        <EmptyState
          title="No resources yet"
          description="Save a useful link, repo, video, or file."
          action={<Button onClick={() => setCreateOpen(true)}>New resource</Button>}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query} />
      ) : (
        <div className="masonry3">
          {filtered.map((resource) => (
            <div key={resource.id} className="masonry-item">
              <ResourceCard resource={resource} onEdit={setEditing} onDelete={setPendingDelete} />
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

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete resource?"
        description={pendingDelete ? `"${pendingDelete.title}" will be removed from Resources.` : undefined}
        confirmLabel="Delete resource"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
