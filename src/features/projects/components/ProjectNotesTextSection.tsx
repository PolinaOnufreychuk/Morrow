import { Textarea } from "@/components/ui/textarea";
import { ProjectSection } from "./ProjectSection";

export interface ProjectNotesTextSectionProps {
  notes: string | null;
  editMode: boolean;
  onChange: (notes: string) => void;
}

/**
 * The project's own free-text `notes` field — distinct from the "Linked
 * notes" section (real `Note` entities). Named explicitly to avoid confusion
 * between the two on this page.
 */
export function ProjectNotesTextSection({ notes, editMode, onChange }: ProjectNotesTextSectionProps) {
  return (
    <ProjectSection eyebrow="Project notes">
      {editMode ? (
        <Textarea
          value={notes ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Anything worth remembering about this project…"
        />
      ) : notes ? (
        <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-text-secondary">{notes}</p>
      ) : (
        <p className="text-[13px] text-text-tertiary">No notes yet.</p>
      )}
    </ProjectSection>
  );
}
