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

export type NoteCardVariant = "compact" | "full" | "pinned";
type NoteType = Note["type"];

export interface NoteCardProps {
  note: Note;
  variant?: NoteCardVariant;
  onEdit?: (note: Note) => void;
  onArchive?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  /** Not used when variant="pinned" — pins it to the sidebar. */
  onPin?: (note: Note) => void;
  /** Only used when variant="pinned" — removes it from the sidebar. */
  onUnpin?: () => void;
}

/** Note types whose body is a media/preview block — title renders below it, matching Inspiration cards. */
const MEDIA_TYPES: NoteType[] = ["image", "moodboard", "code", "bookmark", "pdf"];

/**
 * ONE polymorphic note card. The body is chosen by an exhaustive
 * `switch (note.type)` with a `never` default, so adding a note type to the
 * union will fail the type-check here until a branch is added.
 */
export function NoteCard({
  note,
  variant = "compact",
  onEdit,
  onArchive,
  onDelete,
  onPin,
  onUnpin,
}: NoteCardProps) {
  const meta = NOTE_TYPE_META[note.type];
  const isMedia = MEDIA_TYPES.includes(note.type);
  const showTitle = note.type !== "quote";
  const isPinned = variant === "pinned";

  const overflowMenu = (
    <EntityOverflowMenu
      entityType="note"
      onEdit={!isPinned && onEdit ? () => onEdit(note) : undefined}
      onPin={!isPinned && onPin ? () => onPin(note) : undefined}
      onArchive={!isPinned && onArchive ? () => onArchive(note) : undefined}
      onDelete={!isPinned && onDelete ? () => onDelete(note) : undefined}
      actions={isPinned ? [{ label: "Unpin", onSelect: () => onUnpin?.() }] : undefined}
      triggerClassName={isPinned ? "h-6 w-6" : undefined}
    />
  );

  const titleClassName = cn(
    "font-medium leading-snug text-text-primary",
    isPinned ? "text-[12.5px] leading-[1.35]" : "text-[15px]",
  );

  return (
    <GlassCard
      interactive={isPinned}
      onClick={isPinned ? () => onEdit?.(note) : undefined}
      className={cn("flex flex-col gap-3 p-4", isPinned && "gap-2 p-[9px]")}
    >
      {!isMedia && showTitle && <h3 className={titleClassName}>{note.title}</h3>}

      <NoteBody note={note} variant={variant} isPinned={isPinned} />

      {isMedia && showTitle && <h3 className={titleClassName}>{note.title}</h3>}

      <footer className={cn("mt-auto flex items-center justify-between gap-2 pt-1", isPinned && "pt-0")}>
        <Badge variant="outline">{meta.label}</Badge>
        {overflowMenu}
      </footer>
    </GlassCard>
  );
}

function NoteBody({
  note,
  variant,
  isPinned,
}: {
  note: Note;
  variant: NoteCardVariant;
  isPinned: boolean;
}) {
  const isFull = variant === "full";
  // Sidebar-pinned media shrinks its inner-image radius to 10px per
  // docs/DESIGN.md and caps its height so every pinned card scales alike.
  const mediaRadius = isPinned ? "rounded-card-image-sidebar" : "rounded-card-image";
  switch (note.type) {
    case "text":
      return <TextBody note={note} isFull={isFull} isPinned={isPinned} />;
    case "checklist":
      return <ChecklistBody note={note} isFull={isFull} isPinned={isPinned} />;
    case "bookmark":
      return <BookmarkBody note={note} isPinned={isPinned} mediaRadius={mediaRadius} />;
    case "image":
      return <ImageBody note={note} isFull={isFull} isPinned={isPinned} mediaRadius={mediaRadius} />;
    case "moodboard":
      return <MoodboardBody note={note} mediaRadius={mediaRadius} />;
    case "code":
      return <CodeBody note={note} isFull={isFull} isPinned={isPinned} mediaRadius={mediaRadius} />;
    case "quote":
      return <QuoteBody note={note} isPinned={isPinned} />;
    case "recipe":
      return <RecipeBody note={note} isFull={isFull} isPinned={isPinned} />;
    case "pdf":
      return <PdfBody note={note} mediaRadius={mediaRadius} />;
    case "meeting":
      return <MeetingBody note={note} isFull={isFull} isPinned={isPinned} />;
    default: {
      // Exhaustiveness guard — a new NoteType will fail to compile here.
      const _exhaustive: never = note;
      return _exhaustive;
    }
  }
}

/** Body text one step smaller than the pinned title (12.5px) so hierarchy holds. */
const pinnedText = "text-[11.5px]";

/* ----- type-specific bodies ----- */

function TextBody({ note, isFull, isPinned }: { note: TextNote; isFull: boolean; isPinned: boolean }) {
  return (
    <p
      className={cn(
        "text-text-secondary",
        isPinned ? cn(pinnedText, "line-clamp-2") : "text-[13px]",
        !isFull && !isPinned && "line-clamp-3",
      )}
    >
      {note.body}
    </p>
  );
}

function ChecklistBody({
  note,
  isFull,
  isPinned,
}: {
  note: ChecklistNote;
  isFull: boolean;
  isPinned: boolean;
}) {
  const items = isFull ? note.items : note.items.slice(0, isPinned ? 2 : 3);
  const doneCount = note.items.filter((item) => item.done).length;
  return (
    <div className={cn("flex flex-col gap-1.5", isPinned && "gap-1")}>
      {items.map((item, index) => (
        <label
          key={index}
          className={cn("flex items-center gap-2 text-text-secondary", isPinned ? pinnedText : "text-[13px]")}
        >
          <Checkbox checked={item.done} disabled />
          <span className={cn("truncate", item.done && "text-text-tertiary line-through")}>{item.text}</span>
        </label>
      ))}
      <span className={cn("mt-1 text-text-tertiary", isPinned ? "text-[10.5px]" : "text-[12px]")}>
        {doneCount}/{note.items.length} done
      </span>
    </div>
  );
}

function BookmarkBody({
  note,
  isPinned,
  mediaRadius,
}: {
  note: BookmarkNote;
  isPinned: boolean;
  mediaRadius: string;
}) {
  const domain = note.domain ?? note.url;
  return (
    <a
      href={note.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "flex flex-col gap-1 border border-border-subtle bg-surface-card/60",
        mediaRadius,
        isPinned ? "p-2" : "p-3",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-2 font-medium text-text-primary",
          isPinned ? pinnedText : "text-[13px]",
        )}
      >
        {note.faviconUrl ? (
          <img src={note.faviconUrl} alt="" draggable={false} className="h-4 w-4 rounded-[4px]" />
        ) : (
          <span className="flex h-4 w-4 items-center justify-center rounded-[4px] border border-border-subtle text-[9px] font-semibold uppercase text-text-tertiary">
            {domain.charAt(0)}
          </span>
        )}
        <span className="truncate">{domain}</span>
      </span>
      {!isPinned && note.snippet && (
        <span className="line-clamp-2 text-[12px] text-text-secondary">{note.snippet}</span>
      )}
    </a>
  );
}

function ImageBody({
  note,
  isFull,
  isPinned,
  mediaRadius,
}: {
  note: ImageNote;
  isFull: boolean;
  isPinned: boolean;
  mediaRadius: string;
}) {
  return (
    <div className={cn("overflow-hidden", mediaRadius, isPinned ? "h-[86px]" : isFull ? "h-56" : "h-36")}>
      <img src={note.coverImageUrl} alt="" draggable={false} className="h-full w-full object-cover" />
    </div>
  );
}

function MoodboardBody({ note, mediaRadius }: { note: MoodboardNote; mediaRadius: string }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {note.images.map((src, index) => (
        <div key={index} className={cn("overflow-hidden", mediaRadius)}>
          <img src={src} alt="" draggable={false} className="aspect-square w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function CodeBody({
  note,
  isFull,
  isPinned,
  mediaRadius,
}: {
  note: CodeNote;
  isFull: boolean;
  isPinned: boolean;
  mediaRadius: string;
}) {
  return (
    <div className={cn("overflow-hidden bg-sage-900", mediaRadius)}>
      <pre
        className={cn(
          "overflow-x-auto leading-relaxed text-cream-50",
          isPinned ? "max-h-[86px] p-2 text-[10.5px]" : "p-3 text-[12px]",
          !isFull && !isPinned && "max-h-32",
        )}
      >
        <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {note.code}
        </code>
      </pre>
    </div>
  );
}

function QuoteBody({ note, isPinned }: { note: QuoteNote; isPinned: boolean }) {
  return (
    <blockquote className="flex flex-col gap-2 border-l-2 border-sage-300 pl-3">
      {/* Canela italic treatment per docs/FEATURES.md */}
      <p
        className={cn(
          "font-display font-light italic leading-snug text-text-primary",
          isPinned ? "line-clamp-3 text-[13px]" : "text-[18px]",
        )}
      >
        “{note.quote}”
      </p>
      {!isPinned && note.author && (
        <cite className="text-[12px] not-italic text-text-tertiary">— {note.author}</cite>
      )}
    </blockquote>
  );
}

function RecipeBody({ note, isFull, isPinned }: { note: RecipeNote; isFull: boolean; isPinned: boolean }) {
  const items = isFull ? note.ingredients : note.ingredients.slice(0, isPinned ? 3 : 4);
  return (
    <ul className={cn("flex flex-col gap-1 text-text-secondary", isPinned ? pinnedText : "text-[13px]")}>
      {items.map((ingredient, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sage-400" />
          <span className="truncate">{ingredient}</span>
        </li>
      ))}
    </ul>
  );
}

function PdfBody({ note, mediaRadius }: { note: PdfNote; mediaRadius: string }) {
  return (
    <div className={cn("flex items-center gap-3 border border-border-subtle bg-surface-card/60 p-3", mediaRadius)}>
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

function MeetingBody({ note, isFull, isPinned }: { note: MeetingNote; isFull: boolean; isPinned: boolean }) {
  const agenda = isFull ? note.agenda : note.agenda.slice(0, isPinned ? 2 : 3);
  return (
    <div className={cn("flex flex-col gap-3", isPinned && "gap-2")}>
      <div className="flex items-center -space-x-1.5">
        {note.attendees.map((attendee) =>
          attendee.avatarUrl ? (
            <img
              key={attendee.name}
              src={attendee.avatarUrl}
              alt={attendee.name}
              title={attendee.name}
              draggable={false}
              className={cn(
                "rounded-full border-2 border-surface-card object-cover",
                isPinned ? "h-6 w-6" : "h-7 w-7",
              )}
            />
          ) : (
            <span
              key={attendee.name}
              title={attendee.name}
              className={cn(
                "flex items-center justify-center rounded-full border-2 border-surface-card bg-sage-200 font-medium text-sage-700",
                isPinned ? "h-6 w-6 text-[11px]" : "h-7 w-7 text-[12px]",
              )}
            >
              {attendee.name.charAt(0).toUpperCase()}
            </span>
          ),
        )}
      </div>
      <ul className={cn("flex flex-col gap-1 text-text-secondary", isPinned ? pinnedText : "text-[13px]")}>
        {agenda.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sage-400" />
            <span className="truncate">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
