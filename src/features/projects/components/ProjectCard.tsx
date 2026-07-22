import { Link } from "react-router-dom";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { Skeleton } from "@/components/shared/Skeleton";
import { Badge } from "@/components/ui/badge";
import { formatRelativeUpdated } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/entities";

export type ProjectCardVariant = "compact" | "full" | "pinned";

export interface ProjectCardProps {
  project: Project;
  variant?: ProjectCardVariant;
  onEdit?: (project: Project) => void;
  onArchive?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  /** Not used when variant="pinned" — pins it to the sidebar. */
  onPin?: (project: Project) => void;
  /** Only used when variant="pinned" — removes it from the sidebar. */
  onUnpin?: () => void;
}

/**
 * Project card. `compact` (~320px, used in grids/dashboard), `full`
 * (masonry), and `pinned` (sidebar mini-card) variants share one component
 * so the design never drifts.
 */
export function ProjectCard({
  project,
  variant = "compact",
  onEdit,
  onArchive,
  onDelete,
  onPin,
  onUnpin,
}: ProjectCardProps) {
  const isFull = variant === "full";
  const isPinned = variant === "pinned";
  return (
    <GlassCard
      interactive
      className={cn(
        "group relative flex flex-col overflow-hidden",
        variant === "compact" && "w-full max-w-[320px]",
        isPinned && "w-full",
      )}
    >
      <div
        className={cn(
          "absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-fast ease-out group-hover:opacity-100",
          isPinned && "right-2 top-2",
        )}
      >
        <EntityOverflowMenu
          entityType="project"
          onEdit={!isPinned && onEdit ? () => onEdit(project) : undefined}
          onPin={!isPinned && onPin ? () => onPin(project) : undefined}
          onArchive={!isPinned && onArchive ? () => onArchive(project) : undefined}
          onDelete={!isPinned && onDelete ? () => onDelete(project) : undefined}
          actions={isPinned ? [{ label: "Unpin", onSelect: () => onUnpin?.() }] : undefined}
          triggerClassName={cn("bg-surface-card/70 backdrop-blur-sm", isPinned && "h-6 w-6")}
        />
      </div>

      <Link to={`/projects/${project.id}`} className="flex flex-col">
        <div className={cn("flex flex-col gap-2 p-4 pb-2", isPinned && "gap-[6px] p-[9px] pb-2")}>
          <div className="flex items-center gap-2">
            {isPinned ? (
              <span className="inline-flex items-center rounded-chip border border-border-subtle bg-ink-900/[.05] px-[9px] py-1 text-[10.5px] font-medium leading-none text-text-secondary">
                Project
              </span>
            ) : (
              <>
                <StatusPill status={project.status} />
                {project.category && <Badge variant="outline">{project.category}</Badge>}
              </>
            )}
            {isPinned && (
              <span className="ml-auto text-[10.5px] text-text-tertiary">
                {formatRelativeUpdated(project.updatedAt)}
              </span>
            )}
          </div>

          <h3
            className={cn(
              "font-medium leading-snug text-text-primary",
              isPinned ? "text-[12.5px] leading-[1.35]" : "text-[16px]",
            )}
          >
            {project.title}
          </h3>

          {isFull && project.description && (
            <p className="line-clamp-2 text-[13px] text-text-secondary">{project.description}</p>
          )}
        </div>

        {project.coverImageUrl && (
          <div
            className={cn(
              "mx-4 overflow-hidden rounded-card-image",
              isFull ? "h-52" : "h-40",
              isPinned && "mx-[9px] mb-[9px] h-[86px] rounded-card-image-sidebar",
            )}
          >
            <img
              src={project.coverImageUrl}
              alt=""
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]"
            />
          </div>
        )}

        {!isPinned && (
          <span className="px-4 pb-4 pt-2 text-[12px] text-text-tertiary">
            Updated {formatRelativeUpdated(project.updatedAt).toLowerCase()}
          </span>
        )}
      </Link>
    </GlassCard>
  );
}

/** Matches ProjectCard's "full" shape so the loading state doesn't jump. */
export function ProjectCardSkeleton() {
  return (
    <GlassCard className="flex flex-col overflow-hidden" aria-hidden="true">
      <div className="flex flex-col gap-2 p-4 pb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-chip" />
          <Skeleton className="h-5 w-16 rounded-chip" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="mx-4 h-52 rounded-card-image" />
    </GlassCard>
  );
}
