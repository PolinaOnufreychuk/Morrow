import { type ReactNode } from "react";
import { Icon } from "@/design-system/icons/Icon";

export interface RemovableCardOverlayProps {
  children: ReactNode;
  onRemove: () => void;
  show: boolean;
}

/**
 * Wraps a card (InspirationCard/NoteCard/ResourceCard) with a small "x"
 * button, shown only in edit mode, that unlinks the item from this project
 * without touching those cards' own props/signatures.
 */
export function RemovableCardOverlay({ children, onRemove, show }: RemovableCardOverlayProps) {
  return (
    <div className="relative">
      {children}
      {show && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove from project"
          className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-ink-900/70 text-cream-50 backdrop-blur-sm transition-colors duration-fast ease-out hover:bg-ink-900"
        >
          <Icon name="close" size={13} />
        </button>
      )}
    </div>
  );
}
