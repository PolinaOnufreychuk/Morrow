import { type ReactNode } from "react";
import { Icon } from "@/design-system/icons/Icon";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { SidebarNavItem } from "./SidebarNavItem";

/**
 * Collapsible primary navigation. Width animates 264px ↔ 78px with
 * `ease-breath`. Explicitly NO profile/avatar footer — single-user app
 * (docs/DESIGN.md). Archive is pinned to the bottom of the nav.
 *
 * Nav glyphs are simple inline SVGs kept local to the sidebar — the shared
 * Icon set is intentionally minimal (search/close/chevron/plus/dots/arrow)
 * per the scaffolding brief, so per-destination glyphs live here.
 */
const NAV_GLYPH = {
  dashboard: (
    <NavGlyph>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="12" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="12" width="7" height="7" rx="2" />
      <rect x="12" y="12" width="7" height="7" rx="2" />
    </NavGlyph>
  ),
  projects: (
    <NavGlyph>
      <path d="M3 6.5a2 2 0 0 1 2-2h3l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </NavGlyph>
  ),
  inspiration: (
    <NavGlyph>
      <rect x="3" y="3" width="16" height="16" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.8" />
      <path d="m4 15 4-4 4 4 3-3 4 4" />
    </NavGlyph>
  ),
  notes: (
    <NavGlyph>
      <path d="M6 3h7l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M13 3v5h5" />
    </NavGlyph>
  ),
  resources: (
    <NavGlyph>
      <path d="M9 12a3 3 0 0 0 4.5.3l2.5-2.5a3 3 0 0 0-4.2-4.2L10.5 6.8" />
      <path d="M13 10a3 3 0 0 0-4.5-.3L6 12.2a3 3 0 0 0 4.2 4.2l1.3-1.2" />
    </NavGlyph>
  ),
  archive: (
    <NavGlyph>
      <rect x="3" y="4" width="16" height="4" rx="1.5" />
      <path d="M4.5 8v9a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V8" />
      <path d="M9 12h4" />
    </NavGlyph>
  ),
} satisfies Record<string, ReactNode>;

function NavGlyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const PRIMARY_NAV = [
  { to: "/", label: "Dashboard", icon: NAV_GLYPH.dashboard, end: true },
  { to: "/projects", label: "Projects", icon: NAV_GLYPH.projects },
  { to: "/inspiration", label: "Inspiration", icon: NAV_GLYPH.inspiration },
  { to: "/notes", label: "Notes", icon: NAV_GLYPH.notes },
  { to: "/resources", label: "Resources", icon: NAV_GLYPH.resources },
] as const;

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "glass-sidebar sticky top-0 flex h-screen flex-col rounded-none p-4 transition-[width] duration-medium ease-breath",
        collapsed ? "w-[78px]" : "w-[264px]",
      )}
    >
      {/* Brand + collapse toggle */}
      <div className={cn("mb-6 flex items-center gap-2", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <span className="font-display text-[22px] font-light text-text-primary">Morrow</span>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-8 items-center justify-center rounded-chip text-text-secondary transition-colors duration-fast ease-out hover:bg-surface-card/60 hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon
            name="chevron-right"
            size={18}
            className={cn("transition-transform duration-medium ease-breath", !collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {PRIMARY_NAV.map((item) => (
          <SidebarNavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
            end={"end" in item ? item.end : undefined}
          />
        ))}
      </nav>

      {/* Archive pinned to the bottom — replaces the old account section. */}
      <div className="mt-auto border-t border-border-subtle pt-2">
        <SidebarNavItem
          to="/archive"
          label="Archive"
          icon={NAV_GLYPH.archive}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
