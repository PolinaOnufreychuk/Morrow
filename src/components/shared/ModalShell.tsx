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
  /** Override the title's size/weight for a modal whose reference calls for it. Every other modal keeps the default. */
  titleClassName?: string;
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
  titleClassName,
  description,
  children,
  footer,
  className,
}: ModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="-mr-1 max-h-[60vh] overflow-y-auto pr-1">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
