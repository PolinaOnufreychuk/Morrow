import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@/design-system/icons/Icon";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddDashedTile } from "@/components/shared/AddDashedTile";
import { Switch } from "@/components/ui/switch";
import { useBoard, useBoardReferences } from "../hooks/useInspiration";
import { ReferenceGridItem } from "../components/ReferenceGridItem";
import { ReferenceMultiSelectBar } from "../components/ReferenceMultiSelectBar";
import { RefPreviewLightbox } from "../components/RefPreviewLightbox";
import { BoardEditModal } from "../components/BoardEditModal";

export function BoardDetailPage() {
  const { boardId = "" } = useParams();
  const { data: board } = useBoard(boardId);
  const { data: references = [] } = useBoardReferences(boardId);

  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  if (!board) {
    return (
      <EmptyState
        title="Board not found"
        description="This board may have been deleted or archived."
        action={
          <Link to="/inspiration" className="text-sage-700 underline underline-offset-2">
            Back to inspiration
          </Link>
        }
      />
    );
  }

  const toggleSelect = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/inspiration"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary"
      >
        <Icon name="arrow-left" size={16} />
        Inspiration
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-light leading-tight text-text-primary">{board.title}</h1>
          {board.notes && <p className="text-[14px] text-text-secondary">{board.notes}</p>}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[13px] text-text-secondary">
            <span>Edit mode</span>
            <Switch checked={editMode} onCheckedChange={setEditMode} />
          </label>
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit board
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 board:grid-cols-4">
        {references.map((reference, index) => (
          <ReferenceGridItem
            key={reference.id}
            reference={reference}
            index={index}
            onOpen={setLightboxIndex}
            selectable={editMode}
            selected={selected.includes(reference.id)}
            onToggleSelect={toggleSelect}
            showDragHandle={editMode}
          />
        ))}
        {editMode && <AddDashedTile label="Add reference" className="aspect-square min-h-0" />}
      </div>

      <ReferenceMultiSelectBar
        selectedCount={selected.length}
        onRemoveSelected={() => setSelected([])}
        onClearSelection={() => setSelected([])}
      />

      <RefPreviewLightbox
        references={references}
        activeIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      <BoardEditModal open={editOpen} onOpenChange={setEditOpen} board={board} />
    </div>
  );
}
