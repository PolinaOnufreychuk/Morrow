import { Link } from "react-router-dom";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBoardReferences } from "../hooks/useInspiration";
import type { InspirationBoard } from "@/types/entities";

export type InspirationCardVariant = "compact" | "full";

export interface InspirationCardProps {
  board: InspirationBoard;
  variant?: InspirationCardVariant;
  onEdit?: (board: InspirationBoard) => void;
  onArchive?: (board: InspirationBoard) => void;
  onDelete?: (board: InspirationBoard) => void;
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
  onEdit,
  onArchive,
  onDelete,
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

  return (
    <div className="group relative flex flex-col">
      <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-fast ease-out group-hover:opacity-100">
        <EntityOverflowMenu
          entityType="collection"
          onEdit={onEdit ? () => onEdit(board) : undefined}
          onArchive={onArchive ? () => onArchive(board) : undefined}
          onDelete={onDelete ? () => onDelete(board) : undefined}
          triggerClassName="bg-surface-card/70 backdrop-blur-sm"
        />
      </div>

      <Link to={`/inspiration/${board.id}`} className="flex flex-col">
        <div className="grid">
          {/* Stack sliver — same grid cell as the collage, nudged down-left so its edge peeks out */}
          <div className="col-start-1 row-start-1 -translate-x-2 translate-y-2 rounded-card border border-white/70 bg-cream-50 shadow-resting" />

          {/* Top collage card */}
          <div
            className={cn(
              "relative col-start-1 row-start-1 grid grid-cols-[1.6fr_1fr] grid-rows-2 gap-1.5 overflow-hidden rounded-card bg-surface-card p-2 shadow-resting transition-transform duration-medium ease-out group-hover:-translate-y-0.5",
              isFull ? "aspect-[16/10]" : "aspect-[4/3]",
            )}
          >
            {primary ? (
              <img src={primary} alt="" className="col-span-1 row-span-2 h-full w-full rounded-card-image object-cover" />
            ) : (
              <div className="col-span-1 row-span-2 rounded-card-image bg-sage-100" />
            )}
            {topRight ? (
              <img src={topRight} alt="" className="h-full w-full rounded-card-image object-cover" />
            ) : (
              <div className="rounded-card-image bg-sage-100" />
            )}
            {bottomRight ? (
              <img src={bottomRight} alt="" className="h-full w-full rounded-card-image object-cover" />
            ) : (
              <div className="rounded-card-image bg-sage-100" />
            )}
          </div>
        </div>

        {/* Directly on the page background — no card behind this text */}
        <div className="flex flex-col gap-1.5 pt-3">
          <h3 className="text-[16px] font-medium leading-snug text-text-primary">{board.title}</h3>
          <div className="flex items-center gap-2">
            {board.tags[0] && <Badge variant="outline">{board.tags[0]}</Badge>}
            <span className="text-[12.5px] text-text-tertiary">{references.length} saved</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
