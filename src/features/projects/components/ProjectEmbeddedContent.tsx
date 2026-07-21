import { type ReactNode } from "react";
import { InspirationCard } from "@/features/inspiration/components/InspirationCard";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { ResourceCard } from "@/features/resources/components/ResourceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { InspirationBoard, Note, Resource } from "@/types/entities";

export interface ProjectEmbeddedContentProps {
  boards: InspirationBoard[];
  notes: Note[];
  resources: Resource[];
}

/**
 * Project-scoped content, rendered with each module's NATIVE card component
 * (never simplified white placeholders — docs/DESIGN.md: Cards). Divided
 * into clear sections per the flagship Project Details spec.
 */
export function ProjectEmbeddedContent({ boards, notes, resources }: ProjectEmbeddedContentProps) {
  const isEmpty = boards.length === 0 && notes.length === 0 && resources.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        title="Nothing linked yet"
        description="Inspiration boards, notes, and resources scoped to this project will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {boards.length > 0 && (
        <Section title="Inspiration">
          <div className="grid grid-cols-1 gap-4 board:grid-cols-2">
            {boards.map((board) => (
              <InspirationCard key={board.id} board={board} />
            ))}
          </div>
        </Section>
      )}

      {notes.length > 0 && (
        <Section title="Notes">
          <div className="grid grid-cols-1 gap-4 board:grid-cols-2">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </Section>
      )}

      {resources.length > 0 && (
        <Section title="Resources">
          <div className="grid grid-cols-1 gap-4 board:grid-cols-2">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[18px] font-medium text-text-primary">{title}</h2>
      {children}
    </section>
  );
}
