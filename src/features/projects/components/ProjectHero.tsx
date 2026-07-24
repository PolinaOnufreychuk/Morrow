import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/design-system/icons/Icon";
import { StatusPill } from "@/components/shared/StatusPill";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import type { Project } from "@/types/entities";

export interface ProjectHeroProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  editMode?: boolean;
  coverImageUrl?: string | null;
  onChangeCover?: (url: string) => void;
}

/**
 * Project Details hero — a SMALLER hero image with status + tags overlaid ON
 * the image and the overflow menu positioned ON the image (docs/DESIGN.md).
 * In edit mode, the tags/menu overlay is replaced by a "Change cover"
 * affordance (a small inline URL input — no real file upload exists in this
 * stack, matching how cover images work everywhere else in the app).
 */
export function ProjectHero({
  project,
  onEdit,
  onDelete,
  editMode = false,
  coverImageUrl,
  onChangeCover,
}: ProjectHeroProps) {
  const [changingCover, setChangingCover] = useState(false);
  const [draftCover, setDraftCover] = useState("");
  const resolvedCover = coverImageUrl ?? project.coverImageUrl;

  // Reset the inline "change cover" affordance whenever edit mode ends (e.g.
  // via the page-level Cancel button) so re-entering edit mode never
  // resurfaces a stale, half-filled input.
  useEffect(() => {
    if (!editMode) setChangingCover(false);
  }, [editMode]);

  return (
    <div className="relative h-[160px] w-full overflow-hidden rounded-card board:h-[200px]">
      {resolvedCover ? (
        <img src={resolvedCover} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-sage-100" />
      )}

      {/* Legibility scrim so overlaid controls stay readable on any image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/45 via-ink-900/5 to-ink-900/15" />

      {editMode ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {changingCover ? (
            <div className="flex items-center gap-2 rounded-chip bg-surface-card/90 p-2 backdrop-blur-sm">
              <Input
                autoFocus
                value={draftCover}
                onChange={(event) => setDraftCover(event.target.value)}
                placeholder="https://…"
                type="url"
                className="w-[260px]"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onChangeCover?.(draftCover.trim());
                  setChangingCover(false);
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="bg-surface-card/90 backdrop-blur-sm"
              onClick={() => {
                setDraftCover(resolvedCover ?? "");
                setChangingCover(true);
              }}
            >
              <Icon name="image" size={16} />
              Change cover
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Menu — positioned ON the image, top-right. */}
          <div className="absolute right-3 top-3">
            <EntityOverflowMenu
              entityType="project"
              onEdit={onEdit}
              onDelete={onDelete}
              triggerClassName="bg-surface-card/80 backdrop-blur-sm text-text-primary"
            />
          </div>

          {/* Status + category — overlaid ON the image, top-left. */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <StatusPill status={project.status} />
            {project.category && (
              <Badge variant="outline" className="bg-surface-card/80 backdrop-blur-sm">
                {project.category}
              </Badge>
            )}
          </div>
        </>
      )}
    </div>
  );
}
