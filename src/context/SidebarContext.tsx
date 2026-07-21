import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * The only genuinely global, cross-route piece of state in the app:
 * whether the sidebar is collapsed. Plain React Context — no Zustand
 * (per the architecture brief).
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  const value = useMemo<SidebarContextValue>(
    () => ({ collapsed, toggle, setCollapsed }),
    [collapsed, toggle],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
