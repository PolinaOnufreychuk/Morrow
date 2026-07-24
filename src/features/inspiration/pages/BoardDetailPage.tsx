import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@/design-system/icons/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddDashedTile } from "@/components/shared/AddDashedTile";
import { PageShell } from "@/components/shared/PageShell";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import {
  useAddReferences,
  useBoard,
  useBoardReferences,
  useDeleteBoard,
  useRemoveReferences,
} from "../hooks/useInspiration";
import { useBoardEditState } from "../hooks/useBoardEditState";
import { ReferenceGridItem } from "../components/ReferenceGridItem";
import { ReferenceMultiSelectBar } from "../components/ReferenceMultiSelectBar";
import { RefPreviewLightbox } from "../components/RefPreviewLightbox";
import { AddReferenceModal } from "../components/AddReferenceModal";
import { INSPIRATION_CATEGORY_OPTIONS } from "../types";
import type { InspirationBoard } from "@/types/entities";

const CATEGORY_SELECT_OPTIONS = INSPIRATION_CATEGORY_OPTIONS.map((value) => ({ value, label: value }));

export function BoardDetailPage() {
  const { boardId = "" } = useParams();
  // Keyed on boardId so all local state (edit mode, selection, open modals)
  // resets if this page is ever navigated board-to-board without unmounting.
  return <BoardDetailPageContent key={boardId} boardId={boardId} />;
}

const EMPTY_BOARD: InspirationBoard = {
  id: "",
  title: "",
  coverImageUrl: null,
  tags: [],
  notes: null,
  projectId: null,
  isArchived: false,
  createdAt: "",
  updatedAt: "",
};

function BoardDetailPageContent({ boardId }: { boardId: string }) {
  const { data: board } = useBoard(boardId);
  const { data: references = [] } = useBoardReferences(boardId);

  const [selected, setSelected] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [addReferenceOpen, setAddReferenceOpen] = useState(false);
  const [deleteBoardOpen, setDeleteBoardOpen] = useState(false);
  const [deleteRefsOpen, setDeleteRefsOpen] = useState(false);

  const addReferences = useAddReferences(boardId);
  const removeReferences = useRemoveReferences(boardId);
  const deleteBoard = useDeleteBoard();
  const navigate = useNavigate();
  // Hooks must run unconditionally — `board` may still be undefined here.
  const editState = useBoardEditState(board ?? EMPTY_BOARD);

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

  const handleSave = async () => {
    try {
      await editState.save();
      notify.success("Board updated");
    } catch {
      notify.error("Couldn't update this board.");
    }
  };

  const handleCancelEdit = () => {
    editState.cancel();
    setSelected([]);
  };

  const handleDeleteSelected = async () => {
    await removeReferences.mutateAsync(selected);
    notify.success(`${selected.length} reference${selected.length === 1 ? "" : "s"} deleted`);
    setSelected([]);
  };

  const selectedCategory = editState.draft.tags[0] ?? INSPIRATION_CATEGORY_OPTIONS[0];

  return (
    <PageShell>
      <Link
        to="/inspiration"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary"
      >
        <Icon name="arrow-left" size={16} />
        Back to inspiration
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          {editState.isEditing ? (
            <Input
              value={editState.draft.title}
              onChange={(event) => editState.patch({ title: event.target.value })}
              className="h-auto border-none bg-transparent p-0 font-display text-[34px] font-light leading-tight shadow-none focus-visible:ring-1"
              aria-label="Board title"
            />
          ) : (
            <h1 className="font-display text-[34px] font-light leading-tight text-text-primary [text-wrap:balance]">
              {board.title}
            </h1>
          )}

          {editState.isEditing ? (
            <Textarea
              value={editState.draft.notes ?? ""}
              onChange={(event) => editState.patch({ notes: event.target.value })}
              placeholder="What's this collection about?"
              rows={2}
              className="min-h-0 resize-none border-none bg-transparent p-0 text-[14px] text-text-secondary shadow-none focus-visible:ring-1"
            />
          ) : (
            board.notes && <p className="text-[14px] text-text-secondary">{board.notes}</p>
          )}

          <div className="flex items-center gap-2">
            {editState.isEditing ? (
              <PropertyDropdown
                options={CATEGORY_SELECT_OPTIONS}
                value={selectedCategory}
                onValueChange={(value) => editState.patch({ tags: [value] })}
                triggerClassName="h-7 rounded-chip border-border-subtle bg-transparent px-2 text-[12.5px]"
              />
            ) : (
              board.tags[0] && <Badge variant="outline">{board.tags[0]}</Badge>
            )}
            <span className="text-[12.5px] text-text-tertiary">{references.length} saved</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editState.isEditing ? (
            <>
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={editState.isSaving}>
                Save changes
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setAddReferenceOpen(true)}>
                <Icon name="plus" size={17} />
                Add reference
              </Button>
              <EntityOverflowMenu
                entityType="collection"
                onEdit={editState.startEditing}
                onDelete={() => setDeleteBoardOpen(true)}
                triggerClassName="h-10 w-10 rounded-button border border-border-default bg-surface-card text-text-secondary hover:bg-cream-100 hover:text-text-primary"
              />
            </>
          )}
        </div>
      </div>

      <div className="masonry4">
        {references.map((reference, index) => (
          <div key={reference.id} className="masonry-item">
            <ReferenceGridItem
              reference={reference}
              index={index}
              onOpen={setLightboxIndex}
              selectable={editState.isEditing}
              selected={selected.includes(reference.id)}
              onToggleSelect={toggleSelect}
            />
          </div>
        ))}
        <div className="masonry-item">
          <AddDashedTile
            className="aspect-square min-h-0"
            onClick={() => setAddReferenceOpen(true)}
            aria-label="Add reference"
          />
        </div>
      </div>

      <ReferenceMultiSelectBar
        selectedCount={editState.isEditing ? selected.length : 0}
        onDeleteSelected={() => setDeleteRefsOpen(true)}
        onClearSelection={() => setSelected([])}
        isBusy={removeReferences.isPending}
      />

      <RefPreviewLightbox
        references={references}
        activeIndex={lightboxIndex}
        onNavigate={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      <AddReferenceModal
        open={addReferenceOpen}
        onOpenChange={setAddReferenceOpen}
        onAdd={(inputs) => {
          addReferences.mutate(inputs, {
            onSuccess: (created) =>
              notify.success(`${created.length} reference${created.length === 1 ? "" : "s"} added`),
            onError: () => notify.error("Couldn't add these references."),
          });
        }}
      />

      <ConfirmDialog
        open={deleteRefsOpen}
        onOpenChange={setDeleteRefsOpen}
        title={`Delete ${selected.length} reference${selected.length === 1 ? "" : "s"}?`}
        description="This action cannot be undone."
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        destructive
        onConfirm={handleDeleteSelected}
      />

      <ConfirmDialog
        open={deleteBoardOpen}
        onOpenChange={setDeleteBoardOpen}
        title="Delete board?"
        description={`"${board.title}" and all its references will be permanently removed.`}
        confirmLabel="Delete board"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          await deleteBoard.mutateAsync(board.id);
          notify.success(`"${board.title}" deleted`);
          navigate("/inspiration");
        }}
      />
    </PageShell>
  );
}
