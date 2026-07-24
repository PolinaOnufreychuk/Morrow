import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { Icon } from "@/design-system/icons/Icon";
import { PinnableItem } from "@/components/shared/PinnableItem";
import { usePinned } from "@/context/PinnedContext";
import type { Note, NoteType } from "@/types/entities";
import { useArchiveNote, useNotes } from "../hooks/useNotes";
import { NoteCard } from "../components/NoteCard";
import { NoteTypePickerModal } from "../components/NoteTypePickerModal";
import { NoteEditorModal } from "../components/NoteEditorModal";
import { NoteTypeIcon } from "../components/NoteTypeIcon";
import { EntityFilterPopover, type EntityFilterOption } from "@/components/shared/EntityFilterPopover";
import { NOTE_TYPE_META, NOTE_TYPE_ORDER } from "../noteTypeMeta";
import type { NoteSort } from "../types";

const TYPE_OPTIONS: EntityFilterOption[] = [
  { value: "all", label: "All" },
  ...NOTE_TYPE_ORDER.map((type) => ({
    value: type,
    label: NOTE_TYPE_META[type].label,
    icon: <NoteTypeIcon type={type} size={16} />,
  })),
];

const SORT_OPTIONS: { value: NoteSort; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "created", label: "Recently added" },
  { value: "title", label: "Alphabetical" },
];

export function NotesPage() {
  const { data: notes = [] } = useNotes();
  // "Delete" moves the note to Archive (soft-delete); the Archive screen's
  // own "Delete permanently" is the only real hard-delete path.
  const archiveNote = useArchiveNote();
  const { pin } = usePinned();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<NoteType | "all">("all");
  const [sort, setSort] = useState<NoteSort>("recent");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editorType, setEditorType] = useState<NoteType | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = notes.filter(
      (note) =>
        (normalized === "" || note.title.toLowerCase().includes(normalized)) &&
        (type === "all" || note.type === type),
    );
    return [...matches].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "created") return b.createdAt.localeCompare(a.createdAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [notes, query, type, sort]);

  const openEditorFor = (type: NoteType) => {
    setPickerOpen(false);
    setEditingNote(null);
    setEditorType(type);
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setEditorType(note.type);
  };

  // Lets the sidebar's pinned Note deep-link into this page's editor modal
  // (the modal's open/closed state is otherwise page-local).
  useEffect(() => {
    const openId = searchParams.get("open");
    if (!openId) return;
    const note = notes.find((candidate) => candidate.id === openId);
    if (note) editNote(note);
    setSearchParams(
      (params) => {
        params.delete("open");
        return params;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, notes]);

  return (
    <PageShell>
      <PageHeader
        title="Notes"
        titleClassName="mt-3 text-[44px]"
        actions={
          <Button onClick={() => setPickerOpen(true)}>
            <Icon name="plus" size={17} />
            New note
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notes…"
          variant="flat"
          className="flex-1"
        />
        <EntityFilterPopover
          isActive={type !== "all" || sort !== "recent"}
          onClear={() => {
            setType("all");
            setSort("recent");
          }}
          sections={[
            {
              eyebrow: "Note type",
              options: TYPE_OPTIONS,
              selected: type,
              onChange: (value) => setType(value as NoteType | "all"),
            },
            {
              eyebrow: "Sort by",
              options: SORT_OPTIONS,
              selected: sort,
              onChange: (value) => setSort(value as NoteSort),
            },
          ]}
        />
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title="How about capturing a thought right now?"
          action={
            <Button onClick={() => setPickerOpen(true)}>
              <Icon name="plus" size={16} />
              New note
            </Button>
          }
          illustration={<EmptyStateIllustration variant="note" />}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query} />
      ) : (
        <div className="masonry4">
          {filtered.map((note) => (
            <div key={note.id} className="masonry-item">
              <PinnableItem entityType="note" id={note.id}>
                <NoteCard
                  note={note}
                  onEdit={editNote}
                  onPin={(target) => pin({ entityType: "note", id: target.id })}
                  onDelete={setPendingDelete}
                />
              </PinnableItem>
            </div>
          ))}
        </div>
      )}

      <NoteTypePickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelectType={openEditorFor}
      />

      {editorType && (
        <NoteEditorModal
          open={editorType !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditorType(null);
              setEditingNote(null);
            }
          }}
          note={editingNote ?? undefined}
          type={editorType}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete note?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be moved to Archive and permanently deleted in 7 days.`
            : undefined
        }
        confirmLabel="Delete note"
        destructive
        onConfirm={() => {
          if (!pendingDelete) return;
          const target = pendingDelete;
          archiveNote.mutate(target.id, {
            onSuccess: () => notify.success(`"${target.title}" moved to Archive`),
            onError: () => notify.error("Couldn't delete this note."),
          });
          setPendingDelete(null);
        }}
      />
    </PageShell>
  );
}
