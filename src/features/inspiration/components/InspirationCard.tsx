import { Link } from "react-router-dom";
import { GlassCard } from "@/components/shared/GlassCard";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InspirationBoard } from "@/types/entities";

export type InspirationCardVariant = "compact" | "full";

export interface InspirationCardProps {
  board: InspirationBoard;
  /** Up to 3 reference images to fan; falls back to the board cover. */
  previewImages?: string[];
  variant?: InspirationCardVariant;
  onEdit?: (board: InspirationBoard) => void;
  onArchive?: (board: InspirationBoard) => void;
  onDelete?: (board: InspirationBoard) => void;
}

const FAN_ROTATIONS = ["-rotate-6", "rotate-0", "rotate-6"];
const FAN_OFFSETS = ["-translate-x-6", "translate-x-0", "translate-x-6"];

/**
 * Inspiration board card. Its signature composition is a fanned/rotated
 * 3-image stack — a board card is never downgraded to a plain list row
 * (docs/DESIGN.md). Compact + full variants.
 */
export function InspirationCard({
  board,
  previewImages,
  variant = "compact",
  onEdit,
  onArchive,
  onDelete,
}: InspirationCardProps) {
  const images = (previewImages && previewImages.length > 0
    ? previewImages
    : board.coverImageUrl
      ? [board.coverImageUrl]
      : []
  ).slice(0, 3);

  const isFull = variant === "full";

  return (
    <GlassCard interactive className="group relative flex flex-col">
      <div className="absolute right-3 top-3 z-20 opacity-0 transition-opacity duration-fast ease-out group-hover:opacity-100">
        <EntityOverflowMenu
          entityType="collection"
          onEdit={onEdit ? () => onEdit(board) : undefined}
          onArchive={onArchive ? () => onArchive(board) : undefined}
          onDelete={onDelete ? () => onDelete(board) : undefined}
          triggerClassName="bg-surface-card/70 backdrop-blur-sm"
        />
      </div>

      <Link to={`/inspiration/${board.id}`} className="flex flex-col">
        {/* Fanned image stack */}
        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden px-6",
            isFull ? "h-56" : "h-44",
          )}
        >
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              className={cn(
                "absolute h-[78%] w-[58%] rounded-card-image object-cover shadow-resting transition-transform duration-medium ease-out",
                FAN_ROTATIONS[index] ?? "rotate-0",
                FAN_OFFSETS[index] ?? "translate-x-0",
                "group-hover:scale-[1.02]",
              )}
              style={{ zIndex: index === 1 ? 10 : 5 }}
            />
          ))}
          {images.length === 0 && (
            <div className="h-[78%] w-[58%] rounded-card-image bg-sage-100" />
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <h3 className="text-[16px] font-medium leading-snug text-text-primary">{board.title}</h3>
          {isFull && board.notes && (
            <p className="line-clamp-2 text-[13px] text-text-secondary">{board.notes}</p>
          )}
          {board.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {board.tags.slice(0, isFull ? 6 : 3).map((tag) => (
                <Badge key={tag} variant="neutral">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Link>
    </GlassCard>
  );
}
