import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSidebar } from "@/context/SidebarContext";
import { usePinned } from "@/context/PinnedContext";
import { queryKeys } from "@/lib/api/queryKeys";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AddDashedTile } from "@/components/shared/AddDashedTile";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { useProject } from "@/features/projects/hooks/useProjects";
import { InspirationCard } from "@/features/inspiration/components/InspirationCard";
import { useBoard } from "@/features/inspiration/hooks/useInspiration";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { useNote } from "@/features/notes/hooks/useNotes";
import { ResourceCard } from "@/features/resources/components/ResourceCard";
import { useResource } from "@/features/resources/hooks/useResources";
import logoLockup from "@/assets/morrow-logo-horizontal-black.svg";
import logoIcon from "@/assets/morrow-icon-black.svg";

/**
 * Collapsible primary navigation, recreated from Dashboard.dc.html (lines
 * 51–111). Glass panel over the page background, width animates 264 ↔ 78px
 * with ease-breath. Logo cross-fades lockup ↔ icon on collapse. Pinned
 * project mini-card + Archive item pinned to the bottom. Collapse toggle is a
 * frosted circle straddling the right edge. NO profile/avatar footer
 * (single-user app).
 *
 * Nav glyphs are the exact rounded-stroke 19px SVGs from the source so every
 * screen shares one icon voice.
 */
const NAV_GLYPH = {
  dashboard: (
    <NavGlyph>
      <rect x="3.6" y="3.6" width="7.1" height="7.1" rx="2.3" />
      <rect x="13.3" y="3.6" width="7.1" height="7.1" rx="2.3" />
      <rect x="3.6" y="13.3" width="7.1" height="7.1" rx="2.3" />
      <rect x="13.3" y="13.3" width="7.1" height="7.1" rx="2.3" />
    </NavGlyph>
  ),
  projects: (
    <NavGlyph>
      <path d="M3.5 8.2c0-1.5 1.2-2.7 2.7-2.7h2.4c.8 0 1.6.4 2.1 1l.8 1c.4.5 1 .7 1.6.7h4.7c1.5 0 2.7 1.2 2.7 2.7v6.4c0 1.5-1.2 2.7-2.7 2.7H6.2c-1.5 0-2.7-1.2-2.7-2.7z" />
    </NavGlyph>
  ),
  inspiration: (
    <NavGlyph>
      <rect x="3.6" y="5" width="16.8" height="14" rx="3.4" />
      <circle cx="8.8" cy="9.9" r="1.5" />
      <path d="m4.6 16.9 4.2-3.6c.6-.5 1.5-.5 2.1 0l2.8 2.4 2.3-1.9c.6-.5 1.5-.5 2.1 0l2 1.7" />
    </NavGlyph>
  ),
  notes: (
    <NavGlyph>
      <path d="M5 6.6c0-1.7 1.3-3 3-3h5.4c.5 0 1 .2 1.4.6l3.6 3.6c.4.4.6.9.6 1.4v8.2c0 1.7-1.3 3-3 3H8c-1.7 0-3-1.3-3-3z" />
      <path d="M8.7 12.5h6.6M8.7 15.7h4.2" />
    </NavGlyph>
  ),
  resources: (
    <NavGlyph>
      <path d="M6 6.9C6 5.3 7.3 4 8.9 4h6.2C16.7 4 18 5.3 18 6.9v11.7c0 .9-1 1.5-1.8.9l-3.6-2.5c-.35-.24-.85-.24-1.2 0l-3.6 2.5c-.8.6-1.8 0-1.8-.9z" />
    </NavGlyph>
  ),
} satisfies Record<string, ReactNode>;

function NavGlyph({ children }: { children: ReactNode }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
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
  { to: "/notes", label: "Notes", icon: NAV_GLYPH.notes, count: 12 },
  { to: "/resources", label: "Resources", icon: NAV_GLYPH.resources },
] as const;

/** Wraps a collapsed-sidebar nav item with its label as a tooltip; passes through untouched when expanded. */
function CollapsedTooltip({
  collapsed,
  label,
  children,
}: {
  collapsed: boolean;
  label: string;
  children: ReactNode;
}) {
  if (!collapsed) return <>{children}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const { pinned, pin, unpin, draggedRef } = usePinned();
  const [isDragOver, setIsDragOver] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const projectQuery = useProject(pinned?.entityType === "project" ? pinned.id : "");
  const boardQuery = useBoard(pinned?.entityType === "collection" ? pinned.id : "");
  const noteQuery = useNote(pinned?.entityType === "note" ? pinned.id : "");
  const resourceQuery = useResource(pinned?.entityType === "resource" ? pinned.id : "");

  // A fresh drag should never inherit the previous drop target's hover state.
  useEffect(() => {
    if (!draggedRef) setIsDragOver(false);
  }, [draggedRef]);

  // The Sidebar never unmounts, so its byId query for the pinned entity won't
  // otherwise notice an archive/delete performed from a listing page. Treat
  // navigation as the checkpoint to re-check freshness.
  useEffect(() => {
    if (!pinned) return;
    const key =
      pinned.entityType === "project"
        ? queryKeys.projects.byId(pinned.id)
        : pinned.entityType === "collection"
          ? queryKeys.inspirationBoards.byId(pinned.id)
          : pinned.entityType === "note"
            ? queryKeys.notes.byId(pinned.id)
            : queryKeys.resources.byId(pinned.id);
    queryClient.invalidateQueries({ queryKey: key });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const pinnedQuery =
    pinned?.entityType === "project"
      ? projectQuery
      : pinned?.entityType === "collection"
        ? boardQuery
        : pinned?.entityType === "note"
          ? noteQuery
          : pinned?.entityType === "resource"
            ? resourceQuery
            : null;

  // Auto-unpin once we learn the entity was archived or deleted elsewhere —
  // never show a stale, dead-ended pinned card.
  useEffect(() => {
    if (!pinnedQuery?.isSuccess) return;
    if (!pinnedQuery.data || pinnedQuery.data.isArchived) unpin();
  }, [pinnedQuery?.isSuccess, pinnedQuery?.data, unpin]);

  const pinnedCard =
    pinned?.entityType === "project" && projectQuery.data ? (
      <ProjectCard project={projectQuery.data} variant="pinned" onUnpin={unpin} />
    ) : pinned?.entityType === "collection" && boardQuery.data ? (
      <InspirationCard board={boardQuery.data} variant="pinned" onUnpin={unpin} />
    ) : pinned?.entityType === "note" && noteQuery.data ? (
      <NoteCard
        note={noteQuery.data}
        variant="pinned"
        onEdit={(note) => navigate(`/notes?open=${note.id}`)}
        onUnpin={unpin}
      />
    ) : pinned?.entityType === "resource" && resourceQuery.data ? (
      <ResourceCard resource={resourceQuery.data} variant="pinned" onUnpin={unpin} />
    ) : null;

  const showPinnedSection = !collapsed && (draggedRef !== null || pinnedCard !== null);

  return (
    <div className="relative z-[3] h-full flex-shrink-0">
      <aside
        className={cn(
          "flex h-full flex-col gap-[22px] px-[14px] pb-[18px] pt-[22px] transition-[width] duration-[340ms] ease-breath",
          collapsed ? "w-[78px]" : "w-[264px]",
        )}
        style={{
          background: "rgba(247,246,243,.52)",
          backdropFilter: "blur(28px) saturate(1.25)",
          WebkitBackdropFilter: "blur(28px) saturate(1.25)",
          // Right edge is a glass highlight (reads on the Dashboard's photo)
          // layered with a border-subtle hairline + soft shadow (reads on the
          // flat cream background every other page uses) — visible either way.
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.58), 1px 0 0 rgba(255,255,255,.55), 2px 0 0 rgba(36,38,33,.09), 8px 0 20px -12px hsl(30 25% 20% / .16)",
        }}
      >
        {/* Brand — lockup / icon crossfade */}
        <div className="relative mx-[6px] my-[2px] h-[30px] flex-shrink-0">
          <img
            src={logoLockup}
            alt="Morrow"
            className="absolute left-[2px] top-1/2 h-[21px] -translate-y-1/2 transition-opacity duration-[240ms] ease-breath"
            style={{ opacity: collapsed ? 0 : 1 }}
          />
          <img
            src={logoIcon}
            alt=""
            className="absolute inset-x-0 top-1/2 mx-auto h-[26px] w-[26px] -translate-y-1/2 transition-opacity duration-[240ms] ease-breath"
            style={{ opacity: collapsed ? 1 : 0 }}
          />
        </div>

        {/* Scrollable nav + pinned region (keeps Archive from clipping) */}
        <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-[22px] overflow-y-auto overflow-x-hidden px-1">
          <nav className="flex flex-col gap-[3px]">
            {PRIMARY_NAV.map((item) => (
              <CollapsedTooltip key={item.to} collapsed={collapsed} label={item.label}>
                <NavLink
                  to={item.to}
                  end={"end" in item ? item.end : undefined}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-[13px] whitespace-nowrap rounded-[13px] px-3 py-[10px] transition-colors duration-[160ms]",
                      collapsed && "justify-center",
                      isActive
                        ? "bg-white/80 text-sage-900 shadow-[0_6px_16px_-10px_hsl(30_25%_20%_/_.28)]"
                        : "text-text-tertiary hover:bg-white/45 hover:text-text-primary",
                    )
                  }
                >
                  <span className="flex flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="flex-1 text-[13.5px] font-medium leading-none">{item.label}</span>
                  )}
                  {!collapsed && "count" in item && item.count ? (
                    <span className="rounded-[7px] bg-ink-900/[.06] px-2 py-0.5 text-[11.5px] font-medium leading-none text-text-tertiary">
                      {item.count}
                    </span>
                  ) : null}
                </NavLink>
              </CollapsedTooltip>
            ))}
          </nav>

          {/* Pinned — hidden entirely when nothing is pinned and no drag is in progress */}
          {showPinnedSection && (
            <div className="flex flex-col gap-[11px] border-t border-border-subtle pt-[18px]">
              <span className="eyebrow px-[6px] text-text-tertiary">Pinned</span>
              {draggedRef ? (
                <AddDashedTile
                  className={cn(
                    "min-h-[86px] transition-colors duration-fast ease-out",
                    isDragOver && "border-sage-600 bg-sage-100/50 text-sage-700",
                  )}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    pin(draggedRef);
                    setIsDragOver(false);
                  }}
                />
              ) : (
                pinnedCard
              )}
            </div>
          )}
        </div>

        {/* Archive — pinned to bottom, separated by hairline */}
        <div className="flex-shrink-0 border-t border-border-subtle pt-[14px]">
          <CollapsedTooltip collapsed={collapsed} label="Archive">
            <NavLink
              to="/archive"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-[13px] whitespace-nowrap rounded-[12px] px-3 py-[9px] opacity-[.88] transition-[background,color,opacity] duration-[160ms] hover:bg-white/45 hover:text-text-secondary hover:opacity-100",
                  collapsed && "justify-center",
                  isActive ? "bg-white/70 text-sage-900 opacity-100" : "text-text-tertiary",
                )
              }
            >
              <span className="flex flex-shrink-0">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3.6" y="5.2" width="16.8" height="4.4" rx="1.8" />
                  <path d="M5 9.8v7c0 1.3 1.1 2.4 2.4 2.4h9.2c1.3 0 2.4-1.1 2.4-2.4v-7" />
                  <path d="M10.2 13.2h3.6" />
                </svg>
              </span>
              {!collapsed && <span className="flex-1 text-[13px] leading-none">Archive</span>}
            </NavLink>
          </CollapsedTooltip>
        </div>
      </aside>

      {/* Collapse toggle — frosted circle straddling the right edge */}
      <button
        type="button"
        onClick={toggle}
        title="Toggle sidebar"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute right-[-12px] top-[32px] flex h-6 w-6 items-center justify-center rounded-full border border-white/75 bg-white/90 text-text-primary shadow-[0_3px_10px_-3px_hsl(30_25%_20%_/_.22)] backdrop-blur-[10px] transition-[transform,background] duration-[340ms] ease-breath hover:bg-white"
        style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m14 6-6 6 6 6" />
        </svg>
      </button>
    </div>
  );
}
