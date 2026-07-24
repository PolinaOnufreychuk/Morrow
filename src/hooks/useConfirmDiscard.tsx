import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

/**
 * Guards a modal's close (X / Escape / overlay click) against silently
 * discarding unsaved edits. Pass the form's dirty state and its real
 * `onOpenChange`; render the returned `discardDialog` inside the modal.
 *
 * There was no existing "unsaved changes" pattern anywhere in the app before
 * this — every create/edit modal previously discarded typed input with zero
 * warning on close.
 */
export function useConfirmDiscard(isDirty: boolean, onOpenChange: (open: boolean) => void) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const guardedOnOpenChange = (next: boolean) => {
    if (!next && isDirty) {
      setConfirmOpen(true);
      return;
    }
    onOpenChange(next);
  };

  const discardDialog = (
    <ConfirmDialog
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      title="Discard changes?"
      description="Your changes haven't been saved."
      confirmLabel="Discard"
      destructive
      onConfirm={() => {
        setConfirmOpen(false);
        onOpenChange(false);
      }}
    />
  );

  return { guardedOnOpenChange, discardDialog };
}
