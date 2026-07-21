import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
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

export function NotesPage() {
  const { data: notes = [] } = useNotes();
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editorType, setEditorType] = useState<NoteType | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized === "") return notes;
    return notes.filter((note) => note.title.toLowerCase().includes(normalized));
  }, [notes, query]);

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
    <div className="flex flex-col gap-6">
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

      <SearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search notes…"
        className="w-full max-w-xs"
      />

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
    </div>
  );
}
