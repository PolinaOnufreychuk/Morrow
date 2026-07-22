import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { useCreateBoard } from "../hooks/useInspiration";

const CATEGORY_SELECT_OPTIONS = CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

export interface BoardQuickCreateFormProps {
  projectId: string;
  onCreated: () => void;
}

/** Inline "create new board, pre-linked to this project" form for the project-details Link-or-Create modal. */
export function BoardQuickCreateForm({ projectId, onCreated }: BoardQuickCreateFormProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>(CATEGORY_OPTIONS[0]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const createBoard = useCreateBoard();

  const handleSubmit = () => {
    if (!title.trim()) return;
    createBoard.mutate(
      {
        title: title.trim(),
        notes: notes.trim() || null,
        tags: [category],
        coverImageUrl: coverImageUrl.trim() || null,
        projectId,
      },
      { onSuccess: onCreated },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="board-quick-title" className="eyebrow text-text-tertiary">
          Title
        </label>
        <Input
          id="board-quick-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Morning color studies"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="board-quick-notes" className="eyebrow text-text-tertiary">
          Description
        </label>
        <Textarea
          id="board-quick-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="What's this collection about?"
        />
      </div>

      <PropertyDropdown
        label="Category"
        options={CATEGORY_SELECT_OPTIONS}
        value={category}
        onValueChange={setCategory}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="board-quick-cover" className="eyebrow text-text-tertiary">
          Cover image URL
        </label>
        <Input
          id="board-quick-cover"
          type="url"
          value={coverImageUrl}
          onChange={(event) => setCoverImageUrl(event.target.value)}
          placeholder="https://…"
        />
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!title.trim() || createBoard.isPending}
        className="self-end"
      >
        Save collection
      </Button>
    </div>
  );
}
