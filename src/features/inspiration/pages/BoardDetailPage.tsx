import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@/design-system/icons/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyDropdown } from "@/components/shared/PropertyDropdown";
import { EmptyState } from "@/components/shared/EmptyState";
import { AddDashedTile } from "@/components/shared/AddDashedTile";
import { PageShell } from "@/components/shared/PageShell";
import { BackLink } from "@/components/shared/BackLink";
import { EntityOverflowMenu } from "@/components/shared/EntityOverflowMenu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { notify } from "@/components/shared/Toast";
import { useBackContext } from "@/lib/navigation";
import {
  useAddReferences,
  useArchiveBoard,
  useBoard,
  useBoardReferences,
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
  projectIds: [],
  isArchived: false,
  archivedAt: null,
  createdAt: "",
  updatedAt: "",
};

function BoardDetailPageContent({ boardId }: { boardId: string }) {
  const back = useBackContext({ path: "/inspiration", label: "Inspiration" });
  const { data: board } = useBoard(boardId);
  const { data: references = [] } = useBoardReferences(boardId);

  const [selected, setSelected] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [addReferenceOpen, setAddReferenceOpen] = useState(false);
  const [deleteBoardOpen, setDeleteBoardOpen] = useState(false);
  const [deleteRefsOpen, setDeleteRefsOpen] = useState(false);

  const addReferences = useAddReferences(boardId);
  const removeReferences = useRemoveReferences(boardId);
  // "Delete" moves the board to Archive (soft-delete); the Archive screen's
  // own "Delete permanently" is the only real hard-delete path.
  const archiveBoard = useArchiveBoard();
  const navigate = useNavigate();
  // Hooks must run unconditionally — `board` may still be undefined here.
  const editState = useBoardEditState(board ?? EMPTY_BOARD);

  // Grows the notes textarea to match its content height so entering edit mode
  // doesn't add extra blank space beyond what the read-mode paragraph occupied.
  const notesTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  useLayoutEffect(() => {
    const el = notesTextareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [editState.isEditing, editState.draft.notes]);

  if (!board) {
    return (
      <EmptyState
        title="Board not found"
        description="This board may have been deleted or archived."
        action={
          <BackLink to={back.path} label={back.label} />
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
      <BackLink to={back.path} label={back.label} />

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
              ref={notesTextareaRef}
              value={editState.draft.notes ?? ""}
              onChange={(event) => editState.patch({ notes: event.target.value })}
              placeholder="What's this collection about?"
              rows={1}
              className="min-h-0 resize-none overflow-hidden border-none bg-transparent p-0 text-[14px] leading-normal text-text-secondary shadow-none focus-visible:ring-1"
            />
          ) : (
            board.notes && <p className="text-[14px] leading-normal text-text-secondary">{board.notes}</p>
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

      <div className="masonry4 mt-2">
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
        description={`"${board.title}" will be moved to Archive and permanently deleted in 7 days.`}
        confirmLabel="Delete board"
        pendingLabel="Deleting…"
        destructive
        onConfirm={async () => {
          await archiveBoard.mutateAsync(board.id);
          notify.success(`"${board.title}" moved to Archive`);
          navigate("/inspiration");
        }}
      />
    </PageShell>
  );
}
