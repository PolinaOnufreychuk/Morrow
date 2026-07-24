import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
import { FormField } from "@/components/shared/FormField";
import { ModalSection } from "@/components/shared/ModalSection";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { useCreateBoard } from "../hooks/useInspiration";
import { INSPIRATION_CATEGORY_OPTIONS as CATEGORY_OPTIONS } from "../types";

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
    <div className="flex flex-col gap-6">
      <ModalSection tone="primary">
        <FormField htmlFor="board-quick-title" label="Title">
          <Input
            id="board-quick-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Morning color studies"
          />
        </FormField>

        <FormField htmlFor="board-quick-notes" label="Description" optional>
          <Textarea
            id="board-quick-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="What's this collection about?"
          />
        </FormField>
      </ModalSection>

      <ModalSection tone="secondary">
        <PropertyDropdown label="Category" options={CATEGORY_SELECT_OPTIONS} value={category} onValueChange={setCategory} />

        <FormField label="Cover image" optional>
          <ImageDropzone
            value={coverImageUrl || null}
            onChange={(url) => setCoverImageUrl(url ?? "")}
            onUpload={(file) => uploadCoverImage("inspiration-board", file)}
          />
        </FormField>
      </ModalSection>

      <Button
        type="button"
        size="lg"
        fullWidth
        onClick={handleSubmit}
        disabled={!title.trim() || createBoard.isPending}
      >
        Save collection
      </Button>
    </div>
  );
}
