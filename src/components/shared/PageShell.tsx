import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Padded, centered container shared by every non-dashboard page (Projects,
 * Inspiration, Notes, Resources, Archive, and their detail pages). Only the
 * Dashboard builds its own bespoke layout and skips this.
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-[clamp(24px,3.2vw,44px)] pb-24 pt-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
