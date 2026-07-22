import { useState } from "react";
import { useUpdateProject } from "./useProjects";
import type { ExternalLink, ISODateString, Project, ProjectAttachment, ProjectStatus } from "@/types/entities";

export interface ProjectDraft {
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  status: ProjectStatus;
  deadline: ISODateString | null;
  category: string;
  externalLinks: ExternalLink[];
  attachments: ProjectAttachment[];
  notes: string | null;
}

function toDraft(project: Project): ProjectDraft {
  return {
    title: project.title,
    description: project.description,
    coverImageUrl: project.coverImageUrl,
    status: project.status,
    deadline: project.deadline,
    category: project.tags[0] ?? "",
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
    const restTags = project.tags.slice(1);
    const tags = draft.category.trim() ? [draft.category.trim(), ...restTags] : restTags;
    await updateProject.mutateAsync({
      id: project.id,
      title: draft.title,
      description: draft.description,
      coverImageUrl: draft.coverImageUrl,
      status: draft.status,
      deadline: draft.deadline,
      tags,
      externalLinks: draft.externalLinks,
      attachments: draft.attachments,
      notes: draft.notes,
    });
    setIsEditing(false);
  }

  return { isEditing, draft, patch, startEditing, cancel, save, isSaving: updateProject.isPending };
}
