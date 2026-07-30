import { GlassCard } from "@/components/shared/GlassCard";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ChecklistNote,
  ImageNote,
  Note,
  PdfNote,
  QuoteNote,
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
  onDelete?: (note: Note) => void;
  /** Not used when variant="pinned" — pins it to the sidebar. */
  onPin?: (note: Note) => void;
  /** Only used when variant="pinned" — removes it from the sidebar. */
  onUnpin?: () => void;
}

/** Note types whose body is a media/preview block — title renders below it, matching Inspiration cards. */
const MEDIA_TYPES: NoteType[] = ["image", "pdf"];

/** Whether a note's title renders after its body instead of above it. */
export function isMediaNoteType(type: NoteType): boolean {
  return MEDIA_TYPES.includes(type);
}

/** Quote notes render their own quote styling in place of a title. */
export function showsNoteTitle(type: NoteType): boolean {
  return type !== "quote";
}

/**
 * ONE polymorphic note card. The body is chosen by an exhaustive
 * `switch (note.type)` with a `never` default, so adding a note type to the
 * union will fail the type-check here until a branch is added.
 */
export function NoteCard({
  note,
  variant = "compact",
  onEdit,
  onDelete,
  onPin,
  onUnpin,
}: NoteCardProps) {
  const meta = NOTE_TYPE_META[note.type];
  const isMedia = isMediaNoteType(note.type);
  const showTitle = showsNoteTitle(note.type);
  const isPinned = variant === "pinned";

  const overflowMenu = (
    <EntityOverflowMenu
      entityType="note"
      onEdit={!isPinned && onEdit ? () => onEdit(note) : undefined}
      onPin={!isPinned && onPin ? () => onPin(note) : undefined}
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
      {!isMedia && showTitle ? (
        <div className="flex flex-col gap-1">
          <h3 className={titleClassName}>{note.title}</h3>
          <NoteBody note={note} variant={variant} isPinned={isPinned} />
        </div>
      ) : (
        <NoteBody note={note} variant={variant} isPinned={isPinned} />
      )}

      {isMedia && showTitle && <h3 className={titleClassName}>{note.title}</h3>}

      <footer className={cn("mt-auto flex items-center justify-between gap-2 pt-1", isPinned && "pt-0")}>
        <Badge variant="outline">{meta.label}</Badge>
        {overflowMenu}
      </footer>
    </GlassCard>
  );
}

export function NoteBody({
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
    case "image":
      return <ImageBody note={note} isFull={isFull} isPinned={isPinned} mediaRadius={mediaRadius} />;
    case "quote":
      return <QuoteBody note={note} isPinned={isPinned} />;
    case "pdf":
      return <PdfBody note={note} mediaRadius={mediaRadius} />;
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

function PdfBody({ note, mediaRadius }: { note: PdfNote; mediaRadius: string }) {
  return (
    <a
      href={note.fileUrl || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 border border-border-subtle bg-surface-card/60 p-3",
        mediaRadius,
      )}
    >
      <NoteTypeIcon type="pdf" size={22} className="text-blush-600" />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[13px] font-medium text-text-primary">{note.filename}</span>
        {note.description && (
          <span className="truncate text-[12px] text-text-tertiary">{note.description}</span>
        )}
      </div>
    </a>
  );
}
