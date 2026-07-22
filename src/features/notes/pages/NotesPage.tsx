import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { Icon } from "@/design-system/icons/Icon";
import type { Note, NoteType } from "@/types/entities";
import { useArchiveNote, useNotes } from "../hooks/useNotes";
import { NoteCard } from "../components/NoteCard";
import { NoteTypePickerModal } from "../components/NoteTypePickerModal";
import { NoteEditorModal } from "../components/NoteEditorModal";
import { NotesFilterPopover } from "../components/NotesFilterPopover";
import { NOTE_TYPE_META, NOTE_TYPE_ORDER } from "../noteTypeMeta";
import type { NoteSort } from "../types";

const TYPE_OPTIONS: { value: NoteType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...NOTE_TYPE_ORDER.map((type) => ({ value: type, label: NOTE_TYPE_META[type].label })),
];

const SORT_OPTIONS: { value: NoteSort; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "created", label: "Recently added" },
  { value: "title", label: "Alphabetical" },
];

export function NotesPage() {
  const { data: notes = [] } = useNotes();
  const archiveNote = useArchiveNote();
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

  return (
    <PageShell>
      <PageHeader
        title="Notes"
        titleClassName="text-[44px]"
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
        <NotesFilterPopover
          categories={TYPE_OPTIONS}
          category={type}
          onCategoryChange={setType}
          sortOptions={SORT_OPTIONS}
          sort={sort}
          onSortChange={setSort}
          onClear={() => {
            setType("all");
            setSort("recent");
          }}
        />
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Capture a thought, a checklist, or a snippet of code."
          action={<Button onClick={() => setPickerOpen(true)}>New note</Button>}
        />
      ) : filtered.length === 0 ? (
        <NoSearchResultsState query={query} />
      ) : (
        <div className="masonry4">
          {filtered.map((note) => (
            <div key={note.id} className="masonry-item">
              <NoteCard
                note={note}
                onEdit={editNote}
                onArchive={(target) =>
                  archiveNote.mutate(target.id, {
                    onSuccess: () => notify.success(`"${target.title}" archived`),
                    onError: () => notify.error("Couldn't archive this note."),
                  })
                }
                onDelete={setPendingDelete}
              />
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
        description={pendingDelete ? `"${pendingDelete.title}" will be permanently removed.` : undefined}
        confirmLabel="Delete note"
        destructive
        onConfirm={() => {
          // TODO: wire to useDeleteNote()
        }}
      />
    </PageShell>
  );
}
