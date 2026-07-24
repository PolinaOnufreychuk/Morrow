import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Icon } from "@/design-system/icons/Icon";
import { PinnableItem } from "@/components/shared/PinnableItem";
import { usePinned } from "@/context/PinnedContext";
import { notify } from "@/components/shared/Toast";
import type { Resource } from "@/types/entities";
import { useArchiveResource, useResources } from "../hooks/useResources";
import { ResourceCard } from "../components/ResourceCard";
import { ResourceCreateModal } from "../components/ResourceCreateModal";
import { EntityFilterPopover, type EntityFilterOption } from "@/components/shared/EntityFilterPopover";
import { RESOURCE_CATEGORY_OPTIONS, type ResourceCategoryFilter, type ResourceSort } from "../types";

const CATEGORY_OPTIONS: EntityFilterOption[] = [
  { value: "all", label: "All" },
  ...RESOURCE_CATEGORY_OPTIONS.map((option) => ({ value: option, label: option })),
];

const SORT_OPTIONS: EntityFilterOption[] = [
  { value: "recent", label: "Recently updated" },
  { value: "created", label: "Recently added" },
  { value: "title", label: "Title" },
];

export function ResourcesPage() {
  const { data: resources = [] } = useResources();
  // "Delete" moves the resource to Archive (soft-delete); the Archive
  // screen's own "Delete permanently" is the only real hard-delete path.
  const archiveResource = useArchiveResource();
  const { pin } = usePinned();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceCategoryFilter>("all");
  const [sort, setSort] = useState<ResourceSort>("recent");
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Resource | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = resources.filter((resource) => {
      const matchesCategory = category === "all" || resource.tags.includes(category);
      const matchesQuery =
        normalized === "" ||
        resource.title.toLowerCase().includes(normalized) ||
        resource.description?.toLowerCase().includes(normalized) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(normalized));
      return matchesCategory && matchesQuery;
    });
    return [...matches].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "created") return b.createdAt.localeCompare(a.createdAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [resources, query, category, sort]);

  return (
    <PageShell>
      <PageHeader
        title="Resources"
        titleClassName="mt-3 text-[44px]"
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
          variant="flat"
          className="flex-1"
        />
        <EntityFilterPopover
          isActive={category !== "all" || sort !== "recent"}
          onClear={() => {
            setCategory("all");
            setSort("recent");
          }}
          sections={[
            {
              eyebrow: "Category",
              options: CATEGORY_OPTIONS,
              selected: category,
              onChange: (value) => setCategory(value as ResourceCategoryFilter),
            },
            {
              eyebrow: "Sort by",
              options: SORT_OPTIONS,
              selected: sort,
              onChange: (value) => setSort(value as ResourceSort),
            },
          ]}
        />
      </div>

      {resources.length === 0 ? (
        <EmptyState
          title="How about saving a resource right now?"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Icon name="plus" size={16} />
              New resource
            </Button>
          }
          illustration={<EmptyStateIllustration variant="resource" />}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query || category} />
      ) : (
        <div className="masonry4">
          {filtered.map((resource) => (
            <div key={resource.id} className="masonry-item relative">
              <PinnableItem entityType="resource" id={resource.id}>
                <ResourceCard
                  resource={resource}
                  onPin={(target) => pin({ entityType: "resource", id: target.id })}
                  onDelete={setPendingDelete}
                />
              </PinnableItem>
            </div>
          ))}
        </div>
      )}

      <ResourceCreateModal open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete resource?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be moved to Archive and permanently deleted in 7 days.`
            : undefined
        }
        confirmLabel="Delete resource"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          if (!pendingDelete) return;
          await archiveResource.mutateAsync(pendingDelete.id);
          notify.success(`"${pendingDelete.title}" moved to Archive`);
        }}
      />
    </PageShell>
  );
}
