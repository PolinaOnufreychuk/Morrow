import { Link } from "react-router-dom";
import { GlassCard } from "@/components/shared/GlassCard";
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
 * Inspiration board card. Its signature composition is an asymmetric collage
 * — one large reference image with up to two smaller ones peeking behind it
 * — never downgraded to a plain list row (docs/DESIGN.md). Compact + full
 * variants. Reads its own reference count/images via `useBoardReferences` so
 * every board card (dashboard, list page, embedded-in-project) stays in sync
 * with the real data without prop-drilling.
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
  const [primary, ...peeking] = images;

  const isFull = variant === "full";

  return (
    <GlassCard interactive className="group flex flex-col">
      <Link to={`/inspiration/${board.id}`} className="flex flex-col">
        {/* Asymmetric collage: one large image + up to two peeking behind it */}
        <div className={cn("relative overflow-hidden", isFull ? "h-56" : "h-44")}>
          {primary ? (
            <img
              src={primary}
              alt=""
              className="absolute bottom-3 left-3 top-3 w-[64%] rounded-card-image object-cover shadow-resting transition-transform duration-medium ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute bottom-3 left-3 top-3 w-[64%] rounded-card-image bg-sage-100" />
          )}
          {peeking[0] && (
            <img
              src={peeking[0]}
              alt=""
              className="absolute right-3 top-3 h-[46%] w-[34%] rotate-3 rounded-card-image object-cover shadow-resting"
            />
          )}
          {peeking[1] && (
            <img
              src={peeking[1]}
              alt=""
              className="absolute bottom-3 right-3 h-[46%] w-[34%] -rotate-2 rounded-card-image object-cover shadow-resting"
            />
          )}
        </div>

        <div className="flex flex-col gap-1.5 p-4 pb-0 pt-1">
          <h3 className="text-[16px] font-medium leading-snug text-text-primary">{board.title}</h3>
          {isFull && board.notes && (
            <p className="line-clamp-2 text-[13px] text-text-secondary">{board.notes}</p>
          )}
        </div>
      </Link>

      {/* Outside the Link — an overflow menu button must never nest inside an anchor. */}
      <div className="flex items-center justify-between gap-2 p-4 pt-1.5">
        <div className="flex items-center gap-2">
          {board.tags[0] && <Badge variant="neutral">{board.tags[0]}</Badge>}
          <span className="text-[12.5px] text-text-tertiary">{references.length} saved</span>
        </div>
        <EntityOverflowMenu
          entityType="collection"
          onEdit={onEdit ? () => onEdit(board) : undefined}
          onArchive={onArchive ? () => onArchive(board) : undefined}
          onDelete={onDelete ? () => onDelete(board) : undefined}
          triggerClassName="opacity-0 transition-opacity duration-fast ease-out group-hover:opacity-100"
        />
      </div>
    </GlassCard>
  );
}
