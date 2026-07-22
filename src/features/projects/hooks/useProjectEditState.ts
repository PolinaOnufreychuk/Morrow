import { useState } from "react";
import { useUpdateProject } from "./useProjects";
import type { ExternalLink, Project, ProjectAttachment } from "@/types/entities";

export interface ProjectDraft {
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  externalLinks: ExternalLink[];
  attachments: ProjectAttachment[];
  notes: string | null;
}

function toDraft(project: Project): ProjectDraft {
  return {
    title: project.title,
    description: project.description,
    coverImageUrl: project.coverImageUrl,
    externalLinks: project.externalLinks,
    attachments: project.attachments,
    notes: project.notes,
  };
}

/**
 * Inline edit-mode state for the Project Details page. Only scalar fields are
 * staged in `draft` — linking/unlinking/creating boards, notes, and resources
 * happens as immediate mutations independent of Cancel/Save (confirmed
 * decision: undoing a just-created entity on Cancel would be surprising).
 * Status/Category/Due date live entirely in `ProjectInfoSidebar` now — they
 * save immediately and are never part of this staged draft.
 */
export function useProjectEditState(project: Project) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ProjectDraft>(() => toDraft(project));
  const updateProject = useUpdateProject();

  function startEditing() {
    setDraft(toDraft(project));
    setIsEditing(true);
  }

  function cancel() {
    setDraft(toDraft(project));
    setIsEditing(false);
  }

  function patch(next: Partial<ProjectDraft>) {
    setDraft((current) => ({ ...current, ...next }));
  }

  async function save() {
    await updateProject.mutateAsync({
      id: project.id,
      title: draft.title,
      description: draft.description,
      coverImageUrl: draft.coverImageUrl,
      externalLinks: draft.externalLinks,
      attachments: draft.attachments,
      notes: draft.notes,
    });
    setIsEditing(false);
  }

  return { isEditing, draft, patch, startEditing, cancel, save, isSaving: updateProject.isPending };
}
