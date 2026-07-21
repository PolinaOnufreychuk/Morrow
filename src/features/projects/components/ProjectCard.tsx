import { Link } from "react-router-dom";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { Badge } from "@/components/ui/badge";
import { formatRelativeDeadline } from "@/lib/format";
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
        {project.coverImageUrl && (
          <div className={cn("m-2 overflow-hidden rounded-card-image", isFull ? "h-52" : "h-40")}>
            <img
              src={project.coverImageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 p-4 pt-2">
          <div className="flex items-center justify-between gap-2">
            <StatusPill status={project.status} />
            <span className="text-[12px] text-text-tertiary">
              {formatRelativeDeadline(project.deadline)}
            </span>
          </div>

          <h3 className="text-[16px] font-medium leading-snug text-text-primary">
            {project.title}
          </h3>

          {isFull && project.description && (
            <p className="line-clamp-2 text-[13px] text-text-secondary">{project.description}</p>
          )}

          {project.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {project.tags.slice(0, isFull ? 6 : 3).map((tag) => (
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
