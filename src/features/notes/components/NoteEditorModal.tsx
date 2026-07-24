import { useState, type FormEvent } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/FormField";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
import { notify } from "@/components/shared/Toast";
import { uploadCoverImage } from "@/lib/supabase/storage";
import type { ChecklistItem, MeetingAttendee, Note, NoteType } from "@/types/entities";
import { NOTE_TYPE_META } from "../noteTypeMeta";
import { NoteValidationError } from "../types";
import { useCreateNote, useUpdateNote } from "../hooks/useNotes";
import { ChecklistItemsField } from "./fields/ChecklistItemsField";
import { StringListField } from "./fields/StringListField";

export interface NoteEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Editing an existing note, or creating a new one of this type. */
  note?: Note;
  type: NoteType;
}

const FORM_ID = "note-editor-form";
const EMPTY_MOODBOARD: [string | null, string | null, string | null, string | null] = [
  null,
  null,
  null,
  null,
];

/** Routes to the right type-specific field set and wires the form to real
 * create/update mutations. Local `useState` per field (rather than a single
 * typed object) keeps each control trivially controlled regardless of which
 * of the 10 discriminated note variants is active. */
export function NoteEditorModal({ open, onOpenChange, note, type }: NoteEditorModalProps) {
  const meta = NOTE_TYPE_META[type];
  const isEditing = Boolean(note);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const isPending = createNote.isPending || updateNote.isPending;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [title, setTitle] = useState(note?.title ?? "");
  const [body, setBody] = useState(note?.type === "text" ? note.body : "");
  const [items, setItems] = useState<ChecklistItem[]>(
    note?.type === "checklist" ? note.items : [{ text: "", done: false }],
  );
  const [url, setUrl] = useState(note?.type === "bookmark" ? note.url : "");
  const [snippet, setSnippet] = useState(note?.type === "bookmark" ? (note.snippet ?? "") : "");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    note?.type === "image" ? note.coverImageUrl : null,
  );
  const [images, setImages] = useState<[string | null, string | null, string | null, string | null]>(
    note?.type === "moodboard" ? note.images : EMPTY_MOODBOARD,
  );
  const [language, setLanguage] = useState(note?.type === "code" ? note.language : "");
  const [code, setCode] = useState(note?.type === "code" ? note.code : "");
  const [quote, setQuote] = useState(note?.type === "quote" ? note.quote : "");
  const [author, setAuthor] = useState(note?.type === "quote" ? (note.author ?? "") : "");
  const [ingredients, setIngredients] = useState<string[]>(
    note?.type === "recipe" ? note.ingredients : [""],
  );
  const [filename, setFilename] = useState(note?.type === "pdf" ? note.filename : "");
  const [pageCount, setPageCount] = useState(
    note?.type === "pdf" && note.pageCount != null ? String(note.pageCount) : "",
  );
  const [attendeeNames, setAttendeeNames] = useState<string[]>(
    note?.type === "meeting" ? note.attendees.map((attendee) => attendee.name) : [""],
  );
  const [agenda, setAgenda] = useState<string[]>(note?.type === "meeting" ? note.agenda : [""]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setSubmitError("Title is required.");
      return;
    }
    if (type === "moodboard" && images.some((image) => !image)) {
      setSubmitError("Add all four images.");
      return;
    }

    const projectId = note?.projectId ?? null;
    const base = { title: trimmedTitle, projectId };
    let payload: Record<string, unknown>;

    switch (type) {
      case "text":
        payload = { type, ...base, body };
        break;
      case "checklist":
        payload = { type, ...base, items: items.filter((item) => item.text.trim().length > 0) };
        break;
      case "bookmark":
        payload = {
          type,
          ...base,
          url,
          faviconUrl: null,
          domain: null,
          snippet: snippet.trim() || null,
        };
        break;
      case "image":
        payload = { type, ...base, coverImageUrl: coverImageUrl ?? "" };
        break;
      case "moodboard":
        payload = { type, ...base, images };
        break;
      case "code":
        payload = { type, ...base, language, code };
        break;
      case "quote":
        payload = { type, ...base, quote, author: author.trim() || null };
        break;
      case "recipe":
        payload = {
          type,
          ...base,
          ingredients: ingredients.map((item) => item.trim()).filter(Boolean),
        };
        break;
      case "pdf":
        payload = {
          type,
          ...base,
          filename,
          pageCount: pageCount.trim() ? Number(pageCount) : null,
        };
        break;
      case "meeting": {
        const attendees: MeetingAttendee[] = attendeeNames
          .map((name) => name.trim())
          .filter(Boolean)
          .map((name) => ({ name, avatarUrl: null }));
        payload = {
          type,
          ...base,
          attendees,
          agenda: agenda.map((item) => item.trim()).filter(Boolean),
        };
        break;
      }
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

  const updateImageAt = (index: number, value: string | null) => {
    setImages((current) => {
      const next = [...current] as typeof current;
      next[index] = value;
      return next;
    });
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        setSubmitError(null);
        onOpenChange(next);
      }}
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
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Note title"
          />
        </FormField>

        {type === "text" && (
          <FormField htmlFor="note-body" label="Body">
            <Textarea
              id="note-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write something…"
            />
          </FormField>
        )}

        {type === "checklist" && (
          <FormField label="Items">
            <ChecklistItemsField value={items} onChange={setItems} />
          </FormField>
        )}

        {type === "bookmark" && (
          <>
            <FormField htmlFor="note-url" label="URL">
              <Input
                id="note-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://…"
              />
            </FormField>
            <FormField htmlFor="note-snippet" label="Snippet" optional>
              <Textarea
                id="note-snippet"
                value={snippet}
                onChange={(event) => setSnippet(event.target.value)}
                placeholder="A short excerpt or description…"
              />
            </FormField>
          </>
        )}

        {type === "image" && (
          <FormField label="Image">
            <ImageDropzone
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              onUpload={(file) => uploadCoverImage("note", file)}
            />
          </FormField>
        )}

        {type === "moodboard" && (
          <FormField label="Images">
            <div className="grid grid-cols-2 gap-3">
              {images.map((image, index) => (
                <ImageDropzone
                  key={index}
                  value={image}
                  onChange={(value) => updateImageAt(index, value)}
                  onUpload={(file) => uploadCoverImage("note", file)}
                  label={`Image ${index + 1}`}
                />
              ))}
            </div>
          </FormField>
        )}

        {type === "code" && (
          <>
            <FormField htmlFor="note-language" label="Language">
              <Input
                id="note-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                placeholder="e.g. TypeScript"
              />
            </FormField>
            <FormField htmlFor="note-code" label="Code">
              <Textarea
                id="note-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Paste a snippet…"
                className="min-h-[160px] font-mono text-[13px]"
              />
            </FormField>
          </>
        )}

        {type === "quote" && (
          <>
            <FormField htmlFor="note-quote" label="Quote">
              <Textarea
                id="note-quote"
                value={quote}
                onChange={(event) => setQuote(event.target.value)}
                placeholder="Write the quote…"
              />
            </FormField>
            <FormField htmlFor="note-author" label="Author" optional>
              <Input
                id="note-author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="Who said it?"
              />
            </FormField>
          </>
        )}

        {type === "recipe" && (
          <FormField label="Ingredients">
            <StringListField
              value={ingredients}
              onChange={setIngredients}
              itemLabel="Ingredient"
              addLabel="Add ingredient"
            />
          </FormField>
        )}

        {type === "pdf" && (
          <>
            <FormField htmlFor="note-filename" label="Filename">
              <Input
                id="note-filename"
                value={filename}
                onChange={(event) => setFilename(event.target.value)}
                placeholder="document.pdf"
              />
            </FormField>
            <FormField htmlFor="note-page-count" label="Page count" optional>
              <Input
                id="note-page-count"
                type="number"
                min={1}
                value={pageCount}
                onChange={(event) => setPageCount(event.target.value)}
                placeholder="e.g. 12"
              />
            </FormField>
          </>
        )}

        {type === "meeting" && (
          <>
            <FormField label="Attendees">
              <StringListField
                value={attendeeNames}
                onChange={setAttendeeNames}
                itemLabel="Attendee"
                addLabel="Add attendee"
              />
            </FormField>
            <FormField label="Agenda">
              <StringListField value={agenda} onChange={setAgenda} itemLabel="Agenda item" addLabel="Add agenda item" />
            </FormField>
          </>
        )}
      </form>
    </ModalShell>
  );
}
