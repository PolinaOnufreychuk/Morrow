import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

/**
 * Tasteful loading placeholder — a soft pulsing glass-card shape, not a
 * generic gray box. The source export has no loading states of its own
 * (all fixture data resolves synchronously); this is an allowed quality
 * improvement per the implementation brief.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-card bg-ink-900/[.06]", className)}
      aria-hidden="true"
    />
  );
}
