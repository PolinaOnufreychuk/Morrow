import { useState } from "react";
import { InspirationCard } from "@/features/inspiration/components/InspirationCard";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { ResourceCard } from "@/features/resources/components/ResourceCard";
import { useUpdateBoard } from "@/features/inspiration/hooks/useInspiration";
import { useUpdateNote } from "@/features/notes/hooks/useNotes";
import { useUpdateResource } from "@/features/resources/hooks/useResources";
import { BoardQuickCreateForm } from "@/features/inspiration/components/BoardQuickCreateForm";
import { NoteQuickCreateForm } from "@/features/notes/components/NoteQuickCreateForm";
import { ResourceQuickCreateForm } from "@/features/resources/components/ResourceQuickCreateForm";
import { Badge } from "@/components/ui/badge";
import { NOTE_TYPE_META } from "@/features/notes/noteTypeMeta";
import { ProjectSection } from "./ProjectSection";
import { AddDashedTile } from "@/components/shared/AddDashedTile";
import { RemovableCardOverlay } from "./RemovableCardOverlay";
import { LinkOrCreateModal } from "./LinkOrCreateModal";
import type { InspirationBoard, Note, Resource } from "@/types/entities";

export interface ProjectEmbeddedContentProps {
  projectId: string;
  boards: InspirationBoard[];
  notes: Note[];
  resources: Resource[];
  allBoards: InspirationBoard[];
  allNotes: Note[];
  allResources: Resource[];
  editMode: boolean;
}

// auto-fit keeps cards filling the full row width — up to three per row on
// wide screens, but never leaving a dead trailing column when fewer items
// are linked (a fixed grid-cols-3 would otherwise shrink cards and still
// leave empty space when there are only 1-2 items).
const CARD_GRID = "grid grid-cols-2 gap-4 board:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]";

/**
 * Project-scoped content, rendered with each module's NATIVE card component
 * (never simplified white placeholders — docs/DESIGN.md: Cards). Each of the
 * three sections always renders its shell + an Add tile, even when empty.
 */
export function ProjectEmbeddedContent({
  projectId,
  boards,
  notes,
  resources,
  allBoards,
  allNotes,
  allResources,
  editMode,
}: ProjectEmbeddedContentProps) {
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);

  const updateBoard = useUpdateBoard();
  const updateNote = useUpdateNote();
  const updateResource = useUpdateResource();

  return (
    <div className="flex flex-col gap-6">
      <ProjectSection eyebrow="Linked inspiration">
        <div className={CARD_GRID}>
          {boards.map((board) => (
            <RemovableCardOverlay
              key={board.id}
              show={editMode}
              onRemove={() => updateBoard.mutate({ id: board.id, projectId: null })}
            >
              <InspirationCard board={board} />
            </RemovableCardOverlay>
          ))}
          <AddDashedTile label="Create board" onClick={() => setBoardModalOpen(true)} />
        </div>
      </ProjectSection>

      <ProjectSection eyebrow="Linked notes">
        <div className={CARD_GRID}>
          {notes.map((note) => (
            <RemovableCardOverlay
              key={note.id}
              show={editMode}
              onRemove={() => updateNote.mutate({ id: note.id, projectId: null })}
            >
              <NoteCard note={note} />
            </RemovableCardOverlay>
          ))}
          <AddDashedTile label="Add note" onClick={() => setNoteModalOpen(true)} />
        </div>
      </ProjectSection>

      <ProjectSection eyebrow="Linked resources">
        <div className={CARD_GRID}>
          {resources.map((resource) => (
            <RemovableCardOverlay
              key={resource.id}
              show={editMode}
              onRemove={() => updateResource.mutate({ id: resource.id, projectId: null })}
            >
              <ResourceCard resource={resource} />
            </RemovableCardOverlay>
          ))}
          <AddDashedTile label="Link resource" onClick={() => setResourceModalOpen(true)} />
        </div>
      </ProjectSection>

      <LinkOrCreateModal
        open={boardModalOpen}
        onOpenChange={setBoardModalOpen}
        title="Add inspiration board"
        entityLabel="board"
        items={allBoards}
        projectId={projectId}
        onLinkExisting={(board) =>
          updateBoard.mutate({ id: board.id, projectId }, { onSuccess: () => setBoardModalOpen(false) })
        }
        isLinking={updateBoard.isPending}
        renderItemMeta={(board) => (
          <span className="flex items-center gap-2">
            {board.tags[0] && <Badge variant="outline">{board.tags[0]}</Badge>}
          </span>
        )}
        renderCreateForm={({ onCreated }) => (
          <BoardQuickCreateForm projectId={projectId} onCreated={onCreated} />
        )}
      />

      <LinkOrCreateModal
        open={noteModalOpen}
        onOpenChange={setNoteModalOpen}
        title="Add note"
        entityLabel="note"
        items={allNotes}
        projectId={projectId}
        onLinkExisting={(note) =>
          updateNote.mutate({ id: note.id, projectId }, { onSuccess: () => setNoteModalOpen(false) })
        }
        isLinking={updateNote.isPending}
        renderItemMeta={(note) => <Badge variant="outline">{NOTE_TYPE_META[note.type].label}</Badge>}
        renderCreateForm={({ onCreated }) => (
          <NoteQuickCreateForm projectId={projectId} onCreated={onCreated} />
        )}
      />

      <LinkOrCreateModal
        open={resourceModalOpen}
        onOpenChange={setResourceModalOpen}
        title="Link resource"
        entityLabel="resource"
        items={allResources}
        projectId={projectId}
        onLinkExisting={(resource) =>
          updateResource.mutate(
            { id: resource.id, projectId },
            { onSuccess: () => setResourceModalOpen(false) },
          )
        }
        isLinking={updateResource.isPending}
        renderItemMeta={(resource) => (
          <span className="flex items-center gap-2">
            {resource.tags[0] && <Badge variant="outline">{resource.tags[0]}</Badge>}
          </span>
        )}
        renderCreateForm={({ onCreated }) => (
          <ResourceQuickCreateForm projectId={projectId} onCreated={onCreated} />
        )}
      />
    </div>
  );
}
