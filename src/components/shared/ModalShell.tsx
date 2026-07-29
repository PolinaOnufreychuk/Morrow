import { useEffect, useRef, useState, type ReactNode } from "react";
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
  /** Small uppercase context row above the title (e.g. a tag + hostname) —
   * styled to the design system's eyebrow spec, not ad hoc per modal. */
  eyebrow?: ReactNode;
  description?: string;
  children: ReactNode;
  /** Footer actions — never include a redundant Cancel; the X closes the modal. */
  footer?: ReactNode;
  /** "end" (default) right-aligns footer actions, e.g. ConfirmDialog's
   * Cancel+Confirm pair. "stretch" fills the row — pair with a single
   * `<Button fullWidth>` for a modal's lone terminal CTA. "split" lays
   * footer children out in a row where each button controls its own width
   * (e.g. a narrow Cancel + a wider primary CTA). */
  footerAlign?: "end" | "stretch" | "split";
  /** Static, decorative image shown as a short edge-to-edge strip at the very
   * top of the modal, replacing the text header's gradient underline. Only
   * used by modals that have a real cover-image concept (Project/Board/
   * Resource create+edit) — NOT tied to the record's own uploaded image.
   * When set, title/description render centered below the image and the
   * body is wrapped in a single bordered card. */
  heroImage?: string;
  /** Opt-in "New project" mockup treatment: the hero image grows tall and
   * the title overlays it in white, centered — no description line, and the
   * modal's corners round out further. Every other heroImage modal
   * (Board/Resource create+edit) keeps the current thin-strip layout. */
  heroTitleOverlay?: boolean;
  /** For a hero banner whose artwork already renders the title (e.g. the
   * "New note" picker's baked-in wordmark): suppress the visible `<h2>`
   * overlay so it isn't doubled, while still emitting a screen-reader-only
   * `DialogTitle` for accessibility. Only meaningful with `heroTitleOverlay`. */
  heroTitleInImage?: boolean;
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
  eyebrow,
  description,
  children,
  footer,
  footerAlign = "end",
  heroImage,
  heroTitleOverlay = false,
  heroTitleInImage = false,
  className,
}: ModalShellProps) {
  // Fade the hero-overlay body's edges so content dissolves under the banner
  // (top) and above the footer buttons (bottom) instead of hard-clipping —
  // each edge only fades when there's hidden content past it.
  const bodyRef = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState({ top: false, bottom: false });

  const updateFade = (el: HTMLDivElement) => {
    const top = el.scrollTop > 4;
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 4;
    setFade((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
  };

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      if (bodyRef.current) updateFade(bodyRef.current);
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Top edge dissolves fully (content tucks under the banner); the bottom is a
  // gentler, shorter dim (partial alpha) so it reads subtly, not as a heavy wash.
  const bodyMask =
    fade.top || fade.bottom
      ? `linear-gradient(to bottom, ${fade.top ? "transparent, #000 32px" : "#000 0"}, ${
          fade.bottom ? "#000 calc(100% - 18px), rgba(0,0,0,0.45) 100%" : "#000 100%"
        })`
      : undefined;

  if (heroImage && heroTitleOverlay) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          hideCloseButton
          className={cn("max-w-[500px] rounded-[30px] p-4", className)}
        >
          <div className="relative h-28 overflow-hidden rounded-[22px]">
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
            {heroTitleInImage ? (
              <DialogTitle className="sr-only">{title}</DialogTitle>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-7 text-center">
                {eyebrow && <div className="flex items-center gap-2">{eyebrow}</div>}
                <h2 className={cn("font-display text-[30px] font-normal text-white/90", titleClassName)}>
                  {title}
                </h2>
              </div>
            )}
          </div>

          <div
            ref={bodyRef}
            className="max-h-[62vh] overflow-y-auto px-0 pb-1 pt-3"
            onScroll={(e) => updateFade(e.currentTarget)}
            style={bodyMask ? { maskImage: bodyMask, WebkitMaskImage: bodyMask } : undefined}
          >
            {children}
          </div>

          {footer && (
            <div
              className={cn(
                "flex gap-3 px-0 pb-0 pt-3",
                footerAlign === "end" && "justify-end",
                footerAlign === "stretch" && "flex-col",
              )}
            >
              {footer}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  if (heroImage) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("overflow-hidden p-0", className)}>
          <img src={heroImage} alt="" className="h-16 w-full object-cover" />

          <div className="flex flex-col items-center gap-1.5 px-7 pt-4 text-center">
            {eyebrow && <div className="flex items-center gap-2">{eyebrow}</div>}
            <h2 className={cn("font-display text-[28px] font-light text-text-primary", titleClassName)}>
              {title}
            </h2>
            {description && <p className="text-[13px] text-text-secondary">{description}</p>}
          </div>

          <div className="px-7 pb-2 pt-4">
            <div className="h-[360px] overflow-y-auto rounded-card border border-border-subtle p-6">
              {children}
            </div>
          </div>

          {footer && (
            <div
              className={cn(
                "flex gap-2 px-7 pb-7 pt-4",
                footerAlign === "end" && "justify-end",
                footerAlign === "stretch" && "flex-col",
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
          {eyebrow && <div className="flex items-center gap-2">{eyebrow}</div>}
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="-mr-1 flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-1">{children}</div>
        {footer && (
          <div
            className={cn(
              "mt-6 flex gap-2",
              footerAlign === "end" && "justify-end",
              footerAlign === "stretch" && "flex-col",
            )}
          >
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
