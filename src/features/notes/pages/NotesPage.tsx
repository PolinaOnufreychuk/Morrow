import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageShell } from "@/components/shared/PageShell";
import { SearchInput } from "@/components/shared/SearchInput";
import { SortSelect } from "@/components/shared/SortSelect";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { NoSearchResultsState } from "@/components/shared/NoSearchResultsState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Icon } from "@/design-system/icons/Icon";
import type { Note, NoteType } from "@/types/entities";
import { useNotes } from "../hooks/useNotes";
import { NoteCard } from "../components/NoteCard";
import { NoteTypePickerModal } from "../components/NoteTypePickerModal";
import { NoteEditorModal } from "../components/NoteEditorModal";
import type { NoteSort } from "../types";

const SORT_OPTIONS: { value: NoteSort; label: string }[] = [
  { value: "recent", label: "Recently updated" },
  { value: "title", label: "Title" },
];

export function NotesPage() {
  const { data: notes = [] } = useNotes();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<NoteSort>("recent");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editorType, setEditorType] = useState<NoteType | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matches = notes.filter(
      (note) => normalized === "" || note.title.toLowerCase().includes(normalized),
    );
    return [...matches].sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : b.updatedAt.localeCompare(a.updatedAt),
    );
  }, [notes, query, sort]);

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
        eyebrow="Thinking space"
        title="Notes"
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
          className="w-full max-w-xs"
        />
        <SortSelect options={SORT_OPTIONS} value={sort} onValueChange={setSort} className="h-11 w-[168px]" />
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
        <div className="masonry3">
          {filtered.map((note) => (
            <div key={note.id} className="masonry-item">
              <NoteCard note={note} onEdit={editNote} onDelete={setPendingDelete} />
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
