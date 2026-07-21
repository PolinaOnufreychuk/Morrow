import { Button } from "@/components/ui/button";
import { ModalShell } from "./ModalShell";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
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
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      className="max-w-sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <span className="sr-only">{title}</span>
    </ModalShell>
  );
}
