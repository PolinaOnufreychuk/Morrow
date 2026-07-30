import { useState, type FormEvent } from "react";
import { ModalShell } from "@/components/shared/ModalShell";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/FormField";
import { ImageDropzone } from "@/components/shared/ImageDropzone";
import { notify } from "@/components/shared/Toast";
import { useConfirmDiscard } from "@/hooks/useConfirmDiscard";
import { uploadCoverImage } from "@/lib/supabase/storage";
import type { ChecklistItem, Note, NoteType } from "@/types/entities";
import { NoteValidationError } from "../types";
import { useCreateNote, useUpdateNote } from "../hooks/useNotes";
import { ChecklistItemsField } from "./fields/ChecklistItemsField";
import { PdfDropzone, type PdfFileValue } from "./fields/PdfDropzone";
import bgNoteEditor from "@/assets/grain-gradient-sage-blush.png";
import bgNoteButton from "@/assets/bg-note-button.png";

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

/** The banner wordmark per type — matches the reference mockups exactly
 * (quote/pdf drop the trailing "note"). Checklist uses an editable overlay
 * instead, so its value here only feeds the accessible DialogTitle. */
const HERO_LABEL: Record<NoteType, string> = {
  text: "text note",
  checklist: "checklist",
  image: "image note",
  quote: "quote",
  pdf: "pdf",
};

/** Routes to the right type-specific field set and wires the form to real
 * create/update mutations. Local `useState` per field (rather than a single
 * typed object) keeps each control trivially controlled regardless of which
 * of the 5 discriminated note variants is active. */
export function NoteEditorModal({ open, onOpenChange, note, type, initialProjectIds }: NoteEditorModalProps) {
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
  const [description, setDescription] = useState(note?.type === "pdf" ? (note.description ?? "") : "");
  const [pdfFile, setPdfFile] = useState<PdfFileValue | null>(
    note?.type === "pdf" ? { fileUrl: note.fileUrl, filename: note.filename, fileSize: null } : null,
  );

  // Quote notes have no visible title field — the quote text stands in as the
  // record's title (cards render the quote, never the title).
  const effectiveTitle = type === "quote" ? quote.trim() : title.trim();
  const canSubmit = (() => {
    switch (type) {
      case "text":
      case "checklist":
        return effectiveTitle.length > 0;
      case "image":
        return effectiveTitle.length > 0 && Boolean(coverImageUrl);
      case "quote":
        return quote.trim().length > 0;
      case "pdf":
        return effectiveTitle.length > 0 && Boolean(pdfFile);
    }
  })();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    if (!effectiveTitle) {
      setSubmitError(type === "quote" ? "Quote is required." : "Title is required.");
      return;
    }

    const projectIds = note?.projectIds ?? initialProjectIds ?? [];
    const base = { title: effectiveTitle, projectIds };
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
          description: description.trim() || null,
          fileUrl: pdfFile?.fileUrl ?? "",
          filename: pdfFile?.filename ?? "",
        };
        break;
    }

    const onError = (error: unknown) => {
      setSubmitError(
        error instanceof NoteValidationError ? error.message : "Couldn't save the note. Please try again.",
      );
    };

    if (isEditing && note) {
      updateNote.mutate({ id: note.id, ...payload } as Parameters<typeof updateNote.mutate>[0], {
        onSuccess: () => {
          notify.success("Note saved");
          onOpenChange(false);
        },
        onError,
      });
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

  // Checklist puts its title, editable, inside the banner instead of a field.
  const checklistOverlay =
    type === "checklist" ? (
      <div className="flex h-full flex-col justify-center gap-1 px-6">
        <span className="text-[12px] font-medium text-white/75">Checklist title:</span>
        <input
          aria-label="Checklist title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            markDirty();
          }}
          placeholder="New checklist"
          className="w-full bg-transparent font-display text-[30px] font-normal leading-tight text-white placeholder:text-white/70 focus:outline-none"
        />
      </div>
    ) : undefined;

  return (
    <>
      <ModalShell
        open={open}
        onOpenChange={guardedOnOpenChange}
        title={`${isEditing ? "Edit" : "New"} ${HERO_LABEL[type]}`}
        className="max-w-[429px]"
        heroImage={bgNoteEditor}
        heroTitleOverlay
        heroOverlay={checklistOverlay}
        footerAlign="split"
        footer={
          <>
            <DialogClose asChild>
              <Button
                variant="secondary"
                size="lg"
                className="h-[48px] basis-[36%] rounded-[15px] text-[16px]"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="hero"
              size="lg"
              type="submit"
              form={FORM_ID}
              className="h-[48px] flex-1 rounded-[15px] bg-cover bg-center text-[16px]"
              style={{ backgroundImage: `url(${bgNoteButton})` }}
              disabled={!canSubmit || isPending}
              aria-busy={isPending}
            >
              {isPending ? "Saving…" : isEditing ? "Save changes" : "Create note"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={handleSubmit} className="flex flex-col gap-5">
          {type === "text" && (
            <>
              <FormField htmlFor="note-title" label="Title" labelTone="prominent" error={submitError ?? undefined}>
                <Input
                  id="note-title"
                  rounded="soft"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    markDirty();
                  }}
                  placeholder="Note title"
                />
              </FormField>
              <FormField htmlFor="note-body" label="Body" labelTone="prominent">
                <Textarea
                  id="note-body"
                  rounded="soft"
                  value={body}
                  onChange={(event) => {
                    setBody(event.target.value);
                    markDirty();
                  }}
                  placeholder="Write something…"
                />
              </FormField>
            </>
          )}

          {type === "checklist" && (
            <FormField label="Items" labelTone="prominent" error={submitError ?? undefined}>
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
            <>
              <FormField htmlFor="note-title" label="Title" labelTone="prominent" error={submitError ?? undefined}>
                <Input
                  id="note-title"
                  rounded="soft"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    markDirty();
                  }}
                  placeholder="Note title"
                />
              </FormField>
              <FormField label="Image" labelTone="prominent">
                <ImageDropzone
                  size="large"
                  value={coverImageUrl}
                  onChange={(value) => {
                    setCoverImageUrl(value);
                    markDirty();
                  }}
                  onUpload={(file) => uploadCoverImage("note", file)}
                  label="Drop image, or click to upload"
                  helperText="Maximum 10 MB file size"
                />
              </FormField>
            </>
          )}

          {type === "quote" && (
            <>
              <FormField htmlFor="note-quote" label="Quote" labelTone="prominent" error={submitError ?? undefined}>
                {/* Decorative sage→blush bar sits inside the field on the left;
                    the textarea reserves left padding so text clears it. */}
                <div className="relative">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-4 left-4 w-[3px] rounded-full bg-gradient-to-b from-sage-400 to-blush-300"
                  />
                  <Textarea
                    id="note-quote"
                    rounded="soft"
                    value={quote}
                    onChange={(event) => {
                      setQuote(event.target.value);
                      markDirty();
                    }}
                    placeholder="Write the quote…"
                    className="pl-7 font-display text-[22px] italic leading-snug placeholder:italic"
                  />
                </div>
              </FormField>
              <FormField htmlFor="note-author" label="Author" labelTone="prominent" optional>
                <Input
                  id="note-author"
                  rounded="soft"
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
              <FormField htmlFor="note-title" label="Title" labelTone="prominent" error={submitError ?? undefined}>
                <Input
                  id="note-title"
                  rounded="soft"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    markDirty();
                  }}
                  placeholder="Note title"
                />
              </FormField>
              <FormField htmlFor="note-description" label="Description" labelTone="prominent" optional>
                <Textarea
                  id="note-description"
                  rounded="soft"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    markDirty();
                  }}
                  placeholder="e.g. Studio portfolio site v2"
                />
              </FormField>
              <FormField label="File" labelTone="prominent">
                <PdfDropzone
                  value={pdfFile}
                  onChange={(value) => {
                    setPdfFile(value);
                    markDirty();
                  }}
                  onUpload={(file) => uploadCoverImage("note", file)}
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
