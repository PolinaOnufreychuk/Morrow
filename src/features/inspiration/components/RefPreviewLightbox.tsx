import { useCallback, useEffect, useRef } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { hostnameOf } from "@/lib/format";
import type { InspirationReference } from "@/types/entities";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export interface RefPreviewLightboxProps {
  references: InspirationReference[];
  /** Index of the currently shown reference, or null when closed. */
  activeIndex: number | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

/**
 * Fullscreen reference viewer — entirely new (not in the wireframe export).
 * Blurred backdrop, prev/next navigation, close. Keyboard: ←/→/Esc.
 * Motion/glass language matches the rest of the system.
 */
export function RefPreviewLightbox({
  references,
  activeIndex,
  onNavigate,
  onClose,
}: RefPreviewLightboxProps) {
  const isOpen = activeIndex !== null;
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex - 1 + references.length) % references.length);
  }, [activeIndex, references.length, onNavigate]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    onNavigate((activeIndex + 1) % references.length);
  }, [activeIndex, references.length, onNavigate]);

  // Focus trap: move focus in on open, cycle Tab within the overlay, and
  // restore focus to whatever opened the lightbox on close — this is a
  // hand-rolled overlay (not Radix Dialog), so none of that comes for free.
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "Tab") {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, goPrev, goNext]);

  if (activeIndex === null) return null;
  const reference = references[activeIndex];
  if (!reference) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Reference preview"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-button bg-surface-card/85 text-text-primary backdrop-blur-sm transition-colors duration-fast ease-out hover:bg-surface-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icon name="close" size={18} />
      </button>

      {references.length > 1 && (
        <>
          <NavButton side="left" onClick={goPrev} />
          <NavButton side="right" onClick={goNext} />
        </>
      )}

      <figure
        className="flex max-h-[85vh] max-w-[85vw] flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        {reference.imageUrl ? (
          <img
            src={reference.imageUrl}
            alt=""
            className="max-h-[78vh] max-w-full rounded-card object-contain shadow-hover"
          />
        ) : (
          <div className="flex h-[50vh] w-[60vw] max-w-full items-center justify-center rounded-card bg-surface-card/15 text-[14px] text-cream-50/80">
            {reference.sourceUrl ? hostnameOf(reference.sourceUrl) : "No preview available"}
          </div>
        )}
        <figcaption className="flex items-center gap-3 text-[13px] text-cream-50/90">
          <span>
            {activeIndex + 1} / {references.length}
          </span>
          {reference.sourceUrl && (
            <a
              href={reference.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
              onClick={(event) => event.stopPropagation()}
            >
              Source
            </a>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={side === "left" ? "Previous reference" : "Next reference"}
      className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-button bg-surface-card/85 text-text-primary backdrop-blur-sm transition-colors duration-fast ease-out hover:bg-surface-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        side === "left" ? "left-5" : "right-5"
      }`}
    >
      <Icon name="arrow-left" size={19} className={side === "right" ? "rotate-180" : undefined} />
    </button>
  );
}
