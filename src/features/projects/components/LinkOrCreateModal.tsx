import { useState, type ReactNode } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { SegmentedTabs } from "@/components/shared/SegmentedTabs";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";

type Mode = "link" | "create";

export interface LinkOrCreateModalProps<T extends { id: string; title: string; projectId: string | null }> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  entityLabel: string;
  /** Full, unfiltered list of this entity type — filtered internally to items not already on this project. */
  items: T[];
  projectId: string;
  onLinkExisting: (item: T) => void;
  isLinking?: boolean;
  renderItemMeta?: (item: T) => ReactNode;
  renderCreateForm: (args: { onCreated: () => void }) => ReactNode;
}

/**
 * One generic "link existing / create new" modal, parametrized by entity
 * type — used for Inspiration boards, Notes, and Resources on the Project
 * Details page. Only the list-item meta and the create-form body differ per
 * caller; the two-path shell is identical.
 */
export function LinkOrCreateModal<T extends { id: string; title: string; projectId: string | null }>({
  open,
  onOpenChange,
  title,
  entityLabel,
  items,
  projectId,
  onLinkExisting,
  isLinking = false,
  renderItemMeta,
  renderCreateForm,
}: LinkOrCreateModalProps<T>) {
  const [mode, setMode] = useState<Mode>("link");
  const [query, setQuery] = useState("");

  const linkable = items.filter((item) => item.projectId !== projectId);
  const filtered =
    query.trim().length === 0
      ? linkable
      : linkable.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()));

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setMode("link");
      setQuery("");
    }
    onOpenChange(next);
  };

  return (
    <ModalShell open={open} onOpenChange={handleOpenChange} title={title}>
      <div className="flex flex-col gap-4">
        <SegmentedTabs
          options={[
            { value: "link", label: "Link existing" },
            { value: "create", label: "Create new" },
          ]}
          value={mode}
          onValueChange={setMode}
        />

        {mode === "link" ? (
          <div className="flex flex-col gap-3">
            <SearchInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${entityLabel}s…`}
            />
            <div className="flex max-h-[320px] flex-col gap-1.5 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-1 py-6 text-center text-[13px] text-text-tertiary">
                  No {entityLabel}s to link.
                </p>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-chip border border-border-subtle px-3 py-2.5"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-[14px] font-medium text-text-primary">
                        {item.title}
                      </span>
                      {item.projectId && (
                        <span className="text-[12px] text-blush-600">
                          Currently linked to another project — linking will move it here
                        </span>
                      )}
                      {renderItemMeta?.(item)}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isLinking}
                      onClick={() => onLinkExisting(item)}
                    >
                      Link
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          renderCreateForm({ onCreated: () => handleOpenChange(false) })
        )}
      </div>
    </ModalShell>
  );
}
