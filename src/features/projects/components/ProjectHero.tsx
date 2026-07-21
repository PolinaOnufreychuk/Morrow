import { Badge } from "@/components/ui/badge";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import type { Project } from "@/types/entities";

export interface ProjectHeroProps {
  project: Project;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

/**
 * Project Details hero — a SMALLER hero image with tags overlaid ON the
 * image and the overflow menu positioned ON the image (docs/DESIGN.md).
 * This is a deliberate gap-fix vs the wireframe export, which never placed
 * tags/menu on the image.
 */
export function ProjectHero({ project, onEdit, onArchive, onDelete }: ProjectHeroProps) {
  return (
    <div className="relative h-[240px] w-full overflow-hidden rounded-card board:h-[300px]">
      {project.coverImageUrl ? (
        <img src={project.coverImageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-sage-100" />
      )}

      {/* Legibility scrim so overlaid controls stay readable on any image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-ink-900/5 to-ink-900/15" />

      {/* Menu — positioned ON the image, top-right. */}
      <div className="absolute right-3 top-3">
        <EntityOverflowMenu
          entityType="project"
          onEdit={onEdit}
          onArchive={onArchive}
          onDelete={onDelete}
          triggerClassName="bg-surface-card/80 backdrop-blur-sm text-text-primary"
        />
      </div>

      {/* Tags — overlaid ON the image, bottom-left. */}
      {project.tags.length > 0 && (
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="dark" className="bg-ink-900/55 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
