import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Icon } from "@/design-system/icons/Icon";
import { PinnableItem } from "@/components/shared/PinnableItem";
import { usePinned } from "@/context/PinnedContext";
import { notify } from "@/components/shared/Toast";
import type { Resource } from "@/types/entities";
import { useDeleteResource, useResources } from "../hooks/useResources";
import { ResourceCard } from "../components/ResourceCard";
import { ResourceCreateModal } from "../components/ResourceCreateModal";
import { EntityFilterPopover, type EntityFilterOption } from "@/components/shared/EntityFilterPopover";
import { ResourceBulkEditBar } from "../components/ResourceBulkEditBar";
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
  const deleteResource = useDeleteResource();
  const { pin } = usePinned();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceCategoryFilter>("all");
  const [sort, setSort] = useState<ResourceSort>("recent");
  const [createOpen, setCreateOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

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

  const toggleEditMode = () => {
    setEditMode((mode) => !mode);
    setSelected([]);
  };

  const toggleSelect = (resource: Resource) => {
    setSelected((current) =>
      current.includes(resource.id)
        ? current.filter((id) => id !== resource.id)
        : [...current, resource.id],
    );
  };

  const handleBulkDelete = async () => {
    const count = selected.length;
    try {
      await Promise.all(selected.map((id) => deleteResource.mutateAsync(id)));
      notify.success(`${count} resource${count === 1 ? "" : "s"} deleted`);
    } catch {
      notify.error("Couldn't delete one or more resources. Please try again.");
    }
    setSelected([]);
    setEditMode(false);
    setBulkDeleteOpen(false);
  };

  return (
    <PageShell>
      <PageHeader
        title="Resources"
        titleClassName="mt-3 text-[44px]"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={toggleEditMode} disabled={resources.length === 0}>
              {editMode ? "Done" : "Edit"}
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Icon name="plus" size={17} />
              New resource
            </Button>
          </div>
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
              {editMode && (
                <div className="absolute left-3 top-3 z-20" onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={selected.includes(resource.id)}
                    onCheckedChange={() => toggleSelect(resource)}
                    aria-label={`Select ${resource.title}`}
                    className="bg-surface-card/90 shadow-resting"
                  />
                </div>
              )}
              <PinnableItem entityType="resource" id={resource.id} disabled={editMode}>
                <ResourceCard
                  resource={resource}
                  editMode={editMode}
                  onSelectToggle={toggleSelect}
                  onPin={editMode ? undefined : (target) => pin({ entityType: "resource", id: target.id })}
                />
              </PinnableItem>
            </div>
          ))}
        </div>
      )}

      <ResourceBulkEditBar
        selectedCount={selected.length}
        onDeleteSelected={() => setBulkDeleteOpen(true)}
        onClearSelection={() => setSelected([])}
      />

      <ResourceCreateModal open={createOpen} onOpenChange={setCreateOpen} />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selected.length} resource${selected.length === 1 ? "" : "s"}?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleBulkDelete}
      />
    </PageShell>
  );
}
