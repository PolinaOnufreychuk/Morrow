import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateNote } from "../hooks/useNotes";

export interface NoteQuickCreateFormProps {
  projectId: string;
  onCreated: () => void;
}

/**
 * Inline "create new note, pre-linked to this project" form for the
 * project-details Link-or-Create modal. Always creates a simple Text note —
 * the full 10-type picker lives on the Notes page itself, not nested here.
 */
export function NoteQuickCreateForm({ projectId, onCreated }: NoteQuickCreateFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const createNote = useCreateNote();

  const handleSubmit = () => {
    if (!title.trim()) return;
    createNote.mutate(
      { type: "text", title: title.trim(), body: body.trim(), projectId },
      { onSuccess: onCreated },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-quick-title" className="eyebrow text-text-tertiary">
          Title
        </label>
        <Input
          id="note-quick-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note title"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note-quick-body" className="eyebrow text-text-tertiary">
          Note
        </label>
        <Textarea
          id="note-quick-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write something…"
        />
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!title.trim() || createNote.isPending}
        className="self-end"
      >
        Create note
      </Button>
    </div>
  );
}
