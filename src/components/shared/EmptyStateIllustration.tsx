import { cn } from "@/lib/utils";

export type EmptyStateIllustrationVariant =
  | "project"
  | "note"
  | "resource"
  | "inspiration"
  | "archive"
  | "search";

export interface EmptyStateIllustrationProps {
  variant: EmptyStateIllustrationVariant;
  className?: string;
}

/** Static silhouette block — same token family as Skeleton.tsx, without the pulse (this is decorative, not a loading state). */
function Block({ className, strong }: { className?: string; strong?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-[6px]", strong ? "bg-ink-900/[.10]" : "bg-ink-900/[.05]", className)}
    />
  );
}

function ProjectCardShape({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-[152px] flex-col gap-2.5 rounded-card bg-surface-card p-3.5", className)}>
      <div className="flex gap-1.5">
        <Block className="h-3.5 w-12 rounded-chip" />
        <Block className="h-3.5 w-8 rounded-chip" />
      </div>
      <Block strong className="h-3.5 w-4/5" />
      <Block className="h-3 w-3/5" />
      <Block className="h-16 w-full rounded-card-image" />
    </div>
  );
}

function NoteCardShape({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-[152px] flex-col gap-2.5 rounded-card bg-surface-card p-3.5", className)}>
      <Block strong className="h-3.5 w-3/4" />
      <Block className="h-2.5 w-full" />
      <Block className="h-2.5 w-full" />
      <Block className="h-2.5 w-2/5" />
      <div className="mt-1 flex items-center justify-between">
        <Block className="h-3 w-10 rounded-chip" />
        <Block className="h-3 w-3" />
      </div>
    </div>
  );
}

function ResourceCardShape({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-[152px] flex-col gap-2.5 rounded-card bg-surface-card p-3.5", className)}>
      <Block className="h-14 w-full rounded-card-image" />
      <Block strong className="h-3.5 w-4/5" />
      <div className="flex items-center justify-between">
        <Block className="h-3 w-9 rounded-chip" />
        <Block className="h-3 w-7" />
      </div>
    </div>
  );
}

function InspirationCardShape({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-[160px] flex-col gap-2.5 rounded-card bg-surface-card p-3.5", className)}>
      <div className="grid h-20 grid-cols-[1.6fr_1fr] grid-rows-2 gap-1.5">
        <Block className="row-span-2 h-full w-full rounded-card-image" />
        <Block className="h-full w-full rounded-card-image" />
        <Block className="h-full w-full rounded-card-image" />
      </div>
      <Block strong className="h-3.5 w-3/5" />
      <div className="flex items-center gap-1.5">
        <Block className="h-3 w-9 rounded-chip" />
        <Block className="h-3 w-6" />
      </div>
    </div>
  );
}

function ArchiveRowShape({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-[196px] items-center gap-3 rounded-card bg-surface-card p-3.5", className)}>
      <Block className="h-10 w-10 shrink-0 rounded-card-image" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Block className="h-2.5 w-1/2" />
        <Block strong className="h-3.5 w-full" />
      </div>
    </div>
  );
}

const SHAPES: Record<EmptyStateIllustrationVariant, [typeof ProjectCardShape, typeof ProjectCardShape]> = {
  project: [ProjectCardShape, ProjectCardShape],
  note: [NoteCardShape, NoteCardShape],
  resource: [ResourceCardShape, ResourceCardShape],
  inspiration: [InspirationCardShape, InspirationCardShape],
  archive: [ArchiveRowShape, ArchiveRowShape],
  search: [NoteCardShape, ResourceCardShape],
};

/** Outline-only footprint for the back "ghost" layer, sized to roughly match each shape's rendered box. */
const GHOST_SIZE: Record<EmptyStateIllustrationVariant, string> = {
  project: "h-[172px] w-[152px]",
  note: "h-[150px] w-[152px]",
  resource: "h-[150px] w-[152px]",
  inspiration: "h-[168px] w-[160px]",
  archive: "h-[72px] w-[196px]",
  search: "h-[150px] w-[152px]",
};

const GHOST_LAYER = "absolute -rotate-[8deg] -translate-x-4 -translate-y-3.5 opacity-[.16]";
const MID_LAYER = "absolute -rotate-3 -translate-x-1.5 -translate-y-1 opacity-[.55]";
const FRONT_LAYER = "relative rotate-2 translate-x-1.5 translate-y-1 shadow-resting";

/** A 3-layer stack of tilted card silhouettes, built from Skeleton's own visual language, unified per page. */
export function EmptyStateIllustration({ variant, className }: EmptyStateIllustrationProps) {
  const [Back, Front] = SHAPES[variant];

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={GHOST_LAYER}>
        <div aria-hidden="true" className={cn("rounded-card border border-ink-900/[.08]", GHOST_SIZE[variant])} />
      </div>
      <div className={MID_LAYER}>
        <Back />
      </div>
      <div className={FRONT_LAYER}>
        <Front />
      </div>
    </div>
  );
}
