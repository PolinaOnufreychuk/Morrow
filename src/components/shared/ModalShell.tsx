import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
  /** "end" (default) right-aligns footer actions, e.g. ConfirmDialog's
   * Cancel+Confirm pair. "stretch" fills the row — pair with a single
   * `<Button fullWidth>` for a modal's lone terminal CTA. */
  footerAlign?: "end" | "stretch";
  /** Static, decorative image shown as a short edge-to-edge strip at the very
   * top of the modal, replacing the text header's gradient underline. Only
   * used by modals that have a real cover-image concept (Project/Board/
   * Resource create+edit) — NOT tied to the record's own uploaded image.
   * When set, title/description render centered below the image and the
   * body is wrapped in a single bordered card. */
  heroImage?: string;
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
  footerAlign = "end",
  heroImage,
  className,
}: ModalShellProps) {
  if (heroImage) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("overflow-hidden p-0", className)}>
          <img src={heroImage} alt="" className="h-20 w-full object-cover" />

          <div className="flex flex-col items-center gap-1 px-8 pt-4 text-center">
            <h2 className={cn("font-display text-[28px] font-light text-text-primary", titleClassName)}>
              {title}
            </h2>
            {description && <p className="text-[13px] text-text-secondary">{description}</p>}
          </div>

          <div className="px-8 pb-2 pt-4">
            <div className="h-[360px] overflow-y-auto rounded-card border border-border-subtle p-6">
              {children}
            </div>
          </div>

          {footer && (
            <div
              className={cn(
                "flex gap-2 px-8 pb-8 pt-6",
                footerAlign === "end" ? "justify-end" : "flex-col",
              )}
            >
              {footer}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="-mr-1 flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-1">{children}</div>
        {footer && (
          <div className={cn("mt-6 flex gap-2", footerAlign === "end" ? "justify-end" : "flex-col")}>
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
