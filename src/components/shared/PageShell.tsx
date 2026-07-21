import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageShellProps {
  children: ReactNode;
  /** Archive uses a narrower column than the other list pages. */
  narrow?: boolean;
  className?: string;
}

/**
 * Padded, centered container shared by every non-dashboard page (Projects,
 * Inspiration, Notes, Resources, Archive). Dashboard and detail pages build
 * their own bespoke layout and don't use this.
 */
export function PageShell({ children, narrow = false, className }: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col gap-6 px-[clamp(24px,3.2vw,44px)] pb-24 pt-10",
        narrow ? "max-w-[1120px]" : "max-w-[1440px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
