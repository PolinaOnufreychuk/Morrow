import { GlassCard } from "@/components/shared/GlassCard";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  BookmarkNote,
  ChecklistNote,
  CodeNote,
  ImageNote,
  MeetingNote,
  MoodboardNote,
  Note,
  PdfNote,
  QuoteNote,
  RecipeNote,
  TextNote,
} from "@/types/entities";
import { NOTE_TYPE_META } from "../noteTypeMeta";
import { NoteTypeIcon } from "./NoteTypeIcon";

export type NoteCardVariant = "compact" | "full";
type NoteType = Note["type"];

export interface NoteCardProps {
  note: Note;
  variant?: NoteCardVariant;
  onEdit?: (note: Note) => void;
  onArchive?: (note: Note) => void;
  onDelete?: (note: Note) => void;
}

/** Note types whose body is a media/preview block — title renders below it, matching Inspiration cards. */
const MEDIA_TYPES: NoteType[] = ["image", "moodboard", "code", "bookmark", "pdf"];

/**
 * ONE polymorphic note card. The body is chosen by an exhaustive
 * `switch (note.type)` with a `never` default, so adding a note type to the
 * union will fail the type-check here until a branch is added.
 */
export function NoteCard({ note, variant = "compact", onEdit, onArchive, onDelete }: NoteCardProps) {
  const meta = NOTE_TYPE_META[note.type];
  const isMedia = MEDIA_TYPES.includes(note.type);
  const showTitle = note.type !== "quote";

  const overflowMenu = (
    <EntityOverflowMenu
      entityType="note"
      onEdit={onEdit ? () => onEdit(note) : undefined}
      onArchive={onArchive ? () => onArchive(note) : undefined}
      onDelete={onDelete ? () => onDelete(note) : undefined}
    />
  );

  return (
    <GlassCard className="flex flex-col gap-3 p-4">
      {!isMedia && showTitle && (
        <h3 className="text-[15px] font-medium leading-snug text-text-primary">{note.title}</h3>
      )}

      <NoteBody note={note} variant={variant} />

      {isMedia && showTitle && (
        <h3 className="text-[15px] font-medium leading-snug text-text-primary">{note.title}</h3>
      )}

      <footer className="mt-auto flex items-center justify-between gap-2 pt-1">
        <Badge variant="neutral">{meta.label}</Badge>
        {overflowMenu}
      </footer>
    </GlassCard>
  );
}

function NoteBody({ note, variant }: { note: Note; variant: NoteCardVariant }) {
  const isFull = variant === "full";
  switch (note.type) {
    case "text":
      return <TextBody note={note} isFull={isFull} />;
    case "checklist":
      return <ChecklistBody note={note} isFull={isFull} />;
    case "bookmark":
      return <BookmarkBody note={note} />;
    case "image":
      return <ImageBody note={note} isFull={isFull} />;
    case "moodboard":
      return <MoodboardBody note={note} />;
    case "code":
      return <CodeBody note={note} isFull={isFull} />;
    case "quote":
      return <QuoteBody note={note} />;
    case "recipe":
      return <RecipeBody note={note} isFull={isFull} />;
    case "pdf":
      return <PdfBody note={note} />;
    case "meeting":
      return <MeetingBody note={note} isFull={isFull} />;
    default: {
      // Exhaustiveness guard — a new NoteType will fail to compile here.
      const _exhaustive: never = note;
      return _exhaustive;
    }
  }
}

/* ----- type-specific bodies ----- */

function TextBody({ note, isFull }: { note: TextNote; isFull: boolean }) {
  return (
    <p className={cn("text-[13px] text-text-secondary", isFull ? "" : "line-clamp-3")}>
      {note.body}
    </p>
  );
}

function ChecklistBody({ note, isFull }: { note: ChecklistNote; isFull: boolean }) {
  const items = isFull ? note.items : note.items.slice(0, 3);
  const doneCount = note.items.filter((item) => item.done).length;
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, index) => (
        <label key={index} className="flex items-center gap-2 text-[13px] text-text-secondary">
          <Checkbox checked={item.done} disabled />
          <span className={cn(item.done && "text-text-tertiary line-through")}>{item.text}</span>
        </label>
      ))}
      <span className="mt-1 text-[12px] text-text-tertiary">
        {doneCount}/{note.items.length} done
      </span>
    </div>
  );
}

function BookmarkBody({ note }: { note: BookmarkNote }) {
  const domain = note.domain ?? note.url;
  return (
    <a
      href={note.url}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col gap-1 rounded-card-image border border-border-subtle bg-surface-card/60 p-3"
    >
      <span className="flex items-center gap-2 text-[13px] font-medium text-text-primary">
        {note.faviconUrl ? (
          <img src={note.faviconUrl} alt="" className="h-4 w-4 rounded-[4px]" />
        ) : (
          <span className="flex h-4 w-4 items-center justify-center rounded-[4px] border border-border-subtle text-[9px] font-semibold uppercase text-text-tertiary">
            {domain.charAt(0)}
          </span>
        )}
        {domain}
      </span>
      {note.snippet && <span className="line-clamp-2 text-[12px] text-text-secondary">{note.snippet}</span>}
    </a>
  );
}

function ImageBody({ note, isFull }: { note: ImageNote; isFull: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-card-image", isFull ? "h-56" : "h-36")}>
      <img src={note.coverImageUrl} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

function MoodboardBody({ note }: { note: MoodboardNote }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {note.images.map((src, index) => (
        <div key={index} className="overflow-hidden rounded-card-image">
          <img src={src} alt="" className="aspect-square w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function CodeBody({ note, isFull }: { note: CodeNote; isFull: boolean }) {
  return (
    <div className="overflow-hidden rounded-card-image bg-sage-900">
      <pre
        className={cn(
          "overflow-x-auto p-3 text-[12px] leading-relaxed text-cream-50",
          !isFull && "max-h-32",
        )}
      >
        <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {note.code}
        </code>
      </pre>
    </div>
  );
}

function QuoteBody({ note }: { note: QuoteNote }) {
  return (
    <blockquote className="flex flex-col gap-2 border-l-2 border-sage-300 pl-3">
      {/* Canela italic treatment per docs/FEATURES.md */}
      <p className="font-display text-[18px] font-light italic leading-snug text-text-primary">
        “{note.quote}”
      </p>
      {note.author && <cite className="text-[12px] not-italic text-text-tertiary">— {note.author}</cite>}
    </blockquote>
  );
}

function RecipeBody({ note, isFull }: { note: RecipeNote; isFull: boolean }) {
  const items = isFull ? note.ingredients : note.ingredients.slice(0, 4);
  return (
    <ul className="flex flex-col gap-1 text-[13px] text-text-secondary">
      {items.map((ingredient, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sage-400" />
          {ingredient}
        </li>
      ))}
    </ul>
  );
}

function PdfBody({ note }: { note: PdfNote }) {
  return (
    <div className="flex items-center gap-3 rounded-card-image border border-border-subtle bg-surface-card/60 p-3">
      <NoteTypeIcon type="pdf" size={22} className="text-blush-600" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] font-medium text-text-primary">{note.filename}</span>
        {note.pageCount !== null && (
          <span className="text-[12px] text-text-tertiary">{note.pageCount} pages</span>
        )}
      </div>
    </div>
  );
}

function MeetingBody({ note, isFull }: { note: MeetingNote; isFull: boolean }) {
  const agenda = isFull ? note.agenda : note.agenda.slice(0, 3);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center -space-x-1.5">
        {note.attendees.map((attendee) =>
          attendee.avatarUrl ? (
            <img
              key={attendee.name}
              src={attendee.avatarUrl}
              alt={attendee.name}
              title={attendee.name}
              className="h-7 w-7 rounded-full border-2 border-surface-card object-cover"
            />
          ) : (
            <span
              key={attendee.name}
              title={attendee.name}
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface-card bg-sage-200 text-[12px] font-medium text-sage-700"
            >
              {attendee.name.charAt(0).toUpperCase()}
            </span>
          ),
        )}
      </div>
      <ul className="flex flex-col gap-1 text-[13px] text-text-secondary">
        {agenda.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sage-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
