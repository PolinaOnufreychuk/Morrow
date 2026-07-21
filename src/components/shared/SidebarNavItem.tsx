import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: ReactNode;
  collapsed: boolean;
  end?: boolean;
  /** Optional preview slot shown under the label when expanded (e.g. pinned items). */
  preview?: ReactNode;
}

/** Single nav row. Reused for every sidebar destination, including Archive. */
export function SidebarNavItem({
  to,
  label,
  icon,
  collapsed,
  end,
  preview,
}: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group flex flex-col gap-2 rounded-nav-item px-3 py-2 transition-colors duration-fast ease-out",
          isActive
            ? "bg-surface-card text-text-primary shadow-resting"
            : "text-text-secondary hover:bg-surface-card/50 hover:text-text-primary",
        )
      }
    >
      <span className={cn("flex items-center gap-3", collapsed && "justify-center")}>
        <span className="shrink-0">{icon}</span>
        {!collapsed && <span className="text-[14px] font-medium">{label}</span>}
      </span>
      {!collapsed && preview && <div className="pl-8">{preview}</div>}
    </NavLink>
  );
}
