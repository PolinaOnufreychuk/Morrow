import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Base translucent card surface — the `.glass-card` composite lives in
 * design-system/tokens/glass.css (blur+saturate+border+inset highlight).
 * Every card-like surface in the app composes from this.
 */
export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-card rounded-card",
        interactive && "cursor-pointer",
        className,
      )}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";
