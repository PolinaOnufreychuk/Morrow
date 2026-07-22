import type { ReactNode } from "react";
import { usePinned, type PinnableEntityType } from "@/context/PinnedContext";

export interface PinnableItemProps {
  entityType: PinnableEntityType;
  id: string;
  children: ReactNode;
  /** Turns off dragging without unmounting the wrapper — e.g. while a page's bulk-select edit mode is active. */
  disabled?: boolean;
}

/**
 * Makes a listing-page card draggable into the sidebar's Pinned slot. Only
 * used on the four primary listing pages (Projects/Inspiration/Notes/
 * Resources) — never on Dashboard, embedded content, or Archive.
 */
export function PinnableItem({ entityType, id, children, disabled = false }: PinnableItemProps) {
  const { setDraggedRef } = usePinned();

  if (disabled) return <>{children}</>;

  return (
    <div
      draggable
      onDragStart={(event) => {
        // Firefox requires data to be set for the drag to initiate; the
        // actual payload travels via context state, not dataTransfer.
        event.dataTransfer.setData("text/plain", id);
        event.dataTransfer.effectAllowed = "copy";
        setDraggedRef({ entityType, id });
      }}
      onDragEnd={() => setDraggedRef(null)}
    >
      {children}
    </div>
  );
}
