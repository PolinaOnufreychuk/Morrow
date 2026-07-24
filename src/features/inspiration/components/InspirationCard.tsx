import { Link } from "react-router-dom";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBoardReferences } from "../hooks/useInspiration";
import type { BackContext } from "@/lib/navigation";
import type { InspirationBoard } from "@/types/entities";

export type InspirationCardVariant = "compact" | "full" | "pinned";

export interface InspirationCardProps {
  board: InspirationBoard;
  variant?: InspirationCardVariant;
  onDelete?: (board: InspirationBoard) => void;
  /** Not used when variant="pinned" — pins it to the sidebar. */
  onPin?: (board: InspirationBoard) => void;
  /** Only used when variant="pinned" — removes it from the sidebar. */
  onUnpin?: () => void;
  /** Where the detail page's back-link should point when opened from here, if not the default. */
  backContext?: BackContext;
}

/**
 * Inspiration board card. Reads like a stack of photos: a single faint
 * sliver layer peeks out behind a top collage of up to three images, and the
 * title/tag/count sit directly on the page background below — never inside
 * a white card block (docs/DESIGN.md). Reads its own reference count/images
 * via `useBoardReferences` so every board card (dashboard, list page,
 * embedded-in-project) stays in sync with the real data without prop-drilling.
 */
export function InspirationCard({
  board,
  variant = "compact",
  onDelete,
  onPin,
  onUnpin,
  backContext,
}: InspirationCardProps) {
  const { data: references = [] } = useBoardReferences(board.id);
  const images = (
    references.length > 0
      ? references.map((reference) => reference.imageUrl)
      : board.coverImageUrl
        ? [board.coverImageUrl]
        : []
  ).slice(0, 3);
  const [primary, topRight, bottomRight] = images;

  const isFull = variant === "full";
  const isPinned = variant === "pinned";
  const imageRadius = isPinned ? "rounded-card-image-sidebar" : "rounded-card-image";

  return (
    <div className="group relative flex flex-col">
      <div
        className={cn(
          "absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-fast ease-out group-hover:opacity-100",
          isPinned && "right-1.5 top-1.5",
        )}
      >
        <EntityOverflowMenu
          entityType="collection"
          onPin={!isPinned && onPin ? () => onPin(board) : undefined}
          onDelete={!isPinned && onDelete ? () => onDelete(board) : undefined}
          actions={isPinned ? [{ label: "Unpin", onSelect: () => onUnpin?.() }] : undefined}
          triggerClassName={cn("bg-surface-card/70 backdrop-blur-sm", isPinned && "h-6 w-6")}
        />
      </div>

      <Link
        to={`/inspiration/${board.id}`}
        state={backContext ? { back: backContext } : undefined}
        className="flex flex-col"
      >
        <div className="grid">
          {/* Stack sliver — same grid cell as the collage, nudged down-left so its edge peeks out */}
          <div
            className={cn(
              "col-start-1 row-start-1 -translate-x-2 translate-y-2 rotate-[-2deg] border border-white/70 bg-cream-50 shadow-resting",
              isPinned ? "rounded-card-image-sidebar" : "rounded-card",
            )}
          />

          {/* Top collage card */}
          <div
            className={cn(
              "relative col-start-1 row-start-1 grid grid-cols-[1.6fr_1fr] grid-rows-2 gap-1.5 overflow-hidden bg-surface-card/70 p-2 shadow-resting transition-transform duration-medium ease-out group-hover:-translate-y-0.5",
              isPinned ? "rounded-[10px]" : "rounded-card",
              isFull ? "aspect-[16/10]" : "aspect-[4/3]",
            )}
          >
            {primary ? (
              <img src={primary} alt="" draggable={false} className={cn("col-span-1 row-span-2 h-full w-full object-cover", imageRadius)} />
            ) : (
              <div className={cn("col-span-1 row-span-2 bg-sage-100", imageRadius)} />
            )}
            {topRight ? (
              <img src={topRight} alt="" draggable={false} className={cn("h-full w-full object-cover", imageRadius)} />
            ) : (
              <div className={cn("bg-sage-100", imageRadius)} />
            )}
            {bottomRight ? (
              <img src={bottomRight} alt="" draggable={false} className={cn("h-full w-full object-cover", imageRadius)} />
            ) : (
              <div className={cn("bg-sage-100", imageRadius)} />
            )}
          </div>
        </div>

        {/* Directly on the page background — no card behind this text */}
        <div className={cn("flex flex-col gap-1.5 pt-5", isPinned && "gap-1 pt-2")}>
          <h3
            className={cn(
              "font-medium leading-snug text-text-primary",
              isPinned ? "text-[12.5px] leading-[1.35]" : "text-[16px]",
            )}
          >
            {board.title}
          </h3>
          <div className="flex items-center gap-2">
            {!isPinned && board.tags[0] && <Badge variant="outline">{board.tags[0]}</Badge>}
            <span className="text-[12.5px] text-text-tertiary">{references.length} saved</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
