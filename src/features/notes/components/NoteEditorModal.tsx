import { useState, type FormEvent } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/FormField";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
import { notify } from "@/components/shared/Toast";
import { useConfirmDiscard } from "@/hooks/useConfirmDiscard";
import { uploadCoverImage } from "@/lib/supabase/storage";
import type { ChecklistItem, Note, NoteType } from "@/types/entities";
import { NOTE_TYPE_META } from "../noteTypeMeta";
import { NoteValidationError } from "../types";
import { useCreateNote, useUpdateNote } from "../hooks/useNotes";
import { ChecklistItemsField } from "./fields/ChecklistItemsField";

export interface NoteEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Editing an existing note, or creating a new one of this type. */
  note?: Note;
  type: NoteType;
  /** Projects to pre-link a newly created note to (e.g. when opened from a
   * project's detail page). Ignored when editing an existing note. */
  initialProjectIds?: string[];
}

const FORM_ID = "note-editor-form";

/** Routes to the right type-specific field set and wires the form to real
 * create/update mutations. Local `useState` per field (rather than a single
 * typed object) keeps each control trivially controlled regardless of which
 * of the 5 discriminated note variants is active. */
export function NoteEditorModal({ open, onOpenChange, note, type, initialProjectIds }: NoteEditorModalProps) {
  const meta = NOTE_TYPE_META[type];
  const isEditing = Boolean(note);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const isPending = createNote.isPending || updateNote.isPending;
  const [submitError, setSubmitError] = useState<string | null>(null);
  // No react-hook-form here (see file header comment), so dirtiness is
  // tracked manually — any field change flips this once, for the lifetime
  // of the modal instance.
  const [isDirty, setIsDirty] = useState(false);
  const markDirty = () => setIsDirty(true);

  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.type === "text" ? note.body : "");
  const [items, setItems] = useState<ChecklistItem[]>(
    note?.type === "checklist" ? note.items : [{ text: "", done: false }],
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    note?.type === "image" ? note.coverImageUrl : null,
  );
  const [quote, setQuote] = useState(note?.type === "quote" ? note.quote : "");
  const [author, setAuthor] = useState(note?.type === "quote" ? (note.author ?? "") : "");
  const [filename, setFilename] = useState(note?.type === "pdf" ? note.filename : "");
  const [pageCount, setPageCount] = useState(
    note?.type === "pdf" && note.pageCount != null ? String(note.pageCount) : "",
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setSubmitError("Title is required.");
      return;
    }

    const projectIds = note?.projectIds ?? initialProjectIds ?? [];
    const base = { title: trimmedTitle, projectIds };
    let payload: Record<string, unknown>;

    switch (type) {
      case "text":
        payload = { type, ...base, body };
        break;
      case "checklist":
        payload = { type, ...base, items: items.filter((item) => item.text.trim().length > 0) };
        break;
      case "image":
        payload = { type, ...base, coverImageUrl: coverImageUrl ?? "" };
        break;
      case "quote":
        payload = { type, ...base, quote, author: author.trim() || null };
        break;
      case "pdf":
        payload = {
          type,
          ...base,
          filename,
          pageCount: pageCount.trim() ? Number(pageCount) : null,
        };
        break;
    }

    const onError = (error: unknown) => {
      setSubmitError(
        error instanceof NoteValidationError ? error.message : "Couldn't save the note. Please try again.",
      );
    };

    if (isEditing && note) {
      updateNote.mutate(
        { id: note.id, ...payload } as Parameters<typeof updateNote.mutate>[0],
        {
          onSuccess: () => {
            notify.success("Note saved");
            onOpenChange(false);
          },
          onError,
        },
      );
    } else {
      createNote.mutate(payload, {
        onSuccess: () => {
          notify.success("Note created");
          onOpenChange(false);
        },
        onError,
      });
    }
  };

  const { guardedOnOpenChange, discardDialog } = useConfirmDiscard(isDirty, (next) => {
    if (isPending) return;
    setSubmitError(null);
    onOpenChange(next);
  });

  return (
    <>
    <ModalShell
      open={open}
      onOpenChange={guardedOnOpenChange}
      title={isEditing ? `Edit ${meta.label.toLowerCase()} note` : `New ${meta.label.toLowerCase()} note`}
      footerAlign="stretch"
      footer={
        <Button size="lg" fullWidth type="submit" form={FORM_ID} disabled={isPending} aria-busy={isPending}>
          {isPending ? "Saving…" : isEditing ? "Save changes" : "Create note"}
        </Button>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FormField htmlFor="note-title" label="Title" error={submitError ?? undefined}>
          <Input
            id="note-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              markDirty();
            }}
            placeholder="Note title"
          />
        </FormField>

        {type === "text" && (
          <FormField htmlFor="note-body" label="Body">
            <Textarea
              id="note-body"
              value={body}
              onChange={(event) => {
                setBody(event.target.value);
                markDirty();
              }}
              placeholder="Write something…"
            />
          </FormField>
        )}

        {type === "checklist" && (
          <FormField label="Items">
            <ChecklistItemsField
              value={items}
              onChange={(value) => {
                setItems(value);
                markDirty();
              }}
            />
          </FormField>
        )}

        {type === "image" && (
          <FormField label="Image">
            <ImageDropzone
              value={coverImageUrl}
              onChange={(value) => {
                setCoverImageUrl(value);
                markDirty();
              }}
              onUpload={(file) => uploadCoverImage("note", file)}
            />
          </FormField>
        )}

        {type === "quote" && (
          <>
            <FormField htmlFor="note-quote" label="Quote">
              <Textarea
                id="note-quote"
                value={quote}
                onChange={(event) => {
                  setQuote(event.target.value);
                  markDirty();
                }}
                placeholder="Write the quote…"
              />
            </FormField>
            <FormField htmlFor="note-author" label="Author" optional>
              <Input
                id="note-author"
                value={author}
                onChange={(event) => {
                  setAuthor(event.target.value);
                  markDirty();
                }}
                placeholder="Who said it?"
              />
            </FormField>
          </>
        )}

        {type === "pdf" && (
          <>
            <FormField htmlFor="note-filename" label="Filename">
              <Input
                id="note-filename"
                value={filename}
                onChange={(event) => {
                  setFilename(event.target.value);
                  markDirty();
                }}
                placeholder="document.pdf"
              />
            </FormField>
            <FormField htmlFor="note-page-count" label="Page count" optional>
              <Input
                id="note-page-count"
                type="number"
                min={1}
                value={pageCount}
                onChange={(event) => {
                  setPageCount(event.target.value);
                  markDirty();
                }}
                placeholder="e.g. 12"
              />
            </FormField>
          </>
        )}
      </form>
    </ModalShell>
    {discardDialog}
    </>
  );
}
