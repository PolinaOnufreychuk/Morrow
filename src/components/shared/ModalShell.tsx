import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ModalShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Footer actions — never include a redundant Cancel; the X closes the modal. */
  footer?: ReactNode;
  className?: string;
}

/**
 * Glass scrim + centered panel + built-in close button (subtle light-gray
 * circular background — provided by DialogContent). Per docs/DESIGN.md's
 * Modals rule: no redundant Cancel button when the X exists.
 */
export function ModalShell({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: ModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
