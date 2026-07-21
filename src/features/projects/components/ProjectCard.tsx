import { Link } from "react-router-dom";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { Skeleton } from "@/components/shared/Skeleton";
import { Badge } from "@/components/ui/badge";
import { formatRelativeUpdated } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/entities";

export type ProjectCardVariant = "compact" | "full";

export interface ProjectCardProps {
  project: Project;
  variant?: ProjectCardVariant;
  onEdit?: (project: Project) => void;
  onArchive?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

/**
 * Project card. `compact` (~320px, used in grids/dashboard) and `full`
 * (masonry) variants share one component so the design never drifts.
 */
export function ProjectCard({
  project,
  variant = "compact",
  onEdit,
  onArchive,
  onDelete,
}: ProjectCardProps) {
  const isFull = variant === "full";
  return (
    <GlassCard
      interactive
      className={cn(
        "group relative flex flex-col overflow-hidden",
        variant === "compact" && "w-full max-w-[320px]",
      )}
    >
      <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-fast ease-out group-hover:opacity-100">
        <EntityOverflowMenu
          entityType="project"
          onEdit={onEdit ? () => onEdit(project) : undefined}
          onArchive={onArchive ? () => onArchive(project) : undefined}
          onDelete={onDelete ? () => onDelete(project) : undefined}
          triggerClassName="bg-surface-card/70 backdrop-blur-sm"
        />
      </div>

      <Link to={`/projects/${project.id}`} className="flex flex-col">
        <div className="flex flex-col gap-2 p-4 pb-2">
          <div className="flex items-center gap-2">
            <StatusPill status={project.status} />
            {project.tags[0] && <Badge variant="neutral">{project.tags[0]}</Badge>}
          </div>

          <h3 className="text-[16px] font-medium leading-snug text-text-primary">
            {project.title}
          </h3>

          {isFull && project.description && (
            <p className="line-clamp-2 text-[13px] text-text-secondary">{project.description}</p>
          )}
        </div>

        {project.coverImageUrl && (
          <div className={cn("mx-4 overflow-hidden rounded-card-image", isFull ? "h-52" : "h-40")}>
            <img
              src={project.coverImageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]"
            />
          </div>
        )}

        <span className="px-4 pb-4 pt-2 text-[12px] text-text-tertiary">
          Updated {formatRelativeUpdated(project.updatedAt).toLowerCase()}
        </span>
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
