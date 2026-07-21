import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalShell } from "./ModalShell";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  pendingLabel?: string;
  destructive?: boolean;
  /** May return a promise — the dialog shows a pending state and only
   * closes after it resolves; on rejection it stays open with an inline
   * error so the user can retry without re-triggering the whole flow. */
  onConfirm: () => void | Promise<void>;
}

/**
 * Confirmation modal. Reuses ModalShell; here a Cancel button IS present
 * because a confirm decision genuinely needs a paired negative action —
 * this is a deliberate exception to the "no Cancel next to X" rule, which
 * targets editor modals, not binary confirmations.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  pendingLabel,
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (isPending) return; // don't allow Escape/overlay-close mid-flight
    if (next) setError(null);
    onOpenChange(next);
  };

  const handleConfirm = async () => {
    setError(null);
    setIsPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      description={description}
      className="max-w-sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            onClick={handleConfirm}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (pendingLabel ?? "Working…") : confirmLabel}
          </Button>
        </>
      }
    >
      {error && (
        <p role="alert" className="text-[13px] text-blush-600">
          {error}
        </p>
      )}
    </ModalShell>
  );
}
