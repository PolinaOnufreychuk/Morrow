import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type PinnableEntityType = "project" | "collection" | "note" | "resource";

export interface PinnedRef {
  entityType: PinnableEntityType;
  id: string;
}

interface PinnedContextValue {
  pinned: PinnedRef | null;
  pin: (ref: PinnedRef) => void;
  unpin: () => void;
  /** Set while a card from a listing page is being dragged, so the sidebar can reveal the drop placeholder. */
  draggedRef: PinnedRef | null;
  setDraggedRef: (ref: PinnedRef | null) => void;
}

const PinnedContext = createContext<PinnedContextValue | null>(null);

/**
 * Sidebar's single pinned item, generic across entity types. Plain React
 * Context — same pattern as SidebarContext, no Zustand, no persistence
 * (the rest of the app is in-memory fixture data that resets on reload too).
 */
export function PinnedProvider({ children }: { children: ReactNode }) {
  const [pinned, setPinned] = useState<PinnedRef | null>(null);
  const [draggedRef, setDraggedRef] = useState<PinnedRef | null>(null);

  const pin = useCallback((ref: PinnedRef) => setPinned(ref), []);
  const unpin = useCallback(() => setPinned(null), []);

  const value = useMemo<PinnedContextValue>(
    () => ({ pinned, pin, unpin, draggedRef, setDraggedRef }),
    [pinned, pin, unpin, draggedRef],
  );

  return <PinnedContext.Provider value={value}>{children}</PinnedContext.Provider>;
}

export function usePinned(): PinnedContextValue {
  const context = useContext(PinnedContext);
  if (!context) {
    throw new Error("usePinned must be used within a PinnedProvider");
  }
  return context;
}
